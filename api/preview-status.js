// Image Preview Status API - Poll for job completion
import crypto from 'crypto';

// Import the job status cache from preview.js (in production, use shared Redis)
// For now, we'll recreate it here - this should be refactored to use a proper cache
const jobStatusCache = new Map();

// Helper to check Stable Horde job status
async function checkHordeStatus(jobId) {
  if (!process.env.HORDE_API_KEY) {
    throw new Error('Stable Horde API key not configured');
  }

  try {
    // First check the status
    const statusResponse = await fetch(`https://stablehorde.net/api/v2/generate/check/${jobId}`, {
      headers: {
        'apikey': process.env.HORDE_API_KEY
      }
    });

    if (!statusResponse.ok) {
      throw new Error(`Failed to check Horde status: ${statusResponse.statusText}`);
    }

    const status = await statusResponse.json();
    
    if (status.done && status.finished > 0) {
      // Get the generated images
      const imageResponse = await fetch(`https://stablehorde.net/api/v2/generate/status/${jobId}`, {
        headers: {
          'apikey': process.env.HORDE_API_KEY
        }
      });

      if (!imageResponse.ok) {
        throw new Error(`Failed to get Horde images: ${imageResponse.statusText}`);
      }

      const imageData = await imageResponse.json();
      
      // Process generations and ensure we have valid images
      const validImages = (imageData.generations || []).filter(gen => gen.img && !gen.censored);
      
      if (validImages.length === 0) {
        return {
          status: 'failed',
          error: 'No valid images generated or all images were censored'
        };
      }
      
      return {
        status: 'completed',
        images: validImages.map(gen => ({
          img: gen.img,
          seed: gen.seed,
          worker_id: gen.worker_id,
          worker_name: gen.worker_name,
          model: gen.model,
          censored: gen.censored || false
        })),
        metadata: {
          queue_position: 0,
          wait_time: status.wait_time || 0,
          kudos: status.kudos || 0,
          finished: status.finished,
          processing: status.processing,
          restarted: status.restarted,
          waiting: status.waiting,
          done: status.done
        }
      };
    } else if (status.faulted) {
      return {
        status: 'failed',
        error: 'Generation failed on Stable Horde - job was faulted'
      };
    } else if (status.is_possible === false) {
      return {
        status: 'failed', 
        error: 'Generation not possible with current parameters'
      };
    } else {
      // Still processing
      return {
        status: 'processing',
        queue_position: status.queue_position || 0,
        wait_time: status.wait_time || 0,
        finished: status.finished || 0,
        processing: status.processing || 0,
        restarted: status.restarted || 0,
        waiting: status.waiting || 1
      };
    }
  } catch (error) {
    console.error('Horde status check error:', error);
    return {
      status: 'failed',
      error: `Status check failed: ${error.message}`
    };
  }
}

// Helper to check Gemini job status (placeholder)
async function checkGeminiStatus(jobId) {
  // Check our local cache for the job status
  const cached = jobStatusCache.get(jobId);
  if (cached) {
    return cached;
  }

  // In a real implementation, you'd check with Google's API
  return {
    status: 'processing',
    estimated_time: 10
  };
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { jobId } = req.query;

    if (!jobId) {
      return res.status(400).json({ error: 'Job ID is required' });
    }

    // Get job info from cache to determine provider
    const jobInfo = jobStatusCache.get(jobId);
    
    if (!jobInfo) {
      // Try to determine provider from job ID format
      // Horde IDs are typically UUID format, Gemini might be different
      const isHordeId = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(jobId);
      
      if (isHordeId) {
        const status = await checkHordeStatus(jobId);
        return res.json({
          jobId,
          ...status,
          provider: 'horde'
        });
      } else {
        return res.status(404).json({ error: 'Job not found' });
      }
    }

    let status;

    if (jobInfo.provider === 'horde') {
      status = await checkHordeStatus(jobId);
    } else if (jobInfo.provider === 'gemini') {
      status = await checkGeminiStatus(jobId);
    } else {
      return res.status(400).json({ error: 'Unknown provider' });
    }

    // Update cache with latest status
    if (status.status === 'completed' || status.status === 'failed') {
      jobStatusCache.set(jobId, {
        ...jobInfo,
        ...status,
        completedAt: Date.now()
      });
      
      // Clean up completed jobs after 1 hour
      setTimeout(() => {
        jobStatusCache.delete(jobId);
      }, 60 * 60 * 1000);
    }

    res.json({
      jobId,
      provider: jobInfo.provider,
      submittedAt: jobInfo.submittedAt,
      ...status
    });

  } catch (error) {
    console.error('Preview status error:', error);
    res.status(500).json({
      error: 'Failed to check preview status',
      details: error.message
    });
  }
}