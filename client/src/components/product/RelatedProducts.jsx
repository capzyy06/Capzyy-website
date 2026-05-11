import { useGetProductsQuery } from '../../store/api/productsApi';
import ProductCard from './ProductCard';

export default function RelatedProducts({ categoryId, currentProductId }) {
  const { data } = useGetProductsQuery({ category: categoryId, limit: 4 });
  const related = data?.products?.filter(p => p._id !== currentProductId) || [];
  if (!related.length) return null;
  return (
    <section className="mt-20">
      <h2 className="font-display text-4xl tracking-widest text-white mb-8">YOU MAY ALSO LIKE</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {related.slice(0, 4).map(p => <ProductCard key={p._id} product={p} />)}
      </div>
    </section>
  );
}
