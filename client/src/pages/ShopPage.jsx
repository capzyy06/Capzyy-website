import { useState } from 'react';
import { useGetProductsQuery } from '../store/api/productsApi';
import ProductGrid from '../components/product/ProductGrid';
import FilterSidebar from '../components/filter/FilterSidebar';
import SortDropdown from '../components/filter/SortDropdown';

const DEFAULT = { category: '', minPrice: '', maxPrice: '', sort: 'newest' };

export default function ShopPage() {
  const [filters, setFilters] = useState(DEFAULT);
  const [page, setPage] = useState(1);

  const { data, isLoading } = useGetProductsQuery({ ...filters, page, limit: 12 });
  const products = data?.products || [];
  const totalPages = data?.pages || 1;

  const handleFilters = (f) => { setFilters(f); setPage(1); };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-10">
        <h1 className="font-display text-6xl md:text-8xl tracking-widest text-white">ALL CAPS</h1>
        <p className="text-textSecondary text-sm mt-2">{data?.total || 0} styles</p>
      </div>

      <div className="flex flex-col md:flex-row gap-10">
        <FilterSidebar filters={filters} onChange={handleFilters} />

        <div className="flex-1">
          {/* Sort bar */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-textMuted text-xs tracking-wider">Showing {products.length} of {data?.total || 0}</p>
            <SortDropdown value={filters.sort} onChange={s => handleFilters({ ...filters, sort: s })} />
          </div>

          <ProductGrid products={products} isLoading={isLoading} cols={3} />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-12">
              {[...Array(totalPages)].map((_, i) => (
                <button key={i} onClick={() => setPage(i + 1)}
                  className={`w-10 h-10 text-sm font-semibold border transition-colors ${page === i + 1 ? 'bg-white text-black border-white' : 'border-border text-textSecondary hover:border-white hover:text-white'}`}>
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
