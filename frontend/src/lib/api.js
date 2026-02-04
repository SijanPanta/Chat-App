const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3030";

export async function fetchUser() {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/api/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }

  return response.json();
}

export async function uploadProfilePicture(userId, formData) {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/api/users/${userId}/profile-picture`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    },
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Upload failed");
  }

  return response.json();
}

export async function deleteProfile(userId) {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/api/users/${userId}/profile-picture`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Deletion failed");
  }

  return {success:true};
}

export async function login(credentials) {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Login failed");
  }

  return response.json();
}

export async function register(userData) {
  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Registration failed");
  }

  return response.json();
}

export async function logout() {
  const token = localStorage.getItem("token");

  await fetch(`${API_URL}/api/auth/logout`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
