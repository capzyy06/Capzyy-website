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
const EMPTY = { name: '', description: '', price: '', compareAtPrice: '', category: '', stock: '', tags: '', features: '', isFeatured: false, isNewArrival: false, isBestSeller: false, isActive: true };

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

  // BUG C-3 FIX: fetch the specific product by ID directly instead of
  // loading all products and doing a client-side find() — which silently
  // fails for any product beyond the first page (limit 20)
  const { data: productData } = useGetProductByIdQuery(id, { skip: !isEdit });

  const categories = catData?.categories || [];

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
      // BUG S-8 FIX: folder removed from request body — derived server-side
      // BUG C-5 FIX: Authorization header removed — httpOnly cookie sent automatically
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

  const tf = (key, label, type = 'text', required = false, placeholder = '') => (
    <div>
      <label className="text-xs tracking-widest uppercase text-textSecondary block mb-2">{label}{required && ' *'}</label>
      <input type={type} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} className="input-field" placeholder={placeholder} required={required} />
    </div>
  );

  const cb = (key, label) => (
    <label className="flex items-center gap-3 cursor-pointer">
      <input type="checkbox" checked={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.checked }))} className="w-4 h-4 accent-white" />
      <span className="text-sm text-textSecondary">{label}</span>
    </label>
  );

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="font-display text-4xl tracking-widest text-white mb-8">{isEdit ? 'EDIT PRODUCT' : 'ADD PRODUCT'}</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {tf('name', 'Product Name', 'text', true, 'Hellfire Black Snapback')}

        <div>
          <label className="text-xs tracking-widest uppercase text-textSecondary block mb-2">Description *</label>
          <textarea rows={4} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="input-field resize-none" placeholder="Describe the cap..." required />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {tf('price', 'Price (₹)', 'number', true, '1299')}
          {tf('compareAtPrice', 'Compare at Price (₹)', 'number', false, '1599')}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs tracking-widest uppercase text-textSecondary block mb-2">Category *</label>
            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="input-field" required>
              <option value="">Select category</option>
              {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>
          {tf('stock', 'Stock Qty', 'number', true, '50')}
        </div>

        {tf('tags', 'Tags (comma-separated)', 'text', false, 'black, snapback, streetwear')}

        {/* Features — stored as array, edited as comma-separated string */}
        <div>
          <label className="text-xs tracking-widest uppercase text-textSecondary block mb-2">Features (comma-separated)</label>
          <textarea
            rows={3}
            value={form.features}
            onChange={e => setForm(f => ({ ...f, features: e.target.value }))}
            className="input-field resize-none"
            placeholder="100% Cotton, Snapback closure, One size fits all, Structured front panel"
          />
          <p className="text-textMuted text-xs mt-1.5">Each feature separated by a comma will appear as an individual tag on the product page.</p>
        </div>

        <div>
          <label className="text-xs tracking-widest uppercase text-textSecondary block mb-2">Product Images</label>
          <div className="flex flex-wrap gap-3 mb-3">
            {images.map((img, i) => (
              <div key={i} className="relative w-24 h-24">
                <img src={img.url} alt="" className="w-full h-full object-cover" />
                <button type="button" onClick={() => removeImage(i)} className="absolute -top-2 -right-2 w-5 h-5 bg-sale text-white rounded-full text-xs flex items-center justify-center">✕</button>
              </div>
            ))}
            <label className="w-24 h-24 border border-dashed border-border flex items-center justify-center cursor-pointer hover:border-white transition-colors">
              <span className="text-textMuted text-2xl">{uploading ? '...' : '+'}</span>
              <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-xs tracking-widest uppercase text-textSecondary block">Flags</label>
          {cb('isFeatured', 'Featured (shown on homepage)')}
          {cb('isNewArrival', 'New Arrival')}
          {cb('isBestSeller', 'Best Seller')}
          {cb('isActive', 'Active (visible on store)')}
        </div>

        <div className="flex gap-4 pt-4">
          <button type="submit" disabled={creating || updating} className="btn-primary">{creating || updating ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}</button>
          <button type="button" onClick={() => navigate('/admin/products')} className="btn-secondary">Cancel</button>
        </div>
      </form>
    </div>
  );
}