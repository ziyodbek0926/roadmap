import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import api from '../lib/api';
import useAuthStore from '../store/useAuthStore';
import LoadingScreen from '../components/LoadingScreen';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

export default function Dashboard() {
  const { user, direction, testResults, isAdmin } = useAuthStore();
  const [roadmap, setRoadmap] = useState([]);
  const [completedIds, setCompletedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [hasDirection, setHasDirection] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [roadmapRes, progressRes] = await Promise.all([
          api.get('/content/my-roadmap', { silent403: true }).catch((e) => {
            if (e.response?.status === 403) {
              setHasDirection(false);
              return { data: [] };
            }
            throw e;
          }),
          api.get('/content/my-progress'),
        ]);

        setRoadmap(roadmapRes.data);
        setCompletedIds(new Set(progressRes.data.ro_yxat.map((p) => p.lesson_id)));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const markAsDone = async (lessonId) => {
    try {
      await api.post(`/content/mark-done/${lessonId}`, {});
      setCompletedIds((prev) => new Set(prev).add(lessonId));
      toast.success('Dars muvaffaqiyatli tugatildi! ✅');
    } catch {
      // handled by interceptor
    }
  };

  if (loading) return <LoadingScreen label="Yo'l xaritangiz tayyorlanmoqda..." />;

  const latestScore =
    testResults.length > 0 ? `${testResults[testResults.length - 1].c_koeffitsienti}%` : '0%';

  return (
    <div className="min-h-screen bg-bg-app py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-soft p-6 flex flex-wrap items-center justify-between gap-4 border-t-8 border-primary-400"
        >
          <div>
            <h1 className="text-2xl font-bold mb-1">Salom, {user?.ism}! 👋</h1>
            <p className="text-ink-700/80 font-medium">
              Yo'nalish: <span className="text-primary-600 font-bold">{direction}</span>
            </p>
          </div>
          <div className="flex items-center gap-4">
            {isAdmin() && (
              <button
                onClick={() => navigate('/admin')}
                className="text-sm px-4 py-2 bg-ink-900 hover:bg-ink-700 text-white rounded-xl font-semibold transition-colors"
              >
                🛠️ Admin Panel
              </button>
            )}
            <div className="text-right">
              <div className="text-sm text-ink-400 mb-1">O'zlashtirish (C)</div>
              <div className="text-3xl font-black text-mint-500">{latestScore}</div>
            </div>
          </div>
        </motion.div>

        {/* Roadmap */}
        <div className="card-soft p-8">
          <h2 className="text-xl font-bold mb-8 text-center">
            Sizning O'quv Yo'l Xaritangiz 🚀
          </h2>

          {!hasDirection || roadmap.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12 border-4 border-dashed border-primary-300 rounded-3xl bg-primary-50"
            >
              <div className="text-4xl mb-4">🧭</div>
              <p className="mb-6 text-lg font-medium text-ink-700">
                Sizda hali yo'nalish yo'q. Qaysi kasb sizga mosligini aniqlaymizmi?
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/onboarding')}
                className="px-8 py-3 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-2xl shadow-pop transition-colors"
              >
                Onboarding testidan o'tish
              </motion.button>
            </motion.div>
          ) : (
            <motion.div variants={container} initial="hidden" animate="show" className="space-y-12">
              {roadmap.map((course) => (
                <div key={course.id}>
                  <h3 className="text-lg font-bold text-primary-600 mb-6 bg-primary-50 p-3 rounded-xl inline-block">
                    {course.nom} ({course.daraja})
                  </h3>

                  <div className="ml-4 md:ml-8 border-l-4 border-sun-400 space-y-6 relative">
                    {course.lessons.map((lesson, index) => {
                      const done = completedIds.has(lesson.id);
                      return (
                        <motion.div
                          key={lesson.id}
                          variants={item}
                          whileHover={{ scale: 1.01 }}
                          className="relative pl-8 md:pl-12 group"
                        >
                          <div
                            className={`absolute -left-[14px] top-1 w-6 h-6 border-4 rounded-full transition-transform duration-300 group-hover:scale-125 shadow-soft ${
                              done ? 'bg-mint-400 border-mint-400' : 'bg-white border-sun-400'
                            }`}
                          />

                          <div className="bg-bg-app p-5 rounded-2xl shadow-soft hover:shadow-pop transition-shadow">
                            <div className="flex items-center justify-between gap-3">
                              <h4 className="font-bold text-lg mb-2">
                                {index + 1}. {lesson.mavzu_nomi}
                              </h4>
                              <AnimatePresence>
                                {done && (
                                  <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                    className="text-xs font-bold px-2 py-1 rounded-full bg-mint-100 text-mint-500 whitespace-nowrap"
                                  >
                                    ✓ Tugatilgan
                                  </motion.span>
                                )}
                              </AnimatePresence>
                            </div>
                            <div className="flex flex-wrap gap-3 mt-4">
                              {lesson.video_url && (
                                <a
                                  href={lesson.video_url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-sm px-4 py-2 bg-white rounded-xl font-medium text-ink-700 hover:text-primary-600 shadow-soft transition-colors"
                                >
                                  🎬 Videoni ko'rish
                                </a>
                              )}
                              <button
                                onClick={() => markAsDone(lesson.id)}
                                disabled={done}
                                className="text-sm px-4 py-2 bg-mint-400 hover:bg-mint-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium shadow-soft transition-colors"
                              >
                                {done ? "✅ O'qib bo'ldingiz" : "✅ O'qib tugatdim"}
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
