import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3030",
});

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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const currentPath =
      typeof window !== "undefined" ? window.location.pathname : "";

    if (
      status === 401 &&
      currentPath !== "/login" &&
      currentPath !== "/register"
    ) {
      console.error("Unauthorized: Please log in again.");
      return Promise.reject(new Error("Unauthorized: Please log in again."));
    }

    if (status === 403) {
      console.warn("Access denied:", error.response.data.error);
    }

    const errorMessage =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      "An error occurred";
    return Promise.reject(new Error(errorMessage));
  },
);

export default api;
