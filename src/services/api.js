import axios from "axios";

const api = axios.create({
  // Gunakan domain publik yang sudah Anda tunnel lewat Cloudflare
  baseURL: "http://localhost:3000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
