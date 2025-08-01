// Disable body parsing for webhook verification
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
}

import Stripe from 'stripe';

export default async function handler(req, res) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'customer.subscription.created':
        console.log(`Subscription created: ${event.id}`);
        await handleSubscriptionCreated(event.data.object);
        break;

      case 'customer.subscription.updated':
        console.log(`Subscription updated: ${event.id}`);
        await handleSubscriptionUpdated(event.data.object);
        break;

      case 'customer.subscription.deleted':
        console.log(`Subscription canceled: ${event.id}`);
        await handleSubscriptionDeleted(event.data.object);
        break;

      case 'customer.subscription.trial_will_end':
        console.log(`Subscription trial will end: ${event.id}`);
        await handleTrialWillEnd(event.data.object);
        break;

      case 'invoice.payment_succeeded':
        console.log(`Payment succeeded: ${event.id}`);
        await handlePaymentSucceeded(event.data.object);
        break;

      case 'invoice.payment_failed':
        console.log(`Payment failed: ${event.id}`);
        await handlePaymentFailed(event.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Error handling webhook:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
}

// Webhook event handlers
async function handleSubscriptionCreated(subscription) {
  // TODO: Update user's subscription status in your database
  // Example: Mark user as Pro subscriber
  console.log('New subscription created:', subscription.id);
}

async function handleSubscriptionUpdated(subscription) {
  // TODO: Update subscription status
  console.log('Subscription updated:', subscription.id);
}

async function handleSubscriptionDeleted(subscription) {
  // TODO: Remove Pro access from user
  console.log('Subscription deleted:', subscription.id);
}

async function handleTrialWillEnd(subscription) {
  // TODO: Send reminder email
  console.log('Trial ending soon:', subscription.id);
}

async function handlePaymentSucceeded(invoice) {
  // TODO: Confirm payment and extend subscription
  console.log('Payment succeeded:', invoice.id);
}

async function handlePaymentFailed(invoice) {
  // TODO: Handle failed payment (send email, grace period)
  console.log('Payment failed:', invoice.id);
}