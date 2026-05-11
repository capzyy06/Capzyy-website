import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import CustomCursor from '../components/common/CustomCursor';

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: '📊', end: true },
  { to: '/admin/products', label: 'Products', icon: '🧢' },
  { to: '/admin/categories', label: 'Categories', icon: '📂' },
  { to: '/admin/orders', label: 'Orders', icon: '📦' },
];

export default function AdminLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => { dispatch(logout()); navigate('/admin/login'); };

  return (
    <div className="min-h-screen bg-bg flex">
      <CustomCursor /> 
      {/* Sidebar */}
      <aside className="w-56 bg-surface border-r border-border flex flex-col">
        <div className="p-6 border-b border-border">
          <h1 className="font-display text-2xl tracking-widest text-white">CAPZYY</h1>
          <p className="text-textMuted text-xs mt-1">Admin Panel</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {NAV.map(({ to, label, icon, end }) => (
            <NavLink key={to} to={to} end={end}
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded transition-colors ${isActive ? 'bg-white text-black' : 'text-textSecondary hover:text-white hover:bg-surfaceHover'}`}>
              <span>{icon}</span>{label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-border">
          <button onClick={handleLogout} className="w-full text-left flex items-center gap-3 px-3 py-2.5 text-sm text-textSecondary hover:text-sale transition-colors">
            <span>🚪</span> Logout
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
