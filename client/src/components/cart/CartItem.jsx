import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { removeFromCart, updateQuantity } from '../../store/slices/cartSlice';
import { formatPrice } from '../../utils/formatPrice';

export default function CartItem({ item, onImageClick }) {
  const dispatch = useDispatch();

  const imageEl = (
    <img
      src={item.image || '/placeholder.jpg'}
      alt={item.name}
      className="w-20 h-20 object-cover bg-surface"
    />
  );

  return (
    <div className="flex gap-4 py-4 border-b border-border">
      {/* Image — if onImageClick passed (from drawer), use button. Otherwise Link to category */}
      {onImageClick ? (
        <button onClick={onImageClick} className="flex-shrink-0 cursor-pointer">
          {imageEl}
        </button>
      ) : (
        <Link
          to={item.categorySlug ? `/category/${item.categorySlug}` : `/product/${item.slug}`}
          className="flex-shrink-0"
        >
          {imageEl}
        </Link>
      )}

      <div className="flex-1 min-w-0">
        <h4 className="text-white text-sm font-semibold truncate">{item.name}</h4>
        {item.variant?.color && <p className="text-textMuted text-xs mt-0.5">Color: {item.variant.color}</p>}
        {item.variant?.size && <p className="text-textMuted text-xs">Size: {item.variant.size}</p>}
        <div className="flex items-center justify-between mt-3">
          {/* Qty controls */}
          <div className="flex items-center border border-border">
            <button
              onClick={() => dispatch(updateQuantity({ key: item.key, quantity: item.quantity - 1 }))}
              disabled={item.quantity <= 1}
              className="w-8 h-8 flex items-center justify-center text-textSecondary hover:text-white disabled:opacity-30 transition-colors"
            >−</button>
            <span className="w-8 text-center text-white text-sm">{item.quantity}</span>
            <button
              onClick={() => dispatch(updateQuantity({ key: item.key, quantity: item.quantity + 1 }))}
              className="w-8 h-8 flex items-center justify-center text-textSecondary hover:text-white transition-colors"
            >+</button>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-white text-sm font-semibold">{formatPrice(item.price * item.quantity)}</span>
            <button
              onClick={() => dispatch(removeFromCart(item.key))}
              className="text-textMuted hover:text-sale transition-colors"
              aria-label="Remove"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}