import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export default function ProtectedAdminRoute({ children }) {
  const { user, isAuthenticated } = useSelector(s => s.auth);
  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}
