document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const errorMessage = document.getElementById("errorMessage");

    try {
        const response = await fetch("/file-server/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (data.error) {
            errorMessage.style.display = "block";
            errorMessage.textContent = data.message;
        } else {
            errorMessage.style.display = "none";
            alert("Login successfully!");
            // Redirect or handle successful login
            window.location.href = "/file-server/api/dashboard";
        }
    } catch (error) {
        errorMessage.style.display = "block";
        errorMessage.textContent = "An error occurred. Please try again.";
    }
});
