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
  
  let referrerId = null;
  if (startPayload && startPayload.startsWith('ref_')) {
    referrerId = startPayload.slice(4);
    console.log('Referrer ID:', referrerId);
    message += ` You were referred by user ${referrerId}.`;
    
    // Add points to the referrer
    try {
      const referrerRef = db.collection('users').doc(referrerId);
      await db.runTransaction(async (transaction) => {
        const doc = await transaction.get(referrerRef);
        if (doc.exists) {
          const currentPoints = doc.data().points || 0;
          transaction.update(referrerRef, { points: currentPoints + 100 });
        }
      });
      console.log('Added 100 points to referrer');
    } catch (error) {
      console.error('Error adding points to referrer:', error);
    }
  }
  
  try {
    // Check if user exists, if not, create a new user with 0 points
    const userRef = db.collection('users').doc(userId);
    const doc = await userRef.get();
    if (!doc.exists) {
      await userRef.set({ points: 0, referredBy: referrerId });
      console.log(`Created new user: ${userId}`);
    } else {
      console.log(`User ${userId} already exists`);
    }

    let webAppUrl = `https://leemount96.github.io/tma-test/?userId=${encodeURIComponent(userId)}`;
    if (referrerId) {
      webAppUrl += `&ref=${encodeURIComponent(referrerId)}`;
    }
    
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

app.get('/api/checkReferral', async (req, res) => {
  const { userId, referrerId } = req.query;
  
  if (!userId || !referrerId) {
    return res.status(400).json({ error: 'userId and referrerId are required' });
  }

  try {
    const userRef = db.collection('users').doc(userId);
    const doc = await userRef.get();

    if (!doc.exists) {
      // New user, add points to referrer
      const referrerRef = db.collection('users').doc(referrerId);
      await db.runTransaction(async (transaction) => {
        const referrerDoc = await transaction.get(referrerRef);
        if (referrerDoc.exists) {
          const currentPoints = referrerDoc.data().points || 0;
          transaction.update(referrerRef, { points: currentPoints + 100 });
        }
      });

      // Create new user document
      await userRef.set({ points: 0, referredBy: referrerId });

      res.status(200).json({ message: 'Referral successful', pointsAdded: 100 });
    } else {
      res.status(200).json({ message: 'User already exists', pointsAdded: 0 });
    }
  } catch (error) {
    console.error('Error checking referral:', error);
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