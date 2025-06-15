import express, { type Request, type Response } from 'express';
import { redisClient } from '../redis.js';

const router = express.Router();

// POST /api/tokens/delete
// Body: { ids: string[] }
router.post('/tokens/delete', async (req: Request, res: Response): Promise<void> => {
  const ids: string[] = req.body.ids;
  if (!Array.isArray(ids) || ids.length === 0) {
    res.status(400).json({ error: 'No IDs provided' });
    return;
  }

  try {
    // Ensure Redis is connected (optional, but safe)
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
    const deleteResults = await Promise.all(
      ids.map(id => redisClient.del(`user:${id}`))
    );
    res.json({ success: true, deleted: ids.filter((_, i) => deleteResults[i]) });
    console.log('Deleted tokens:', ids.filter((_, i) => deleteResults[i]));
    return;
  } catch (err) {
    console.error('[Redis] Failed to delete tokens:', err);
    res.status(500).json({ error: 'Failed to delete tokens' });
    return;
  }
});

export default router;
