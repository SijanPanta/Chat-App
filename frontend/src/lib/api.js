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
  (error) => Promise.reject(error),
);

// Add a response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
    
    // Handle authentication errors (401) - token invalid/expired
    if (status === 401 && currentPath !== '/login' && currentPath !== '/register') {
      console.error("Unauthorized: Please log in again.");
      return Promise.reject(new Error("Unauthorized: Please log in again."));
    }
    
    // Handle authorization errors (403) - insufficient permissions
    // Don't redirect, just pass the error through
    if (status === 403) {
      console.warn("Access denied:", error.response.data.error);
    }
    
    // Extract error message from response
    const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message || "An error occurred";
    return Promise.reject(new Error(errorMessage));
  },
);

// Fetch user data
export async function fetchUser() {
  const response = await api.get("/api/auth/me");
  return response.data;
}

// Upload profile picture
export async function uploadProfilePicture(userId, formData) {
  const response = await api.post(
    `/api/users/${userId}/profile-picture`,
    formData,
  );
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

export async function getUserPosts(userId) {
  const response = await api.get(`/api/posts/users/${userId}`);
  // console.log(response.data)
  return response.data;
}

export async function createPost(content) {
  const response = await api.post("/api/posts/", { content });
  return response.data;
}
export async function deletePost(postId) {
  const response = await api.delete(`/api/posts/${postId}`);
  return response.data;
}

export async function getAllPosts() {
  const response = await api.get(`/api/posts/`);
  return response.data;
}
