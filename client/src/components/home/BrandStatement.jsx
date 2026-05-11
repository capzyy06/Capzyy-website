import { ArrowRight, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const SLIDES = [
  {
    tag: '01 / QUALITY',
    heading: 'Built to last.',
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam quis nostrud.',
  },
  {
    tag: '02 / CULTURE',
    heading: 'Worn by the streets.',
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
  },
  {
    tag: '03 / DESIGN',
    heading: 'Details that matter.',
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  },
  {
    tag: '04 / IDENTITY',
    heading: 'Your cap. Your story.',
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit sed quia consequuntur magni.',
  },
];

export default function BrandStatement() {
  const [idx, setIdx] = useState(0);
  const [animating, setAnimating] = useState(false);

  const go = (next) => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setIdx(next);
      setAnimating(false);
    }, 300);
  };

  const prev = () => go((idx - 1 + SLIDES.length) % SLIDES.length);
  const next = () => go((idx + 1) % SLIDES.length);

  useEffect(() => {
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [idx]);

  return (
    <section className="relative py-32 md:py-48 overflow-hidden border-y border-border">
      {/* Giant watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span
          className="font-display leading-none tracking-tight whitespace-nowrap"
          style={{ fontSize: 'clamp(100px, 22vw, 320px)', color: 'rgba(255,255,255,0.04)' }}
        >
          EST · 2024
        </span>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto px-5 text-center">
        {/* Eyebrow */}
        <p className="font-condensed text-xs tracking-[0.5em] mb-5 reveal" style={{ color: '#C8F135' }}>
          — MANIFESTO
        </p>

        {/* Headline */}
        <h2 className="leading-[1.05] reveal" style={{ fontSize: 'clamp(42px, 6vw, 88px)' }}>
          <span className="font-body font-light" style={{ color: '#F5F0E8' }}>
            Not just a cap.
          </span>
          <br />
          <span className="font-body italic font-light" style={{ color: '#C8F135' }}>
            A statement.
          </span>
        </h2>

        {/* Body */}
        <p className="font-body text-base md:text-lg max-w-2xl mx-auto mt-8 leading-relaxed reveal" style={{ color: '#F5F0E8' }}>
          Born on the streets of India, designed for the global underground. Every stitch
          carries the noise of the city, the silence of the night, and the energy of every
          kid who refused to blend in.
        </p>

        {/* CTA */}
        <div className="mt-4 reveal">
          <Link
            to="/about"
            className="inline-flex flex-col items-center gap-1 font-condensed text-sm tracking-[0.3em] uppercase"
            style={{ color: '#F5F0E8' }}
          >
            <span>OUR STORY</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* ── Slider ── */}
        <div className="mt-16 reveal ">
          {/* Slide content — lime bg */}
          <div
            className=" px-6 py-2 text-left transition-opacity duration-300"
            style={{ background: 'rgba(200,241,53,0.08)', opacity: animating ? 0 : 1 }}
          >
            <p className="font-condensed text-sm tracking-[0.4em] uppercase mb-3" style={{ color: '#F5F0E8' }}>
              {SLIDES[idx].tag}
            </p>
            <h3 className="font-body font-light mb-3" style={{ fontSize: 'clamp(24px, 3vw, 36px)', color: '#F5F0E8' }}>
              {SLIDES[idx].heading}
            </h3>
            <p className="font-body text-md leading-relaxed" style={{ color: '#F5F0E8' }}>
              {SLIDES[idx].body}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between mt-4">
            {/* Dots */}
            <div className="flex items-center gap-2">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => go(i)}
                  className="transition-all duration-300"
                  style={{
                    width: i === idx ? '24px' : '6px',
                    height: '6px',
                    borderRadius: '3px',
                    background: i === idx ? '#C8F135' : '#2A2A2A',
                  }}
                />
              ))}
            </div>

            {/* Arrows */}
            <div className="flex gap-2">
              <button
                onClick={prev}
                className="w-10 h-10 border border-border flex items-center justify-center text-textSecondary hover:border-white hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                onClick={next}
                className="w-10 h-10 border border-border flex items-center justify-center text-textSecondary hover:border-white hover:text-white transition-colors"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}