import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import LoadingScreen from './LoadingScreen';

export default function AdminRoute({ children }) {
  const { status, user, isAdmin } = useAuthStore();

  if (status === 'idle' || status === 'loading') {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
