import express, { Request, Response } from 'express';
import { redisClient } from '../redis.js';

const router = express.Router();

router.get('/tokens', async (req: Request, res: Response): Promise<void> => {
  try {
    // Get all keys that start with 'user:'
    const keys = await redisClient.keys('user:*');
    const tokens = [];

    // Fetch data for each key
    for (const key of keys) {
      const userData = await redisClient.hGetAll(key);
      if (Object.keys(userData).length > 0) {
        tokens.push({
          id: key.replace('user:', ''),
          ...userData
        });
      }
    }

    console.log('Retrieved all tokens:');
    res.json({ tokens });
  } catch (error) {
    console.error('🔴 [Vercel] Error fetching tokens:', error);
    res.status(500).json({ error: 'Failed to fetch tokens from Redis' });
  }
});

export default router;
