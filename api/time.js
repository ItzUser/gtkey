// api/time.js

const https = require('https');

// Variabel untuk menyimpan key dan waktu pembaruan
let cachedKey = null;
let lastUpdated = null;

// Discord Webhook URL (ganti dengan webhook Anda sendiri)
const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/WEBHOOK_ID/WEBHOOK_TOKEN";

// Fungsi untuk menghasilkan key acak dengan angka dan huruf
function generateRandomKey() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let key = '';
    for (let i = 0; i < 10; i++) {
        key += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return key;
}

// Fungsi untuk mengirim log ke Discord
function sendLogToDiscord(key, timestamp) {
    const payload = JSON.stringify({
        content: `New Key Generated: **${key}**\nTimestamp: **${timestamp}**`,
    });

    const url = new URL(DISCORD_WEBHOOK_URL);
    const options = {
        hostname: url.hostname,
        path: url.pathname + url.search,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(payload),
        },
    };

    const req = https.request(options, (res) => {
        if (res.statusCode !== 204) {
            console.error(`Failed to send log to Discord: ${res.statusCode}`);
        }
    });

    req.on('error', (error) => {
        console.error(`Error sending log to Discord: ${error.message}`);
    });

    req.write(payload);
    req.end();
}

// Fungsi untuk memperbarui key setiap 5 menit
function updateKeyAndSendLog() {
    const now = Date.now();
    cachedKey = generateRandomKey();
    lastUpdated = now;

    const timestamp = new Date(lastUpdated).toLocaleString();
    sendLogToDiscord(cachedKey, timestamp);

    console.log(`Key updated: ${cachedKey} at ${timestamp}`);
}

// Jalankan pembaruan key secara otomatis setiap 5 menit
setInterval(updateKeyAndSendLog, 5 * 60 * 1000); // 5 menit dalam milidetik
updateKeyAndSendLog(); // Jalankan sekali saat server dimulai

// Endpoint handler untuk API (opsional jika tetap ingin endpoint tersedia)
module.exports = (req, res) => {
    const now = new Date();
    const timeData = {
        hours: String(now.getHours()).padStart(2, '0'),
        minutes: String(now.getMinutes()).padStart(2, '0'),
        seconds: String(now.getSeconds()).padStart(2, '0'),
        iso: now.toISOString(),
        key: cachedKey,
        lastUpdated: new Date(lastUpdated).toISOString(),
    };

    res.status(200).json(timeData);
};
