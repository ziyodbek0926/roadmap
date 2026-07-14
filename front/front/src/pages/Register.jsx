import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import api from '../lib/api';
import AuroraBackground from '../components/AuroraBackground';

const initialForm = {
  ism_sharif: '',
  telefon: '',
  hudud: '',
  maktab: '',
  yosh: '',
  login: '',
  parol: '',
};

export default function Register() {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/auth/register', {
        ...form,
        yosh: form.yosh ? Number(form.yosh) : null,
      });
      toast.success("Ro'yxatdan muvaffaqiyatli o'tdingiz! Endi tizimga kiring. 🎉");
      navigate('/login');
    } catch {
      // handled by interceptor
    } finally {
      setSubmitting(false);
    }
  };

  const field = (name, label, opts = {}) => (
    <div>
      <label className="block text-sm font-semibold text-ink-700 mb-1.5">{label}</label>
      <input
        name={name}
        value={form[name]}
        onChange={handleChange}
        className="w-full px-4 py-3 rounded-2xl border-2 border-white/70 bg-white/70 focus:outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-200 transition-all placeholder:text-ink-400"
        {...opts}
      />
    </div>
  );

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 py-10 overflow-hidden">
      <AuroraBackground />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 glass w-full max-w-lg rounded-4xl shadow-pop p-8 md:p-10"
      >
        <div className="text-center mb-7">
          <div className="text-5xl mb-3">✨</div>
          <h1 className="text-3xl font-bold text-ink-900 mb-2">Ro'yxatdan o'tish</h1>
          <p className="text-ink-700/80">O'quv sayohatingizni boshlang</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {field('ism_sharif', "To'liq ism", { required: true, placeholder: 'Ism Familiya' })}

          <div className="grid grid-cols-2 gap-4">
            {field('telefon', 'Telefon', { required: true, placeholder: '+998901234567' })}
            {field('yosh', 'Yosh', { type: 'number', placeholder: '16' })}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {field('hudud', 'Hudud', { placeholder: 'Toshkent' })}
            {field('maktab', 'Maktab', { placeholder: '12-maktab' })}
          </div>

          {field('login', 'Login', { required: true, placeholder: 'Login tanlang' })}
          {field('parol', 'Parol', { required: true, type: 'password', placeholder: '••••••••' })}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 bg-mint-400 hover:bg-mint-500 disabled:opacity-60 text-white font-bold rounded-2xl transition-colors shadow-pop"
          >
            {submitting ? 'Yuborilmoqda...' : "Ro'yxatdan o'tish"}
          </motion.button>
        </form>

        <div className="mt-6 text-center text-sm text-ink-700/80">
          Hisobingiz bormi?{' '}
          <Link to="/login" className="text-primary-600 hover:underline font-bold">
            Tizimga kirish
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
