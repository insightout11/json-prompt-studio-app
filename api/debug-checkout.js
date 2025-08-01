export default async function handler(req, res) {
  try {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { lookup_key } = req.body;
    
    // First, let's see if we can find the price
    const prices = await stripe.prices.list({
      lookup_keys: [lookup_key],
      expand: ['data.product']
    });
    
    if (prices.data.length === 0) {
      return res.status(400).json({ 
        error: 'Price not found',
        lookup_key: lookup_key,
        debug: 'No prices found with this lookup key'
      });
    }
    
    // Return the price info instead of creating checkout session
    res.json({
      success: true,
      lookup_key: lookup_key,
      price_found: prices.data[0].id,
      price_amount: prices.data[0].unit_amount,
      product_name: prices.data[0].product.name
    });
    
  } catch (error) {
    console.error('Debug checkout error:', error);
    res.status(500).json({ 
      error: error.message,
      code: error.code,
      type: error.type
    });
  }
}