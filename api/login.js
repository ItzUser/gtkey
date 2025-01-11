// login.js

document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault(); // Mencegah form submit default

    // Ambil nilai dari input username dan password
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Lakukan validasi sederhana (bisa disesuaikan sesuai kebutuhan)
    if (username === "admin" && password === "password123") {
        // Login berhasil, arahkan ke halaman Show Data
        window.location.href = "/index.html"; // Sesuaikan nama halaman jika berbeda
    } else {
        // Tampilkan pesan error
        const errorMessage = document.getElementById("error-message");
        errorMessage.style.display = "block";
    }
});
