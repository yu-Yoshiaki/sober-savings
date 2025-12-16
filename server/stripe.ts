import Stripe from 'stripe';
import { Router, raw } from 'express';
import { ENV } from './_core/env';
import { PRODUCTS, ProductId } from './products';
import { getDb } from './db';
import { users } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

// Initialize Stripe
const stripe = new Stripe(ENV.stripeSecretKey || '');

export const stripeRouter = Router();

// Webhook endpoint - MUST be registered before express.json()
stripeRouter.post('/webhook', raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  
  if (!sig || !ENV.stripeWebhookSecret) {
    console.error('[Stripe Webhook] Missing signature or webhook secret');
    return res.status(400).send('Missing signature');
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, ENV.stripeWebhookSecret);
  } catch (err: any) {
    console.error('[Stripe Webhook] Signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle test events
  if (event.id.startsWith('evt_test_')) {
    console.log('[Webhook] Test event detected, returning verification response');
    return res.json({ verified: true });
  }

  console.log(`[Stripe Webhook] Received event: ${event.type}`);

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutComplete(session);
        break;
      }
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionChange(subscription);
        break;
      }
      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice;
        console.log(`[Stripe] Invoice paid: ${invoice.id}`);
        break;
      }
      default:
        console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('[Stripe Webhook] Error processing event:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.user_id;
  const customerId = session.customer as string;
  const subscriptionId = session.subscription as string;

  if (!userId) {
    console.error('[Stripe] No user_id in session metadata');
    return;
  }

  const db = await getDb();
  if (!db) {
    console.error('[Stripe] Database not available');
    return;
  }

  // Update user with Stripe info
  await db.update(users)
    .set({
      plan: 'pro',
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId,
      subscriptionStatus: 'active',
    })
    .where(eq(users.id, parseInt(userId)));

  console.log(`[Stripe] User ${userId} upgraded to Pro`);
}

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  
  const db = await getDb();
  if (!db) return;

  const status = subscription.status;
  const isActive = status === 'active' || status === 'trialing';

  // Get period end from items if available
  const periodEnd = subscription.items?.data?.[0]?.current_period_end;

  await db.update(users)
    .set({
      plan: isActive ? 'pro' : 'free',
      subscriptionStatus: status,
      subscriptionEndDate: periodEnd 
        ? new Date(periodEnd * 1000) 
        : null,
    })
    .where(eq(users.stripeCustomerId, customerId));

  console.log(`[Stripe] Subscription ${subscription.id} status: ${status}`);
}

// Create checkout session endpoint
export async function createCheckoutSession(
  userId: number,
  userEmail: string,
  userName: string | null,
  productId: ProductId,
  origin: string
): Promise<string> {
  const product = PRODUCTS[productId];
  
  if (!product) {
    throw new Error(`Invalid product: ${productId}`);
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    customer_email: userEmail,
    client_reference_id: userId.toString(),
    metadata: {
      user_id: userId.toString(),
      customer_email: userEmail,
      customer_name: userName || '',
      product_id: productId,
    },
    line_items: [
      {
        price_data: {
          currency: product.currency,
          product_data: {
            name: product.name,
            description: product.description,
          },
          unit_amount: product.priceAmount,
          recurring: {
            interval: product.interval,
          },
        },
        quantity: 1,
      },
    ],
    allow_promotion_codes: true,
    success_url: `${origin}/settings?payment=success`,
    cancel_url: `${origin}/pricing?payment=cancelled`,
  });

  return session.url || '';
}

// Create customer portal session
export async function createPortalSession(
  stripeCustomerId: string,
  origin: string
): Promise<string> {
  const session = await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: `${origin}/settings`,
  });

  return session.url;
}
