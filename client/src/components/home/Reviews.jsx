import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Star } from 'lucide-react';

const reviews = [
  {
    rating: 5,
    text: "Quality is unmatched. The stitching, the fit — feels like a ₹5k cap. Cop without thinking.",
    name: "Aditya R.",
    city: "Bengaluru",
    product: "Shadow Brim 01",
  },
  {
    rating: 5,
    text: "I wear caps everyday. Capzyy hits different. The cream snap is now my daily.",
    name: "Meher P.",
    city: "Mumbai",
    product: "Cream Snap Pro",
  },
  {
    rating: 4,
    text: "Sold out in 2 days. Got the restock and worth every rupee. Packaging is sick too.",
    name: "Rahul S.",
    city: "Delhi",
    product: "Lime Stitch Bucket",
  },
  {
    rating: 5,
    text: "Indian streetwear finally has a brand that doesn't feel like a clone. Proud to wear this.",
    name: "Ishan K.",
    city: "Pune",
    product: "Olive Mesh Trucker",
  },
];

const distribution = [
  { stars: 5, pct: 78 },
  { stars: 4, pct: 16 },
  { stars: 3, pct: 4 },
  { stars: 2, pct: 1 },
  { stars: 1, pct: 1 },
];

export default function Reviews() {
  const [idx, setIdx] = useState(0);
  const [animating, setAnimating] = useState(false);

  const go = (next) => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => { setIdx(next); setAnimating(false); }, 300);
  };

  const prev = () => go((idx - 1 + reviews.length) % reviews.length);
  const next = () => go((idx + 1) % reviews.length);

  useEffect(() => {
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [idx]);

  const r = reviews[idx];

  return (
    <section className="relative px-5 md:px-10 py-24 md:py-32">
      <div className="grid lg:grid-cols-12 gap-12">

        {/* Left — rating + distribution */}
        <div className="lg:col-span-5 reveal">
          <p className="font-condensed text-xs tracking-[0.5em] mb-3" style={{ color: '#C8F135' }}>
            — 06 / VOICES
          </p>
          <h2 className="font-display leading-[0.9] tracking-tight" style={{ fontSize: 'clamp(48px, 7vw, 96px)', color: '#F5F0E8' }}>
            WHAT THE{' '}
            <span className="italic font-body font-light" style={{ color: '#F5F0E8' }}>streets</span>{' '}
            SAY
          </h2>

          {/* Rating */}
          <div className="mt-10">
            <div className="flex items-baseline gap-3">
              <span className="font-display leading-none" style={{ fontSize: 'clamp(56px, 8vw, 96px)', color: '#C8F135' }}>
                4.8
              </span>
              <div className="flex flex-col">
                <div className="flex gap-0.5" style={{ color: '#C8F135' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="font-condensed text-xs tracking-wider mt-1" style={{ color: '#555' }}>
                  2,400+ verified reviews
                </span>
              </div>
            </div>

            {/* Distribution bars */}
            <div className="mt-8 space-y-3">
              {distribution.map((d) => (
                <div key={d.stars} className="flex items-center gap-3">
                  <span className="font-condensed text-xs w-6" style={{ color: '#555' }}>{d.stars}★</span>
                  <div className="flex-1 h-1 overflow-hidden" style={{ background: '#1a1a1a' }}>
                    <div
                      className="h-full transition-all duration-1000"
                      style={{ width: `${d.pct}%`, background: '#C8F135' }}
                    />
                  </div>
                  <span className="font-condensed text-xs w-10 text-right" style={{ color: '#555' }}>
                    {d.pct}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — review card */}
        <div className="lg:col-span-7 reveal">
          <div
            className="relative p-8 md:p-12 min-h-[320px] flex flex-col justify-between"
            style={{ background: '#141414', border: '1px solid #2A2A2A' }}
          >
            {/* Quote mark watermark */}
            <div
              className="absolute top-0 right-4 font-display leading-none select-none"
              style={{ fontSize: '10rem', color: 'rgba(200,241,53,0.08)' }}
            >
              "
            </div>

            <div>
              {/* Stars */}
              <div className="flex gap-1 mb-6" style={{ color: '#C8F135' }}>
                {[...Array(r.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>

              {/* Review text */}
              <p
                className="font-body leading-snug relative z-10 transition-opacity duration-300"
                style={{
                  fontSize: 'clamp(20px, 2.5vw, 32px)',
                  color: '#F5F0E8',
                  opacity: animating ? 0 : 1,
                }}
              >
                "{r.text}"
              </p>
            </div>

            {/* Bottom row */}
            <div
              className="flex items-end justify-between mt-8 transition-opacity duration-300"
              style={{ opacity: animating ? 0 : 1 }}
            >
              <div>
                <p className="font-condensed text-sm tracking-[0.2em] uppercase" style={{ color: '#F5F0E8' }}>
                  {r.name}
                </p>
                <p className="font-condensed text-xs tracking-wider mt-0.5" style={{ color: '#555' }}>
                  {r.city} · {r.product}
                </p>
              </div>

              {/* Arrow buttons */}
              <div className="flex gap-2">
                <button
                  onClick={prev}
                  className="w-10 h-10 flex items-center justify-center transition-colors"
                  style={{ border: '1px solid #2A2A2A', color: '#888' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#C8F135'; e.currentTarget.style.color = '#0a0a0a'; e.currentTarget.style.borderColor = '#C8F135'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#888'; e.currentTarget.style.borderColor = '#2A2A2A'; }}
                  aria-label="Prev"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={next}
                  className="w-10 h-10 flex items-center justify-center transition-colors"
                  style={{ border: '1px solid #2A2A2A', color: '#888' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#C8F135'; e.currentTarget.style.color = '#0a0a0a'; e.currentTarget.style.borderColor = '#C8F135'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#888'; e.currentTarget.style.borderColor = '#2A2A2A'; }}
                  aria-label="Next"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}