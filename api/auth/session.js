// Session API - Get current user data from session
import { parseJWTSession } from './callback.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
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

    // Return user data (excluding sensitive info if needed)
    const response = {
      id: userData.userId,
      email: userData.email,
      name: userData.name,
      avatarUrl: userData.avatarUrl,
      tier: userData.tier,
      monthlyUsage: userData.monthlyUsage,
      hasUsedNewUserBonus: userData.hasUsedNewUserBonus,
      authMethod: userData.authMethod,
      emailVerified: true, // OAuth users are verified
      isAuthenticated: true
    };

    res.json(response);

  } catch (error) {
    console.error('Session API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}