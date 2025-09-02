// Magic Link Authentication - Send and validate email sign-in links
import crypto from 'crypto';
import { createOrUpdateUser, createSession, magicTokens } from './callback.js';

// Generate magic link token
function generateMagicToken() {
  return crypto.randomBytes(32).toString('hex');
}

// Send magic link email (mock implementation for now)
async function sendMagicLinkEmail(email, token) {
  // In a real implementation, this would send an actual email
  // For now, we'll just log the magic link to console
  const magicLink = `${process.env.APP_URL || 'http://localhost:5188'}/api/auth/callback?token=${token}`;
  
  console.log(`\n🔗 Magic Link for ${email}:`);
  console.log(`${magicLink}`);
  console.log(`(This would normally be sent via email)\n`);
  
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
        return res.redirect('/app?auth_error=' + encodeURIComponent('Invalid or expired link'));
      }

      // Check if token is expired (15 minutes)
      if (Date.now() > tokenData.expiresAt) {
        magicTokens.delete(token);
        return res.redirect('/app?auth_error=' + encodeURIComponent('Link has expired'));
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
      res.redirect('/app?auth_success=true');

    } catch (error) {
      console.error('Magic link validation error:', error);
      res.redirect('/app?auth_error=' + encodeURIComponent('Authentication failed'));
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

      res.json({
        success: true,
        message: 'Magic link sent! Check your email (or console in dev mode)',
        email
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