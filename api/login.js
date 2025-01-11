

export default function handler(req, res) {
    if (req.method === "POST") {
        const { username, password } = req.body;

        // Username dan password yang valid
        const validUsername = "user";
        const validPassword = "user";

        // Cek validitas username dan password
        if (username === validUsername && password === validPassword) {
            return res.status(200).json({ message: "Login berhasil!" });
        } else {
            return res.status(400).json({ message: "Username atau password salah!" });
        }
    } else {
        // Jika bukan metode POST
        res.status(405).json({ message: "Method not allowed" });
    }
}
