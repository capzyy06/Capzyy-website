import { useState } from 'react';

export default function ProductImageGallery({ images = [], name }) {
  const [active, setActive] = useState(0);

  if (!images.length) return (
    <div className="aspect-square bg-surface flex items-center justify-center">
      <span className="text-textMuted">No image</span>
    </div>
  );

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto md:max-h-[600px]">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`flex-shrink-0 w-16 h-16 border-2 overflow-hidden transition-colors ${active === i ? 'border-white' : 'border-border hover:border-textSecondary'}`}
            >
              <img src={img.url} alt={`${name} view ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
      {/* Main image */}
      <div className="flex-1 aspect-square bg-surface overflow-hidden">
        <img
          src={images[active]?.url}
          alt={name}
          className="w-full h-full object-cover transition-all duration-300"
        />
      </div>
    </div>
  );
}
