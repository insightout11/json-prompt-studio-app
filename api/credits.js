// Credits Management API - Handle pro user credits for image generation

// Simple in-memory storage for development - in production use database
const userCredits = new Map();
const creditTransactions = new Map();

// Credit costs
const CREDIT_COSTS = {
  'nano_banana_generation': 1, // 1 credit per generation
  'enhancement': 1, // 1 credit per enhancement
  'variations': 1 // 1 credit per additional variation
};

// Subscription credit allocations
const MONTHLY_ALLOCATIONS = {
  'pro': 150 // Pro plan gets 150 credits per month
};

// Helper to initialize user credits
function initializeUserCredits(userId, plan = 'pro') {
  if (!userCredits.has(userId)) {
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    
    userCredits.set(userId, {
      currentCredits: MONTHLY_ALLOCATIONS[plan] || 0,
      monthlyAllocation: MONTHLY_ALLOCATIONS[plan] || 0,
      lastResetMonth: currentMonth,
      totalUsed: 0,
      plan
    });
  }
  return userCredits.get(userId);
}

// Helper to check if credits need monthly reset
function checkMonthlyReset(userId) {
  const userCredit = userCredits.get(userId);
  if (!userCredit) return null;

  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  
  if (userCredit.lastResetMonth !== currentMonth) {
    // Add rollover (capped at 300)
    const rolloverAmount = Math.min(userCredit.currentCredits, 300 - userCredit.monthlyAllocation);
    const newAllocation = userCredit.monthlyAllocation + Math.max(0, rolloverAmount);
    
    userCredits.set(userId, {
      ...userCredit,
      currentCredits: newAllocation,
      lastResetMonth: currentMonth
    });
    
    return userCredits.get(userId);
  }
  
  return userCredit;
}

// Helper to reserve credits (returns reservation ID)
function reserveCredits(userId, amount, operation) {
  const userCredit = checkMonthlyReset(userId);
  
  if (!userCredit) {
    throw new Error('User not found');
  }
  
  if (userCredit.currentCredits < amount) {
    throw new Error(`Insufficient credits. Required: ${amount}, Available: ${userCredit.currentCredits}`);
  }
  
  // Create reservation
  const reservationId = `res_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const reservation = {
    id: reservationId,
    userId,
    amount,
    operation,
    status: 'reserved',
    createdAt: Date.now(),
    expiresAt: Date.now() + (5 * 60 * 1000) // 5 minute expiration
  };
  
  // Temporarily reduce available credits
  userCredits.set(userId, {
    ...userCredit,
    currentCredits: userCredit.currentCredits - amount
  });
  
  // Store transaction
  if (!creditTransactions.has(userId)) {
    creditTransactions.set(userId, []);
  }
  creditTransactions.get(userId).push(reservation);
  
  return reservationId;
}

// Helper to confirm credit spend (after successful operation)
function confirmSpend(userId, reservationId) {
  const transactions = creditTransactions.get(userId) || [];
  const reservation = transactions.find(t => t.id === reservationId);
  
  if (!reservation) {
    throw new Error('Reservation not found');
  }
  
  if (reservation.status !== 'reserved') {
    throw new Error(`Cannot confirm reservation with status: ${reservation.status}`);
  }
  
  if (Date.now() > reservation.expiresAt) {
    // Expired reservation - refund the credits
    refundReservation(userId, reservationId);
    throw new Error('Reservation expired');
  }
  
  // Mark as confirmed
  reservation.status = 'confirmed';
  reservation.confirmedAt = Date.now();
  
  const userCredit = userCredits.get(userId);
  userCredits.set(userId, {
    ...userCredit,
    totalUsed: userCredit.totalUsed + reservation.amount
  });
  
  return reservation;
}

// Helper to refund reserved credits
function refundReservation(userId, reservationId) {
  const transactions = creditTransactions.get(userId) || [];
  const reservation = transactions.find(t => t.id === reservationId);
  
  if (!reservation || reservation.status !== 'reserved') {
    return false;
  }
  
  // Refund the credits
  const userCredit = userCredits.get(userId);
  userCredits.set(userId, {
    ...userCredit,
    currentCredits: userCredit.currentCredits + reservation.amount
  });
  
  // Mark as refunded
  reservation.status = 'refunded';
  reservation.refundedAt = Date.now();
  
  return true;
}

export default async function handler(req, res) {
  try {
    const { userId, action = 'get' } = req.method === 'GET' ? req.query : req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    switch (req.method) {
      case 'GET':
        // Get current credit balance and usage
        const userCredit = checkMonthlyReset(userId) || initializeUserCredits(userId);
        
        return res.json({
          userId,
          currentCredits: userCredit.currentCredits,
          monthlyAllocation: userCredit.monthlyAllocation,
          totalUsed: userCredit.totalUsed,
          plan: userCredit.plan,
          lastResetMonth: userCredit.lastResetMonth,
          nextResetDate: getNextResetDate()
        });

      case 'POST':
        if (action === 'reserve') {
          const { amount, operation } = req.body;
          
          if (!amount || amount <= 0) {
            return res.status(400).json({ error: 'Valid amount is required' });
          }
          
          try {
            const reservationId = reserveCredits(userId, amount, operation);
            const userCredit = userCredits.get(userId);
            
            return res.json({
              reservationId,
              reserved: amount,
              remainingCredits: userCredit.currentCredits,
              expiresIn: 300 // 5 minutes
            });
          } catch (error) {
            return res.status(402).json({ error: error.message });
          }
        }
        
        if (action === 'confirm') {
          const { reservationId } = req.body;
          
          if (!reservationId) {
            return res.status(400).json({ error: 'Reservation ID is required' });
          }
          
          try {
            const confirmation = confirmSpend(userId, reservationId);
            const userCredit = userCredits.get(userId);
            
            return res.json({
              confirmed: true,
              reservationId,
              amount: confirmation.amount,
              remainingCredits: userCredit.currentCredits,
              totalUsed: userCredit.totalUsed
            });
          } catch (error) {
            return res.status(400).json({ error: error.message });
          }
        }
        
        if (action === 'refund') {
          const { reservationId } = req.body;
          
          if (!reservationId) {
            return res.status(400).json({ error: 'Reservation ID is required' });
          }
          
          const refunded = refundReservation(userId, reservationId);
          const userCredit = userCredits.get(userId);
          
          return res.json({
            refunded,
            remainingCredits: userCredit ? userCredit.currentCredits : 0
          });
        }
        
        return res.status(400).json({ error: 'Invalid action' });

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }

  } catch (error) {
    console.error('Credits API error:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
}

// Helper to get next month's reset date
function getNextResetDate() {
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return nextMonth.toISOString();
}