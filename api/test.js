export default async function handler(req, res) {
  try {
    // Test environment variables
    const hasStripeKey = !!process.env.STRIPE_SECRET_KEY;
    const keyPreview = process.env.STRIPE_SECRET_KEY ? process.env.STRIPE_SECRET_KEY.substring(0, 7) + '...' : 'missing';
    
    res.json({ 
      status: 'ok',
      method: req.method,
      hasStripeKey,
      keyPreview,
      body: req.body
    });
  } catch (error) {
    res.status(500).json({ 
      error: error.message,
      stack: error.stack 
    });
  }
}