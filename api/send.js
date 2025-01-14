export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { key, timestamp } = req.body;

    if (!key || !timestamp) {
        return res.status(400).json({ error: 'Missing key or timestamp' });
    }

    // Fungsi untuk mengonversi ISO 8601 ke detik Unix
    const isoToEpoch = (isoTime) => {
        const date = new Date(isoTime);
        return Math.floor(date.getTime() / 1000); // Mengembalikan dalam detik
    };

    // Konversi timestamp ISO ke Unix epoch
    const epochTime = isoToEpoch(timestamp);

    // Format timestamp dalam format Discord <t:EPOCH:R>
    const formattedTime = `<t:${epochTime}:R>`;

    // Webhook URL Discord
    const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1326510907844722730/W4tKUX1HJdxHrkGnEN8sqtqmBPxbQHc7WoaY9BdyTYt_SHQaOy4DWoVfb3j3UhUToI4P/messages/1327622882129350743";

    const payload = {
        content: `**New Key Generated: **${key}**\nTimestamp: **${formattedTime}`,
    };

    try {
        const response = await fetch(DISCORD_WEBHOOK_URL, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            return res.status(200).json({ message: 'Message successfully edited on Discord!' });
        } else {
            return res.status(response.status).json({ error: `Failed to edit message on Discord: ${response.statusText}` });
        }
    } catch (error) {
        console.error('Error editing message on Discord:', error);
        return res.status(500).json({ error: 'An error occurred while editing the message on Discord.' });
    }
}
