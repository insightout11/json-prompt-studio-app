import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Validate required environment variables
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('Missing required Stripe environment variables');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'customer.subscription.created':
        console.log('Subscription created:', event.data.object.id);
        // Handle new subscription
        break;

      case 'customer.subscription.updated':
        console.log('Subscription updated:', event.data.object.id);
        // Handle subscription changes
        break;

      case 'customer.subscription.deleted':
        console.log('Subscription cancelled:', event.data.object.id);
        // Handle subscription cancellation
        break;

      case 'invoice.payment_succeeded':
        console.log('Payment succeeded:', event.data.object.id);
        // Handle successful payment
        break;

      case 'invoice.payment_failed':
        console.log('Payment failed:', event.data.object.id);
        // Handle failed payment
        break;

      case 'checkout.session.completed':
        const session = event.data.object;
        console.log('Checkout completed:', session.id);
        
        // If this is a subscription, the subscription will be created automatically
        if (session.mode === 'subscription') {
          console.log('Subscription checkout completed for:', session.customer);
        }
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
}