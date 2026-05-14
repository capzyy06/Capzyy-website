import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { rehydrateAuth } from '../../store/slices/authSlice';

export default function ProtectedAdminRoute({ children }) {
  const { user, isAuthenticated } = useSelector(s => s.auth);
  const dispatch = useDispatch();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Always verify cookie is valid on mount
    // This catches the mobile case where Redux says authenticated
    // but the cookie was silently dropped by the browser
    dispatch(rehydrateAuth()).finally(() => setChecking(false));
  }, [dispatch]);

  if (checking) {
    // Show spinner while verifying cookie
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}