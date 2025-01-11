const https = require("https");

let cachedKey = null;
let lastUpdated = null;
let cachedMessageId = null;  // Menyimpan messageId dari pesan Discord yang pertama kali dikirim

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
    method: "POST", // Menggunakan metode POST untuk mengirim pesan
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(payload),
    },
    timeout: 5000, // Timeout 5 detik untuk permintaan
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

// Fungsi utama untuk memperbarui key, mengirim log, dan merespon
function updateKeyAndSendLog() {
  const now = Date.now();
  cachedKey = generateRandomKey();
  lastUpdated = now;

  const timestamp = new Date(lastUpdated).toLocaleString();

  if (cachedMessageId) {
    // Jika sudah ada messageId, edit pesan (Anda bisa menambahkan log di sini)
    console.log(`Editing previous message with key: ${cachedKey}`);
    editLogOnDiscord(cachedKey, timestamp);
  } else {
    // Jika belum ada messageId, kirim pesan baru
    console.log(`Sending new message with key: ${cachedKey}`);
    sendLogToDiscord(cachedKey, timestamp);
  }

  console.log(`Key updated: ${cachedKey} at ${timestamp}`);
}

// Fungsi untuk mengedit pesan di Discord jika messageId ada
function editLogOnDiscord(key, timestamp) {
  if (!cachedMessageId) {
    console.log("No message to edit, sending new message...");
    sendLogToDiscord(key, timestamp);
    return;
  }

  const payload = JSON.stringify({
    content: `Key Updated: **${key}**\nTimestamp: **${timestamp}** (Edited)`,
  });

  const url = new URL(`${DISCORD_WEBHOOK_URL}/${cachedMessageId}`);
  const options = {
    hostname: url.hostname,
    path: url.pathname + url.search,
    method: "PATCH",  // Menggunakan PATCH untuk edit pesan
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(payload),
    },
    timeout: 5000, // Timeout 5 detik untuk permintaan
  };

  const req = https.request(options, (res) => {
    if (res.statusCode === 200) {
      console.log("Message edited successfully on Discord");
    } else {
      console.error(`Failed to edit log on Discord: ${res.statusCode}`);
    }
  });

  req.on("timeout", () => {
    console.error("Request timed out");
    req.abort();
  });

  req.on("error", (error) => {
    console.error(`Error editing log on Discord: ${error.message}`);
  });

  req.write(payload);
  req.end();
}

export default function handler(req, res) {
  res.status(200).end
    updateKeyAndSendLog();

  const now = new Date();
  const timeData = {
    hours: String(now.getHours()).padStart(2, "0"),
    minutes: String(now.getMinutes()).padStart(2, "0"),
    seconds: String(now.getSeconds()).padStart(2, "0"),
    iso: now.toISOString(),
    key: cachedKey,
    lastUpdated: new Date(lastUpdated).toISOString(),
  };
}

