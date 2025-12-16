import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  
  // Subscription fields
  plan: mysqlEnum("plan", ["free", "pro"]).default("free").notNull(),
  stripeCustomerId: varchar("stripeCustomerId", { length: 255 }),
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 255 }),
  subscriptionStatus: varchar("subscriptionStatus", { length: 64 }),
  subscriptionEndDate: timestamp("subscriptionEndDate"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * User settings for sobriety tracking
 */
export const userSettings = mysqlTable("user_settings", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  
  dailyTarget: int("dailyTarget").default(1000).notNull(),
  startDate: timestamp("startDate").defaultNow().notNull(),
  currency: varchar("currency", { length: 10 }).default("¥").notNull(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserSettings = typeof userSettings.$inferSelect;
export type InsertUserSettings = typeof userSettings.$inferInsert;

/**
 * Savings entries (manual additions)
 */
export const savingsEntries = mysqlTable("savings_entries", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  
  amount: int("amount").notNull(),
  date: timestamp("date").notNull(),
  note: text("note"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SavingsEntry = typeof savingsEntries.$inferSelect;
export type InsertSavingsEntry = typeof savingsEntries.$inferInsert;

/**
 * User goals
 */
export const userGoals = mysqlTable("user_goals", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  targetAmount: int("targetAmount").notNull(),
  image: varchar("image", { length: 500 }),
  isActive: boolean("isActive").default(false).notNull(),
  isPreset: boolean("isPreset").default(false).notNull(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserGoal = typeof userGoals.$inferSelect;
export type InsertUserGoal = typeof userGoals.$inferInsert;

/**
 * AI Coach conversations (Pro feature)
 */
export const coachConversations = mysqlTable("coach_conversations", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  
  role: mysqlEnum("role", ["user", "assistant"]).notNull(),
  content: text("content").notNull(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CoachConversation = typeof coachConversations.$inferSelect;
export type InsertCoachConversation = typeof coachConversations.$inferInsert;