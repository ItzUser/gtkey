// api/time.js

const express = require('express');
const app = express();

// Rute untuk mendapatkan waktu
app.get('/', (req, res) => {  // Mengakses root (/) di dalam api
    const now = new Date();
    const timeData = {
        hours: String(now.getHours()).padStart(2, '0'),
        minutes: String(now.getMinutes()).padStart(2, '0'),
        seconds: String(now.getSeconds()).padStart(2, '0'),
        iso: now.toISOString()
    };
    res.json(timeData);
});

// Menjalankan aplikasi Express di dalam serverless function
module.exports = (req, res) => {
    app(req, res);  // Menjalankan aplikasi Express
};
