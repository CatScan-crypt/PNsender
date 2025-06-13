import express from 'express';
import { connectToRedis, redisClient } from './redis.js';

const app = express();
const port = process.env.PORT || 3001;

app.get('/', (_req, res) => {
  res.send('Hello from the server!');
});

app.get('/api/data', async (_req, res) => {
  try {
    const data = await redisClient.get('test_key');
    res.json({ data });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data from Redis' });
  }
});

const startServer = async () => {
  try {
    await connectToRedis();
    console.log('Connected to Redis successfully!');

    // Set some mock data
    await redisClient.set('test_key', 'Hello from Redis!');

    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Failed to start the server:', error);
    process.exit(1);
  }
};

startServer();
