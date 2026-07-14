import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import LoadingScreen from './LoadingScreen';

export default function ProtectedRoute({ children }) {
  const { status, user } = useAuthStore();

  if (status === 'idle' || status === 'loading') {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
