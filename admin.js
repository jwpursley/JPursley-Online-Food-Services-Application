document.getElementById("login-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
        
    if (email === "admin@email.com" && password === "admin123") {
        window.location.href = "index.html";
    } else {
        document.getElementById("error-message").classList.remove("hidden");
    }
});