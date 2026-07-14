import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import api from '../lib/api';
import useAuthStore from '../store/useAuthStore';
import LoadingScreen from '../components/LoadingScreen';

export default function Onboarding() {
  const { user } = useAuthStore();
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  if (!user) return <LoadingScreen />;

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await api.post('/onboarding/submit', {
        user_id: user.id,
        test_type: 'aptitude',
        tanlangan_yonalish_id: 1,
        natija_bali: 85.0,
      });

      toast.success("Tabriklaymiz! Sizga yo'nalish biriktirildi. 🎉");
      navigate('/dashboard');
    } catch {
      // handled by interceptor
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sun-100 via-primary-50 to-mint-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card-soft max-w-lg w-full text-center p-10 border-t-8 border-sun-400"
      >
        <motion.div
          className="text-6xl mb-4"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          🎯
        </motion.div>
        <h1 className="text-2xl font-bold mb-4">Qobiliyatni Aniqlash Testi</h1>
        <p className="text-ink-700/80 mb-8 leading-relaxed">
          Sizga qaysi kasb (Dasturlash, Dizayn, SMM) ko'proq mos kelishini aniqlashimiz uchun,
          iltimos natijani tekshirish tugmasini bosing.
          <br />
          <br />
          <span className="text-xs text-ink-400">
            (Hozircha vizual test qismi qo'shilmagan, tugma avtomatik 85 ball bilan sizni
            "Dasturlash"ga o'tkazadi).
          </span>
        </p>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full py-4 bg-sun-400 hover:bg-sun-300 disabled:opacity-60 text-ink-900 font-bold rounded-2xl shadow-pop transition-colors"
        >
          {submitting ? 'Yuborilmoqda...' : "Testni yakunlash va Yo'nalish olish"}
        </motion.button>
      </motion.div>
    </div>
  );
}
