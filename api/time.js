// api/time.js

const express = require('express');
const app = express();

// Route untuk mendapatkan waktu
app.get('/time', (req, res) => {
    const now = new Date();
    const timeData = {
        hours: String(now.getHours()).padStart(2, '0'),
        minutes: String(now.getMinutes()).padStart(2, '0'),
        seconds: String(now.getSeconds()).padStart(2, '0'),
        iso: now.toISOString()
    };
    res.json(timeData);
});

// Export function sebagai handler serverless
module.exports = (req, res) => {
    app(req, res);  // Menjalankan aplikasi Express di serverless function
};
