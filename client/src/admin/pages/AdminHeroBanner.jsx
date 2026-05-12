import { useState, useRef } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  Plus, Trash2, GripVertical, Eye, EyeOff,
  ChevronDown, ChevronUp, Settings, Image as ImageIcon, Save,
  ChevronUp as MoveUp, ChevronDown as MoveDown,
} from 'lucide-react';

import {
  useAdminGetHeroBannerQuery,
  useAddSlideMutation,
  useUpdateSlideMutation,
  useDeleteSlideMutation,
  useReorderSlidesMutation,
  useUpdateBannerSettingsMutation,
} from '../../store/api/heroBannerApi';

const BASE = import.meta.env.VITE_API_BASE_URL || '/api/v1';

const EMPTY_SLIDE = {
  image: { url: '', publicId: '' },
  eyebrow: '— WEAR THE',
  headline: 'C U L T U R E',
  subHeadline: 'CAPZYY',
  bodyText: "India's premium cap brand. Built loud. Worn louder.",
  eyebrowColor: '#C8F135',
  headlineColor: '#F5F0E8',
  subHeadlineColor: 'rgba(245,240,232,0.3)',
  bodyTextColor: '#aaa',
  accentColor: '#C8F135',
  primaryBtnLabel: 'Shop Now',
  primaryBtnLink: '/shop',
  primaryBtnBg: '#C8F135',
  primaryBtnText: '#0a0a0a',
  secondaryBtnLabel: 'New Drops',
  secondaryBtnLink: '/category/new-arrivals',
  isActive: true,
  order: 0,
};

const Field = ({ label, value, onChange, type = 'text', placeholder = '' }) => (
  <div>
    <label className="text-xs tracking-widest uppercase text-textSecondary block mb-1.5">{label}</label>
    <input
      type={type}
      value={value ?? ''}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="input-field w-full"
    />
  </div>
);

const ColorField = ({ label, value, onChange }) => (
  <div>
    <label className="text-xs tracking-widest uppercase text-textSecondary block mb-1.5">{label}</label>
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={value?.startsWith('#') ? value : '#ffffff'}
        onChange={e => onChange(e.target.value)}
        className="w-10 h-10 rounded cursor-pointer border border-border bg-transparent flex-shrink-0"
      />
      <input
        type="text"
        value={value ?? ''}
        onChange={e => onChange(e.target.value)}
        className="input-field flex-1 min-w-0"
        placeholder="e.g. #C8F135 or rgba(…)"
      />
    </div>
  </div>
);

