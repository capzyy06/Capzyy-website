import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import CartItem from '../components/cart/CartItem';
import { formatPrice } from '../utils/formatPrice';

const SHIPPING_THRESHOLD = 999;
const SHIPPING_COST = 99;

export default function CartPage() {
  const { items, total, itemCount } = useSelector(s => s.cart);
  const { isAuthenticated } = useSelector(s => s.auth);
  const navigate = useNavigate();
  const shipping = total >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const grandTotal = total + shipping;

  const handleCheckout = () => {
  if (!isAuthenticated) {
    navigate('/login?redirect=/checkout');
  } else {
    navigate('/checkout');
  }
};

  if (!items.length) return (
    <div className="max-w-7xl mx-auto px-4 py-32 text-center">
      <h1 className="font-display text-6xl tracking-widest text-white mb-6">YOUR BAG IS EMPTY</h1>
      <p className="text-textSecondary mb-8">Looks like you haven't picked a cap yet.</p>
      <Link to="/shop" className="btn-primary inline-block">Shop All Caps</Link>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="font-display text-6xl md:text-8xl tracking-widest text-white mb-10">YOUR BAG ({itemCount})</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Items */}
        <div className="lg:col-span-2">
          {items.map(item => <CartItem key={item.key} item={item} />)}
          <Link to="/shop" className="inline-block mt-6 text-xs tracking-widest uppercase text-textSecondary hover:text-white transition-colors border-b border-textMuted hover:border-white pb-0.5">
            ← Continue Shopping
          </Link>
        </div>

        {/* Summary */}
        <div className="bg-surface p-6 space-y-4 h-fit">
          <h2 className="font-display text-2xl tracking-widest text-white">ORDER SUMMARY</h2>
          <div className="space-y-3 text-sm border-b border-border pb-4">
            <div className="flex justify-between text-textSecondary">
              <span>Subtotal</span><span className="text-white">{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between text-textSecondary">
              <span>Shipping</span>
              <span className={shipping === 0 ? 'text-success' : 'text-white'}>
                {shipping === 0 ? 'FREE' : formatPrice(shipping)}
              </span>
            </div>
            
          </div>
          <div className="flex justify-between text-white font-bold tracking-wider">
            <span>TOTAL</span><span>{formatPrice(grandTotal)}</span>
          </div>
          <button onClick={handleCheckout} className="btn-primary w-full">
            Proceed to Checkout
          </button>
          
          <p className="text-textMuted text-xs text-center">Taxes included where applicable</p>
        </div>
      </div>
    </div>
  );
}