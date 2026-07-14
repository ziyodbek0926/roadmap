import axios from 'axios';
import { toast } from 'sonner';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: BASE_URL,
});

// --- Request interceptor: attach the JWT from localStorage on every call ---
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- Response interceptor: centralize error handling with toast pop-ups ---
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const detail = error.response?.data?.detail;

    if (status === 401) {
      // Token expired / invalid — clean up and bounce to login.
      localStorage.removeItem('access_token');
      toast.error(detail || "Sessiya muddati tugadi. Qaytadan tizimga kiring.");
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    } else if (status === 403) {
      // Left for callers to handle contextually (e.g. "no roadmap yet"),
      // but we still surface it if the caller doesn't opt out.
      if (!error.config?.silent403) {
        toast.error(detail || 'Bu amal uchun ruxsatingiz yetarli emas.');
      }
    } else if (status === 404) {
      toast.error(detail || 'So\'ralgan ma\'lumot topilmadi.');
    } else if (status >= 500) {
      toast.error('Serverda xatolik yuz berdi. Birozdan so\'ng qayta urinib ko\'ring.');
    } else if (!error.response) {
      toast.error('Serverga ulanib bo\'lmadi. Internet aloqasini tekshiring.');
    } else if (detail) {
      toast.error(detail);
    }

    return Promise.reject(error);
  }
);

export default api;
