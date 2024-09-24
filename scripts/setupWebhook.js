require('dotenv').config();
const axios = require('axios');

const BOT_TOKEN = process.env.BOT_TOKEN;
if (!BOT_TOKEN) {
  console.error('BOT_TOKEN is not set. Please set it in your environment variables.');
  process.exit(1);
}

const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;
const URI = `https://first-tma-five.vercel.app/api/bot`;

const setWebhook = async () => {
  try {
    const res = await axios.get(`${TELEGRAM_API}/setWebhook?url=${URI}`);
    console.log(res.data);
  } catch (error) {
    console.error('Error setting webhook:', error.response ? error.response.data : error.message);
  }
};

setWebhook();