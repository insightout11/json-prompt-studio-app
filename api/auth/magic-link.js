// Magic Link Authentication - Send and validate email sign-in links
import crypto from 'crypto';
import { createOrUpdateUser, createJWTSession, magicTokens } from './callback.js';

// Generate magic link token
function generateMagicToken() {
  return crypto.randomBytes(32).toString('hex');
}

// Send magic link email
async function sendMagicLinkEmail(email, token) {
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://jsonpromptstudio.com'
    : 'http://localhost:5188';
  const magicLink = `${baseUrl}/api/auth/magic-link?token=${token}`;
  
  // For development, log to console
  if (process.env.NODE_ENV !== 'production') {
    console.log(`\n🔗 Magic Link for ${email}:`);
    console.log(`${magicLink}`);
    console.log(`(Click this link or copy to browser to sign in)\n`);
    return true;
  }
  
  // For production, send actual email
  try {
    if (process.env.RESEND_API_KEY) {
      console.log('🔑 Resend API Key found:', process.env.RESEND_API_KEY ? `${process.env.RESEND_API_KEY.substring(0, 8)}...` : 'MISSING');
      console.log('🔑 Attempting to send email to:', email);
      
      // Use Resend for email delivery
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'JSON Prompt Studio <noreply@jsonpromptstudio.com>',
          to: [email],
          subject: 'Sign in to JSON Prompt Studio',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1 style="color: #7c3aed;">JSON Prompt Studio</h1>
              <p>Click the button below to sign in to your account:</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${magicLink}" 
                   style="background-color: #7c3aed; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
                  Sign In
                </a>
              </div>
              <p style="color: #666; font-size: 14px;">
                This link will expire in 15 minutes. If you didn't request this, you can safely ignore this email.
              </p>
            </div>
          `,
        }),
      });

      console.log('🌐 Resend API response status:', response.status);
      console.log('🌐 Resend API response headers:', [...response.headers.entries()]);
      
      if (!response.ok) {
        const error = await response.text();
        console.error(`❌ Resend API error (${response.status}):`, error);
        console.error('❌ Full error response:', error);
        throw new Error(`Email delivery failed: ${response.status} - ${error}`);
      }

      const result = await response.json();
      console.log(`✅ Magic link email sent successfully to ${email}:`, JSON.stringify(result, null, 2));
      console.log(`📧 Email should arrive from: JSON Prompt Studio <noreply@jsonpromptstudio.com>`);
      console.log(`📬 Check spam/junk folder if not in inbox`);
      return true;
    } else {
      // Fallback: log to console if no email service configured
      console.log(`\n🔗 PRODUCTION Magic Link for ${email}:`);
      console.log(`${magicLink}`);
      console.log(`(Email service not configured - add RESEND_API_KEY to environment)\n`);
      return true;
    }
  } catch (error) {
    console.error('Failed to send magic link email:', error);
    // Still return true so the user gets feedback, but log the error
    return true;
  }
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
        const errorUrl = process.env.NODE_ENV === 'production' 
          ? 'https://jsonpromptstudio.com/app?auth_error=' + encodeURIComponent('Invalid or expired link')
          : 'http://localhost:5188/app?auth_error=' + encodeURIComponent('Invalid or expired link');
        return res.redirect(errorUrl);
      }

      // Check if token is expired (15 minutes)
      if (Date.now() > tokenData.expiresAt) {
        magicTokens.delete(token);
        const errorUrl = process.env.NODE_ENV === 'production' 
          ? 'https://jsonpromptstudio.com/app?auth_error=' + encodeURIComponent('Link has expired')
          : 'http://localhost:5188/app?auth_error=' + encodeURIComponent('Link has expired');
        return res.redirect(errorUrl);
      }

      // Create or update user
      const user = createOrUpdateUser({
        id: tokenData.email,
        email: tokenData.email,
        provider: 'email'
      });

      // Create JWT session token
      const sessionToken = createJWTSession(user);

      // Clean up used token
      magicTokens.delete(token);

      // Set session cookie with proper domain for production
      const isProduction = process.env.NODE_ENV === 'production';
      const cookieDomain = isProduction ? '; Domain=.jsonpromptstudio.com' : '';
      res.setHeader('Set-Cookie', [
        `session=${sessionToken}; HttpOnly; Path=/; Max-Age=${30 * 24 * 60 * 60}; SameSite=Lax${isProduction ? '; Secure' : ''}${cookieDomain}`
      ]);

      // Redirect to app with success status  
      const redirectUrl = process.env.NODE_ENV === 'production' 
        ? 'https://jsonpromptstudio.com/app?auth=success&method=email'
        : 'http://localhost:5188/app?auth=success&method=email';
      res.redirect(redirectUrl);

    } catch (error) {
      console.error('Magic link validation error:', error);
      const errorUrl = process.env.NODE_ENV === 'production' 
        ? 'https://jsonpromptstudio.com/app?auth_error=' + encodeURIComponent('Authentication failed')
        : 'http://localhost:5188/app?auth_error=' + encodeURIComponent('Authentication failed');
      res.redirect(errorUrl);
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

      let message;
      if (process.env.NODE_ENV !== 'production') {
        message = 'Magic link sent! Check the console/terminal for the link (development mode)';
      } else if (process.env.RESEND_API_KEY) {
        message = 'Magic link sent! Check your email for the sign-in link';
      } else {
        message = 'Magic link generated! Email service not configured - check server logs';
      }
        
      const baseUrl = process.env.NODE_ENV === 'production' 
        ? 'https://jsonpromptstudio.com'
        : 'http://localhost:5188';
      const magicLink = `${baseUrl}/api/auth/magic-link?token=${token}`;
      
      res.json({
        success: true,
        message,
        email,
        devMode: process.env.NODE_ENV !== 'production',
        magicLink: process.env.NODE_ENV !== 'production' ? magicLink : undefined
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