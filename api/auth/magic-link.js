// Magic Link Authentication - Send and validate email sign-in links
import crypto from 'crypto';
import { createOrUpdateUser, createSession, magicTokens } from './callback.js';

// Generate magic link token
function generateMagicToken() {
  return crypto.randomBytes(32).toString('hex');
}

// Send magic link email
async function sendMagicLinkEmail(email, token) {
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://json-prompt-studio-app.vercel.app'
    : 'http://localhost:5188';
  const magicLink = `${baseUrl}/api/auth/magic-link?token=${token}`;
  
  // For development, log to console
  if (process.env.NODE_ENV !== 'production') {
    console.log(`\n🔗 Magic Link for ${email}:`);
    console.log(`${magicLink}`);
    console.log(`(Click this link or copy to browser to sign in)\n`);
    return true;
  }
  
  // For production, you would integrate with an email service
  // Example services: SendGrid, Mailgun, AWS SES, Resend, etc.
  console.log(`Magic link generated for ${email}: ${magicLink}`);
  
  // TODO: Replace with actual email service
  // await sendEmail({
  //   to: email,
  //   subject: 'Sign in to JSON Prompt Studio',
  //   html: `<p>Click this link to sign in: <a href="${magicLink}">Sign In</a></p>`
  // });
  
  return true;
}

// Validate email format
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Main magic link handler (for Vercel serverless)
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    // Handle magic link validation
    const { token } = req.query;
    
    if (!token) {
      return res.status(400).json({ error: 'Missing token' });
    }

    try {
      // Look up the token
      const tokenData = magicTokens.get(token);
      
      if (!tokenData) {
        return res.redirect('/?auth_error=' + encodeURIComponent('Invalid or expired link'));
      }

      // Check if token is expired (15 minutes)
      if (Date.now() > tokenData.expiresAt) {
        magicTokens.delete(token);
        return res.redirect('/?auth_error=' + encodeURIComponent('Link has expired'));
      }

      // Create or update user
      const user = createOrUpdateUser({
        id: tokenData.email,
        email: tokenData.email,
        provider: 'email'
      });

      // Create session
      const session = createSession(user.id);

      // Clean up used token
      magicTokens.delete(token);

      // Set session cookie
      res.setHeader('Set-Cookie', `session=${session.id}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000`);

      // Redirect to app
      res.redirect('/?auth_success=true');

    } catch (error) {
      console.error('Magic link validation error:', error);
      res.redirect('/?auth_error=' + encodeURIComponent('Authentication failed'));
    }
    
    return;
  }

  if (req.method === 'POST') {
    // Handle magic link generation
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }

      if (!isValidEmail(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
      }

      // Generate token
      const token = generateMagicToken();
      const expiresAt = Date.now() + (15 * 60 * 1000); // 15 minutes

      // Store token
      magicTokens.set(token, {
        email,
        expiresAt,
        createdAt: Date.now()
      });

      // Send magic link email
      await sendMagicLinkEmail(email, token);

      const message = process.env.NODE_ENV !== 'production' 
        ? 'Magic link sent! Check the console/terminal for the link (development mode)'
        : 'Magic link sent! Check your email for the sign-in link';
        
      res.json({
        success: true,
        message,
        email,
        devMode: process.env.NODE_ENV !== 'production'
      });

    } catch (error) {
      console.error('Magic link generation error:', error);
      res.status(500).json({
        error: 'Failed to send magic link',
        details: error.message
      });
    }
    
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
}