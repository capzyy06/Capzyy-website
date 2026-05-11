import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAdminGetAllProductsQuery, useDeleteProductMutation, useUpdateProductMutation } from '../../store/api/productsApi';
import { formatPrice } from '../../utils/formatPrice';
import Spinner from '../../components/common/Spinner';
import toast from 'react-hot-toast';

export default function AdminProducts() {
  const [search, setSearch] = useState('');
  const { data, isLoading, refetch } = useAdminGetAllProductsQuery({ search });
  const [deleteProduct] = useDeleteProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const products = data?.products || [];

  const handleDelete = async (id, name) => {
    if (!confirm(`Remove "${name}"?`)) return;
    await deleteProduct(id);
    toast.success('Product removed');
  };

  const handleToggle = async (product) => {
    await updateProduct({ id: product._id, isActive: !product.isActive });
    toast.success(product.isActive ? 'Product hidden' : 'Product visible');
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-4xl tracking-widest text-white">PRODUCTS</h1>
        <Link to="/admin/products/new" className="btn-primary text-sm px-4 py-2">+ Add Product</Link>
      </div>

      {/* Search */}
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." className="input-field max-w-xs mb-6" />

      {isLoading ? <Spinner size="lg" className="py-20" /> : (
        <div className="bg-surface border border-border overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border">
              {['Product', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map(h => (
                <th key={h} className="text-left px-6 py-3 text-xs tracking-widest uppercase text-textSecondary font-semibold">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {products.map(p => (
                <tr key={p._id} className={`border-b border-border transition-colors hover:bg-surfaceHover ${!p.isActive ? 'opacity-50' : ''}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {p.images?.[0]?.url && <img src={p.images[0].url} alt={p.name} className="w-10 h-10 object-cover bg-bg" />}
                      <span className="text-white font-medium">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-textSecondary">{p.category?.name || '—'}</td>
                  <td className="px-6 py-4 text-white">{formatPrice(p.price)}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-semibold ${p.stock < 5 ? 'text-sale' : 'text-success'}`}>{p.stock}</span>
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => handleToggle(p)} className={`text-xs font-semibold uppercase tracking-wider ${p.isActive ? 'text-success' : 'text-textMuted'}`}>
                      {p.isActive ? 'Active' : 'Hidden'}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Link to={`/admin/products/edit/${p._id}`} className="text-xs text-textSecondary hover:text-white transition-colors uppercase tracking-wider">Edit</Link>
                      <button onClick={() => handleDelete(p._id, p.name)} className="text-xs text-textMuted hover:text-sale transition-colors uppercase tracking-wider">Remove</button>
                    </div>
                  </td>
                </tr>
              ))}
              {!products.length && <tr><td colSpan={6} className="px-6 py-12 text-center text-textMuted">No products found</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
