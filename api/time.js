const https = require('https');

// Variabel untuk menyimpan key dan waktu pembaruan
let cachedKey = null;
let lastUpdated = null;

// Discord Webhook URL (ganti dengan webhook Anda sendiri)
const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1326510907844722730/W4tKUX1HJdxHrkGnEN8sqtqmBPxbQHc7WoaY9BdyTYt_SHQaOy4DWoVfb3j3UhUToI4P";

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
        if (res.statusCode === 204) {
            console.log("Log sent successfully to Discord");
        } else {
            console.error(`Failed to send log to Discord: ${res.statusCode}`);
        }
    });

    req.on('error', (error) => {
        console.error(`Error sending log to Discord: ${error.message}`);
    });

    req.write(payload);
    req.end();
}

// Fungsi untuk memperbarui key dan mengirim log ke Discord
function updateKeyAndSendLog() {
    const now = Date.now();
    cachedKey = generateRandomKey();
    lastUpdated = now;

    const timestamp = new Date(lastUpdated).toLocaleString();
    sendLogToDiscord(cachedKey, timestamp); // Kirim log ke Discord setelah key diperbarui

    console.log(`Key updated: ${cachedKey} at ${timestamp}`);
}

// Fungsi utama untuk API
module.exports = async (req, res) => {
    const now = Date.now();
    if (!cachedKey || !lastUpdated || (now - lastUpdated > 60 * 1000)) {
        // Update key jika sudah lebih dari 1 menit
        updateKeyAndSendLog();
    }

    const timestamp = new Date(lastUpdated).toLocaleString();
    const timeData = {
        hours: String(new Date().getHours()).padStart(2, '0'),
        minutes: String(new Date().getMinutes()).padStart(2, '0'),
        seconds: String(new Date().getSeconds()).padStart(2, '0'),
        iso: new Date().toISOString(),
        key: cachedKey,
        lastUpdated: timestamp,
    };

    return res.status(200).json(timeData);
};

// Jalankan pembaruan key secara otomatis setiap 1 menit
setInterval(updateKeyAndSendLog, 60 * 1000);  // 1 menit dalam milidetik
updateKeyAndSendLog(); // Jalankan sekali saat server dimulai
