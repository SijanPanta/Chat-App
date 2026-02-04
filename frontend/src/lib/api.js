const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3030";

const handleResponse = async (response) => {
  if (!response.ok) {
    // Handle expired token
    if (response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    const error = await response.json();
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
};

export async function fetchUser() {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/api/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse(response);
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

  return handleResponse(response);
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

  return { success: true };
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
    console.log(error);
    throw new Error(error.error || "Invalid credentials");
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

  return handleResponse(response);
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

export async function changePassword(data) {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`${API_URL}/api/users/password/reset`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  } catch (error) {
    throw new Error(error.message || "Failed to change password");
  }
}
