import { create } from 'zustand';
import api from '../lib/api';

const useAuthStore = create((set, get) => ({
  user: null, // { id, ism, telefon, rol }
  direction: null, // biriktirilgan_yonalish
  testResults: [],
  status: 'idle', // 'idle' | 'loading' | 'ready' | 'guest'

  isAdmin: () => get().user?.rol === 'admin',
  isAuthenticated: () => !!get().user,

  // Pulls the profile once (e.g. on app boot or after login) so every page
  // can read user info from the store instead of re-fetching it.
  fetchProfile: async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      set({ user: null, status: 'guest' });
      return null;
    }
    set({ status: 'loading' });
    try {
      const res = await api.get('/dashboard/profile');
      set({
        user: res.data.o_quvchi,
        direction: res.data.biriktirilgan_yonalish,
        testResults: res.data.test_natijalari || [],
        status: 'ready',
      });
      return res.data;
    } catch {
      set({ user: null, status: 'guest' });
      return null;
    }
  },

  logout: () => {
    localStorage.removeItem('access_token');
    set({ user: null, direction: null, testResults: [], status: 'guest' });
  },

  setToken: (token) => {
    localStorage.setItem('access_token', token);
  },
}));

export default useAuthStore;
