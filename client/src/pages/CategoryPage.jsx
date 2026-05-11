import { useParams } from 'react-router-dom';
import { useGetCategoryBySlugQuery } from '../store/api/categoriesApi';
import { useGetProductsQuery } from '../store/api/productsApi';
import ProductGrid from '../components/product/ProductGrid';
import SortDropdown from '../components/filter/SortDropdown';
import { useState } from 'react';

export default function CategoryPage() {
  const { slug } = useParams();
  const [sort, setSort] = useState('newest');
  const { data: catData } = useGetCategoryBySlugQuery(slug);
  const category = catData?.category;
  const { data, isLoading } = useGetProductsQuery({ category: category?._id, sort }, { skip: !category?._id });
  const products = data?.products || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-10">
        <p className="text-textMuted text-xs tracking-widest uppercase mb-2">Category</p>
        <h1 className="font-display text-6xl md:text-8xl tracking-widest text-white">{category?.name?.toUpperCase() || slug.toUpperCase()}</h1>
        {category?.description && <p className="text-textSecondary text-sm mt-3 max-w-xl">{category.description}</p>}
      </div>
      <div className="flex justify-between items-center mb-6">
        <p className="text-textMuted text-xs tracking-wider">{data?.total || 0} styles</p>
        <SortDropdown value={sort} onChange={setSort} />
      </div>
      <ProductGrid products={products} isLoading={isLoading} cols={4} />
    </div>
  );
}
