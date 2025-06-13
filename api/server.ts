import express, { type Request, type Response } from 'express';
import { connectToRedis, redisClient } from './redis.js';


const app = express();
const port = process.env.PORT || 3001;

// Endpoint to fetch a user by ID
app.get('/api/user/:id', async (req: Request, res: Response): Promise<void> => {
  console.log(`🟡 [Vercel] Received request for user: ${req.params.id}`);
  try {
    const user = await redisClient.hGetAll(`user:${req.params.id}`);
    if (Object.keys(user).length === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json({ user });
  } catch (error) {
    console.error('🔴 [Vercel] Error fetching user data:', error);
    res.status(500).json({ error: 'Failed to fetch data from Redis' });
  }
});


const startServer = async () => {
  try {
    await connectToRedis();
    console.log('Connected to Redis successfully!');



    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('🔴 [Vercel] Failed to start the server:', error);
    process.exit(1);
  }
};

startServer();