function EditForm({ draft, setDraft, onSave, onCancel, uploading, onUpload }) {
  return (
    <div className="mt-4 border-t border-border pt-4 space-y-5">
      {/* Image */}
      <div>
        <label className="text-xs tracking-widest uppercase text-textSecondary block mb-2">Slide Image *</label>
        <div className="flex flex-wrap items-center gap-3">
          {draft.image?.url
            ? <img src={draft.image.url} className="w-24 h-16 object-cover border border-border rounded" alt="preview" />
            : (
              <div className="w-24 h-16 border border-dashed border-border flex items-center justify-center text-textMuted rounded">
                <ImageIcon className="w-5 h-5" />
              </div>
            )
          }
          <label className="btn-secondary cursor-pointer text-sm py-2.5 px-4">
            {uploading ? 'Uploading…' : 'Upload Image'}
            <input type="file" accept="image/*" onChange={onUpload} className="hidden" />
          </label>
        </div>
      </div>

      {/* Text fields */}
      <div className="grid grid-cols-1 gap-4">
        <Field label="Eyebrow text" value={draft.eyebrow} onChange={v => setDraft(d => ({ ...d, eyebrow: v }))} placeholder="— WEAR THE" />
        <Field label="Headline" value={draft.headline} onChange={v => setDraft(d => ({ ...d, headline: v }))} placeholder="C U L T U R E" />
        <Field label="Sub-headline" value={draft.subHeadline} onChange={v => setDraft(d => ({ ...d, subHeadline: v }))} placeholder="CAPZYY" />
        <div>
          <label className="text-xs tracking-widest uppercase text-textSecondary block mb-1.5">Body Text</label>
          <textarea
            value={draft.bodyText ?? ''}
            onChange={e => setDraft(d => ({ ...d, bodyText: e.target.value }))}
            rows={3}
            className="input-field w-full resize-none"
            placeholder="India's premium cap brand…"
          />
        </div>
      </div>

      {/* Colors */}
      <div>
        <p className="text-xs tracking-widest uppercase text-textSecondary mb-3">Colors</p>
        <div className="grid grid-cols-1 gap-4">
          <ColorField label="Eyebrow color" value={draft.eyebrowColor} onChange={v => setDraft(d => ({ ...d, eyebrowColor: v }))} />
          <ColorField label="Headline color" value={draft.headlineColor} onChange={v => setDraft(d => ({ ...d, headlineColor: v }))} />
          <ColorField label="Sub-headline color" value={draft.subHeadlineColor} onChange={v => setDraft(d => ({ ...d, subHeadlineColor: v }))} />
          <ColorField label="Body text color" value={draft.bodyTextColor} onChange={v => setDraft(d => ({ ...d, bodyTextColor: v }))} />
          <ColorField label="Accent color" value={draft.accentColor} onChange={v => setDraft(d => ({ ...d, accentColor: v }))} />
        </div>
      </div>

      {/* Primary Button */}
      <div>
        <p className="text-xs tracking-widest uppercase text-textSecondary mb-3">Primary Button</p>
        <div className="grid grid-cols-1 gap-4">
          <Field label="Label" value={draft.primaryBtnLabel} onChange={v => setDraft(d => ({ ...d, primaryBtnLabel: v }))} placeholder="Shop Now" />
          <Field label="Link" value={draft.primaryBtnLink} onChange={v => setDraft(d => ({ ...d, primaryBtnLink: v }))} placeholder="/shop" />
          <ColorField label="Background" value={draft.primaryBtnBg} onChange={v => setDraft(d => ({ ...d, primaryBtnBg: v }))} />
          <ColorField label="Text color" value={draft.primaryBtnText} onChange={v => setDraft(d => ({ ...d, primaryBtnText: v }))} />
        </div>
      </div>

      {/* Secondary Button */}
      <div>
        <p className="text-xs tracking-widest uppercase text-textSecondary mb-3">Secondary Button</p>
        <div className="grid grid-cols-1 gap-4">
          <Field label="Label" value={draft.secondaryBtnLabel} onChange={v => setDraft(d => ({ ...d, secondaryBtnLabel: v }))} placeholder="New Drops" />
          <Field label="Link" value={draft.secondaryBtnLink} onChange={v => setDraft(d => ({ ...d, secondaryBtnLink: v }))} placeholder="/category/new-arrivals" />
        </div>
      </div>

      {/* Visibility */}
      <label className="flex items-center gap-3 cursor-pointer py-1">
        <input
          type="checkbox"
          checked={draft.isActive ?? true}
          onChange={e => setDraft(d => ({ ...d, isActive: e.target.checked }))}
          className="w-5 h-5 accent-white flex-shrink-0"
        />
        <span className="text-sm text-textSecondary">Visible on site</span>
      </label>

      {/* Actions */}
      <div className="flex flex-col gap-2 pt-2">
        <button onClick={onSave} className="btn-primary flex items-center justify-center gap-2 text-sm w-full py-3">
          <Save className="w-4 h-4" /> Save Slide
        </button>
        <button onClick={onCancel} className="btn-secondary text-sm w-full py-3 text-center">Cancel</button>
      </div>
    </div>
  );
}

