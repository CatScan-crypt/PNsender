import express, { type Request, type Response } from 'express';
import { connectToRedis, redisClient } from './redis.js';


const app = express();
const port = process.env.PORT || 3001;

app.get('/', (_req: Request, res: Response): void => {
  res.send('Hello from the server! Try /api/user/1 or /api/product/101');
});

// Endpoint to fetch a user by ID
app.get('/api/user/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await redisClient.hGetAll(`user:${req.params.id}`);
    if (Object.keys(user).length === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data from Redis' });
  }
});

// Endpoint to fetch a product by ID
app.get('/api/product/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await redisClient.hGetAll(`product:${req.params.id}`);
    if (Object.keys(product).length === 0) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    res.json({ product });
  } catch (error) {
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
    console.error('Failed to start the server:', error);
    process.exit(1);
  }
};

startServer();
