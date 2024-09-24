const express = require('express');
const admin = require('firebase-admin');
const { Telegraf } = require('telegraf');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Decode the base64-encoded service account key
const serviceAccount = JSON.parse(Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_KEY, 'base64').toString('utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const bot = new Telegraf(process.env.BOT_TOKEN);

const VERCEL_URL = process.env.VERCEL_URL || 'first-tma-five.vercel.app';
const webhookUrl = `https://${VERCEL_URL}/api/bot`;

bot.telegram.setWebhook(webhookUrl)
  .then(() => console.log('Webhook set successfully'))
  .catch((error) => console.error('Failed to set webhook:', error));

bot.command('start', (ctx) => {
  console.log('Received start command');
  const startPayload = ctx.message.text.split(' ')[1];
  const userId = ctx.from.id; // Extract user ID
  let message = 'Welcome to ₿earn!';
  
  if (startPayload && startPayload.startsWith('ref_')) {
    const referrerId = startPayload.split('_')[1];
    message += ` You were referred by user ${referrerId}.`;
    // Here you would typically store this referral information
  }

  ctx.reply(message + ' Click the button below to open the mini app:', {
    reply_markup: {
      inline_keyboard: [[
        { text: "Open ₿earn App", web_app: { url: `https://leemount96.github.io/tma-test/?userId=${userId}` } }
      ]]
    }
  });
});

// Add a catch-all handler
bot.on('message', (ctx) => {
  console.log('Received message:', ctx.message);
  ctx.reply('I received your message!');
});

// This is the Vercel serverless function handler
app.post('/api/bot', async (req, res) => {
  console.log('Received update:', req.body);
  
  // Check if the request includes a valid bot token
  const secretToken = req.query.token;
  if (secretToken !== process.env.BOT_TOKEN) {
    console.error('Unauthorized request');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    await bot.handleUpdate(req.body);
    res.status(200).end();
  } catch (error) {
    console.error('Error in bot update handler:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

// Add endpoints to read/write points
app.get('/api/getPoints', async (req, res) => {
    try {
      const userId = req.query.userId;
      if (!userId) {
        return res.status(400).json({ error: 'userId is required' });
      }
      const userRef = db.collection('users').doc(userId);
      const doc = await userRef.get();
      if (!doc.exists) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json(doc.data());
    } catch (error) {
      console.error('Error fetching points:', error);
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
  });
  
  app.post('/api/updatePoints', async (req, res) => {
    try {
      const { userId, points } = req.body;
      if (!userId || points === undefined) {
        return res.status(400).json({ error: 'userId and points are required' });
      }
      const userRef = db.collection('users').doc(userId);
      await userRef.set({ points }, { merge: true });
      res.status(200).json({ message: 'Points updated successfully' });
    } catch (error) {
      console.error('Error updating points:', error);
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
  });

module.exports = app;