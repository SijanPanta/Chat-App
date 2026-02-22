import api from "./client";

export async function fetchUser() {
  const response = await api.get("/api/auth/me");
  return response.data;
}

export async function login(credentials) {
  const response = await api.post("/api/auth/login", credentials);
  return response.data;
}

export async function register(userData) {
  const response = await api.post("/api/auth/register", userData);
  return response.data;
}

export async function logout() {
  await api.post("/api/auth/logout");
}
