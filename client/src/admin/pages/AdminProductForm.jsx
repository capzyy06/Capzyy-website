import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useCreateProductMutation,
  useUpdateProductMutation,
  useGetProductByIdQuery,
} from '../../store/api/productsApi';
import { useGetAllCategoriesQuery } from '../../store/api/categoriesApi';
import axios from 'axios';
import toast from 'react-hot-toast';

const BASE = import.meta.env.VITE_API_BASE_URL || '/api/v1';
const EMPTY = {
  name: '', description: '', price: '', compareAtPrice: '',
  category: '', stock: '', tags: '', features: '',
  isFeatured: false, isNewArrival: false, isBestSeller: false, isActive: true,
};

// ─── Section Wrapper ─────────────────────────────────────────────────────────
function Section({ title, children }) {
  return (
    <div className="bg-surface border border-border rounded-xl overflow-hidden">
      {title && (
        <div className="px-4 py-3 border-b border-border">
          <span className="text-[10px] font-bold tracking-widest uppercase text-textSecondary">{title}</span>
        </div>
      )}
      <div className="p-4 space-y-4">{children}</div>
    </div>
  );
}

// ─── Field Components ─────────────────────────────────────────────────────────
function FieldLabel({ label, required }) {
  return (
    <label className="text-xs tracking-widest uppercase text-textSecondary block mb-2">
      {label}{required && <span className="text-rose-400 ml-0.5">*</span>}
    </label>
  );
}

function TextField({ value, onChange, type = 'text', required, placeholder }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      className="input-field w-full text-sm"
      placeholder={placeholder}
      required={required}
      inputMode={type === 'number' ? 'numeric' : undefined}
    />
  );
}

// ─── Toggle Switch ────────────────────────────────────────────────────────────
function Toggle({ checked, onChange, label, description }) {
  return (
    <label className="flex items-center justify-between gap-3 cursor-pointer py-1 group">
      <div>
        <p className="text-sm text-white font-medium">{label}</p>
        {description && <p className="text-xs text-textMuted mt-0.5">{description}</p>}
      </div>
      <div
        className={`relative flex-shrink-0 w-11 h-6 rounded-full transition-colors duration-200 ${
          checked ? 'bg-white' : 'bg-zinc-700'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full shadow transition-transform duration-200 ${
            checked ? 'translate-x-5 bg-black' : 'translate-x-0 bg-zinc-400'
          }`}
        />
        <input type="checkbox" className="sr-only" checked={checked} onChange={onChange} />
      </div>
    </label>
  );
}

