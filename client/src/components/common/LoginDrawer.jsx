import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setCredentials } from '../../store/slices/authSlice';
import { closeLogin } from '../../store/slices/uiSlice';
import toast from 'react-hot-toast';

const BASE = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export default function LoginDrawer() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { isLoginOpen, loginRedirect } = useSelector(s => s.ui);
  const { isAuthenticated }            = useSelector(s => s.auth);

  const [form, setForm]             = useState({ email: '', password: '' });
  const [showPassword, setShowPass] = useState(false);
  const [loading, setLoading]       = useState(false);
  const [navOffset, setNavOffset]   = useState(0);

  // Measure the sticky nav bar height so the drawer sits below it on desktop
  useEffect(() => {
    const measure = () => {
      const sticky = document.querySelector('.sticky.top-0');
      setNavOffset(sticky ? sticky.offsetHeight : 0);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // Close drawer when user logs in
  useEffect(() => {
    if (isAuthenticated && isLoginOpen) dispatch(closeLogin());
  }, [isAuthenticated]);

  // Reset form on close
  useEffect(() => {
    if (!isLoginOpen) {
      setForm({ email: '', password: '' });
      setShowPass(false);
    }
  }, [isLoginOpen]);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = isLoginOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isLoginOpen]);

  const handleClose = () => dispatch(closeLogin());

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(`${BASE}/auth/login`, form, { withCredentials: true });
      dispatch(setCredentials(data));
      dispatch(closeLogin());
      toast.success('Welcome back!');
      if (data.user?.role === 'admin') {
        navigate('/admin');
      } else if (loginRedirect && loginRedirect !== '/') {
        navigate(loginRedirect);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Backdrop — above navbar (z-[69]), covers whole screen */}
      <div
        onClick={handleClose}
        className={`fixed inset-0 bg-black/60 transition-opacity duration-300 z-[69] ${
          isLoginOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Drawer panel — z-[70] so it's above navbar and backdrop */}
      <div
        className={`fixed right-0 bg-[#141414] z-[70] flex flex-col
          transition-transform duration-300 ease-in-out
          ${isLoginOpen ? 'translate-x-0' : 'translate-x-full'}
          w-full sm:w-[400px]`}
        style={{
          // Mobile: full screen from very top
          // Desktop (sm+): start below the sticky nav bar
          top:    navOffset > 0 ? `${navOffset}px` : 0,
          height: navOffset > 0 ? `calc(100vh - ${navOffset}px)` : '100vh',
          boxShadow: '-8px 0 40px rgba(0,0,0,0.6)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#2A2A2A] flex-shrink-0">
          <div>
            <h2 className="font-display text-xl tracking-widest text-white">SIGN IN</h2>
            {loginRedirect === '/checkout' && (
              <p className="text-textSecondary text-xs tracking-widest mt-0.5 uppercase">
                Sign in to complete your order
              </p>
            )}
          </div>
          <button
            onClick={handleClose}
            className="text-textSecondary hover:text-white transition-colors p-2 -mr-1"
            aria-label="Close login"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable form area */}
        <div className="flex-1 overflow-y-auto px-5 py-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="text-xs tracking-widest uppercase text-textSecondary block mb-2">
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="input-field w-full"
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-xs tracking-widest uppercase text-textSecondary block mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  className="input-field w-full pr-12"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(p => !p)}
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-textSecondary hover:text-white transition-colors p-1"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && (
                <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              )}
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-textSecondary text-sm mt-6 text-center">
            Don't have an account?{' '}
            <Link to="/register" onClick={handleClose} className="text-white hover:underline font-medium">
              Register
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}