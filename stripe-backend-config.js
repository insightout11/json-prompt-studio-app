// Backend configuration for Stripe integration
// This would typically be in your Node.js/Express backend

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Price IDs from your Stripe Dashboard
const PRICE_CONFIG = {
  pro_monthly: process.env.STRIPE_PRICE_PRO_MONTHLY, // e.g., 'price_1234567890'
  pro_yearly: process.env.STRIPE_PRICE_PRO_YEARLY,   // e.g., 'price_0987654321'
};

// Webhook endpoint secret for verifying Stripe events
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

/**
 * Create Stripe Checkout Session
 * POST /api/create-checkout-session
 */
const createCheckoutSession = async (req, res) => {
  try {
    const { priceId, billingCycle, customerEmail, metadata = {} } = req.body;

    // Validate price ID
    if (!Object.values(PRICE_CONFIG).includes(priceId)) {
      return res.status(400).json({ error: 'Invalid price ID' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer_email: customerEmail,
      subscription_data: {
        metadata: {
          plan: 'pro',
          billingCycle,
          ...metadata,
        },
      },
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/pricing`,
      metadata: {
        plan: 'pro',
        billingCycle,
        ...metadata,
      },
    });

    res.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
};

/**
 * Get subscription status
 * GET /api/subscription/status
 */
const getSubscriptionStatus = async (req, res) => {
  try {
    const customerId = req.user.stripeCustomerId; // From your auth middleware

    if (!customerId) {
      return res.json({ subscription: null });
    }

    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
      limit: 1,
    });

    if (subscriptions.data.length === 0) {
      return res.json({ subscription: null });
    }

    const subscription = subscriptions.data[0];
    const plan = subscription.metadata.plan || 'pro';
    const billingCycle = subscription.metadata.billingCycle || 'monthly';

    res.json({
      subscription: {
        id: subscription.id,
        plan,
        billingCycle,
        status: subscription.status,
        currentPeriodEnd: subscription.current_period_end,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        customerId: subscription.customer,
      },
    });
  } catch (error) {
    console.error('Error fetching subscription:', error);
    res.status(500).json({ error: 'Failed to fetch subscription status' });
  }
};

/**
 * Cancel subscription
 * POST /api/subscription/cancel
 */
const cancelSubscription = async (req, res) => {
  try {
    const customerId = req.user.stripeCustomerId;

    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
      limit: 1,
    });

    if (subscriptions.data.length === 0) {
      return res.status(404).json({ error: 'No active subscription found' });
    }

    const subscription = subscriptions.data[0];

    // Cancel at period end (don't immediately terminate)
    await stripe.subscriptions.update(subscription.id, {
      cancel_at_period_end: true,
    });

    res.json({ success: true, cancelAtPeriodEnd: true });
  } catch (error) {
    console.error('Error canceling subscription:', error);
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
};

/**
 * Stripe Webhook Handler
 * POST /api/stripe/webhook
 */
const handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      await handleSuccessfulPayment(session);
      break;

    case 'customer.subscription.created':
      const newSubscription = event.data.object;
      await handleSubscriptionCreated(newSubscription);
      break;

    case 'customer.subscription.updated':
      const updatedSubscription = event.data.object;
      await handleSubscriptionUpdated(updatedSubscription);
      break;

    case 'customer.subscription.deleted':
      const deletedSubscription = event.data.object;
      await handleSubscriptionDeleted(deletedSubscription);
      break;

    case 'invoice.payment_succeeded':
      const invoice = event.data.object;
      await handlePaymentSucceeded(invoice);
      break;

    case 'invoice.payment_failed':
      const failedInvoice = event.data.object;
      await handlePaymentFailed(failedInvoice);
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};

/**
 * Handle successful payment
 */
const handleSuccessfulPayment = async (session) => {
  try {
    // Update user's subscription status in your database
    const customerId = session.customer;
    const subscriptionId = session.subscription;

    // Your database update logic here
    await updateUserSubscription(customerId, {
      subscriptionId,
      status: 'active',
      plan: session.metadata.plan,
      billingCycle: session.metadata.billingCycle,
    });

    console.log(`Payment successful for customer ${customerId}`);
  } catch (error) {
    console.error('Error handling successful payment:', error);
  }
};

/**
 * Handle subscription events
 */
const handleSubscriptionCreated = async (subscription) => {
  // Update user's subscription in database
  await updateUserSubscription(subscription.customer, {
    subscriptionId: subscription.id,
    status: subscription.status,
    plan: subscription.metadata.plan,
    billingCycle: subscription.metadata.billingCycle,
    currentPeriodEnd: subscription.current_period_end,
  });
};

const handleSubscriptionUpdated = async (subscription) => {
  // Update user's subscription status
  await updateUserSubscription(subscription.customer, {
    status: subscription.status,
    currentPeriodEnd: subscription.current_period_end,
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
  });
};

const handleSubscriptionDeleted = async (subscription) => {
  // Remove user's subscription
  await removeUserSubscription(subscription.customer);
};

const handlePaymentSucceeded = async (invoice) => {
  // Update subscription billing info
  console.log(`Payment succeeded for subscription ${invoice.subscription}`);
};

const handlePaymentFailed = async (invoice) => {
  // Handle failed payment (send email, update status, etc.)
  console.log(`Payment failed for subscription ${invoice.subscription}`);
};

/**
 * Database helper functions (implement based on your database)
 */
const updateUserSubscription = async (customerId, subscriptionData) => {
  // Implement based on your database (MongoDB, PostgreSQL, etc.)
  // Example:
  // await User.updateOne(
  //   { stripeCustomerId: customerId },
  //   { $set: { subscription: subscriptionData } }
  // );
};

const removeUserSubscription = async (customerId) => {
  // Remove subscription from user record
  // await User.updateOne(
  //   { stripeCustomerId: customerId },
  //   { $unset: { subscription: 1 } }
  // );
};

// Express.js route examples
module.exports = {
  createCheckoutSession,
  getSubscriptionStatus,
  cancelSubscription,
  handleStripeWebhook,
};

// Environment variables needed:
// STRIPE_SECRET_KEY=sk_test_...
// STRIPE_PUBLISHABLE_KEY=pk_test_...
// STRIPE_WEBHOOK_SECRET=whsec_...
// STRIPE_PRICE_PRO_MONTHLY=price_...
// STRIPE_PRICE_PRO_YEARLY=price_...
// FRONTEND_URL=http://localhost:3000