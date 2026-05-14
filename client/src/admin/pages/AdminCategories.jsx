import { useState, useRef, useCallback } from 'react';
import { useGetAllCategoriesQuery, useCreateCategoryMutation, useUpdateCategoryMutation, useDeleteCategoryMutation } from '../../store/api/categoriesApi';
import toast from 'react-hot-toast';
import Spinner from '../../components/common/Spinner';

const EMPTY = { name: '', description: '', displayOrder: 0, isActive: true };

function FormPanel({ form, setForm, editId, imageFile, setImageFile, imagePreview, setImagePreview, currentImage, setCurrentImage, fileRef, handleSave, handleCancel, isSubmitting }) {
  const previewSrc = imagePreview || currentImage;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview('');
    setCurrentImage('');
    if (fileRef.current) fileRef.current.value = '';
  };

  // FIX: use a dedicated toggle handler instead of relying on e.target.checked
  // Mobile browsers (especially Android WebView/Chrome) sometimes fire the
  // onChange event with a stale checked value when the checkbox is inside a
  // component that re-renders. Reading the current form state and flipping it
  // directly avoids the stale-event bug entirely.
  const handleActiveToggle = useCallback(() => {
    setForm(f => ({ ...f, isActive: !f.isActive }));
  }, [setForm]);

  return (
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
            value={form.displayOrder === 0 ? '' : form.displayOrder}
            placeholder="0"
            onChange={e => setForm(f => ({ ...f, displayOrder: e.target.value === '' ? 0 : Number(e.target.value) }))}
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
                onClick={handleRemoveImage}
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

        {/* FIX: checkbox rendered as a styled toggle button div instead of a native
            checkbox input. Native checkboxes on mobile (especially iOS Safari) have
            a known tap-target and event-propagation bug inside forms — the onChange
            fires but the visual state doesn't update, or vice versa, because the
            browser's native checkbox handling interferes with React's synthetic
            event system on touch events.
            A div with onClick + visual state driven purely by form.isActive avoids
            all of this and works identically on desktop and mobile. */}
        <div className="flex items-center gap-3">
          <div
            role="checkbox"
            aria-checked={form.isActive}
            tabIndex={0}
            onClick={handleActiveToggle}
            onKeyDown={e => (e.key === ' ' || e.key === 'Enter') && handleActiveToggle()}
            className={`
              relative w-11 h-6 rounded-full cursor-pointer transition-colors duration-200 flex-shrink-0
              ${form.isActive ? 'bg-white' : 'bg-border'}
            `}
          >
            <span className={`
              absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-black transition-transform duration-200
              ${form.isActive ? 'translate-x-5' : 'translate-x-0'}
            `} />
          </div>
          <span
            onClick={handleActiveToggle}
            className="text-sm text-textSecondary cursor-pointer select-none"
          >
            {form.isActive ? 'Active' : 'Hidden'}
          </span>
        </div>

        <div className="flex gap-3 pt-1">
          <button type="submit" disabled={isSubmitting} className="btn-primary text-sm flex-1 sm:flex-none disabled:opacity-50">
            {isSubmitting ? 'Saving...' : editId ? 'Update' : 'Create'}
          </button>
          {editId && (
            <button
              type="button"
              onClick={handleCancel}
              className="btn-secondary text-sm flex-1 sm:flex-none"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileRef = useRef(null);

  const [activeTab, setActiveTab] = useState('list');

  const buildFormData = () => {
    const fd = new FormData();
    fd.append('name', form.name);
    fd.append('description', form.description);
    fd.append('displayOrder', form.displayOrder);
    // FIX: send '1'/'0' instead of true/false — FormData converts everything to
    // strings, and 'true'/'false' can be parsed inconsistently across backends.
    // '1'/'0' is unambiguous: parse with Number() or compare with === '1'.
    fd.append('isActive', form.isActive ? '1' : '0');
    if (imageFile) fd.append('image', imageFile);
    return fd;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('Name is required'); return; }
    setIsSubmitting(true);
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
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (cat) => {
    setForm({ name: cat.name, description: cat.description || '', displayOrder: cat.displayOrder || 0, isActive: cat.isActive });
    setEditId(cat._id);
    setImageFile(null);
    setImagePreview('');
    setCurrentImage(cat.image?.url || '');
    if (fileRef.current) fileRef.current.value = '';
    setActiveTab('form');
  };

  const resetForm = () => {
    setForm(EMPTY);
    setEditId(null);
    setImageFile(null);
    setImagePreview('');
    setCurrentImage('');
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleCancel = () => {
    resetForm();
    setActiveTab('list');
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete category "${name}"?`)) return;
    try { await deleteCategory(id).unwrap(); toast.success('Deleted'); }
    catch (err) { toast.error(err?.data?.message || 'Cannot delete'); }
  };

  const formPanelProps = {
    form, setForm, editId,
    imageFile, setImageFile,
    imagePreview, setImagePreview,
    currentImage, setCurrentImage,
    fileRef,
    handleSave,
    handleCancel,
    isSubmitting,
  };

  const ListPanel = (
    <div className="bg-surface border border-border overflow-hidden">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h2 className="font-display text-lg sm:text-xl tracking-widest text-white">ALL CATEGORIES</h2>
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
              <div className="w-10 h-10 shrink-0 bg-surfaceHover overflow-hidden border border-border">
                {cat.image?.url
                  ? <img src={cat.image.url} alt={cat.name} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center text-textMuted text-[10px]">—</div>
                }
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-semibold truncate">{cat.name}</p>
                <p className="text-textMuted text-xs truncate">{cat.slug} · Order: {cat.displayOrder}</p>
              </div>

              <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                <span className={`hidden sm:inline text-xs font-semibold ${cat.isActive ? 'text-success' : 'text-textMuted'}`}>
                  {cat.isActive ? 'Active' : 'Hidden'}
                </span>
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
          onClick={() => { if (activeTab !== 'form') resetForm(); setActiveTab('form'); }}
          className={`flex-1 py-2.5 text-xs tracking-widest uppercase font-medium transition-colors ${
            activeTab === 'form' ? 'bg-white text-black' : 'text-textSecondary hover:text-white'
          }`}
        >
          {editId ? 'Edit' : '+ Add'}
        </button>
      </div>

      <div className="hidden lg:grid grid-cols-2 gap-8">
        <FormPanel {...formPanelProps} />
        {ListPanel}
      </div>

      <div className="lg:hidden">
        {activeTab === 'form' ? <FormPanel {...formPanelProps} /> : ListPanel}
      </div>
    </div>
  );
}