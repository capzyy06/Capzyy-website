import ProductCard from './ProductCard';
import Spinner from '../common/Spinner';

export default function ProductGrid({ products, isLoading, cols = 4 }) {
  const colClass = { 2: 'grid-cols-2', 3: 'grid-cols-2 md:grid-cols-3', 4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' }[cols] || 'grid-cols-2 md:grid-cols-4';

  if (isLoading) return <Spinner size="lg" className="py-32" />;

  if (!products?.length) return (
    <div className="py-32 text-center">
      <p className="text-textSecondary text-lg tracking-wide">No caps found.</p>
    </div>
  );

  return (
    <div className={`grid ${colClass} gap-4 md:gap-6`}>
      {products.map(p => <ProductCard key={p._id} product={p} />)}
    </div>
  );
}
