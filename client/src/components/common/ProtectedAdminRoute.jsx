import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { rehydrateAuth } from '../../store/slices/authSlice';

export default function ProtectedAdminRoute({ children }) {
  const { user, isAuthenticated } = useSelector(s => s.auth);
  const dispatch = useDispatch();
  const [checking, setChecking] = useState(!isAuthenticated);
  const checkedRef = useRef(false);

  useEffect(() => {
    // Only verify cookie if Redux says NOT authenticated
    // (i.e. fresh page load / reload — not right after login)
    // If isAuthenticated is already true, we just logged in — trust it
    if (checkedRef.current) return;
    checkedRef.current = true;

    if (!isAuthenticated) {
      dispatch(rehydrateAuth()).finally(() => setChecking(false));
    } else {
      setChecking(false);
    }
  }, [dispatch, isAuthenticated]);

  if (checking) {
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