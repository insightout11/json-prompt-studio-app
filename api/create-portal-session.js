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
    const { session_id } = req.body;

    // Get customer from checkout session
    const checkoutSession = await stripe.checkout.sessions.retrieve(session_id);

    // Create portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: checkoutSession.customer,
      return_url: 'https://jsonpromptstudio.com',
    });

    res.json({ url: portalSession.url });
  } catch (error) {
    console.error('Error creating portal session:', error);
    res.status(400).json({ error: { message: error.message } });
  }
}