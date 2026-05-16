import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { useGetCategoriesQuery } from '../../store/api/categoriesApi';

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

export default function CategoryGrid() {
  const { data, isLoading } = useGetCategoriesQuery();
  const categories = data?.categories || [];

  useReveal(!isLoading && categories.length > 0); // ← fires only after data arrives

  if (isLoading || !categories.length) return null;

  return (
    <section id="caps" className="relative px-5 md:px-10 py-24 md:py-32">
      <div className="flex items-end justify-between mb-12 reveal">
        <div>
          <p className="font-condensed text-xs tracking-[0.5em] text-[#C8F135] mb-3">— 02 / CATEGORIES</p>
          <h2 className="font-display text-6xl md:text-8xl leading-none tracking-tight text-white">
            SHOP BY <span className="italic font-body font-light text-textSecondary">style</span>
          </h2>
        </div>
        <Link
          to="/shop"
          className="story-link hidden md:inline-block font-condensed text-sm tracking-[0.3em] text-textSecondary hover:text-white uppercase"
        >
          View All →
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
        {categories.slice(0, 6).map((cat, i) => (
          <Link
            key={cat._id}
            to={`/category/${cat.slug}`}
            data-cursor="lime"
            className="group relative aspect-[4/5] overflow-hidden bg-surface reveal"
            style={{ transitionDelay: `${i * 80}ms` }}
          >
            {cat.image?.url ? (
              <img
                src={cat.image.url}
                alt={cat.name}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover scale-105 transition-all duration-700"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-surface">
                <span className="font-display text-[8vw] text-white/10 tracking-widest">{cat.name[0]}</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/30 to-transparent" />
            <div className="absolute inset-0 p-5 md:p-7 flex flex-col justify-between">
              <span className="self-end font-condensed text-[10px] tracking-[0.3em] text-white/50 uppercase">0{i + 1}</span>
              <div className="flex items-end justify-between">
                <div>
                  <h3 className="font-display text-3xl md:text-5xl leading-none text-white">{cat.name.toUpperCase()}</h3>
                  <p className="font-condensed text-xs tracking-[0.2em] text-textSecondary uppercase mt-1">
                    {cat.productCount ? `${cat.productCount} styles` : 'Explore'}
                  </p>
                </div>
                <span className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white text-black flex items-center justify-center transition-all duration-500">
                  <ArrowUpRight className="w-5 h-5" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}