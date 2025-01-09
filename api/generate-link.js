const { v4: uuidv4 } = require('uuid'); // Pastikan Anda telah menginstal UUID: `npm install uuid`

module.exports = async (req, res) => {
    try {
        const uniqueId = uuidv4(); // Generate UUID unik
        const link = `/user/${uniqueId}`; // Buat link dengan UUID sebagai bagian dari URL

        res.status(200).json({ link }); // Kembalikan link ke client
    } catch (error) {
        console.error('Error generating link:', error);
        res.status(500).json({ error: 'Failed to generate link' });
    }
};
