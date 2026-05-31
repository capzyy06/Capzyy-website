import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useGetProductBySlugQuery } from '../store/api/productsApi';
import ProductImageGallery from '../components/product/ProductImageGallery';
import { ProductSizeSelector, ProductColorSelector } from '../components/product/ProductVariantSelectors';
import RelatedProducts from '../components/product/RelatedProducts';
import Spinner from '../components/common/Spinner';
import { addToCart } from '../store/slices/cartSlice';
import { openCart } from '../store/slices/uiSlice';
import { formatPrice } from '../utils/formatPrice';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { data, isLoading, isError } = useGetProductBySlugQuery(slug);
  const product = data?.product;

  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [qty, setQty] = useState(1);
  const [shareCopied, setShareCopied] = useState(false);

  if (isLoading) return <Spinner size="lg" className="py-40" />;
  if (isError || !product) return <div className="text-center py-40 text-textSecondary">Product not found.</div>;

  const uniqueColors = [...new Map(product.variants.map(v => [v.color, v])).values()];
  const uniqueSizes = [...new Set(product.variants.map(v => v.size).filter(Boolean))];
  const discountPercent = product.compareAtPrice > product.price
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100) : 0;

  const features = Array.isArray(product.features) ? product.features.filter(Boolean) : [];

  const handleAddToCart = () => {
    dispatch(addToCart({
      productId: product._id,
      name: product.name,
      price: product.price,
      image: product.images?.[0]?.url || '',
      slug: product.slug,
      categorySlug: product.category?.slug || '',
      quantity: qty,
      variant: { color: selectedColor?.color, size: selectedSize },
    }));
    dispatch(openCart());
    toast.success('Added to cart!');
  };

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} on CAPZYY`,
        url,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url).then(() => {
        setShareCopied(true);
        toast.success('Link copied!');
        setTimeout(() => setShareCopied(false), 2000);
      }).catch(() => toast.error('Could not copy link'));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
        {/* Gallery */}
        <ProductImageGallery images={product.images} name={product.name} />

        {/* Info */}
        <div className="space-y-6">
          <div>
            <p className="text-textMuted text-xs tracking-widest uppercase mb-2">{product.category?.name}</p>
            <h1 className="font-display text-5xl tracking-widest text-white">{product.name}</h1>
          </div>

          {/* Price */}
          <div className="flex items-center gap-4">
            <span className="text-white text-2xl font-semibold">{formatPrice(product.price)}</span>
            {product.compareAtPrice > product.price && (
              <>
                <span className="text-textMuted text-lg line-through">{formatPrice(product.compareAtPrice)}</span>
                <span className="bg-sale text-white text-xs font-bold px-2 py-1">-{discountPercent}%</span>
              </>
            )}
          </div>

          <p className="text-textSecondary text-sm leading-relaxed">{product.description}</p>

          {/* Features */}
          {features.length > 0 && (
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-textSecondary mb-3">Features</p>
              <div className="flex flex-wrap gap-2">
                {features.map((feature, index) => (
                  <span key={index} className="text-xs text-textSecondary border border-border px-3 py-1.5 tracking-wide">
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-border pt-6 space-y-6">
            {uniqueColors.length > 0 && <ProductColorSelector colors={uniqueColors} selected={selectedColor} onSelect={setSelectedColor} />}
            {uniqueSizes.length > 0 && <ProductSizeSelector sizes={uniqueSizes} selected={selectedSize} onSelect={setSelectedSize} />}

            {/* Qty */}
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-textSecondary mb-3">Quantity</p>
              <div className="flex items-center border border-border w-fit">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-10 h-10 text-textSecondary hover:text-white transition-colors">−</button>
                <span className="w-10 text-center text-white">{qty}</span>
                <button onClick={() => setQty(q => q + 1)} className="w-10 h-10 text-textSecondary hover:text-white transition-colors">+</button>
              </div>
            </div>

            {/* Add to Cart + Share row */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="btn-primary flex-1 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>

              {/* Share button */}
              <button
                onClick={handleShare}
                aria-label="Share product"
                title="Share"
                className="flex items-center justify-center gap-2 border border-border px-4 h-full text-textSecondary hover:text-white hover:border-white transition-colors min-w-[48px]"
              >
                {shareCopied ? (
                  <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Tags */}
          {product.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
              {product.tags.map(tag => <span key={tag} className="text-xs text-textMuted border border-border px-3 py-1">#{tag}</span>)}
            </div>
          )}
        </div>
      </div>

      <RelatedProducts categoryId={product.category?._id} currentProductId={product._id} />
    </div>
  );
}