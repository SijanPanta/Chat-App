const form = document.querySelector(".login-form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Registration successful! Please login.");
      window.location.href = "/login.html";
    } else {
      if (data.details) {
        // Show validation errors
        const errors = data.details.map((err) => err.message).join("\n");
        alert(errors);
      } else {
        alert(data.error || "Registration failed");
      }
    }
  } catch (error) {
    alert("An error occurred. Please try again.");
    console.error("Error:", error);
  }
});
