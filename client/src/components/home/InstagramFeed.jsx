const tiles = [
  { user: '@capzyy.in', product: 'Shadow Brim 01' },
  { user: '@streetwear.india', product: 'Cream Snap Pro' },
  { user: '@capzyy.drops', product: 'Olive Mesh Trucker' },
  { user: '@headwear.daily', product: 'Lime Stitch Bucket' },
  { user: '@capzyy.fits', product: 'Midnight Dad Cap' },
  { user: '@india.caps', product: 'Bone Six Panel' },
];

export default function InstagramFeed() {
  return (
    <section className="relative px-5 md:px-10 py-24 md:py-32">
      {/* Header */}
      <div className="flex items-end justify-between mb-10 reveal">
        <div>
          <p className="font-condensed text-xs tracking-[0.5em] text-[#C8F135] mb-3">— 05 / IRL</p>
          <h2 className="font-display text-6xl md:text-8xl leading-none tracking-tight text-white">
            SEEN ON THE{' '}
            <span className="italic font-body font-light text-textSecondary">streets</span>
          </h2>
        </div>
        <a
          href="https://instagram.com/capzyy"
          target="_blank"
          rel="noreferrer"
          className="story-link hidden md:inline-block font-condensed text-sm tracking-[0.3em] uppercase text-textSecondary hover:text-white"
        >
          Tag us @CAPZYY →
        </a>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-3">
        {tiles.map((t, i) => (
          <a
            key={i}
            href="https://instagram.com/capzyy"
            target="_blank"
            rel="noreferrer"
            data-cursor="lime"
            className="group relative aspect-square overflow-hidden bg-surface reveal"
            style={{ transitionDelay: `${i * 60}ms` }}
          >
            {/* Placeholder tile */}
            <div className="w-full h-full bg-surfaceHover flex items-center justify-center">
              <span className="font-display text-3xl text-white/10 tracking-widest">
                {String(i + 1).padStart(2, '0')}
              </span>
            </div>

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-bg/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
              <p className="font-display text-lg leading-none text-white">{t.user}</p>
              <p className="font-condensed text-[10px] tracking-[0.2em] text-textSecondary uppercase mt-1">
                wearing: {t.product}
              </p>
            </div>
          </a>
        ))}
      </div>

      <p className="text-center text-textMuted text-xs mt-6 tracking-wider font-condensed">
        Connect your Instagram feed via Meta API to display live posts
      </p>
    </section>
  );
}