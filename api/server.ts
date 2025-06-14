import express, { type Request, type Response } from 'express';
import cors from 'cors';
import admin from 'firebase-admin';
import { connectToRedis, redisClient } from './redis.js';
import dotenv from 'dotenv';
dotenv.config();
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// import serviceAccount from '../serviceAccount.json' assert { type: 'json' };
const serviceAccount = JSON.parse(process.env.VITE_SERVICE_ACCOUNT!);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


const app = express();

// Enable CORS for requests from your frontend
app.use(cors({
  origin: ['http://localhost'],
  credentials: true // set to true if you use cookies/auth
}));

app.use(express.json());
const port = process.env.PORT || 3001;

// Endpoint to fetch a user by ID
app.post('/api/browser-info', async (req: Request, res: Response): Promise<void> => {
  const { token, browserType, browserVersion } = req.body;
  
  if (!token || !browserType || !browserVersion) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  try {
    // Check if token already exists
    const existingUser = await redisClient.hGetAll(`user:${token}`);
    if (Object.keys(existingUser).length > 0) {
      res.status(409).json({ error: 'Token already exists' });
      return;
    }

    // Generate a unique ID for the token
    const id = Date.now().toString();

    // Store the browser information
    await redisClient.hSet(`user:${token}`, {
      id,
      browserType,
      browserVersion,
      token,
      createdAt: new Date().toISOString()
    });

    console.log(`🟢 [Vercel] Stored browser info for token: ${token}`);
    res.status(201).json({ 
      message: 'Browser information stored successfully',
      id,
      token
    });
  } catch (error) {
    console.error('🔴 [Vercel] Error storing browser information:', error);
    res.status(500).json({ error: 'Failed to store data in Redis' });
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

app.get('/api/tokens', async (req: Request, res: Response): Promise<void> => {
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

app.post('/api/send-notification', async (req: Request, res: Response): Promise<void> => {
  const { token, title, body } = req.body;

  if (!token || !title || !body) {
    res.status(400).json({ error: 'Missing token, title, or body' });
    return;
  }

  const message = {
    notification: {
      title,
      body,
    },
    token: token,
  };

  try {
    const response = await admin.messaging().send(message);
    console.log('Successfully sent message:', response);
    res.status(200).json({ messageId: response });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Error sending notification' });
  }
});

startServer();
