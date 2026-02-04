import axios from "axios";

const api = axios.create({
  // Gunakan domain publik yang sudah Anda tunnel lewat Cloudflare
  baseURL: "https://api.herama.my.id/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
