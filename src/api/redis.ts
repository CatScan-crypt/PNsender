import { createClient } from 'redis';
import dotenv from 'dotenv';

// Explicitly load environment variables from .env.development.local
dotenv.config({ path: '.env.development.local' });

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  console.error('🔴 Error: REDIS_URL is not defined. Please ensure a .env.development.local file exists in the project root and contains the REDIS_URL variable.');
  process.exit(1);
}

export const redisClient = createClient({
  url: redisUrl
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

export const connectToRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
};
