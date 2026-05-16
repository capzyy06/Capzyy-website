import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Plus, Star } from 'lucide-react';
import { useGetFeaturedQuery } from '../../store/api/productsApi';

function useReveal(ready) {
  useEffect(() => {
    if (!ready) return;
    const els = document.querySelectorAll('.reveal:not(.visible)');
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
      }),
      { threshold: 0.1 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ready]);
}

export default function FeaturedCollection() {
  const { data, isLoading } = useGetFeaturedQuery();
  const products = data?.products || [];
  const ref = useRef(null);

  useReveal(!isLoading && products.length > 0);

  const scroll = (dir) => ref.current?.scrollBy({ left: dir * 360, behavior: 'smooth' });

  if (isLoading) return null;

  return (
    <section id="drops" className="relative py-24 md:py-32">
      {/* Header */}
      <div className="flex items-end justify-between px-5 md:px-10 mb-10 reveal">
        <div>
          <p className="font-condensed text-xs tracking-[0.5em] text-[#C8F135] mb-3">— 03 / TOP HEAT</p>
          <h2 className="font-display text-6xl md:text-8xl leading-none tracking-tight text-white">
            FEATURED
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll(-1)}
            aria-label="Prev"
            className="w-10 h-10 md:w-12 md:h-12 border border-border flex items-center justify-center hover:bg-white hover:text-black hover:border-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll(1)}
            aria-label="Next"
            className="w-10 h-10 md:w-12 md:h-12 border border-border flex items-center justify-center hover:bg-white hover:text-black hover:border-white transition"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal scroll
          — padding via px on the container clips the first/last card with overflow-x-auto
          — fix: remove px from container, add left padding only to first child and right to last
            via before/after pseudo spacers using scroll-padding-left for snap alignment      */}
      <div
        ref={ref}
        className="no-scrollbar overflow-x-auto flex gap-4 md:gap-6 snap-x snap-mandatory"
        style={{
          paddingLeft: '20px',
          paddingRight: '20px',
          scrollPaddingLeft: '20px',
        }}
      >
        {products.map((p, i) => (
          <Link
            key={p._id}
            to={`/product/${p.slug}`}
            data-cursor="lime"
            className="group flex-none w-[78vw] sm:w-[42vw] md:w-[28vw] lg:w-[22vw] snap-start reveal"
            style={{ transitionDelay: `${i * 60}ms` }}
          >
            <div className="relative aspect-[3/4] overflow-hidden bg-surface">
              {p.images?.[0]?.url ? (
                <img
                  src={p.images[0].url}
                  alt={p.name}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-surfaceHover">
                  <span className="font-display text-4xl text-white/10 tracking-widest">CAP</span>
                </div>
              )}

              {/* Badge */}
              {p.badge && (
                <span
                  className={`absolute top-3 left-3 font-condensed text-[10px] tracking-[0.25em] px-2 py-1 ${
                    p.badge === 'SOLD OUT' ? 'bg-sale text-white' : 'bg-white text-black'
                  }`}
                >
                  {p.badge}
                </span>
              )}

              {p.isBestseller && (
                <span className="absolute top-3 left-3 inline-flex items-center gap-1 font-condensed text-[10px] tracking-[0.25em] px-2 py-1 bg-bg/80 backdrop-blur text-white">
                  <Star className="w-3 h-3 fill-current" /> BESTSELLER
                </span>
              )}

              {/* Price tag */}
              <span
                className="absolute top-3 right-3 font-condensed text-xs tracking-wider px-2 py-1"
                style={{ background: '#C8F135', color: '#0a0a0a' }}
              >
                ₹{p.price?.toLocaleString('en-IN')}
              </span>

              {/* Always-visible Add to Cart panel */}
              <div className="absolute inset-x-0 bottom-0 bg-white text-black py-3 px-4 flex items-center justify-between">
                <span className="font-condensed text-xs tracking-[0.3em] uppercase">Add to Cart</span>
                <Plus className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <h3 className="font-display text-xl md:text-2xl tracking-wide text-white">{p.name}</h3>
              <span className="font-condensed tracking-wider text-white">₹{p.price?.toLocaleString('en-IN')}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* View All */}
      <div className="px-5 md:px-10 mt-10 reveal">
        <Link
          to="/shop"
          className="story-link inline-flex items-center gap-3 font-condensed text-sm tracking-[0.3em] uppercase text-textSecondary hover:text-white"
          data-cursor="hover"
        >
          View All Caps <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}