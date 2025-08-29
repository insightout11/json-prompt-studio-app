// Disable body parsing for webhook verification
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
}

import Stripe from 'stripe';

// Helper functions for database operations
// In production, replace these with actual database calls
async function updateUserSubscription(subscriptionData) {
  // In a real implementation, this would update your user database
  // For now, we'll log the data that would be stored
  console.log('Would update user subscription:', subscriptionData);
  
  // TODO: Replace with actual database update
  // Example: await db.users.updateOne(
  //   { stripeCustomerId: subscriptionData.customerId },
  //   { $set: { subscription: subscriptionData } }
  // );
}

async function getUserByCustomerId(customerId) {
  // In a real implementation, this would query your user database
  console.log('Would query user by customer ID:', customerId);
  
  // TODO: Replace with actual database query
  // Example: return await db.users.findOne({ stripeCustomerId: customerId });
  return null;
}

async function recordPayment(paymentData) {
  // In a real implementation, this would record payment in your database
  console.log('Would record payment:', paymentData);
  
  // TODO: Replace with actual database insert
  // Example: await db.payments.insertOne(paymentData);
}

async function resetMonthlyUsage(customerId) {
  // Reset usage limits for the billing cycle
  console.log('Would reset monthly usage for customer:', customerId);
  
  // TODO: Replace with actual usage reset
  // Example: await db.users.updateOne(
  //   { stripeCustomerId: customerId },
  //   { $set: { monthlyUsage: 0, lastReset: new Date() } }
  // );
}

async function sendTrialEndingEmail(email, trialEndDate) {
  // Send email notification about trial ending
  console.log('Would send trial ending email to:', email, 'ending:', trialEndDate);
  
  // TODO: Implement email sending
  // Example: await emailService.sendTrialEndingNotification(email, trialEndDate);
}

async function sendPaymentFailureEmail(email, invoiceUrl) {
  // Send email about payment failure with link to pay
  console.log('Would send payment failure email to:', email, 'invoice:', invoiceUrl);
  
  // TODO: Implement email sending
  // Example: await emailService.sendPaymentFailureNotification(email, invoiceUrl);
}

function determineTierFromPriceId(priceId) {
  // Map Stripe price IDs to user tiers
  const priceIdMappings = {
    [process.env.STRIPE_PRICE_PRO_MONTHLY]: 'pro',
    [process.env.STRIPE_PRICE_PRO_YEARLY]: 'pro',
    [process.env.VITE_STRIPE_PRICE_PRO_MONTHLY]: 'pro',
    [process.env.VITE_STRIPE_PRICE_PRO_YEARLY]: 'pro',
    // Add more price IDs as needed
  };
  
  return priceIdMappings[priceId] || 'free';
}

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
  try {
    // Mark user as Pro subscriber based on customer ID
    const customerId = subscription.customer;
    const subscriptionId = subscription.id;
    const status = subscription.status;
    const priceId = subscription.items.data[0]?.price?.id;
    
    // Update user subscription status
    await updateUserSubscription({
      customerId,
      subscriptionId,
      status: 'active',
      tier: determineTierFromPriceId(priceId),
      startDate: new Date(subscription.current_period_start * 1000),
      endDate: new Date(subscription.current_period_end * 1000)
    });
    
  } catch (error) {
    console.error('Error handling subscription creation:', error);
    throw error;
  }
}

async function handleSubscriptionUpdated(subscription) {
  try {
    // Update existing subscription
    const customerId = subscription.customer;
    const subscriptionId = subscription.id;
    const status = subscription.status;
    const priceId = subscription.items.data[0]?.price?.id;
    
    await updateUserSubscription({
      customerId,
      subscriptionId,
      status: status === 'active' ? 'active' : 'inactive',
      tier: determineTierFromPriceId(priceId),
      startDate: new Date(subscription.current_period_start * 1000),
      endDate: new Date(subscription.current_period_end * 1000)
    });
    
  } catch (error) {
    console.error('Error handling subscription update:', error);
    throw error;
  }
}

async function handleSubscriptionDeleted(subscription) {
  try {
    // Remove Pro access from user
    const customerId = subscription.customer;
    const subscriptionId = subscription.id;
    
    await updateUserSubscription({
      customerId,
      subscriptionId,
      status: 'canceled',
      tier: 'free',
      endDate: new Date()
    });
    
  } catch (error) {
    console.error('Error handling subscription deletion:', error);
    throw error;
  }
}

async function handleTrialWillEnd(subscription) {
  try {
    // Send reminder email about trial ending
    const customerId = subscription.customer;
    const trialEndDate = new Date(subscription.trial_end * 1000);
    
    // Get user details for email
    const user = await getUserByCustomerId(customerId);
    if (user?.email) {
      await sendTrialEndingEmail(user.email, trialEndDate);
    }
    
  } catch (error) {
    console.error('Error handling trial will end:', error);
    throw error;
  }
}

async function handlePaymentSucceeded(invoice) {
  try {
    // Confirm payment and extend subscription
    const customerId = invoice.customer;
    const subscriptionId = invoice.subscription;
    const amountPaid = invoice.amount_paid;
    
    // Record payment and reset usage limits if applicable
    await recordPayment({
      customerId,
      subscriptionId,
      amount: amountPaid,
      currency: invoice.currency,
      paidAt: new Date(invoice.status_transitions.paid_at * 1000)
    });
    
    // Reset monthly usage limits for pro users
    await resetMonthlyUsage(customerId);
    
  } catch (error) {
    console.error('Error handling payment success:', error);
    throw error;
  }
}

async function handlePaymentFailed(invoice) {
  try {
    // Handle failed payment with grace period
    const customerId = invoice.customer;
    const subscriptionId = invoice.subscription;
    const attemptCount = invoice.attempt_count;
    
    // Get user for notification
    const user = await getUserByCustomerId(customerId);
    
    if (attemptCount === 1) {
      // First failure - send reminder email
      if (user?.email) {
        await sendPaymentFailureEmail(user.email, invoice.hosted_invoice_url);
      }
    } else if (attemptCount >= 3) {
      // Multiple failures - downgrade to free tier with grace period
      await updateUserSubscription({
        customerId,
        subscriptionId,
        status: 'past_due',
        tier: 'free',
        gracePeriodUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days grace
      });
    }
    
  } catch (error) {
    console.error('Error handling payment failure:', error);
    throw error;
  }
}