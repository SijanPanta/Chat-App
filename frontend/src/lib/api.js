import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3030",
});

// Add a request interceptor to attach the token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle 401 errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Fetch user data
export async function fetchUser() {
  const response = await api.get("/api/auth/me");
  return response.data;
}

// Upload profile picture
export async function uploadProfilePicture(userId, formData) {
  const response = await api.post(`/api/users/${userId}/profile-picture`, formData);
  return response.data;
}

// Delete profile picture
export async function deleteProfile(userId) {
  const response = await api.delete(`/api/users/${userId}/profile-picture`);
  return { success: true };
}

// Login
export async function login(credentials) {
  const response = await api.post("/api/auth/login", credentials);
  return response.data;
}

// Register
export async function register(userData) {

  const response = await api.post("/api/auth/register", userData);
  return response.data;
}

// Logout
export async function logout() {
  await api.post("/api/auth/logout");
}

// Change password
export async function changePassword(data) {
  const response = await api.put("/api/users/password/reset", data);
  return response.data;
}