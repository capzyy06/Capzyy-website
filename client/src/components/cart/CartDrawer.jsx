import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { closeCart } from '../../store/slices/uiSlice';
import { openLogin } from '../../store/slices/uiSlice';
import CartItem from './CartItem';
import { formatPrice } from '../../utils/formatPrice';

export default function CartDrawer() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isCartOpen } = useSelector(s => s.ui);
  const { items, total, itemCount } = useSelector(s => s.cart);
  const { isAuthenticated } = useSelector(s => s.auth);

  const handleCheckout = () => {
    dispatch(closeCart());
    if (!isAuthenticated) {
      // Open login drawer with checkout as redirect destination
      setTimeout(() => dispatch(openLogin('/checkout')), 320);
    } else {
      navigate('/checkout');
    }
  };

  const handleImageClick = (item) => {
    dispatch(closeCart());
    // Small delay so drawer close animation finishes, then navigate + scroll top
    setTimeout(() => {
      navigate(`/product/${item.slug}`);
      window.scrollTo({ top: 0, behavior: 'instant' });
    }, 320);
  };

  return (
    <>
      {/* Overlay */}
      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40"
          onClick={() => dispatch(closeCart())}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed right-0 w-full max-w-md pt-16 bg-surface z-50 flex flex-col transition-transform duration-300 ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{
          top: 'var(--nav-h, 60px)',
          height: 'calc(100vh - var(--nav-h, 60px))',
          boxShadow: '-8px 0 40px rgba(0,0,0,0.5)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div>
            <h2 className="font-display text-xl tracking-widest text-white">YOUR BAG</h2>
            <p className="text-textSecondary text-xs tracking-widest mt-0.5">
              {itemCount} {itemCount === 1 ? 'ITEM' : 'ITEMS'}
            </p>
          </div>
          <button
            onClick={() => dispatch(closeCart())}
            className="text-textSecondary hover:text-white transition-colors p-1"
            aria-label="Close cart"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items list */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {!items.length ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <svg className="w-12 h-12 text-textMuted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <p className="text-textSecondary text-sm">Your bag is empty.</p>
              <button
                onClick={() => { dispatch(closeCart()); navigate('/shop'); }}
                className="btn-primary text-sm"
              >
                Shop Caps
              </button>
            </div>
          ) : (
            <div className="space-y-1">
              {items.map(item => (
                <CartItem
                  key={item.key}
                  item={item}
                  onImageClick={() => handleImageClick(item)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (() => {
          const capCount = items.reduce((sum, item) => sum + item.quantity, 0);
          return (
            <div className="px-6 py-5 border-t border-border space-y-3 bg-surface">
              {capCount === 1 && (
                <div className="space-y-1.5">
                  <p className="text-textMuted text-xs tracking-wider">
                    🧢 Add <span className="text-white">1 more cap</span> to unlock free shipping!
                  </p>
                  <div className="h-0.5 bg-border rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: '50%', background: '#C8F135' }} />
                  </div>
                </div>
              )}
              {capCount >= 2 && capCount < 3 && (
                <p className="text-xs tracking-wider" style={{ color: '#C8F135' }}>
                  ✓ FREE SHIPPING UNLOCKED
                </p>
              )}
              {capCount >= 3 && (
                <p className="text-xs tracking-wider text-lime-400">
                  🎁 FREE SHIPPING + SURPRISE CAP!
                </p>
              )}
              <div className="flex justify-between text-white font-semibold text-sm tracking-wider pt-1">
                <span>SUBTOTAL</span>
                <span>{formatPrice(total)}</span>
              </div>
              <p className="text-textMuted text-xs">Shipping calculated at checkout</p>
              <button onClick={handleCheckout} className="btn-primary w-full text-center">
                Proceed to Checkout
              </button>
            </div>
          );
        })()}
      </div>
    </>
  );
}