// Magic Link Authentication - Send login email
import crypto from 'crypto';
import { verificationTokens } from './callback.js';

// In-memory storage for development - in production use Redis or database
const rateLimiter = new Map(); // Simple rate limiting

// Generate secure random token
function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

// Rate limiting helper
function checkRateLimit(email, ip) {
  const now = Date.now();
  const key = `${email}:${ip}`;
  const attempts = rateLimiter.get(key) || [];
  
  // Clean old attempts (older than 1 hour)
  const recentAttempts = attempts.filter(time => now - time < 60 * 60 * 1000);
  
  // Allow max 5 attempts per hour per email+IP combination
  if (recentAttempts.length >= 5) {
    return { allowed: false, resetIn: 60 * 60 * 1000 - (now - recentAttempts[0]) };
  }
  
  // Update rate limit
  recentAttempts.push(now);
  rateLimiter.set(key, recentAttempts);
  
  return { allowed: true };
}

// Send email helper (mock for development)
async function sendMagicLinkEmail(email, token, redirectUrl) {
  const magicLink = `${redirectUrl}/api/auth/callback?token=${token}`;
  
  
  // In production, use a real email service like Resend, SendGrid, etc.
  /*
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'noreply@yourapp.com',
      to: email,
      subject: 'Your JSON Prompt Studio sign-in link',
      html: `
        <h2>Sign in to JSON Prompt Studio</h2>
        <p>Click the button below to sign in to your account:</p>
        <a href="${magicLink}" style="display: inline-block; padding: 12px 24px; background-color: #7c3aed; color: white; text-decoration: none; border-radius: 8px; font-weight: 500;">
          Sign In
        </a>
        <p>Or copy and paste this link into your browser:</p>
        <p><a href="${magicLink}">${magicLink}</a></p>
        <p>This link expires in 15 minutes and can only be used once.</p>
        <p>If you didn't request this link, you can safely ignore this email.</p>
      `
    })
  });
  
  if (!response.ok) {
    throw new Error('Failed to send email');
  }
  */
  
  return true;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, redirectUrl } = req.body;

    // Validate input
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const clientIP = req.ip || req.connection.remoteAddress || 'unknown';

    // Check rate limits
    const rateCheck = checkRateLimit(normalizedEmail, clientIP);
    if (!rateCheck.allowed) {
      return res.status(429).json({ 
        error: 'Too many requests. Please try again later.',
        resetIn: rateCheck.resetIn
      });
    }

    // Generate secure token
    const token = generateToken();
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Store token
    verificationTokens.set(token, {
      email: normalizedEmail,
      expires: expires.getTime(),
      used: false,
      createdAt: Date.now()
    });

    // Clean up expired tokens (simple cleanup)
    const now = Date.now();
    for (const [key, value] of verificationTokens.entries()) {
      if (value.expires < now) {
        verificationTokens.delete(key);
      }
    }

    // Send email
    try {
      await sendMagicLinkEmail(normalizedEmail, token, 'http://localhost:5188');
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      // Don't expose email sending errors to user
      return res.status(500).json({ error: 'Failed to send email. Please try again.' });
    }

    // Success response
    res.status(200).json({ 
      success: true, 
      message: 'Magic link sent to your email',
      email: normalizedEmail 
    });

  } catch (error) {
    console.error('Magic link error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Cleanup function for expired tokens (called periodically)
setInterval(() => {
  const now = Date.now();
  let cleaned = 0;
  
  for (const [key, value] of verificationTokens.entries()) {
    if (value.expires < now || value.used) {
      verificationTokens.delete(key);
      cleaned++;
    }
  }
  
  if (cleaned > 0) {
  }
}, 5 * 60 * 1000); // Clean every 5 minutes