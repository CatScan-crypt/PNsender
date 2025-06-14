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
