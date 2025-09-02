// User Data Export API
import { parseJWTSession, users } from '../auth/callback.js';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

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

    // Get user data
    const user = users.get(userData.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create export data
    const exportData = {
      exportInfo: {
        exportDate: new Date().toISOString(),
        exportVersion: '1.0',
        exportedBy: user.email
      },
      account: {
        id: user.id,
        email: user.email,
        name: user.name,
        tier: user.tier,
        authMethod: user.authMethod,
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt
      },
      usage: {
        monthlyUsage: user.monthlyUsage,
        hasUsedNewUserBonus: user.hasUsedNewUserBonus,
        totalGenerations: user.totalGenerations || 0
      },
      preferences: user.preferences || {
        emailNotifications: {
          accountActivity: true,
          usageAlerts: true,
          marketingUpdates: false
        },
        appNotifications: {
          desktopNotifications: true,
          soundAlerts: true
        },
        privacy: {
          allowAnalytics: true,
          shareUsageData: false
        }
      },
      metadata: {
        note: 'This export contains all your account data from JSON Prompt Studio.',
        dataTypes: ['Account Information', 'Usage Statistics', 'Preferences'],
        contactSupport: 'For questions about this data export, contact support.'
      }
    };

    // Set headers for file download
    const filename = `jsonpromptstudio-export-${user.id}-${new Date().toISOString().split('T')[0]}.json`;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    res.json(exportData);

  } catch (error) {
    console.error('Data export API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}