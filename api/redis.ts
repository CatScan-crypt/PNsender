import { createClient } from 'redis';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Explicitly load environment variables from .env.development.local
// Construct an absolute path to the .env file in the project root
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '..', '.env.development.local');
dotenv.config({ path: envPath });

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  console.error('🔴 [Vercel] Error: REDIS_URL is not defined in Vercel environment variables.');
  process.exit(1);
}

export const redisClient = createClient({
  url: redisUrl
});

redisClient.on('error', (err) => console.error('🔴 [Vercel] Redis Client Error:', err));
redisClient.on('connect', () => console.log('🟡 [Vercel] Redis client connecting...'));
redisClient.on('ready', () => console.log('🟢 [Vercel] Redis client ready!'));

export const connectToRedis = async () => {
  if (!redisClient.isOpen) {
    console.log('🟡 [Vercel] Attempting to connect to Redis...');
    await redisClient.connect();
    console.log('🟢 [Vercel] Successfully connected to Redis!');
  }
};
