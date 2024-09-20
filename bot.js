const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.command('start', (ctx) => {
  console.log('Received start command');
  const startPayload = ctx.message.text.split(' ')[1];
  let message = 'Welcome to ₿earn!';
  
  if (startPayload && startPayload.startsWith('ref_')) {
    const referrerId = startPayload.split('_')[1];
    message += ` You were referred by user ${referrerId}.`;
    // Here you would typically store this referral information
  }

  ctx.reply(message + ' Click the button below to open the mini app:', {
    reply_markup: {
      inline_keyboard: [[
        { text: "Open ₿earn App", web_app: { url: "https://leemount96.github.io/tma-test/" } }
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
module.exports = async (req, res) => {
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
    res.status(500).end();
  }
};