const tiles = [
  {
    img: 'https://res.cloudinary.com/dytpgxkml/image/upload/v1779021024/1_h71crp.jpg',
    user: '@capzyy.in',
    product: 'Shadow Brim 01',
  },
  {
    img: 'https://res.cloudinary.com/dytpgxkml/image/upload/v1779021024/2_gdzvy9.jpg',
    user: '@streetwear.india',
    product: 'Cream Snap Pro',
  },
  {
    img: 'https://res.cloudinary.com/dytpgxkml/image/upload/v1779021023/3_qepwem.jpg',
    user: '@capzyy.drops',
    product: 'Olive Mesh Trucker',
  },
  {
    img: 'https://res.cloudinary.com/dytpgxkml/image/upload/v1779021023/6_ivmi2w.jpg',
    user: '@headwear.daily',
    product: 'Lime Stitch Bucket',
  },
  {
    img: 'https://res.cloudinary.com/dytpgxkml/image/upload/v1779021023/4_oiwuds.jpg',
    user: '@capzyy.fits',
    product: 'Midnight Dad Cap',
  },
  {
    img: 'https://res.cloudinary.com/dytpgxkml/image/upload/v1779021023/5_mebzoo.jpg',
    user: '@india.caps',
    product: 'Bone Six Panel',
  },
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
            {/* Real image */}
            <img
              src={t.img}
              alt={t.product}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

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

      <a
        href="https://instagram.com/capzyy"
        target="_blank"
        rel="noreferrer"
        className="block text-center text-textMuted text-xs mt-6 tracking-wider font-condensed hover:text-white transition-colors"
      >
        Follow us on Instagram @capzyy →
      </a>
    </section>
  );
}