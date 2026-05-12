import { useState, useRef } from 'react';
import { useGetAllCategoriesQuery, useCreateCategoryMutation, useUpdateCategoryMutation, useDeleteCategoryMutation } from '../../store/api/categoriesApi';
import toast from 'react-hot-toast';
import Spinner from '../../components/common/Spinner';

const EMPTY = { name: '', description: '', displayOrder: 0, isActive: true };

export default function AdminCategories() {
  const { data, isLoading } = useGetAllCategoriesQuery();
  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();
  const categories = data?.categories || [];

  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [currentImage, setCurrentImage] = useState('');
  const fileRef = useRef(null);

  // Mobile: which tab is active
  const [activeTab, setActiveTab] = useState('list'); // 'list' | 'form'

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const buildFormData = () => {
    const fd = new FormData();
    fd.append('name', form.name);
    fd.append('description', form.description);
    fd.append('displayOrder', form.displayOrder);
    fd.append('isActive', form.isActive);
    if (imageFile) fd.append('image', imageFile);
    return fd;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('Name is required'); return; }
    try {
      const fd = buildFormData();
      if (editId) {
        await updateCategory({ id: editId, formData: fd }).unwrap();
        toast.success('Updated!');
      } else {
        await createCategory(fd).unwrap();
        toast.success('Category created!');
      }
      resetForm();
      setActiveTab('list');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed');
    }
  };

  const handleEdit = (cat) => {
    setForm({ name: cat.name, description: cat.description || '', displayOrder: cat.displayOrder || 0, isActive: cat.isActive });
    setEditId(cat._id);
    setImageFile(null);
    setImagePreview('');
    setCurrentImage(cat.image?.url || '');
    if (fileRef.current) fileRef.current.value = '';
    setActiveTab('form'); // auto-switch to form on mobile
  };

  const resetForm = () => {
    setForm(EMPTY);
    setEditId(null);
    setImageFile(null);
    setImagePreview('');
    setCurrentImage('');
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete category "${name}"?`)) return;
    try { await deleteCategory(id).unwrap(); toast.success('Deleted'); }
    catch (err) { toast.error(err?.data?.message || 'Cannot delete'); }
  };

  const previewSrc = imagePreview || currentImage;

  const FormPanel = (
    <div className="bg-surface border border-border p-4 sm:p-6">
      <h2 className="font-display text-lg sm:text-xl tracking-widest text-white mb-5">
        {editId ? 'EDIT CATEGORY' : 'ADD CATEGORY'}
      </h2>
      <form onSubmit={handleSave} className="space-y-4">

        <div>
          <label className="text-xs tracking-widest uppercase text-textSecondary block mb-2">Name *</label>
          <input
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            className="input-field w-full"
            placeholder="e.g. Snapback"
          />
        </div>

        <div>
          <label className="text-xs tracking-widest uppercase text-textSecondary block mb-2">Description</label>
          <textarea
            rows={2}
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            className="input-field resize-none w-full"
          />
        </div>

        <div>
          <label className="text-xs tracking-widest uppercase text-textSecondary block mb-2">Display Order</label>
          <input
            type="number"
            value={form.displayOrder}
            onChange={e => setForm(f => ({ ...f, displayOrder: Number(e.target.value) }))}
            className="input-field w-full"
          />
        </div>

        {/* Image upload */}
        <div>
          <label className="text-xs tracking-widest uppercase text-textSecondary block mb-2">
            Category Image {editId && currentImage && '(upload new to replace)'}
          </label>

          {previewSrc && (
            <div className="relative w-full h-32 sm:h-36 mb-3 overflow-hidden bg-surfaceHover border border-border">
              <img src={previewSrc} alt="preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => { setImageFile(null); setImagePreview(''); setCurrentImage(''); if (fileRef.current) fileRef.current.value = ''; }}
                className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 hover:bg-black transition"
              >
                Remove
              </button>
            </div>
          )}

          <div
            onClick={() => fileRef.current?.click()}
            className="border border-dashed border-border hover:border-white transition-colors cursor-pointer px-4 py-5 text-center"
          >
            <p className="text-textSecondary text-xs tracking-widest uppercase">
              {previewSrc ? 'Click to change image' : 'Click to upload image'}
            </p>
            <p className="text-textMuted text-[10px] mt-1">JPG, PNG, WEBP — recommended 800×600px</p>
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))}
            className="w-4 h-4 accent-white"
          />
          <span className="text-sm text-textSecondary">Active</span>
        </label>

        <div className="flex gap-3">
          <button type="submit" className="btn-primary text-sm flex-1 sm:flex-none">
            {editId ? 'Update' : 'Create'}
          </button>
          {editId && (
            <button
              type="button"
              onClick={() => { resetForm(); setActiveTab('list'); }}
              className="btn-secondary text-sm flex-1 sm:flex-none"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );

  const ListPanel = (
    <div className="bg-surface border border-border overflow-hidden">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h2 className="font-display text-lg sm:text-xl tracking-widest text-white">ALL CATEGORIES</h2>
        {/* Mobile: quick-add button inside list header */}
        <button
          onClick={() => { resetForm(); setActiveTab('form'); }}
          className="lg:hidden text-xs tracking-widest uppercase text-textSecondary hover:text-white transition-colors border border-border px-3 py-1.5"
        >
          + Add
        </button>
      </div>

      {isLoading ? (
        <Spinner className="py-10" />
      ) : (
        <div className="divide-y divide-border">
          {categories.map(cat => (
            <div
              key={cat._id}
              className="flex items-center px-3 sm:px-4 py-3 hover:bg-surfaceHover transition-colors gap-3"
            >
              {/* Thumbnail */}
              <div className="w-10 h-10 shrink-0 bg-surfaceHover overflow-hidden border border-border">
                {cat.image?.url
                  ? <img src={cat.image.url} alt={cat.name} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center text-textMuted text-[10px]">—</div>
                }
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-semibold truncate">{cat.name}</p>
                <p className="text-textMuted text-xs truncate">{cat.slug} · Order: {cat.displayOrder}</p>
              </div>

              {/* Status + actions */}
              <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                <span className={`hidden sm:inline text-xs font-semibold ${cat.isActive ? 'text-success' : 'text-textMuted'}`}>
                  {cat.isActive ? 'Active' : 'Hidden'}
                </span>
                {/* Mobile: colored dot instead of word */}
                <span className={`sm:hidden w-2 h-2 rounded-full ${cat.isActive ? 'bg-success' : 'bg-textMuted'}`} />

                <button
                  onClick={() => handleEdit(cat)}
                  className="text-xs text-textSecondary hover:text-white uppercase tracking-wider"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(cat._id, cat.name)}
                  className="text-xs text-textMuted hover:text-sale uppercase tracking-wider"
                >
                  Del
                </button>
              </div>
            </div>
          ))}
          {!categories.length && (
            <p className="text-textMuted text-sm p-6 text-center">No categories yet</p>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="font-display text-2xl sm:text-4xl tracking-widest text-white mb-6 sm:mb-8">
        CATEGORIES
      </h1>

      {/* ── Mobile tab switcher ── */}
      <div className="flex lg:hidden mb-5 border border-border">
        <button
          onClick={() => setActiveTab('list')}
          className={`flex-1 py-2.5 text-xs tracking-widest uppercase font-medium transition-colors ${
            activeTab === 'list' ? 'bg-white text-black' : 'text-textSecondary hover:text-white'
          }`}
        >
          All Categories
        </button>
        <button
          onClick={() => { resetForm(); setActiveTab('form'); }}
          className={`flex-1 py-2.5 text-xs tracking-widest uppercase font-medium transition-colors ${
            activeTab === 'form' ? 'bg-white text-black' : 'text-textSecondary hover:text-white'
          }`}
        >
          {editId ? 'Edit' : '+ Add'}
        </button>
      </div>

      {/* ── Desktop: side-by-side grid ── */}
      <div className="hidden lg:grid grid-cols-2 gap-8">
        {FormPanel}
        {ListPanel}
      </div>

      {/* ── Mobile: tab-based single panel ── */}
      <div className="lg:hidden">
        {activeTab === 'form' ? FormPanel : ListPanel}
      </div>
    </div>
  );
}
