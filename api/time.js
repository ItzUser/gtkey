// api/time.js

// Fungsi untuk menghasilkan key acak dengan 10 angka
function generateRandomKey() {
    let key = '';
    for (let i = 0; i < 10; i++) {
        key += Math.floor(Math.random() * 10); // Angka 0-9
    }
    return key;
}

module.exports = (req, res) => {
    const now = new Date();
    const timeData = {
        hours: String(now.getHours()).padStart(2, '0'),
        minutes: String(now.getMinutes()).padStart(2, '0'),
        seconds: String(now.getSeconds()).padStart(2, '0'),
        iso: now.toISOString(),
        key: generateRandomKey() // Menambahkan key ke dalam respons
    };
    res.status(200).json(timeData);
};
