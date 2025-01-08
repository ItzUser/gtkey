// api/time.js

// Variabel untuk menyimpan key dan waktu pembaruan
let cachedKey = null;
let lastUpdated = null;

// Fungsi untuk menghasilkan key acak dengan angka dan huruf
function generateRandomKey() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let key = '';
    for (let i = 0; i < 10; i++) {
        key += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return key;
}

// Fungsi untuk memperbarui key setiap 5 menit
function getUpdatedKey() {
    const now = Date.now();
    if (!cachedKey || !lastUpdated || now - lastUpdated > 5 * 60 * 1000) { // 5 menit dalam milidetik
        cachedKey = generateRandomKey();
        lastUpdated = now;
    }
    return cachedKey;
}

module.exports = (req, res) => {
    const now = new Date();
    const timeData = {
        hours: String(now.getHours()).padStart(2, '0'),
        minutes: String(now.getMinutes()).padStart(2, '0'),
        seconds: String(now.getSeconds()).padStart(2, '0'),
        iso: now.toISOString(),
        key: getUpdatedKey(),
        lastUpdated: new Date(lastUpdated).toISOString() // Waktu terakhir key diperbarui
    };
    res.status(200).json(timeData);
};
