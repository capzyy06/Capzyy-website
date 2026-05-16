import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../store/slices/cartSlice';
import { openCart } from '../../store/slices/uiSlice';
import ProductBadge from './ProductBadge';
import { formatPrice } from '../../utils/formatPrice';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const dispatch = useDispatch();

  const img1 = product.images?.[0]?.url || '/placeholder.jpg';
  const img2 = product.images?.[1]?.url;
  const discountPercent = product.compareAtPrice > product.price
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100) : 0;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    dispatch(addToCart({
      productId: product._id,
      name: product.name,
      price: product.price,
      image: img1,
      slug: product.slug,
    }));
    dispatch(openCart());
    toast.success('Added to cart!');
  };

  return (
    <Link to={`/product/${product.slug}`} className="group block">
      <div className="relative overflow-hidden bg-surface aspect-square">
        <ProductBadge isNewArrival={product.isNewArrival} isBestSeller={product.isBestSeller} discountPercent={discountPercent} />
        <img
          src={img2 || img1}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover transition-all duration-500"
        />
        {/* Quick add — always visible */}
        <button
          onClick={handleQuickAdd}
          className="absolute bottom-0 left-0 right-0 bg-white text-black text-xs font-bold tracking-widest uppercase py-3 transition-opacity duration-300"
        >
          Quick Add
        </button>
      </div>
      <div className="mt-3 space-y-1">
        <p className="text-xs text-textMuted uppercase tracking-wider">{product.category?.name}</p>
        <h3 className="text-white font-semibold text-sm tracking-wide">{product.name}</h3>
        <div className="flex items-center gap-2">
          <span className="text-white font-semibold text-sm">{formatPrice(product.price)}</span>
          {product.compareAtPrice > product.price && (
            <span className="text-textMuted text-xs line-through">{formatPrice(product.compareAtPrice)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}