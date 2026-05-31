import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleCart } from '../../store/slices/uiSlice';
import { logout } from '../../store/slices/authSlice';
import { useGetCategoriesQuery } from '../../store/api/categoriesApi';
import axios from 'axios';

const BASE = import.meta.env.VITE_API_BASE_URL || '/api/v1';
import {
  Search,
  ShoppingBag,
  Menu,
  X,
  User,
  LogOut,
  Package,
  LayoutDashboard,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { itemCount } = useSelector((s) => s.cart);
  const { user, isAuthenticated } = useSelector((s) => s.auth);

  const { data } = useGetCategoriesQuery();
  const categories = data?.categories || [];

  const [scrolled, setScrolled] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);

    window.addEventListener('scroll', onScroll);

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handler);

    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();

    if (searchVal.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchVal.trim())}`);

      setShowSearch(false);
      setSearchVal('');
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${BASE}/auth/logout`, {}, { withCredentials: true });
    } catch {
      // Even if the server call fails, clear client state so UI resets
    }
    dispatch(logout());
    setProfileOpen(false);
    toast.success('Logged out');
    navigate('/');
  };

  const navLinks = [
    { label: 'All Caps', to: '/shop' },
    ...categories
      .slice(0, 5)
      .map((c) => ({
        label: c.name,
        to: `/category/${c.slug}`,
      })),
    { label: 'About', to: '/about' },
  ];

  return (
    <>
      <header
        className={`relative z-50 transition-all duration-500 ${
          scrolled
            ? 'backdrop-blur-xl bg-bg/85 border-b border-border'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="flex items-center justify-between px-5 md:px-10 h-16 md:h-18">
          
          {/* Logo */}
          <Link
            to="/"
            data-text="CAPZYY®"
            className="glitch font-display text-2xl md:text-3xl tracking-wider text-white"
          >
            CAPZYY<span className="text-green-500 text-[0.6em] align-super">©</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-9">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="story-link font-condensed text-bold tracking-[0.25em] text-white hover:text-white/70 uppercase"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Right icons */}
          <div className="flex items-center gap-4 md:gap-5">

            {/* Search */}
            {showSearch ? (
              <form
                onSubmit={handleSearch}
                className="flex items-center"
              >
                <input
                  autoFocus
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  placeholder="Search caps..."
                  className="bg-surface border border-border text-white text-sm px-3 py-1.5 w-40 focus:outline-none focus:border-white font-condensed tracking-wider"
                />

                <button
                  type="button"
                  onClick={() => setShowSearch(false)}
                  className="ml-2 text-white hover:text-white/70"
                >
                  <X className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setShowSearch(true)}
                className="text-white hover:text-white/70 transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
            )}

            {/* Cart */}
            <button
              onClick={() => dispatch(toggleCart())}
              className="relative text-white hover:text-white/70 transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5" />

              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Profile */}
            <div
              className="relative hidden md:block"
              ref={profileRef}
            >
              <button
                onClick={() =>
                  isAuthenticated
                    ? setProfileOpen((p) => !p)
                    : navigate('/login')
                }
                className="text-white hover:text-white/70 transition-colors"
                aria-label="Account"
              >
                <User className="w-5 h-5" />
              </button>

              {isAuthenticated && profileOpen && (
                <div className="absolute right-0 top-full mt-3 w-56 bg-surface border border-border shadow-xl z-50 animate-fade-in">

                  {/* User info */}
                  <div className="px-4 py-3 border-b border-border">
                    <div className="flex items-center justify-between gap-2">

                      <div className="min-w-0">
                        <p className="text-white text-sm font-semibold truncate">
                          {user?.name || 'My Account'}
                        </p>

                        <p className="text-textMuted text-xs truncate">
                          {user?.email}
                        </p>
                      </div>

                      {user?.role === 'admin' && (
                        <span className="text-[10px] tracking-widest uppercase border border-border px-2 py-1 text-white/70">
                          Admin
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Menu */}
                  <div className="py-1">

                    {user?.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-white hover:text-white/70 hover:bg-surfaceHover transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Admin Dashboard
                      </Link>
                    )}

                    <Link
                      to="/my-orders"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-white hover:text-white/70 hover:bg-surfaceHover transition-colors"
                    >
                      <Package className="w-4 h-4" />
                      My Orders
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-white hover:text-sale hover:bg-surfaceHover transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden text-white hover:text-white/70"
              aria-label="Menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-[60] bg-bg transition-transform duration-500 lg:hidden ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center p-5 border-b border-border">
          <span className="font-display text-2xl tracking-wider text-white">
            CAPZYY<span className="text-white/60">®</span>
          </span>

          <button
            aria-label="Close"
            onClick={() => setMobileOpen(false)}
          >
            <X className="w-7 h-7 text-white" />
          </button>
        </div>

        <nav className="flex flex-col px-8 mt-10 gap-6">

          {navLinks.map((l, i) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setMobileOpen(false)}
              className="font-display text-5xl tracking-wide text-white hover:text-white/70 transition-colors"
              style={{
                animation: mobileOpen
                  ? `rise 0.6s ${0.1 + i * 0.06}s both`
                  : undefined,
              }}
            >
              {l.label.toUpperCase()}
            </Link>
          ))}

          <div className="border-t border-border pt-6 mt-2 flex flex-col gap-4">

            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-2">
                  <p className="font-condensed text-xs tracking-[0.3em] text-textMuted uppercase">
                    {user?.name}
                  </p>

                  {user?.role === 'admin' && (
                    <span className="text-[10px] tracking-[0.2em] uppercase border border-border px-2 py-1 text-white/70">
                      Admin
                    </span>
                  )}
                </div>

                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="font-condensed text-sm tracking-[0.3em] text-white uppercase"
                  >
                    Admin Dashboard
                  </Link>
                )}

                <Link
                  to="/my-orders"
                  onClick={() => setMobileOpen(false)}
                  className="font-condensed text-sm tracking-[0.3em] text-white  uppercase"
                >
                  My Orders
                </Link>

                <button
                  onClick={() => {
                    handleLogout();
                    setMobileOpen(false);
                  }}
                  className="text-left font-condensed text-sm tracking-[0.3em] text-sale uppercase"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="font-condensed text-sm tracking-[0.3em] text-white uppercase"
                >
                  Sign In
                </Link>

                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="font-condensed text-sm tracking-[0.3em] text-white uppercase"
                >
                  Create Account
                </Link>
              </>
            )}
          </div>
        </nav>

        <div className="absolute bottom-10 px-8 font-condensed text-xs tracking-[0.3em] text-textMuted uppercase">
          India's premium cap brand
        </div>
      </div>
    </>
  );
}