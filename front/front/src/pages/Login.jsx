import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import api from '../lib/api';
import useAuthStore from '../store/useAuthStore';
import AuroraBackground from '../components/AuroraBackground';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { setToken, fetchProfile } = useAuthStore();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const body = new URLSearchParams();
      body.append('username', form.username);
      body.append('password', form.password);

      const res = await api.post('/auth/login', body);
      setToken(res.data.access_token);
      await fetchProfile();

      toast.success("Xush kelibsiz! 🎉");
      navigate('/dashboard');
    } catch {
      // api.js interceptor already toasts the server's error message
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
      <AuroraBackground />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 glass w-full max-w-md rounded-4xl shadow-pop p-8 md:p-10"
      >
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🎓</div>
          <h1 className="text-3xl font-bold text-ink-900 mb-2">EduTech Platform</h1>
          <p className="text-ink-700/80">Davom etish uchun tizimga kiring</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-ink-700 mb-1.5">Login</label>
            <input
              type="text"
              name="username"
              required
              autoFocus
              className="w-full px-4 py-3 rounded-2xl border-2 border-white/70 bg-white/70 focus:outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-200 transition-all placeholder:text-ink-400"
              placeholder="Loginingizni kiriting"
              value={form.username}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-ink-700 mb-1.5">Parol</label>
            <input
              type="password"
              name="password"
              required
              className="w-full px-4 py-3 rounded-2xl border-2 border-white/70 bg-white/70 focus:outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-200 transition-all placeholder:text-ink-400"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 bg-primary-500 hover:bg-primary-600 disabled:opacity-60 text-white font-bold rounded-2xl transition-colors shadow-pop"
          >
            {submitting ? 'Tekshirilmoqda...' : 'Tizimga kirish'}
          </motion.button>
        </form>

        <div className="mt-6 text-center text-sm text-ink-700/80">
          Hisobingiz yo'qmi?{' '}
          <Link to="/register" className="text-primary-600 hover:underline font-bold">
            Ro'yxatdan o'tish
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
