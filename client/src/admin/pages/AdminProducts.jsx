import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAdminGetAllProductsQuery, useDeleteProductMutation, useUpdateProductMutation } from '../../store/api/productsApi';
import { formatPrice } from '../../utils/formatPrice';
import Spinner from '../../components/common/Spinner';
import toast from 'react-hot-toast';

// ─── Stock Badge ──────────────────────────────────────────────────────────────
function StockBadge({ stock }) {
  const low = stock < 5;
  return (
    <span className={`text-xs font-bold px-2 py-0.5 rounded ${
      low ? 'text-rose-400 bg-rose-400/10' : 'text-emerald-400 bg-emerald-400/10'
    }`}>
      {stock} {low ? '· low' : ''}
    </span>
  );
}

// ─── Status Toggle ────────────────────────────────────────────────────────────
function StatusToggle({ isActive, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className={`relative flex-shrink-0 w-9 h-5 rounded-full transition-colors duration-200 focus:outline-none ${
        isActive ? 'bg-white' : 'bg-zinc-700'
      }`}
      aria-label={isActive ? 'Hide product' : 'Show product'}
    >
      <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full shadow transition-transform duration-200 ${
        isActive ? 'translate-x-4 bg-black' : 'translate-x-0 bg-zinc-400'
      }`} />
    </button>
  );
}

// ─── Mobile Product Card ──────────────────────────────────────────────────────
function MobileProductCard({ p, onToggle, onDelete }) {
  return (
    <div className={`bg-surface border border-border rounded-xl overflow-hidden transition-opacity ${!p.isActive ? 'opacity-50' : ''}`}>
      <div className="flex gap-3 p-3">
        {/* Image */}
        <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-zinc-900 border border-border">
          {p.images?.[0]?.url
            ? <img src={p.images[0].url} alt={p.name} className="w-full h-full object-cover" />
            : <div className="w-full h-full flex items-center justify-center">
                <svg className="w-5 h-5 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 21h18M3.75 3h16.5" />
                </svg>
              </div>
          }
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 flex flex-col gap-1">
          <p className="text-white text-sm font-semibold truncate leading-snug">{p.name}</p>
          <p className="text-textMuted text-xs">{p.category?.name || '—'}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-white text-sm font-bold">{formatPrice(p.price)}</span>
            <StockBadge stock={p.stock} />
          </div>
        </div>

        {/* Toggle */}
        <div className="flex flex-col items-end justify-between flex-shrink-0">
          <StatusToggle isActive={p.isActive} onToggle={() => onToggle(p)} />
          <span className={`text-[10px] font-semibold uppercase tracking-wider mt-1 ${p.isActive ? 'text-emerald-400' : 'text-zinc-500'}`}>
            {p.isActive ? 'Active' : 'Hidden'}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="border-t border-border flex divide-x divide-border">
        <Link
          to={`/admin/products/edit/${p._id}`}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold uppercase tracking-wider text-textSecondary hover:text-white hover:bg-surfaceHover transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 3.487a2.1 2.1 0 112.97 2.97L7.5 18.79l-4 1 1-4 12.362-12.303z" />
          </svg>
          Edit
        </Link>
        <button
          onClick={() => onDelete(p._id, p.name)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold uppercase tracking-wider text-textMuted hover:text-rose-400 hover:bg-rose-400/5 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m2 0a1 1 0 00-1-1h-4a1 1 0 00-1 1m6 0H7" />
          </svg>
          Remove
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdminProducts() {
  const [search, setSearch] = useState('');
  const { data, isLoading } = useAdminGetAllProductsQuery({ search });
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
    <div className="min-h-screen bg-background">
      {/* ── Sticky Header ── */}
      <div className="sticky top-0 z-20 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-3 mb-4">
            <h1 className="font-display text-2xl sm:text-4xl tracking-widest text-white">PRODUCTS</h1>
            <Link to="/admin/products/new" className="btn-primary text-sm px-3 py-2 flex-shrink-0 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span className="hidden sm:inline">Add Product</span>
              <span className="sm:hidden">Add</span>
            </Link>
          </div>
          {/* Search */}
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-textMuted pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search products…"
              className="input-field w-full sm:max-w-xs pl-9 text-sm"
            />
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="px-4 py-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <Spinner size="lg" className="py-20" />
        ) : (
          <>
            {/* Result count */}
            {products.length > 0 && (
              <p className="text-xs text-textMuted mb-3">{products.length} product{products.length !== 1 ? 's' : ''}</p>
            )}

            {/* ── Desktop table ── */}
            <div className="hidden md:block bg-surface border border-border overflow-x-auto rounded-xl">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    {['Product', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map(h => (
                      <th key={h} className="text-left px-6 py-3 text-xs tracking-widest uppercase text-textSecondary font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p._id} className={`border-b border-border last:border-0 transition-colors hover:bg-surfaceHover ${!p.isActive ? 'opacity-50' : ''}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {p.images?.[0]?.url && (
                            <img src={p.images[0].url} alt={p.name} className="w-10 h-10 object-cover rounded bg-zinc-900" />
                          )}
                          <span className="text-white font-medium">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-textSecondary">{p.category?.name || '—'}</td>
                      <td className="px-6 py-4 text-white">{formatPrice(p.price)}</td>
                      <td className="px-6 py-4"><StockBadge stock={p.stock} /></td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <StatusToggle isActive={p.isActive} onToggle={() => handleToggle(p)} />
                          <span className={`text-xs font-semibold uppercase tracking-wider ${p.isActive ? 'text-emerald-400' : 'text-zinc-500'}`}>
                            {p.isActive ? 'Active' : 'Hidden'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Link to={`/admin/products/edit/${p._id}`} className="text-xs text-textSecondary hover:text-white transition-colors uppercase tracking-wider">Edit</Link>
                          <button onClick={() => handleDelete(p._id, p.name)} className="text-xs text-textMuted hover:text-rose-400 transition-colors uppercase tracking-wider">Remove</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {!products.length && (
                    <tr>
                      <td colSpan={6} className="px-6 py-16 text-center text-textMuted">
                        <EmptyState />
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* ── Mobile card list ── */}
            <div className="md:hidden space-y-3">
              {!products.length
                ? <EmptyState />
                : products.map(p => (
                    <MobileProductCard
                      key={p._id}
                      p={p}
                      onToggle={handleToggle}
                      onDelete={handleDelete}
                    />
                  ))
              }
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <div className="w-12 h-12 rounded-full bg-surface border border-border flex items-center justify-center">
        <svg className="w-5 h-5 text-textMuted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-.375c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v.375c0 .621.504 1.125 1.125 1.125z" />
        </svg>
      </div>
      <p className="text-textMuted text-sm">No products found</p>
      <p className="text-textMuted/60 text-xs">Try a different search term</p>
    </div>
  );
}