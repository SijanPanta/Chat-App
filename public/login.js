const form = document.querySelector(".login-form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Login successful!");
      // Store token if returned
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      // Redirect to home or dashboard
      // window.location.href = '/dashboard.html';
    } else {
      alert(data.error || "Login failed");
    }
  } catch (error) {
    alert("An error occurred. Please try again.");
    console.error("Error:", error);
  }
});
