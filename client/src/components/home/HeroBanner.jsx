import { Link } from 'react-router-dom';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';

import hero1 from '../../assets/hero1.png';
import hero2 from '../../assets/hero2.jpeg';
import hero3 from '../../assets/hero3.jpeg';
import hero4 from '../../assets/hero4.jpeg';
import hero5 from '../../assets/hero5.jpeg';

const BG_IMAGES = [hero1, hero2, hero3, hero4, hero5];

const HEADLINE = 'C U L T U R E';
const SLIDE_DURATION = 4500;

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setPrev(current);
      setCurrent(c => (c + 1) % BG_IMAGES.length);
      setTimeout(() => setPrev(null), 1000);
    }, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, [current]);

  const goTo = (idx) => {
    if (idx === current) return;
    setPrev(current);
    setCurrent(idx);
    setTimeout(() => setPrev(null), 1000);
  };

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        height: '100vh',
        minHeight: '600px',
        marginTop: 'calc(-1 * var(--nav-h, 60px))',
        paddingTop: 'var(--nav-h, 60px)',
      }}
    >
      {/* ── Background image slides ── */}
      {BG_IMAGES.map((src, i) => (
        <div
          key={i}
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${src})`,
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

      {/* ── Lighter overlays — images stay clearly visible ── */}
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

      {/* ── Content ── */}
      <div className="relative z-20 h-full flex flex-col justify-end px-5 md:px-10 pb-[15vh]">
        <div className="max-w-7xl">

          <p
            className="font-condensed text-xs md:text-sm tracking-[0.5em] mb-4 letter"
            style={{ animationDelay: '0.2s', color: '#C8F135' }}
          >
            — WEAR THE
          </p>

          <h1
            className="font-display leading-[0.85] tracking-tight"
            style={{ fontSize: 'clamp(72px, 13vw, 180px)', color: '#F5F0E8' }}
          >
            {HEADLINE.split('').map((c, i) => (
              <span key={i} className="letter" style={{ animationDelay: `${0.4 + i * 0.06}s` }}>
                {c === ' ' ? '\u00A0' : c}
              </span>
            ))}
          </h1>

          <p
            className="font-display leading-[0.85] tracking-tight letter"
            style={{ fontSize: 'clamp(36px, 5vw, 90px)', color: 'rgba(245,240,232,0.3)', animationDelay: '1.0s' }}
          >
            CAPZYY
          </p>

          <p
            className="italic font-body text-base md:text-lg mt-5 letter"
            style={{ animationDelay: '1.1s', color: '#aaa' }}
          >
            India's premium cap brand. Built loud. Worn louder.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mt-8 letter" style={{ animationDelay: '1.3s' }}>
            <Link
              to="/shop"
              data-cursor="hover"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 font-condensed tracking-[0.25em] text-sm uppercase transition-colors duration-300"
              style={{ background: '#C8F135', color: '#0a0a0a', border: '2px solid #C8F135' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#C8F135'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#C8F135'; e.currentTarget.style.color = '#0a0a0a'; }}
            >
              Shop Now <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/category/new-arrivals"
              data-cursor="hover"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 font-condensed tracking-[0.25em] text-sm uppercase transition-colors duration-300"
              style={{ background: 'transparent', color: '#F5F0E8', border: '2px solid rgba(245,240,232,0.3)' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#F5F0E8'; e.currentTarget.style.color = '#0a0a0a'; e.currentTarget.style.borderColor = '#F5F0E8'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#F5F0E8'; e.currentTarget.style.borderColor = 'rgba(245,240,232,0.3)'; }}
            >
              New Drops <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Slide dot indicators ── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
        {BG_IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            style={{
              width: i === current ? '28px' : '8px',
              height: '8px',
              borderRadius: '4px',
              background: i === current ? '#C8F135' : 'rgba(255,255,255,0.35)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.4s ease',
              padding: 0,
            }}
          />
        ))}
      </div>

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
        001 / DROP — 25
      </div>
    </section>
  );
}