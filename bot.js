const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.command('start', (ctx) => {
  ctx.reply('Welcome to ₿earn! Click the button below to open the mini app:', {
    reply_markup: {
      inline_keyboard: [[
        { text: "Open Mini App", web_app: { url: "https://leemount96.github.io/tma-test" } }
      ]]
    }
  });
});

module.exports = async (req, res) => {
  try {
    await bot.handleUpdate(req.body);
    res.status(200).send('OK');
  } catch (error) {
    console.error('Error in bot update handler:', error);
    res.status(500).send('Internal Server Error');
  }
};