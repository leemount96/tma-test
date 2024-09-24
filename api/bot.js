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

bot.command('start', async (ctx) => {
  console.log('Received start command');
  const startPayload = ctx.message.text.split(' ')[1];
  const userId = ctx.from.id.toString();
  console.log('User ID:', userId);
  console.log('Start payload:', startPayload);
  let message = 'Welcome to ₿earn!';
  
  try {
    // Check if user exists, if not, create a new user with 0 points
    const userRef = db.collection('users').doc(userId);
    const doc = await userRef.get();
    if (!doc.exists) {
      await userRef.set({ points: 0 });
      console.log(`Created new user: ${userId}`);
    } else {
      console.log(`User ${userId} already exists`);
    }

    if (startPayload && startPayload.startsWith('ref_')) {
      const referrerId = startPayload.split('_')[1];
      console.log('Referrer ID:', referrerId);
      message += ` You were referred by user ${referrerId}.`;
      // Here you would typically store this referral information and award points
      // For example:
      await db.runTransaction(async (transaction) => {
        const referrerDoc = await transaction.get(db.collection('users').doc(referrerId));
        if (referrerDoc.exists) {
          transaction.update(referrerDoc.ref, { points: referrerDoc.data().points + 100 });
          console.log(`Updated referrer ${referrerId} points`);
        } else {
          console.log(`Referrer ${referrerId} not found`);
        }
      });
    }

    const webAppUrl = `https://leemount96.github.io/tma-test/?userId=${encodeURIComponent(userId)}`;
    const replyMarkup = {
      inline_keyboard: [[
        { text: "Open ₿earn App", web_app: { url: webAppUrl } }
      ]]
    };
    console.log('Reply markup:', JSON.stringify(replyMarkup));

    await ctx.reply(message, { reply_markup: replyMarkup });
    console.log('Reply sent successfully');
  } catch (error) {
    console.error('Error in start command:', error);
    ctx.reply('Sorry, there was an error. Please try again later.');
  }
});

// Add a catch-all handler
bot.on('message', (ctx) => {
  console.log('Received message:', ctx.message);
  ctx.reply('I received your message!');
});

// Telegram bot webhook handler
app.post('/api/bot', async (req, res) => {
  console.log('Received update:', req.body);
  try {
    await bot.handleUpdate(req.body);
    res.status(200).send('OK');
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

// Main handler for Vercel
module.exports = (req, res) => {
  if (!req.url) {
    return res.status(404).send('Not Found');
  }
  return app(req, res);
};