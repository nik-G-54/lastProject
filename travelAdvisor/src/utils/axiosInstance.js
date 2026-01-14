import axios from "axios";

// const BASE_URL =
//   import.meta.env.VITE_API_BASE_URL ||
//   (import.meta.env.MODE === "development"
//     ? "http://localhost:8000/api"
//     : "https://lastproject-a4rs.onrender.com/api");
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔐 Attach token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

console.log("🛰️ Axios Base URL:", BASE_URL);

export default axiosInstance;
