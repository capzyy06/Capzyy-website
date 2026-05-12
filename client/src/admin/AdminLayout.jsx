import { Outlet, NavLink, useNavigate } from 'react-router-dom';
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

  const handleLogout = () => {
    dispatch(logout());
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-bg flex">
      <CustomCursor />

      {/* Sidebar */}
      <aside className="w-56 bg-surface border-r border-border flex flex-col">
        <div className="p-6 border-b border-border">
          <h1 className="font-display text-2xl tracking-widest text-white">
            CAPZYY
          </h1>
          <p className="text-textMuted text-xs mt-1">Admin Panel</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
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

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}