// User Profile Update API
import { parseJWTSession, createJWTSession, users } from '../auth/callback.js';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get session token from cookie
    const sessionToken = req.headers.cookie
      ?.split(';')
      ?.find(cookie => cookie.trim().startsWith('session='))
      ?.split('=')[1];

    if (!sessionToken) {
      return res.status(401).json({ error: 'No session found' });
    }

    // Parse JWT session token
    const userData = parseJWTSession(sessionToken);
    if (!userData) {
      return res.status(401).json({ error: 'Invalid or expired session' });
    }

    // Get update data from request
    const { name, preferences } = req.body;

    // Find and update user
    const user = users.get(userData.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user data
    if (name !== undefined) {
      user.name = name.trim();
    }

    if (preferences) {
      user.preferences = {
        ...user.preferences,
        ...preferences
      };
    }

    // Update the users map
    users.set(userData.userId, user);

    // Create new JWT session with updated data
    const newSessionToken = createJWTSession(user);

    // Set new session cookie
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieDomain = isProduction ? '; Domain=.jsonpromptstudio.com' : '';
    res.setHeader('Set-Cookie', [
      `session=${newSessionToken}; HttpOnly; Path=/; Max-Age=${30 * 24 * 60 * 60}; SameSite=Lax${isProduction ? '; Secure' : ''}${cookieDomain}`
    ]);

    // Return updated user data
    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
        tier: user.tier,
        monthlyUsage: user.monthlyUsage,
        preferences: user.preferences,
        authMethod: user.authMethod
      }
    });

  } catch (error) {
    console.error('Profile update API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}