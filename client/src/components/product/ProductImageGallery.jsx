import { useState, useRef } from 'react';

export default function ProductImageGallery({ images = [], name }) {
  const [active, setActive] = useState(0);
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  if (!images.length) return (
    <div className="aspect-square bg-surface flex items-center justify-center">
      <span className="text-textMuted">No image</span>
    </div>
  );

  const goNext = () => setActive(i => (i + 1) % images.length);
  const goPrev = () => setActive(i => (i - 1 + images.length) % images.length);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = null;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 40) {
      diff > 0 ? goNext() : goPrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Main image — swipeable */}
      <div
        className="relative aspect-square bg-surface overflow-hidden select-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={images[active]?.url}
          alt={name}
          className="w-full h-full object-cover transition-all duration-300"
          draggable={false}
        />

        {/* Dot indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  active === i ? 'bg-white w-4' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        )}

        {/* Left / Right arrows for desktop */}
        {images.length > 1 && (
          <>
            <button
              onClick={goPrev}
              className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/80 text-white items-center justify-center transition-colors"
              aria-label="Previous image"
            >‹</button>
            <button
              onClick={goNext}
              className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/80 text-white items-center justify-center transition-colors"
              aria-label="Next image"
            >›</button>
          </>
        )}
      </div>

      {/* Thumbnails — scrollable, always visible */}
      {images.length > 1 && (
        <div
          className="flex gap-2 overflow-x-auto scroll-smooth"
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
      )}
    </div>
  );
}