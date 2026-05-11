import { useGetCategoriesQuery } from '../../store/api/categoriesApi';

export default function FilterSidebar({ filters, onChange }) {
  const { data } = useGetCategoriesQuery();
  const categories = data?.categories || [];

  const handleCategory = (id) => onChange({ ...filters, category: filters.category === id ? '' : id });
  const handlePrice = (key, val) => onChange({ ...filters, [key]: val });

  return (
    <aside className="w-full md:w-56 flex-shrink-0 space-y-8">
      {/* Categories */}
      <div>
        <h3 className="text-xs font-bold tracking-widest uppercase text-white mb-4">Category</h3>
        <div className="space-y-2">
          {categories.map(c => (
            <button key={c._id} onClick={() => handleCategory(c._id)}
              className={`block w-full text-left text-sm transition-colors py-1 ${filters.category === c._id ? 'text-white font-semibold' : 'text-textSecondary hover:text-white'}`}>
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <h3 className="text-xs font-bold tracking-widest uppercase text-white mb-4">Price</h3>
        <div className="space-y-3">
          {[['Under ₹500', '', '500'], ['₹500 – ₹1000', '500', '1000'], ['₹1000 – ₹2000', '1000', '2000'], ['Above ₹2000', '2000', '']].map(([label, min, max]) => (
            <button key={label} onClick={() => onChange({ ...filters, minPrice: min, maxPrice: max })}
              className={`block w-full text-left text-sm py-1 transition-colors ${filters.minPrice === min && filters.maxPrice === max ? 'text-white font-semibold' : 'text-textSecondary hover:text-white'}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Clear */}
      {(filters.category || filters.minPrice || filters.maxPrice) && (
        <button onClick={() => onChange({ category: '', minPrice: '', maxPrice: '', sort: filters.sort })}
          className="text-xs text-textMuted hover:text-white underline tracking-wider">Clear filters</button>
      )}
    </aside>
  );
}
