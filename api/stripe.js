// Consolidated Stripe API endpoint - handles checkout, portal, and credits
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { action } = req.body;

    switch (action) {
      case 'create-checkout-session':
        return await handleCheckoutSession(req, res);
      case 'create-portal-session':
        return await handlePortalSession(req, res);
      case 'get-credits':
        return await handleGetCredits(req, res);
      default:
        return res.status(400).json({ error: 'Invalid action specified' });
    }

  } catch (error) {
    console.error('Stripe API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error', 
      details: error.message 
    });
  }
}

async function handleCheckoutSession(req, res) {
  const { priceId, successUrl, cancelUrl } = req.body;

  if (!priceId) {
    return res.status(400).json({ error: 'Price ID is required' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl || `${req.headers.origin || 'http://localhost:5173'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${req.headers.origin || 'http://localhost:5173'}/cancel`,
      automatic_tax: { enabled: true },
    });

    return res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return res.status(500).json({ error: 'Failed to create checkout session' });
  }
}

async function handlePortalSession(req, res) {
  const { customerId, returnUrl } = req.body;

  if (!customerId) {
    return res.status(400).json({ error: 'Customer ID is required' });
  }

  try {
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl || `${req.headers.origin || 'http://localhost:5173'}/app`,
    });

    return res.status(200).json({ url: portalSession.url });
  } catch (error) {
    console.error('Error creating portal session:', error);
    return res.status(500).json({ error: 'Failed to create portal session' });
  }
}

async function handleGetCredits(req, res) {
  const { customerId } = req.body;

  if (!customerId) {
    return res.status(400).json({ error: 'Customer ID is required' });
  }

  try {
    // Get customer's subscription
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
      limit: 1
    });

    if (subscriptions.data.length === 0) {
      return res.status(200).json({ 
        tier: 'free',
        credits: 0,
        limit: 3 
      });
    }

    const subscription = subscriptions.data[0];
    
    // Determine tier based on price ID
    const priceId = subscription.items.data[0].price.id;
    let tier = 'pro';
    let limit = 500;

    if (priceId === process.env.STRIPE_PRICE_PRO_YEARLY) {
      limit = 1000;
    }

    return res.status(200).json({ 
      tier,
      credits: 0, // You might want to track usage separately
      limit
    });

  } catch (error) {
    console.error('Error getting credits:', error);
    return res.status(500).json({ error: 'Failed to get credits' });
  }
}