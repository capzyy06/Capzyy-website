import { useSearchParams } from 'react-router-dom';
import { useGetProductsQuery } from '../store/api/productsApi';
import ProductGrid from '../components/product/ProductGrid';

export default function SearchPage() {
  const [params] = useSearchParams();
  const q = params.get('q') || '';
  const { data, isLoading } = useGetProductsQuery({ search: q }, { skip: !q });
  const products = data?.products || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <p className="text-textMuted text-xs tracking-widest uppercase mb-2">Search results for</p>
      <h1 className="font-display text-5xl md:text-7xl tracking-widest text-white mb-10">"{q}"</h1>
      <p className="text-textSecondary text-sm mb-8">{data?.total || 0} results found</p>
      <ProductGrid products={products} isLoading={isLoading} cols={4} />
    </div>
  );
}
