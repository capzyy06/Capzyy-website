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
      categorySlug: product.category?.slug || '',
    }));
    dispatch(openCart());
    toast.success('Added to cart!');
  };

  const handleShare = (e) => {
    e.preventDefault();
    const url = `${window.location.origin}/product/${product.slug}`;
    if (navigator.share) {
      navigator.share({ title: product.name, text: `Check out ${product.name}`, url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url).then(() => toast.success('Link copied!')).catch(() => toast.error('Could not copy link'));
    }
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

        {/* Share button — top right, hover only */}
        <button
          onClick={handleShare}
          aria-label="Share product"
          className="absolute top-2 right-2 bg-white text-black w-8 h-8 flex items-center justify-center rounded-full shadow
                     opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0
                     transition-all duration-300 z-10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
        </button>

        {/* Quick Add — slides up from bottom on hover only */}
        <button
  onClick={handleQuickAdd}
  className="
    absolute bottom-0 left-0 right-0
    bg-[#C7F02D] text-black
    flex items-center justify-center gap-2
    text-xs font-medium tracking-[0.25em] uppercase
    py-4
    translate-y-full group-hover:translate-y-0
    transition-transform duration-300
  "
>
  <span className="text-lg leading-none">+</span>
  <span>Add</span>
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