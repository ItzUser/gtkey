// api/time.js

module.exports = (req, res) => {
    const now = new Date();
    const timeData = {
        hours: String(now.getHours()).padStart(2, '0'),
        minutes: String(now.getMinutes()).padStart(2, '0'),
        seconds: String(now.getSeconds()).padStart(2, '0'),
        iso: now.toISOString()
    };
    res.status(200).json(timeData);
};
