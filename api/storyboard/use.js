// Storyboard Integration API - Attach generated images to storyboard slots

// Simple in-memory storage for development - in production use database
const storyboardSlots = new Map();
const slotHistory = new Map();

// Helper to validate storyboard slot
function validateSlot(storyboardId, slotId) {
  const key = `${storyboardId}:${slotId}`;
  
  if (!storyboardSlots.has(key)) {
    // Initialize slot if it doesn't exist
    storyboardSlots.set(key, {
      id: slotId,
      storyboardId,
      images: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
  }
  
  return storyboardSlots.get(key);
}

// Helper to add image to slot history for rollback
function addToSlotHistory(storyboardId, slotId, imageData) {
  const key = `${storyboardId}:${slotId}`;
  
  if (!slotHistory.has(key)) {
    slotHistory.set(key, []);
  }
  
  const history = slotHistory.get(key);
  history.push({
    ...imageData,
    addedAt: Date.now(),
    version: history.length + 1
  });
  
  // Keep only last 10 versions
  if (history.length > 10) {
    history.shift();
  }
  
  return history.length;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      storyboardId,
      slotId,
      imageUrl,
      jobId,
      prompt,
      provider,
      metadata = {},
      userId,
      action = 'add' // 'add', 'replace', 'remove'
    } = req.body;

    // Validate required fields
    if (!storyboardId || !slotId) {
      return res.status(400).json({
        error: 'Storyboard ID and Slot ID are required'
      });
    }

    const slot = validateSlot(storyboardId, slotId);

    switch (action) {
      case 'add':
      case 'replace':
        if (!imageUrl || !prompt) {
          return res.status(400).json({
            error: 'Image URL and prompt are required for add/replace action'
          });
        }

        const imageData = {
          id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          imageUrl,
          prompt,
          jobId,
          provider,
          metadata,
          userId,
          addedAt: Date.now()
        };

        if (action === 'replace') {
          // Replace all images in slot
          slot.images = [imageData];
        } else {
          // Add to slot (for multiple variations)
          slot.images.push(imageData);
        }

        // Add to history for rollback
        const version = addToSlotHistory(storyboardId, slotId, imageData);
        
        slot.updatedAt = Date.now();
        storyboardSlots.set(`${storyboardId}:${slotId}`, slot);

        return res.json({
          success: true,
          action,
          slot: {
            id: slot.id,
            storyboardId: slot.storyboardId,
            imageCount: slot.images.length,
            latestImage: imageData,
            version
          },
          message: `Image ${action === 'replace' ? 'replaced' : 'added'} in Scene ${slotId}`
        });

      case 'remove':
        const { imageId } = req.body;
        
        if (imageId) {
          // Remove specific image
          slot.images = slot.images.filter(img => img.id !== imageId);
        } else {
          // Remove all images from slot
          slot.images = [];
        }

        slot.updatedAt = Date.now();
        storyboardSlots.set(`${storyboardId}:${slotId}`, slot);

        return res.json({
          success: true,
          action,
          slot: {
            id: slot.id,
            storyboardId: slot.storyboardId,
            imageCount: slot.images.length
          },
          message: imageId ? 'Image removed from scene' : 'All images removed from scene'
        });

      case 'get':
        // Get current slot contents
        return res.json({
          slot: {
            id: slot.id,
            storyboardId: slot.storyboardId,
            images: slot.images,
            imageCount: slot.images.length,
            createdAt: slot.createdAt,
            updatedAt: slot.updatedAt
          }
        });

      default:
        return res.status(400).json({ error: 'Invalid action' });
    }

  } catch (error) {
    console.error('Storyboard integration error:', error);
    res.status(500).json({
      error: 'Failed to update storyboard',
      details: error.message
    });
  }
}