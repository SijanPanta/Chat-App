// Check if user is logged in
const token = localStorage.getItem("token");
if (!token) {
  window.location.href = "/login.html";
}

// Get user data from localStorage
const userData = JSON.parse(localStorage.getItem("user") || "{}");

// Display user information
document.getElementById("username").textContent = userData.username || "N/A";
document.getElementById("email").textContent = userData.email || "N/A";
document.getElementById("userId").textContent = userData.id || "N/A";

// Logout functionality
document.getElementById("logoutBtn").addEventListener("click", async () => {
  try {
    await fetch("/api/auth/logout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    // Clear local storage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // Redirect to login
    window.location.href = "/login.html";
  }
});
