import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Onboarding from './pages/Onboarding';
import AdminPanel from './pages/AdminPanel';
import NotFound from './pages/NotFound';

import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import useAuthStore from './store/useAuthStore';

const pageTransition = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.25, ease: 'easeInOut' },
};

function Page({ children }) {
  return (
    <motion.div {...pageTransition}>
      {children}
    </motion.div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Page><Login /></Page>} />
        <Route path="/register" element={<Page><Register /></Page>} />

        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              <Page><Onboarding /></Page>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Page><Dashboard /></Page>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Page><AdminPanel /></Page>
            </AdminRoute>
          }
        />

        <Route path="*" element={<Page><NotFound /></Page>} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const fetchProfile = useAuthStore((s) => s.fetchProfile);

  // Hydrate the auth store once on boot so every protected route/page
  // can read `user` from the store instead of re-fetching the profile.
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

export default App;
