import { motion } from 'framer-motion';

export default function LoadingScreen({ label = 'Yuklanmoqda...' }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-primary-50">
      <motion.div
        className="w-14 h-14 rounded-2xl bg-primary-400"
        animate={{ rotate: [0, 90, 180, 270, 360], borderRadius: ['30%', '50%', '30%'] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <p className="text-primary-600 font-heading font-semibold">{label}</p>
    </div>
  );
}
