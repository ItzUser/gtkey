const express = require('express');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

let cachedKey = null;
let lastUpdated = null;

// Fungsi untuk menghasilkan kunci acak
function generateRandomKey() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let key = '';
    for (let i = 0; i < 10; i++) {
        key += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return key;
}

// Fungsi untuk memperbarui kunci
function updateKey() {
    const now = Date.now();
    cachedKey = generateRandomKey();
    lastUpdated = now;
}

// Endpoint: `/api/time`
app.get('/api/time', (req, res) => {
    const now = Date.now();
    if (!cachedKey || !lastUpdated || (now - lastUpdated > 60 * 60 * 1000)) {
        updateKey(); // Perbarui kunci jika sudah lebih dari 1 jam
    }

    const timeData = {
        hours: String(new Date().getHours()).padStart(2, '0'),
        minutes: String(new Date().getMinutes()).padStart(2, '0'),
        seconds: String(new Date().getSeconds()).padStart(2, '0'),
        iso: new Date().toISOString(),
        key: cachedKey,
        lastUpdated: new Date(lastUpdated).toLocaleString(),
    };

    res.json(timeData);
});

// Endpoint: `/api/generate-link`
app.get('/api/generate-link', (req, res) => {
    const uniqueId = uuidv4();
    const link = `/user/${uniqueId}`;
    res.json({ link });
});

// Serve static files from the `/public` folder
app.use(express.static(path.join(__dirname, 'public')));

// Jalankan server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    updateKey(); // Perbarui kunci saat server dimulai
    setInterval(updateKey, 60 * 60 * 1000); // Perbarui kunci setiap 1 jam
});
