import { useState, useRef } from 'react';

export default function ProductImageGallery({ images = [], name }) {
  const [active, setActive] = useState(0);
  const thumbsRef = useRef(null);

  if (!images.length) return (
    <div className="aspect-square bg-surface flex items-center justify-center">
      <span className="text-textMuted">No image</span>
    </div>
  );

  const scrollThumbs = (dir) => {
    if (thumbsRef.current) {
      thumbsRef.current.scrollBy({ left: dir * 80, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div className="aspect-square bg-surface overflow-hidden">
        <img
          src={images[active]?.url}
          alt={name}
          className="w-full h-full object-cover transition-all duration-300"
        />
      </div>

      {/* Thumbnails — horizontally scrollable on mobile, always visible */}
      {images.length > 1 && (
        <div className="relative">
          {/* Left arrow */}
          <button
            onClick={() => scrollThumbs(-1)}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-7 h-7 bg-black/70 flex items-center justify-center text-white hover:bg-black transition-colors md:hidden"
            aria-label="Scroll left"
          >
            ‹
          </button>

          <div
            ref={thumbsRef}
            className="flex gap-2 overflow-x-auto scrollbar-hide px-8 md:px-0 scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`flex-shrink-0 w-16 h-16 border-2 overflow-hidden transition-colors ${
                  active === i ? 'border-white' : 'border-border hover:border-textSecondary'
                }`}
              >
                <img src={img.url} alt={`${name} view ${i + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          {/* Right arrow */}
          <button
            onClick={() => scrollThumbs(1)}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-7 h-7 bg-black/70 flex items-center justify-center text-white hover:bg-black transition-colors md:hidden"
            aria-label="Scroll right"
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}