import { useState, useEffect, useCallback } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  LayoutDashboard,
  Image,
  ShoppingBag,
  Folder,
  Package,
  MessageSquare,
  Store,
  LogOut,
  Menu,
  X,
  Loader2,
} from 'lucide-react';

import { logout } from '../store/slices/authSlice';
import CustomCursor from '../components/common/CustomCursor';

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

const NAV = [
  { to: '/',                    label: 'User View',   icon: Store,          end: true },
  { to: '/admin',               label: 'Dashboard',   icon: LayoutDashboard, end: true },
  { to: '/admin/hero-banner',   label: 'Hero Banner', icon: Image },
  { to: '/admin/products',      label: 'Products',    icon: ShoppingBag },
  { to: '/admin/categories',    label: 'Categories',  icon: Folder },
  { to: '/admin/orders',        label: 'Orders',      icon: Package },
  { to: '/admin/support',       label: 'Support',     icon: MessageSquare },
];

export default function AdminLayout() {
  const dispatch    = useDispatch();
  const navigate    = useNavigate();
  const location    = useLocation();

  const [sidebarOpen,   setSidebarOpen]   = useState(false);
  const [loggingOut,    setLoggingOut]    = useState(false);

  // Close sidebar on route change (mobile nav tap)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

  // FIX: call server /auth/logout FIRST so the httpOnly cookie is cleared
  // on the server side. Only then clear Redux state and redirect.
  //
  // The original code only dispatched the Redux logout action, which clears
  // client state but leaves the httpOnly cookie alive in the browser.
  // Any subsequent request with that cookie would still pass server auth
  // for the remaining 7-day JWT lifetime.
  const handleLogout = useCallback(async () => {
    if (loggingOut) return; // prevent double-click
    setLoggingOut(true);

    try {
      await fetch(`${BASE_URL}/auth/logout`, {
        method:      'POST',
        credentials: 'include', // sends the httpOnly cookie so server can clear it
      });
    } catch {
      // Network error — proceed with client-side logout anyway.
      // The cookie will expire naturally; this is an acceptable fallback.
      console.warn('Logout request failed — clearing client state anyway.');
    } finally {
      dispatch(logout());  // clear Redux auth state + persisted storage
      navigate('/admin/login', { replace: true });
    }
  }, [dispatch, navigate, loggingOut]);

  return (
    <div className="min-h-screen bg-bg flex">
      <CustomCursor />

      {/* ── Mobile top bar ─────────────────────────────────────────────── */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-surface border-b border-border flex items-center justify-between px-4">
        <div>
          <h1 className="font-display text-xl tracking-widest text-white leading-none">
            CAPZYY
          </h1>
          <p className="text-textMuted text-[10px]">Admin Panel</p>
        </div>
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 text-textSecondary hover:text-white transition-colors"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
      </header>

      {/* ── Overlay (mobile) ───────────────────────────────────────────── */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ────────────────────────────────────────────────────── */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-50
          w-56 bg-surface border-r border-border
          flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}
      >
        {/* Sidebar header */}
        <div className="p-6 border-b border-border flex items-start justify-between">
          <div>
            <h1 className="font-display text-2xl tracking-widest text-white">
              CAPZYY
            </h1>
            <p className="text-textMuted text-xs mt-1">Admin Panel</p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-1 text-textMuted hover:text-white transition-colors mt-1"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded transition-colors ${
                  isActive
                    ? 'bg-white text-black'
                    : 'text-textSecondary hover:text-white hover:bg-surfaceHover'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-border">
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full text-left flex items-center gap-3 px-3 py-2.5 text-sm text-textSecondary hover:text-sale transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loggingOut
              ? <Loader2 size={18} className="animate-spin" />
              : <LogOut size={18} />
            }
            {loggingOut ? 'Logging out…' : 'Logout'}
          </button>
        </div>
      </aside>

      {/* ── Main content ───────────────────────────────────────────────── */}
      <main className="flex-1 overflow-auto md:mt-0 mt-14">
        <Outlet />
      </main>
    </div>
  );
}