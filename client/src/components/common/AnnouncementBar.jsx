import { Star } from 'lucide-react';

const items = [
  'CRAZY FOR CAPS?!',
  ' FREE SHIPPING 2+CAPS 🧢',
  ' BUY 3 GET A SURPRISE🎁CAP FREE',
  'NEW DROPS EVERY WEEK',
  'CAPS ONLY CRAZY DESIGNS',
  'SHIPPED NATIONWIDE',
];

const row = [...items, ...items, ...items, ...items];

export default function AnnouncementBar() {
  return (
    <div style={{ background: '#C8F135', color: '#0a0a0a' }} className="py-2.5 overflow-hidden">
      <div className="flex marquee-track whitespace-nowrap">
        {row.map((t, i) => (
          <div key={i} className="flex items-center gap-4 px-5 font-condensed text-md tracking-[0.4em] uppercase font-semibold">
            <Star className="w-3 h-3 fill-current flex-none" />
            <span>{t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}