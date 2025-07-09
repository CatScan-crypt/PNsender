import express, { Request, Response } from 'express';
import admin from 'firebase-admin';
import dotenv from 'dotenv';
dotenv.config();
const router = express.Router();

// Add default image URL

router.post('/send-notification', async (req: Request, res: Response): Promise<void> => {
  const { token, title, body, label, source, image } = req.body;

  if (!token || !title || !body) {
    res.status(400).json({ error: 'Missing token, title, or body' });
    return;
  }
  const DEFAULT_IMAGE: string = "https://e7.pngegg.com/pngimages/708/311/png-clipart-icon-logo-twitter-logo-twitter-logo-blue-social-media-thumbnail.png";

  const link: string = process.env.LOCAL_HOST || "https://pnreceiver-git-dev-catscans-projects.vercel.app/";
  const message = {
    notification: {
      title,
      body,
      // Add image to notification, use default if not provided
      image: image ?? DEFAULT_IMAGE,
    },
    
    token: token,
    webpush: {
      
      fcmOptions: {
        link: source ?? link,
        analyticsLabel: label ?? title,
      },
    },
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

export default router;
