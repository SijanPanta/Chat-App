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
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }
      window.location.href = "/dashboard.html";
    } else {
      if (data.details) {
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
