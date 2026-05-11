import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';

export function useAuth() {
  const { user, token, isAuthenticated } = useSelector(s => s.auth);
  const dispatch = useDispatch();
  const signOut = () => dispatch(logout());
  const isAdmin = user?.role === 'admin';
  return { user, token, isAuthenticated, isAdmin, signOut };
}
