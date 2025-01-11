document.getElementById("loginForm").onsubmit = async function(event) {
    event.preventDefault();

    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    // Kirim request POST ke API login
    const response = await fetch("/api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
        // Jika login berhasil
        alert(data.message); // Login berhasil
        // Anda bisa mengarahkan pengguna ke halaman lain atau melakukan tindakan lain di sini
    } else {
        // Tampilkan pesan error jika login gagal
        document.getElementById("error-message").style.display = "block";
    }
};
