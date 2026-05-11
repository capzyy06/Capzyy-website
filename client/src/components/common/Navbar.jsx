import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleCart } from '../../store/slices/uiSlice';
import { logout } from '../../store/slices/authSlice';
import { useGetCategoriesQuery } from '../../store/api/categoriesApi';
import { Search, ShoppingBag, Menu, X, User, LogOut, Package } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { itemCount } = useSelector(s => s.cart);
  const { user, isAuthenticated } = useSelector(s => s.auth);
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

  const handleLogout = () => {
    dispatch(logout());
    setProfileOpen(false);
    toast.success('Logged out');
    navigate('/');
  };

  const navLinks = [
    { label: 'All Caps', to: '/shop' },
    ...categories.slice(0, 4).map(c => ({ label: c.name, to: `/category/${c.slug}` })),
    { label: 'About', to: '/about' },
  ];

  return (
    <>
      <header className={`relative z-50 transition-all duration-500 ${
        scrolled 
          ? 'backdrop-blur-xl bg-bg/85 border-b border-border' 
          : 'bg-transparent border-b border-transparent'
      }`}>
        <div className="flex items-center justify-between px-5 md:px-10 h-16 md:h-20">
          {/* Logo */}
          <Link to="/" data-text="CAPZYY®" className="glitch font-display text-2xl md:text-3xl tracking-wider text-white">
            CAPZYY<span className="text-white/60">®</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-9">
            {navLinks.map((l) => (
              <Link key={l.to} to={l.to} className="story-link font-condensed text-bold tracking-[0.25em] text-textSecondary hover:text-white uppercase">
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Right icons */}
          {/* Right icons */}
          <div className="flex items-center gap-4 md:gap-5">
            
            {/* Search — first */}
            {showSearch ? (
              <form onSubmit={handleSearch} className="flex items-center">
                <input autoFocus value={searchVal} onChange={e => setSearchVal(e.target.value)} placeholder="Search caps..."
                  className="bg-surface border border-border text-white text-sm px-3 py-1.5 w-40 focus:outline-none focus:border-white font-condensed tracking-wider" />
                <button type="button" onClick={() => setShowSearch(false)} className="ml-2 text-textSecondary hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <button onClick={() => setShowSearch(true)} className="text-textSecondary hover:text-white transition-colors" aria-label="Search">
                <Search className="w-5 h-5" />
              </button>
            )}

            {/* Cart — second */}
            <button onClick={() => dispatch(toggleCart())} className="relative text-textSecondary hover:text-white transition-colors" aria-label="Cart">
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Profile — third */}
            <div className="relative hidden md:block" ref={profileRef}>
              <button
                onClick={() => isAuthenticated ? setProfileOpen(p => !p) : navigate('/login')}
                className="text-textSecondary hover:text-white transition-colors"
                aria-label="Account"
              >
                <User className="w-5 h-5" />
              </button>
              {isAuthenticated && profileOpen && (
                <div className="absolute right-0 top-full mt-3 w-52 bg-surface border border-border shadow-xl z-50 animate-fade-in">
                  <div className="px-4 py-3 border-b border-border">
                    <p className="text-white text-sm font-semibold truncate">{user?.name || 'My Account'}</p>
                    <p className="text-textMuted text-xs truncate">{user?.email}</p>
                  </div>
                  <div className="py-1">
                    <Link to="/orders" onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-textSecondary hover:text-white hover:bg-surfaceHover transition-colors">
                      <Package className="w-4 h-4" /> My Orders
                    </Link>
                    <button onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-textSecondary hover:text-sale hover:bg-surfaceHover transition-colors">
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu — last */}
            <button onClick={() => setMobileOpen(true)} className="lg:hidden text-textSecondary hover:text-white" aria-label="Menu">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile overlay */}
      <div className={`fixed inset-0 z-[60] bg-bg transition-transform duration-500 lg:hidden ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-between items-center p-5 border-b border-border">
          <span className="font-display text-2xl tracking-wider text-white">CAPZYY<span className="text-white/60">®</span></span>
          <button aria-label="Close" onClick={() => setMobileOpen(false)}><X className="w-7 h-7 text-white" /></button>
        </div>
        <nav className="flex flex-col px-8 mt-10 gap-6">
          {navLinks.map((l, i) => (
            <Link key={l.to} to={l.to} onClick={() => setMobileOpen(false)}
              className="font-display text-5xl tracking-wide text-white hover:text-textSecondary transition-colors"
              style={{ animation: mobileOpen ? `rise 0.6s ${0.1 + i * 0.06}s both` : undefined }}>
              {l.label.toUpperCase()}
            </Link>
          ))}
          <div className="border-t border-border pt-6 mt-2 flex flex-col gap-4">
            {isAuthenticated ? (
              <>
                <p className="font-condensed text-xs tracking-[0.3em] text-textMuted uppercase">{user?.name}</p>
                <Link to="/orders" onClick={() => setMobileOpen(false)} className="font-condensed text-sm tracking-[0.3em] text-textSecondary uppercase">My Orders</Link>
                <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="text-left font-condensed text-sm tracking-[0.3em] text-sale uppercase">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="font-condensed text-sm tracking-[0.3em] text-textSecondary uppercase">Sign In</Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="font-condensed text-sm tracking-[0.3em] text-white uppercase">Create Account</Link>
              </>
            )}
          </div>
        </nav>
        <div className="absolute bottom-10 px-8 font-condensed text-xs tracking-[0.3em] text-textMuted uppercase">India's premium cap brand</div>
      </div>
    </>
  );
}