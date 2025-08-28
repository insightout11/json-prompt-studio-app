// Magic Link Callback - Handle login from email
import crypto from 'crypto';

// Import the same token storage (in production, this would be shared via database)
// For now, we'll import from the magic-link file
const verificationTokens = new Map();

// Simple user storage (in production, use database)
const users = new Map();
const sessions = new Map();

// Credit granting helper
function grantNewUserBonus(userId, email) {
  // This would integrate with your existing credit system
  // For now, we'll just mark that they got the bonus
  return {
    creditsGranted: 10,
    type: 'bonus_new_user',
    grantedAt: new Date().toISOString()
  };
}

// Generate session ID
function generateSessionId() {
  return crypto.randomBytes(24).toString('hex');
}

// Migration helper for anonymous usage
function migrateAnonymousUsage(userId, fingerprint) {
  // In production, this would migrate usage counters from device fingerprint to user ID
  // For development, we'll simulate this
  console.log(`📊 Migrating anonymous usage from ${fingerprint} to user ${userId}`);
  
  // Simulate finding previous usage
  const today = new Date().toDateString();
  const anonymousKey = `device:${fingerprint}:${today}`;
  
  // In production, you would:
  // 1. Get current anonymous usage: rateLimitStore.get(anonymousKey)
  // 2. Set new user usage: rateLimitStore.set(`user:${userId}:${today}`, usage)
  // 3. Delete anonymous key: rateLimitStore.delete(anonymousKey)
  
  return { migrated: true, previousUsage: 2 }; // Simulated
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { token } = req.query;

    if (!token || typeof token !== 'string') {
      return res.status(400).json({ error: 'Invalid token' });
    }

    // Get verification token from magic-link storage
    // In a real app, this would be in shared storage (Redis/Database)
    const tokenData = verificationTokens.get(token);

    if (!tokenData) {
      return res.status(400).json({ error: 'Invalid or expired link' });
    }

    // Check if token is expired
    if (Date.now() > tokenData.expires) {
      verificationTokens.delete(token);
      return res.status(400).json({ error: 'Link has expired' });
    }

    // Check if token has been used
    if (tokenData.used) {
      return res.status(400).json({ error: 'Link has already been used' });
    }

    // Mark token as used
    tokenData.used = true;
    verificationTokens.set(token, tokenData);

    const { email } = tokenData;

    // Find or create user
    let user = users.get(email);
    let isNewUser = false;

    if (!user) {
      // Create new user
      isNewUser = true;
      const userId = crypto.randomUUID();
      
      user = {
        id: userId,
        email: email,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        tier: 'new_user', // Start with new_user tier for 10 bonus generations
        monthlyUsage: 0,
        hasUsedNewUserBonus: false,
        emailVerified: true // Magic link verifies email
      };

      users.set(email, user);
      console.log(`👤 Created new user: ${email} (${userId})`);
    } else {
      // Update last login
      user.lastLoginAt = new Date().toISOString();
      users.set(email, user);
      console.log(`👤 User login: ${email} (${user.id})`);
    }

    // Grant new user bonus (idempotent)
    let bonusGranted = null;
    if (isNewUser && !user.hasUsedNewUserBonus) {
      bonusGranted = grantNewUserBonus(user.id, email);
      console.log(`🎁 Granted ${bonusGranted.creditsGranted} bonus credits to ${email}`);
      
      // Analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'bonus_credits_granted', {
          amount: bonusGranted.creditsGranted,
          user_id: user.id
        });
      }
    }

    // Create session
    const sessionId = generateSessionId();
    const session = {
      id: sessionId,
      userId: user.id,
      email: user.email,
      createdAt: Date.now(),
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days
    };

    sessions.set(sessionId, session);

    // Migrate anonymous usage if this is a new user
    if (isNewUser) {
      // In production, get fingerprint from cookies/headers
      const fingerprint = req.headers['x-device-fingerprint'] || 'simulated';
      migrateAnonymousUsage(user.id, fingerprint);
    }

    // Set session cookie
    res.setHeader('Set-Cookie', [
      `session=${sessionId}; HttpOnly; Path=/; Max-Age=${30 * 24 * 60 * 60}; SameSite=Strict${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`,
      `justUpgraded=true; Path=/; Max-Age=60; SameSite=Strict${process.env.NODE_ENV === 'production' ? '; Secure' : ''}` // Short-lived flag for welcome toast
    ]);

    // Analytics
    if (isNewUser) {
      console.log('📈 Analytics: signup_completed', {
        method: 'email',
        user_id: user.id,
        email_domain: email.split('@')[1]
      });
    }

    // Redirect back to app with success
    const redirectUrl = new URL('http://localhost:5188/');
    redirectUrl.searchParams.set('auth', 'success');
    
    res.redirect(302, redirectUrl.toString());

  } catch (error) {
    console.error('Callback error:', error);
    
    // Redirect to app with error
    const redirectUrl = new URL('http://localhost:5188/');
    redirectUrl.searchParams.set('auth', 'error');
    
    res.redirect(302, redirectUrl.toString());
  }
}

// Export storage for sharing with magic-link (development only)
export { verificationTokens, users, sessions };