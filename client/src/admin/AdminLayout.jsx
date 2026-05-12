import { useState, useEffect } from 'react';
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
} from 'lucide-react';

import { logout } from '../store/slices/authSlice';
import CustomCursor from '../components/common/CustomCursor';

const NAV = [
  { to: '/', label: 'User View', icon: Store },
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/hero-banner', label: 'Hero Banner', icon: Image },
  { to: '/admin/products', label: 'Products', icon: ShoppingBag },
  { to: '/admin/categories', label: 'Categories', icon: Folder },
  { to: '/admin/orders', label: 'Orders', icon: Package },
  { to: '/admin/support', label: 'Support', icon: MessageSquare },
];

export default function AdminLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar on route change (mobile nav tap)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-bg flex">
      <CustomCursor />

      {/* ── Mobile top bar ── */}
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

      {/* ── Overlay (mobile) ── */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
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
          {/* Close button — mobile only */}
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
            className="w-full text-left flex items-center gap-3 px-3 py-2.5 text-sm text-textSecondary hover:text-sale transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 overflow-auto md:mt-0 mt-14">
        <Outlet />
      </main>
    </div>
  );
}