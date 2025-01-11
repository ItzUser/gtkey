const https = require("https");

const DISCORD_WEBHOOK_URL =
  "https://discord.com/api/webhooks/1326510907844722730/W4tKUX1HJdxHrkGnEN8sqtqmBPxbQHc7WoaY9BdyTYt_SHQaOy4DWoVfb3j3UhUToI4P";

// Fungsi untuk menghasilkan key acak
function generateRandomKey() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let key = "";
  for (let i = 0; i < 10; i++) {
    key += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return key;
}

// Fungsi untuk mengirim log ke Discord menggunakan metode POST
function sendLogToDiscord(key, timestamp) {
  const payload = JSON.stringify({
    content: `New Key Generated: **${key}**\nTimestamp: **${timestamp}**`,
  });

  const url = new URL(DISCORD_WEBHOOK_URL);
  const options = {
    hostname: url.hostname,
    path: url.pathname + url.search,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(payload),
    },
    timeout: 5000,
  };

  const req = https.request(options, (res) => {
    if (res.statusCode === 204) {
      console.log("Message sent successfully to Discord");
    } else {
      console.error(`Failed to send log to Discord: ${res.statusCode}`);
    }
  });

  req.on("timeout", () => {
    console.error("Request timed out");
    req.abort();
  });

  req.on("error", (error) => {
    console.error(`Error sending log to Discord: ${error.message}`);
  });

  req.write(payload);
  req.end();
}

// Endpoint handler untuk cron job di Vercel
module.exports = (req, res) => {
  const now = new Date();
  const key = generateRandomKey();
  const timestamp = now.toLocaleString();

  // Kirim log ke Discord
  sendLogToDiscord(key, timestamp);

  // Respon ke pengguna dengan detail data
  res.status(200).json({
    message: "Log sent to Discord",
    key,
    timestamp: now.toISOString(),
  });
};
