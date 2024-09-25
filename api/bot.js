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
    
    let message = "🚀 Welcome to ₿earn - Start to earn points and yield on your Bitcoin! 🎉\n\n";
    message += "Here's what you can do:\n";
    message += "• Earn points daily 📅\n";
    message += "• Complete fun challenges 🎮\n";
    message += "• Refer friends for bonus points 🤝\n";
    message += "• Coming soon: Earn boosted yields on your Bitcoin 📚\n\n";
    
    let referrerId = null;
    
    if (startPayload && startPayload.startsWith('bearn_')) {
      referrerId = startPayload.slice(6); // Remove 'bearn_' prefix
      console.log('Referrer ID:', referrerId);
      
      if (referrerId === userId) {
        message += "Oops! You can't refer yourself. But don't worry, there are plenty of other ways to earn! 😉\n\n";
      } else {
        message += "🎈 Fantastic! You were referred by a friend!\n";
        message += "We've already added 100 points to your account as a welcome bonus. 🎁\n\n";
        
        // Add points to both the referrer and the new user
        try {
          const referrerRef = db.collection('users').doc(referrerId);
          const newUserRef = db.collection('users').doc(userId);
          
          await db.runTransaction(async (transaction) => {
            const referrerDoc = await transaction.get(referrerRef);
            const newUserDoc = await transaction.get(newUserRef);
            
            if (referrerDoc.exists) {
              const currentReferrerPoints = referrerDoc.data().points || 0;
              transaction.update(referrerRef, { points: currentReferrerPoints + 100 });
              // Send message to referrer
              bot.telegram.sendMessage(referrerId, "🎉 Great news! Someone used your referral link. You've earned 100 bonus points! Keep sharing and earning! 💪");
            } else {
              console.log(`Referrer ${referrerId} does not exist`);
            }
            
            if (newUserDoc.exists) {
              const userData = newUserDoc.data();
              if (userData.referredBy) {
                message += "It looks like you've already been referred before. No worries, there are still plenty of ways to earn points! 😊\n\n";
              } else {
                const currentNewUserPoints = userData.points || 0;
                transaction.update(newUserRef, { 
                  points: currentNewUserPoints + 100,
                  referredBy: referrerId
                });
              }
            } else {
              // If the new user doesn't exist yet, create their document with 100 points
              transaction.set(newUserRef, { points: 100, referredBy: referrerId });
            }
          });
          
          console.log('Referral process completed successfully');
        } catch (error) {
          console.error('Error in referral process:', error);
          message += "Oops! There was a hiccup processing your referral. But don't worry, you can still start earning points right away!\n\n";
        }
      }
    }
    
    try {
      // Check if user exists, if not, create a new user with 0 points
      const userRef = db.collection('users').doc(userId);
      const doc = await userRef.get();
      if (!doc.exists) {
        await userRef.set({ points: 0, referredBy: referrerId });
        console.log(`Created new user: ${userId}`);
        message += "🎉 Your ₿earn account is all set up and ready to go!\n\n";
      } else {
        console.log(`User ${userId} already exists`);
        message += "Welcome back to ₿earn! Ready to continue your earning journey? 😎\n\n";
      }
  
      let webAppUrl = `https://leemount96.github.io/tma-test/?userId=${encodeURIComponent(userId)}`;
      if (referrerId) {
        webAppUrl += `&ref=${encodeURIComponent(referrerId)}`;
      }
      
      message += "🚀 Tap the button below to launch the ₿earn app and start your crypto-earning adventure!\n";
      message += "Remember, the more you engage, the more you earn. Let's get started! 💪";
  
      const replyMarkup = {
        inline_keyboard: [[
          { text: "🚀 Launch ₿earn App", web_app: { url: webAppUrl } }
        ]]
      };
      console.log('Reply markup:', JSON.stringify(replyMarkup));
  
      await ctx.reply(message, { reply_markup: replyMarkup, parse_mode: 'Markdown' });
      console.log('Reply sent successfully');
    } catch (error) {
      console.error('Error in start command:', error);
      ctx.reply('Oops! We encountered a small hiccup. Please try again in a moment. Our crypto elves are working on it! 🧝‍♂️🛠️');
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