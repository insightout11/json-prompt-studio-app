import Stripe from 'stripe';

export default async function handler(req, res) {
  // Only allow in development or with a debug token
  const isDev = process.env.NODE_ENV === 'development';
  const debugToken = req.query.debug_token;
  
  if (!isDev && debugToken !== process.env.DEBUG_TOKEN) {
    return res.status(403).json({ error: 'Debug endpoint not available' });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({ error: 'STRIPE_SECRET_KEY not configured' });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  try {
    // List all prices
    const allPrices = await stripe.prices.list({
      limit: 50,
      expand: ['data.product']
    });

    // Try to find prices by lookup keys
    const lookupTests = {
      pro_monthly: null,
      pro_yearly: null
    };

    for (const [lookup_key, _] of Object.entries(lookupTests)) {
      try {
        const prices = await stripe.prices.list({
          lookup_keys: [lookup_key],
          expand: ['data.product']
        });
        lookupTests[lookup_key] = prices.data.length > 0 ? prices.data[0] : 'NOT_FOUND';
      } catch (error) {
        lookupTests[lookup_key] = `ERROR: ${error.message}`;
      }
    }

    // Environment variable fallbacks
    const envPrices = {
      pro_monthly: process.env.STRIPE_PRICE_PRO_MONTHLY || 'NOT_SET',
      pro_yearly: process.env.STRIPE_PRICE_PRO_YEARLY || 'NOT_SET'
    };

    res.json({
      all_prices: allPrices.data.map(price => ({
        id: price.id,
        lookup_key: price.lookup_key,
        unit_amount: price.unit_amount,
        currency: price.currency,
        recurring: price.recurring,
        product_name: price.product?.name
      })),
      lookup_key_tests: lookupTests,
      environment_variables: envPrices,
      debug_info: {
        stripe_key_configured: !!process.env.STRIPE_SECRET_KEY,
        stripe_key_prefix: process.env.STRIPE_SECRET_KEY?.substring(0, 8) + '...',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to fetch Stripe data',
      message: error.message,
      type: error.type
    });
  }
}