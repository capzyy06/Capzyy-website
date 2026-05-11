import { Star } from 'lucide-react';

const DEFAULT_ITEMS = [
  'FREE SHIPPING ABOVE ₹999',
  'NEW DROPS EVERY FRIDAY',
  'CAPS ONLY',
  'NO COMPROMISE',
  'COD AVAILABLE',
  'SHIPPED NATIONWIDE',
];

export default function MarqueeStrip({ items = DEFAULT_ITEMS, invert = false }) {
  const row = [...items, ...items];

  return (
    <div
      className="overflow-hidden border-y py-4"
      style={{ background: '#C8F135', color: '#0a0a0a', borderColor: '#C8F135' }}
    >
      <div className={`flex whitespace-nowrap ${invert ? 'marquee-track-reverse' : 'marquee-track'}`}>
        {row.map((t, i) => (
          <div key={i} className="flex items-center gap-6 px-6 font-condensed tracking-widest text-xl md:text-2xl font-semibold">
            <Star className="w-4 h-4 fill-current flex-none" />
            <span>{t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}