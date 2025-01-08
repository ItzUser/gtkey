
let cachedKey = null;
let lastUpdated = null;

function generateRandomKey() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let key = '';
    for (let i = 0; i < 10; i++) {
        key += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return key;
}
function updateKey() {
    const now = Date.now();
    cachedKey = generateRandomKey();
    lastUpdated = now;

    const timestamp = new Date(lastUpdated).toLocaleString();

    console.log(`Key updated: ${cachedKey} at ${timestamp}`);
}

// Fungsi utama untuk API
module.exports = async (req, res) => {
    const now = Date.now();
    if (!cachedKey || !lastUpdated || (now - lastUpdated > 60 * 60 * 1000)) {
        // Update key jika sudah lebih dari 1 menit
        updateKey();
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

setInterval(updateKey, 60 * 60 * 1000);  // 1 menit dalam milidetik
updateKey()
