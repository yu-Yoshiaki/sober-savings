import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { createCheckoutSession, createPortalSession } from "./stripe";
import { PRODUCTS, FREE_PLAN_FEATURES, ProductId } from "./products";
import { getDb, getUserByOpenId } from "./db";
import { userSettings, userGoals, savingsEntries, users } from "../drizzle/schema";
import { eq, desc } from "drizzle-orm";
import { z } from "zod";

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // Subscription & Stripe
  subscription: router({
    getPlans: publicProcedure.query(() => ({
      free: {
        name: 'Free',
        price: 0,
        features: FREE_PLAN_FEATURES,
      },
      proMonthly: {
        ...PRODUCTS.PRO_MONTHLY,
        price: PRODUCTS.PRO_MONTHLY.priceAmount,
      },
      proYearly: {
        ...PRODUCTS.PRO_YEARLY,
        price: PRODUCTS.PRO_YEARLY.priceAmount,
      },
    })),

    createCheckout: protectedProcedure
      .input(z.object({
        productId: z.enum(['PRO_MONTHLY', 'PRO_YEARLY']),
      }))
      .mutation(async ({ ctx, input }) => {
        const origin = ctx.req.headers.origin || 'http://localhost:3000';
        const url = await createCheckoutSession(
          ctx.user.id,
          ctx.user.email || '',
          ctx.user.name,
          input.productId as ProductId,
          origin
        );
        return { url };
      }),

    createPortal: protectedProcedure.mutation(async ({ ctx }) => {
      if (!ctx.user.stripeCustomerId) {
        throw new Error('No Stripe customer found');
      }
      const origin = ctx.req.headers.origin || 'http://localhost:3000';
      const url = await createPortalSession(ctx.user.stripeCustomerId, origin);
      return { url };
    }),

    getStatus: protectedProcedure.query(async ({ ctx }) => {
      return {
        plan: ctx.user.plan || 'free',
        subscriptionStatus: ctx.user.subscriptionStatus,
        subscriptionEndDate: ctx.user.subscriptionEndDate,
        isPro: ctx.user.plan === 'pro',
      };
    }),
  }),

  // User Settings
  settings: router({
    get: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return null;

      const result = await db.select()
        .from(userSettings)
        .where(eq(userSettings.userId, ctx.user.id))
        .limit(1);

      return result[0] || null;
    }),

    upsert: protectedProcedure
      .input(z.object({
        dailyTarget: z.number().min(0),
        startDate: z.date(),
        currency: z.string().max(10),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error('Database not available');

        const existing = await db.select()
          .from(userSettings)
          .where(eq(userSettings.userId, ctx.user.id))
          .limit(1);

        if (existing.length > 0) {
          await db.update(userSettings)
            .set({
              dailyTarget: input.dailyTarget,
              startDate: input.startDate,
              currency: input.currency,
            })
            .where(eq(userSettings.userId, ctx.user.id));
        } else {
          await db.insert(userSettings).values({
            userId: ctx.user.id,
            dailyTarget: input.dailyTarget,
            startDate: input.startDate,
            currency: input.currency,
          });
        }

        return { success: true };
      }),
  }),

  // Goals
  goals: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return [];

      return db.select()
        .from(userGoals)
        .where(eq(userGoals.userId, ctx.user.id))
        .orderBy(desc(userGoals.isActive), desc(userGoals.createdAt));
    }),

    create: protectedProcedure
      .input(z.object({
        title: z.string().min(1).max(255),
        description: z.string().optional(),
        targetAmount: z.number().min(1),
        image: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error('Database not available');

        // Check Pro limit for custom goals
        const existingGoals = await db.select()
          .from(userGoals)
          .where(eq(userGoals.userId, ctx.user.id));

        if (ctx.user.plan !== 'pro' && existingGoals.length >= 3) {
          throw new Error('Free plan limited to 3 goals. Upgrade to Pro for unlimited goals.');
        }

        const result = await db.insert(userGoals).values({
          userId: ctx.user.id,
          title: input.title,
          description: input.description || null,
          targetAmount: input.targetAmount,
          image: input.image || null,
          isActive: existingGoals.length === 0,
        });

        return { id: result[0].insertId };
      }),

    setActive: protectedProcedure
      .input(z.object({ goalId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error('Database not available');

        // Deactivate all goals
        await db.update(userGoals)
          .set({ isActive: false })
          .where(eq(userGoals.userId, ctx.user.id));

        // Activate selected goal
        await db.update(userGoals)
          .set({ isActive: true })
          .where(eq(userGoals.id, input.goalId));

        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ goalId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error('Database not available');

        await db.delete(userGoals)
          .where(eq(userGoals.id, input.goalId));

        return { success: true };
      }),
  }),

  // Savings tracking
  savings: router({
    getTotal: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return { total: 0, daysSober: 0 };

      const settings = await db.select()
        .from(userSettings)
        .where(eq(userSettings.userId, ctx.user.id))
        .limit(1);

      if (settings.length === 0) {
        return { total: 0, daysSober: 0 };
      }

      const startDate = settings[0].startDate;
      const dailyTarget = settings[0].dailyTarget;
      const now = new Date();
      const daysSober = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      const total = daysSober * dailyTarget;

      return { total, daysSober };
    }),

    addEntry: protectedProcedure
      .input(z.object({
        amount: z.number(),
        date: z.date(),
        note: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error('Database not available');

        await db.insert(savingsEntries).values({
          userId: ctx.user.id,
          amount: input.amount,
          date: input.date,
          note: input.note || null,
        });

        return { success: true };
      }),

    getHistory: protectedProcedure
      .input(z.object({
        limit: z.number().min(1).max(100).default(30),
      }))
      .query(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) return [];

        return db.select()
          .from(savingsEntries)
          .where(eq(savingsEntries.userId, ctx.user.id))
          .orderBy(desc(savingsEntries.date))
          .limit(input.limit);
      }),
  }),
});

export type AppRouter = typeof appRouter;
