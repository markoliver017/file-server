document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const errorMessage = document.getElementById("errorMessage");

    try {
        const response = await fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (response.ok && !data.error) {
            window.location.href = "/dashboard.html"; // Redirect to dashboard
        } else {
            errorMessage.textContent = data.message || "Login failed";
            errorMessage.style.display = "block";
        }
    } catch (error) {
        console.error(error);
        errorMessage.textContent = "An error occurred. Please try again.";
        errorMessage.style.display = "block";
    }
});
