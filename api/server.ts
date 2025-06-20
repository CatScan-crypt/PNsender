import express from 'express';
import cors from 'cors';
import admin from 'firebase-admin';
import { connectToRedis } from './redis.js';
import dotenv from 'dotenv';
import tokensRouter from './routes/getRegisteredTokens.js';
import sendNotificationRouter from './routes/sendNotification.js';
import deleteTokensRouter from './routes/deleteTokens.js';
import analyticsRouter from './routes/analytics.js';

dotenv.config();

// import serviceAccount from '../serviceAccount.json' assert { type: 'json' };
const serviceAccount = JSON.parse(process.env.VITE_SERVICE_ACCOUNT!);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


const app = express();

// Enable CORS for requests from your frontend
app.use(cors({
  origin: ['http://localhost:5174','http://localhost:5173', 'http://localhost:3001'],  // Add both common React ports
  credentials: true
}));

app.use(express.json());
const port = process.env.PORT || 3001;

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


app.use('/api', tokensRouter);
app.use('/api', sendNotificationRouter);
app.use('/api', deleteTokensRouter);
app.use('/api', analyticsRouter);

startServer();
