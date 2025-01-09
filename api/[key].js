module.exports = (req, res) => {
    const { key } = req.query; // Mengambil key dari URL

    // Validasi jika key tidak valid
    if (!key || key.length !== 10) {
        return res.status(400).json({ error: 'Invalid or missing key' });
    }

    // Data yang akan ditampilkan di response
    const responseData = {
        message: 'Successfully accessed dynamic route',
        key: key,
        timestamp: new Date().toISOString(),
    };

    // Kirim response JSON
    return res.status(200).json(responseData);
};
