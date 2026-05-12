import { Link } from 'react-router-dom';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useGetHeroBannerQuery } from '../../store/api/heroBannerApi';

export default function HeroBanner() {
  const { data, isLoading } = useGetHeroBannerQuery();

  const slides = data?.slides ?? [];
  const slideDuration = data?.slideDuration ?? 4500;

  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState(null);

  // Reset slide index if slides change (e.g. admin removes one)
  useEffect(() => {
    setCurrent(0);
    setPrev(null);
  }, [slides.length]);

  // Auto-advance
  useEffect(() => {
    if (slides.length < 2) return;
    const timer = setInterval(() => {
      setPrev(current);
      setCurrent(c => (c + 1) % slides.length);
      setTimeout(() => setPrev(null), 1000);
    }, slideDuration);
    return () => clearInterval(timer);
  }, [current, slides.length, slideDuration]);

  const goTo = (idx) => {
    if (idx === current) return;
    setPrev(current);
    setCurrent(idx);
    setTimeout(() => setPrev(null), 1000);
  };

  // ── Loading skeleton ─────────────────────────────────────────
  if (isLoading || slides.length === 0) {
    return (
      <section
        className="relative w-full overflow-hidden bg-[#0a0a0a]"
        style={{
          height: '100vh',
          minHeight: '600px',
          marginTop: 'calc(-1 * var(--nav-h, 60px))',
          paddingTop: 'var(--nav-h, 60px)',
        }}
      />
    );
  }

  const slide = slides[current];

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        height: '100vh',
        minHeight: '600px',
        marginTop: 'calc(-1 * var(--nav-h, 80px))',
        paddingTop: 'var(--nav-h, 60px)',
      }}
    >
      {/* ── Background image slides ── */}
      {slides.map((s, i) => (
        <div
          key={s._id}
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${s.image?.url})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
            transform: i === current ? 'scale(1.04)' : 'scale(1)',
            transition: i === current
              ? 'opacity 1.2s ease, transform 6s ease'
              : 'opacity 1.2s ease, transform 1s ease',
            opacity: i === current ? 1 : (i === prev ? 0 : 0),
            zIndex: i === current ? 1 : (i === prev ? 0 : -1),
          }}
        />
      ))}

      {/* ── Gradient overlays ── */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.0) 35%, rgba(0,0,0,0.72) 100%)',
        }}
      />
      <div
        className="absolute inset-0 z-10"
        style={{
          background:
            'linear-gradient(to right, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.15) 50%, transparent 100%)',
        }}
      />

      {/* ── Content (driven by current slide) ── */}
      <div className="relative z-20 h-full flex flex-col justify-end px-5 md:px-10 pb-[15vh]">
        <div className="max-w-7xl">

          {/* Eyebrow */}
          {slide.eyebrow && (
            <p
              className="font-condensed text-xs md:text-sm tracking-[0.5em] mb-4 letter"
              style={{ animationDelay: '0.2s', color: slide.eyebrowColor || '#C8F135' }}
            >
              {slide.eyebrow}
            </p>
          )}

          {/* Headline — letter-by-letter animation */}
          {slide.headline && (
            <h1
              className="font-display leading-[0.85] tracking-tight"
              style={{ fontSize: 'clamp(72px, 13vw, 180px)', color: slide.headlineColor || '#F5F0E8' }}
            >
              {slide.headline.split('').map((c, i) => (
                <span key={i} className="letter" style={{ animationDelay: `${0.4 + i * 0.06}s` }}>
                  {c === ' ' ? '\u00A0' : c}
                </span>
              ))}
            </h1>
          )}

          {/* Sub-headline */}
          {slide.subHeadline && (
            <p
              className="font-display leading-[0.85] tracking-tight letter"
              style={{
                fontSize: 'clamp(36px, 5vw, 90px)',
                color: slide.subHeadlineColor || 'rgba(245,240,232,0.3)',
                animationDelay: '1.0s',
              }}
            >
              {slide.subHeadline}
            </p>
          )}

          {/* Body text */}
          {slide.bodyText && (
            <p
              className="italic font-body text-base md:text-lg mt-5 letter"
              style={{ animationDelay: '1.1s', color: slide.bodyTextColor || '#aaa' }}
            >
              <span style={{ color: slide.accentColor || '#C8F135' }}>CRAZY FOR CAPS</span><br />
              {slide.bodyText}
            </p>
          )}

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-8 letter" style={{ animationDelay: '1.3s' }}>
            {slide.primaryBtnLabel && slide.primaryBtnLink && (
              <Link
                to={slide.primaryBtnLink}
                data-cursor="hover"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 font-condensed tracking-[0.25em] text-sm uppercase transition-colors duration-300"
                style={{
                  background: slide.primaryBtnBg || '#C8F135',
                  color: slide.primaryBtnText || '#0a0a0a',
                  border: `2px solid ${slide.primaryBtnBg || '#C8F135'}`,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = slide.primaryBtnBg || '#C8F135';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = slide.primaryBtnBg || '#C8F135';
                  e.currentTarget.style.color = slide.primaryBtnText || '#0a0a0a';
                }}
              >
                {slide.primaryBtnLabel} <ArrowRight className="w-4 h-4" />
              </Link>
            )}

            {slide.secondaryBtnLabel && slide.secondaryBtnLink && (
              <Link
                to={slide.secondaryBtnLink}
                data-cursor="hover"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 font-condensed tracking-[0.25em] text-sm uppercase transition-colors duration-300"
                style={{
                  background: 'transparent',
                  color: '#F5F0E8',
                  border: '2px solid rgba(245,240,232,0.3)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#F5F0E8';
                  e.currentTarget.style.color = '#0a0a0a';
                  e.currentTarget.style.borderColor = '#F5F0E8';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#F5F0E8';
                  e.currentTarget.style.borderColor = 'rgba(245,240,232,0.3)';
                }}
              >
                {slide.secondaryBtnLabel} <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ── Dot indicators ── */}
      {slides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              style={{
                width: i === current ? '28px' : '8px',
                height: '8px',
                borderRadius: '4px',
                background: i === current
                  ? (slide.accentColor || '#C8F135')
                  : 'rgba(255,255,255,0.35)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.4s ease',
                padding: 0,
              }}
            />
          ))}
        </div>
      )}

      {/* ── Side label ── */}
      <div className="absolute right-5 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center gap-3 z-20">
        <span className="vertical font-condensed text-[10px] tracking-[0.5em] uppercase" style={{ color: '#666' }}>
          EST · 2024 · INDIA
        </span>
      </div>

      {/* ── Scroll indicator ── */}
      <div className="absolute bottom-4 left-5 md:left-10 z-20 flex items-center gap-3" style={{ color: '#888' }}>
        <ArrowDown className="w-4 h-4 animate-bounce" />
        <span className="font-condensed text-xs tracking-[0.4em] uppercase">Scroll</span>
      </div>

      {/* ── Corner tag ── */}
      <div className="absolute bottom-4 right-5 md:right-10 z-20 font-condensed text-xs tracking-[0.3em]" style={{ color: '#666' }}>
        {String(current + 1).padStart(3, '0')} / DROP — 25
      </div>
    </section>
  );
}