export default function AdminHeroBanner() {
  const { data, isLoading, isError } = useAdminGetHeroBannerQuery();
  const [addSlide] = useAddSlideMutation();
  const [updateSlide] = useUpdateSlideMutation();
  const [deleteSlide] = useDeleteSlideMutation();
  const [reorderSlides] = useReorderSlidesMutation();
  const [updateSettings] = useUpdateBannerSettingsMutation();

  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState({});
  const [expanded, setExpanded] = useState({});
  const [uploading, setUploading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [draftDuration, setDraftDuration] = useState('');

  const dragIdx = useRef(null);

  const slides = data ? [...data.slides].sort((a, b) => a.order - b.order) : [];

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    try {
      const fd = new FormData();
      files.forEach(f => fd.append('images', f));
      const { data: res } = await axios.post(`${BASE}/media/upload`, fd, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const { url, publicId } = res.files[0];
      setDraft(d => ({ ...d, image: { url, publicId } }));
      toast.success('Image uploaded!');
    } catch {
      toast.error('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const startEdit = (slide) => {
    setEditing(slide._id || 'new');
    setDraft({ ...slide });
    setExpanded(x => ({ ...x, [slide._id || 'new']: true }));
  };

  const cancelEdit = () => { setEditing(null); setDraft({}); };

  const handleSave = async () => {
    if (!draft.image?.url) { toast.error('Please upload an image'); return; }
    try {
      if (editing === 'new') {
        await addSlide(draft).unwrap();
        toast.success('Slide added!');
      } else {
        await updateSlide({ slideId: editing, ...draft }).unwrap();
        toast.success('Slide updated!');
      }
      cancelEdit();
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to save slide');
    }
  };

  const handleDelete = async (slideId) => {
    if (!window.confirm('Delete this slide?')) return;
    try {
      await deleteSlide(slideId).unwrap();
      toast.success('Slide deleted');
    } catch {
      toast.error('Delete failed');
    }
  };

  const toggleActive = async (slide) => {
    try {
      await updateSlide({ slideId: slide._id, isActive: !slide.isActive }).unwrap();
      toast.success(slide.isActive ? 'Slide hidden' : 'Slide visible');
    } catch {
      toast.error('Failed to update');
    }
  };

  // Touch-friendly reorder via up/down buttons (replaces drag-only on mobile)
  const moveSlide = async (idx, direction) => {
    const reordered = [...slides];
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= reordered.length) return;
    [reordered[idx], reordered[targetIdx]] = [reordered[targetIdx], reordered[idx]];
    try {
      await reorderSlides(reordered.map(s => s._id)).unwrap();
    } catch {
      toast.error('Reorder failed');
    }
  };

  // Desktop drag-and-drop kept intact
  const onDragStart = (idx) => { dragIdx.current = idx; };
  const onDragOver = (e) => e.preventDefault();
  const onDrop = async (idx) => {
    if (dragIdx.current === null || dragIdx.current === idx) return;
    const reordered = [...slides];
    const [moved] = reordered.splice(dragIdx.current, 1);
    reordered.splice(idx, 0, moved);
    dragIdx.current = null;
    try {
      await reorderSlides(reordered.map(s => s._id)).unwrap();
    } catch {
      toast.error('Reorder failed');
    }
  };

  const handleSaveSettings = async () => {
    try {
      await updateSettings({ slideDuration: Number(draftDuration) }).unwrap();
      toast.success('Settings saved!');
      setShowSettings(false);
    } catch (err) {
      toast.error(err?.data?.message || 'Failed');
    }
  };

  if (isLoading) return <div className="p-4 text-textSecondary">Loading banner…</div>;
  if (isError) return <div className="p-4 text-sale">Failed to load banner data.</div>;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-6">
        <h1 className="font-display text-xl sm:text-2xl lg:text-4xl tracking-widest text-white leading-tight">
          HERO BANNER
        </h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setShowSettings(s => !s); setDraftDuration(data?.slideDuration ?? 4500); }}
            className="btn-secondary flex items-center gap-1.5 text-xs sm:text-sm px-3 py-2.5 min-h-[40px]"
            aria-label="Settings"
          >
            <Settings className="w-4 h-4 flex-shrink-0" />
            <span className="hidden sm:inline">Settings</span>
          </button>
          <button
            onClick={() => startEdit({ ...EMPTY_SLIDE, _id: undefined })}
            className="btn-primary flex items-center gap-1.5 text-xs sm:text-sm px-3 py-2.5 min-h-[40px]"
          >
            <Plus className="w-4 h-4 flex-shrink-0" />
            <span>Add Slide</span>
          </button>
        </div>
      </div>

      {/* Settings panel */}
      {showSettings && (
        <div className="mb-5 p-4 border border-border bg-surface rounded space-y-4">
          <p className="text-xs tracking-widest uppercase text-textSecondary">Global Settings</p>
          <div className="space-y-3">
            <div>
              <label className="text-xs tracking-widest uppercase text-textSecondary block mb-1.5">
                Slide Duration (ms)
              </label>
              <input
                type="number"
                min={1000}
                max={15000}
                step={500}
                value={draftDuration}
                onChange={e => setDraftDuration(e.target.value)}
                className="input-field w-full"
              />
              <p className="text-textMuted text-xs mt-1">Min 1000 ms · Max 15 000 ms</p>
            </div>
            <button onClick={handleSaveSettings} className="btn-primary text-sm w-full sm:w-auto py-2.5 px-6">
              Save
            </button>
          </div>
        </div>
      )}

      {/* Add new slide inline form */}
      {editing === 'new' && (
        <div className="mb-5 p-4 border border-dashed border-border bg-surface rounded">
          <p className="text-xs tracking-widest uppercase text-textSecondary">New Slide</p>
          <EditForm
            draft={draft}
            setDraft={setDraft}
            onSave={handleSave}
            onCancel={cancelEdit}
            uploading={uploading}
            onUpload={handleUpload}
          />
        </div>
      )}

      {slides.length === 0 && editing !== 'new' && (
        <p className="text-textMuted text-sm">No slides yet. Click "Add Slide" to get started.</p>
      )}

      {/* Slide cards */}
      <div className="space-y-3">
        {slides.map((slide, idx) => (
          <div
            key={slide._id}
            draggable
            onDragStart={() => onDragStart(idx)}
            onDragOver={onDragOver}
            onDrop={() => onDrop(idx)}
            className="border border-border bg-surface rounded overflow-hidden"
          >
            {/* Card header */}
            <div className="flex items-center gap-2 sm:gap-3 p-3">
              {/* Drag handle — desktop only */}
              <GripVertical className="hidden sm:block w-4 h-4 text-textMuted cursor-grab flex-shrink-0" />

              {/* Mobile reorder buttons */}
              <div className="flex flex-col gap-0.5 sm:hidden flex-shrink-0">
                <button
                  onClick={() => moveSlide(idx, -1)}
                  disabled={idx === 0}
                  className="p-1 text-textMuted hover:text-white disabled:opacity-25 transition-colors"
                  aria-label="Move up"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => moveSlide(idx, 1)}
                  disabled={idx === slides.length - 1}
                  className="p-1 text-textMuted hover:text-white disabled:opacity-25 transition-colors"
                  aria-label="Move down"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Thumbnail */}
              <img
                src={slide.image?.url}
                alt={slide.headline}
                className="w-12 h-9 sm:w-16 sm:h-11 object-cover flex-shrink-0 border border-border rounded"
              />

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs sm:text-sm font-medium truncate leading-snug">
                  {slide.headline || '(no headline)'}
                </p>
                {/* Status badge inline on mobile, separate on desktop */}
                <div className="flex items-center gap-2 mt-0.5">
                  <span
                    className="text-[10px] tracking-widest px-1.5 py-0.5 rounded"
                    style={{
                      background: slide.isActive ? 'rgba(200,241,53,0.12)' : 'rgba(255,255,255,0.06)',
                      color: slide.isActive ? '#C8F135' : '#666',
                    }}
                  >
                    {slide.isActive ? 'LIVE' : 'HIDDEN'}
                  </span>
                  <p className="text-textMuted text-[10px] truncate hidden sm:block">{slide.bodyText}</p>
                </div>
              </div>

              {/* Action buttons — larger tap targets on mobile */}
              <div className="flex items-center gap-0.5 flex-shrink-0">
                <button
                  onClick={() => toggleActive(slide)}
                  className="p-2 hover:text-white text-textMuted transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
                  title={slide.isActive ? 'Hide slide' : 'Show slide'}
                  aria-label={slide.isActive ? 'Hide slide' : 'Show slide'}
                >
                  {slide.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => editing === slide._id ? cancelEdit() : startEdit(slide)}
                  className="p-2 hover:text-white text-textMuted transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
                  title="Edit"
                  aria-label="Edit slide"
                >
                  {editing === slide._id
                    ? <ChevronUp className="w-4 h-4" />
                    : <ChevronDown className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => handleDelete(slide._id)}
                  className="p-2 hover:text-sale text-textMuted transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
                  title="Delete"
                  aria-label="Delete slide"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Inline edit form */}
            {editing === slide._id && (
              <div className="px-3 pb-4 sm:px-4 sm:pb-5">
                <EditForm
                  draft={draft}
                  setDraft={setDraft}
                  onSave={handleSave}
                  onCancel={cancelEdit}
                  uploading={uploading}
                  onUpload={handleUpload}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <p className="text-textMuted text-xs mt-5 leading-relaxed">
        <span className="hidden sm:inline">Drag cards to reorder slides. </span>
        <span className="sm:hidden">Use ↑↓ arrows to reorder slides. </span>
        Changes are saved immediately.
      </p>
    </div>
  );
}