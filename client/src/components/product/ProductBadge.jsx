export default function ProductBadge({ discountPercent }) {
  if (!discountPercent || discountPercent <= 0 || discountPercent > 90) return null;

  return (
    <span className="absolute top-0 left-0 z-10 bg-[#FF3B3B] text-white text-[11px] font-bold px-2.5 py-1 tracking-widest">
      -{discountPercent}% OFF
    </span>
  );
}