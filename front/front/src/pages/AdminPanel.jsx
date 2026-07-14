import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import api from '../lib/api';
import useAuthStore from '../store/useAuthStore';
import LoadingScreen from '../components/LoadingScreen';

const statCards = [
  { key: 'platformadagi_odamlar_soni', label: "O'quvchilar soni", icon: '👥', color: 'from-primary-400 to-primary-500' },
  { key: 'o_qilgan_darslar_soni', label: 'Tugatilgan darslar', icon: '✅', color: 'from-mint-400 to-mint-500' },
  { key: 'bazadagi_kurslar_soni', label: 'Kurslar soni', icon: '📚', color: 'from-sun-400 to-sun-300' },
];

export default function AdminPanel() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, usersRes] = await Promise.all([
          api.get('/admin/dashboard-stats'),
          api.get('/admin/users'),
        ]);
        setStats(statsRes.data.statistika);
        setUsers(usersRes.data.ro_yxat);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredUsers = useMemo(() => {
    if (!search.trim()) return users;
    const q = search.toLowerCase();
    return users.filter(
      (u) =>
        u.ism.toLowerCase().includes(q) ||
        u.login.toLowerCase().includes(q) ||
        u.telefon.includes(q)
    );
  }, [users, search]);

  const chartData = stats
    ? statCards.map((c) => ({ name: c.label, qiymat: stats[c.key] }))
    : [];

  if (loading) return <LoadingScreen label="Admin panel yuklanmoqda..." />;

  return (
    <div className="min-h-screen bg-bg-app py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between flex-wrap gap-3"
        >
          <div>
            <h1 className="text-3xl font-bold text-ink-900">🛠️ Admin Panel</h1>
            <p className="text-ink-700/80">Xush kelibsiz, {user?.ism}</p>
          </div>
        </motion.div>

        {/* Stat cards */}
        <div className="grid sm:grid-cols-3 gap-5">
          {statCards.map((c, i) => (
            <motion.div
              key={c.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              whileHover={{ y: -4 }}
              className={`rounded-3xl p-6 text-white shadow-pop bg-gradient-to-br ${c.color}`}
            >
              <div className="text-3xl mb-3">{c.icon}</div>
              <div className="text-4xl font-black mb-1">{stats?.[c.key] ?? 0}</div>
              <div className="text-sm font-medium opacity-90">{c.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-soft p-6"
        >
          <h2 className="text-lg font-bold mb-4">Umumiy statistika</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ede9fe" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6b7280' }} />
              <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} allowDecimals={false} />
              <Tooltip
                contentStyle={{ borderRadius: 16, border: 'none', boxShadow: '0 10px 30px rgba(124,58,237,0.18)' }}
              />
              <Bar dataKey="qiymat" fill="#a78bfa" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Users table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28 }}
          className="card-soft p-6"
        >
          <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
            <h2 className="text-lg font-bold">Barcha o'quvchilar ({filteredUsers.length})</h2>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Ism, login yoki telefon bo'yicha qidirish..."
              className="px-4 py-2 rounded-xl border-2 border-primary-100 focus:outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-100 text-sm w-full sm:w-72"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-ink-400 border-b-2 border-primary-50">
                  <th className="py-3 pr-4 font-semibold">ID</th>
                  <th className="py-3 pr-4 font-semibold">Ism</th>
                  <th className="py-3 pr-4 font-semibold">Login</th>
                  <th className="py-3 pr-4 font-semibold">Telefon</th>
                  <th className="py-3 pr-4 font-semibold">Rol</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="border-b border-primary-50 hover:bg-primary-50/60 transition-colors">
                    <td className="py-3 pr-4 text-ink-400">#{u.id}</td>
                    <td className="py-3 pr-4 font-semibold text-ink-900">{u.ism}</td>
                    <td className="py-3 pr-4">{u.login}</td>
                    <td className="py-3 pr-4">{u.telefon}</td>
                    <td className="py-3 pr-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          u.rol === 'admin'
                            ? 'bg-ink-900 text-white'
                            : 'bg-mint-100 text-mint-500'
                        }`}
                      >
                        {u.rol}
                      </span>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-ink-400">
                      Hech narsa topilmadi.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
