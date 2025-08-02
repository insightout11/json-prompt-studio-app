import Stripe from 'stripe';

export default async function handler(req, res) {
  // Validate required environment variables
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('STRIPE_SECRET_KEY environment variable is not set');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { lookup_key, trial_days, billing_cycle_anchor, customer_email } = req.body;

    let priceId = null;

    // Try to get price by lookup key first
    try {
      const prices = await stripe.prices.list({
        lookup_keys: [lookup_key],
        expand: ['data.product']
      });

      if (prices.data.length > 0) {
        priceId = prices.data[0].id;
      }
    } catch (lookupError) {
      console.warn('Lookup key not found:', lookup_key);
    }

    // Fallback to environment variable price IDs if lookup key fails
    if (!priceId) {
      const priceMapping = {
        'pro_monthly': process.env.STRIPE_PRICE_PRO_MONTHLY,
        'pro_yearly': process.env.STRIPE_PRICE_PRO_YEARLY,
      };

      priceId = priceMapping[lookup_key];
      
      if (!priceId) {
        return res.status(400).json({ 
          error: `Price not found for ${lookup_key}. Please check Stripe configuration.`,
          lookup_key: lookup_key 
        });
      }
    }

    // Build checkout session configuration
    const sessionConfig = {
      mode: 'subscription',
      line_items: [{
        quantity: 1,
        price: priceId
      }],
      success_url: `https://jsonpromptstudio.com/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `https://jsonpromptstudio.com/cancel.html`,
      
      // Allow promotion codes
      allow_promotion_codes: true,
      
      // Collect customer information for subscriptions
      billing_address_collection: 'auto',
    };

    // Add customer email if provided
    if (customer_email) {
      sessionConfig.customer_email = customer_email;
    }

    // Add subscription data with customizations
    sessionConfig.subscription_data = {
      metadata: {
        plan: lookup_key, // Use the actual lookup_key (e.g., 'team_monthly', 'pro_yearly')
        source: 'json_prompt_studio'
      }
    };

    // Add trial period if specified
    if (trial_days && trial_days > 0) {
      sessionConfig.subscription_data.trial_period_days = parseInt(trial_days);
      
      // Add trial metadata
      sessionConfig.subscription_data.metadata.trial_days = trial_days;
      sessionConfig.subscription_data.metadata.has_trial = 'true';
    }

    // Add billing cycle anchor if specified
    if (billing_cycle_anchor) {
      const anchorDate = new Date(billing_cycle_anchor);
      if (anchorDate > new Date()) {
        sessionConfig.subscription_data.billing_cycle_anchor = Math.floor(anchorDate.getTime() / 1000);
      }
    }

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create(sessionConfig);

    res.json({ 
      url: session.url,
      session_id: session.id 
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(400).json({ error: { message: error.message } });
  }
}