// ─── Image Thumbnail ──────────────────────────────────────────────────────────
function ImageThumb({ url, onRemove }) {
  return (
    <div className="relative group aspect-square w-full rounded-lg overflow-hidden border border-border bg-zinc-900">
      <img src={url} alt="" className="w-full h-full object-cover" />
      <button
        type="button"
        onClick={onRemove}
        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity flex items-center justify-center"
        aria-label="Remove image"
      >
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

// ─── Main Form ────────────────────────────────────────────────────────────────
export default function AdminProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  const [createProduct, { isLoading: creating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: updating }] = useUpdateProductMutation();
  const { data: catData } = useGetAllCategoriesQuery();
  const { data: productData } = useGetProductByIdQuery(id, { skip: !isEdit });

  const categories = catData?.categories || [];
  const isSaving = creating || updating;

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));
  const setCheck = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.checked }));

  useEffect(() => {
    if (isEdit && productData?.product) {
      const p = productData.product;
      setForm({
        name: p.name,
        description: p.description,
        price: p.price,
        compareAtPrice: p.compareAtPrice || '',
        category: p.category?._id || '',
        stock: p.stock,
        tags: p.tags?.join(', ') || '',
        features: p.features?.join(', ') || '',
        isFeatured: p.isFeatured,
        isNewArrival: p.isNewArrival,
        isBestSeller: p.isBestSeller,
        isActive: p.isActive,
      });
      setImages(p.images || []);
    }
  }, [isEdit, productData, id]);

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    try {
      const fd = new FormData();
      files.forEach(f => fd.append('images', f));
      const { data } = await axios.post(`${BASE}/media/upload`, fd, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setImages(prev => [...prev, ...data.files]);
      toast.success('Images uploaded!');
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (idx) => setImages(prev => prev.filter((_, i) => i !== idx));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.category || !form.stock) {
      toast.error('Fill all required fields');
      return;
    }
    const payload = {
      ...form,
      price: Number(form.price),
      compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : null,
      stock: Number(form.stock),
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      features: form.features.split(',').map(f => f.trim()).filter(Boolean),
      images,
    };
    try {
      if (isEdit) {
        await updateProduct({ id, ...payload }).unwrap();
        toast.success('Product updated!');
      } else {
        await createProduct(payload).unwrap();
        toast.success('Product created!');
      }
      navigate('/admin/products');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to save product');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ── Sticky Header ── */}
      <div className="sticky top-0 z-20 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => navigate('/admin/products')}
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-border text-textSecondary hover:text-white hover:border-zinc-500 transition-colors flex-shrink-0"
              aria-label="Back"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="font-display text-xl sm:text-3xl tracking-widest text-white truncate">
              {isEdit ? 'EDIT PRODUCT' : 'ADD PRODUCT'}
            </h1>
          </div>
          {/* Desktop save button */}
          <button
            type="submit"
            form="product-form"
            disabled={isSaving}
            className="hidden sm:flex btn-primary items-center gap-2 flex-shrink-0"
          >
            {isSaving && (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            )}
            {isSaving ? 'Saving…' : isEdit ? 'Update Product' : 'Create Product'}
          </button>
        </div>
      </div>

      {/* ── Form Body ── */}
      <form id="product-form" onSubmit={handleSubmit}>
        <div className="px-4 py-5 sm:px-6 lg:px-8 max-w-3xl mx-auto space-y-4">

          {/* Basic Info */}
          <Section title="Basic Info">
            <div>
              <FieldLabel label="Product Name" required />
              <TextField value={form.name} onChange={set('name')} required placeholder="Hellfire Black Snapback" />
            </div>
            <div>
              <FieldLabel label="Description" required />
              <textarea
                rows={4}
                value={form.description}
                onChange={set('description')}
                className="input-field w-full resize-none text-sm"
                placeholder="Describe the cap…"
                required
              />
            </div>
          </Section>

          {/* Pricing */}
          <Section title="Pricing & Inventory">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <FieldLabel label="Price (₹)" required />
                <TextField value={form.price} onChange={set('price')} type="number" required placeholder="1299" />
              </div>
              <div>
                <FieldLabel label="Compare at (₹)" />
                <TextField value={form.compareAtPrice} onChange={set('compareAtPrice')} type="number" placeholder="1599" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <FieldLabel label="Category" required />
                <select
                  value={form.category}
                  onChange={set('category')}
                  className="input-field w-full text-sm"
                  required
                >
                  <option value="">Select…</option>
                  {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <FieldLabel label="Stock Qty" required />
                <TextField value={form.stock} onChange={set('stock')} type="number" required placeholder="50" />
              </div>
            </div>
          </Section>

          {/* Images */}
          <Section title="Product Images">
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {images.map((img, i) => (
                <ImageThumb key={i} url={img.url} onRemove={() => removeImage(i)} />
              ))}
              {/* Upload button */}
              <label className={`aspect-square w-full rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-zinc-500 active:bg-zinc-900 transition-colors ${uploading ? 'opacity-60 pointer-events-none' : ''}`}>
                {uploading ? (
                  <svg className="w-6 h-6 text-textMuted animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                ) : (
                  <>
                    <svg className="w-6 h-6 text-textMuted mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="text-[10px] text-textMuted uppercase tracking-wider">Add</span>
                  </>
                )}
                <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
            {images.length === 0 && (
              <p className="text-xs text-textMuted text-center -mt-1">Tap the + tile to upload images</p>
            )}
          </Section>

          {/* Tags & Features */}
          <Section title="Tags & Features">
            <div>
              <FieldLabel label="Tags (comma-separated)" />
              <TextField value={form.tags} onChange={set('tags')} placeholder="black, snapback, streetwear" />
            </div>
            <div>
              <FieldLabel label="Features (comma-separated)" />
              <textarea
                rows={3}
                value={form.features}
                onChange={set('features')}
                className="input-field w-full resize-none text-sm"
                placeholder="100% Cotton, Snapback closure, One size fits all"
              />
              <p className="text-textMuted text-xs mt-1.5">Each comma-separated item appears as an individual tag on the product page.</p>
            </div>
          </Section>

          {/* Flags */}
          <Section title="Visibility & Labels">
            <div className="divide-y divide-border -my-1">
              <div className="py-2">
                <Toggle checked={form.isActive} onChange={setCheck('isActive')} label="Active" description="Visible on store" />
              </div>
              <div className="py-2">
                <Toggle checked={form.isFeatured} onChange={setCheck('isFeatured')} label="Featured" description="Shown on homepage" />
              </div>
              <div className="py-2">
                <Toggle checked={form.isNewArrival} onChange={setCheck('isNewArrival')} label="New Arrival" />
              </div>
              <div className="py-2">
                <Toggle checked={form.isBestSeller} onChange={setCheck('isBestSeller')} label="Best Seller" />
              </div>
            </div>
          </Section>

          {/* Mobile sticky footer CTA */}
          <div className="sm:hidden fixed bottom-0 left-0 right-0 z-30 bg-background/95 backdrop-blur-md border-t border-border px-4 py-3 flex gap-3">
            <button
              type="button"
              onClick={() => navigate('/admin/products')}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              {isSaving && (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              )}
              {isSaving ? 'Saving…' : isEdit ? 'Update' : 'Create'}
            </button>
          </div>

          {/* Desktop cancel — inline at bottom */}
          <div className="hidden sm:flex gap-4 pt-2 pb-8">
            <button type="submit" form="product-form" disabled={isSaving} className="btn-primary">
              {isSaving ? 'Saving…' : isEdit ? 'Update Product' : 'Create Product'}
            </button>
            <button type="button" onClick={() => navigate('/admin/products')} className="btn-secondary">
              Cancel
            </button>
          </div>

          {/* Spacer so mobile sticky footer doesn't cover last section */}
          <div className="h-20 sm:hidden" />
        </div>
      </form>
    </div>
  );
}