export default function ProductBadge({ isNewArrival, isBestSeller, discountPercent }) {
  if (discountPercent > 0) return <span className="absolute top-3 left-3 bg-sale text-white text-xs font-bold px-2 py-1 tracking-wider z-10">-{discountPercent}%</span>;
  if (isNewArrival) return <span className="absolute top-3 left-3 bg-white text-black text-xs font-bold px-2 py-1 tracking-wider z-10">NEW</span>;
  if (isBestSeller) return <span className="absolute top-3 left-3 bg-black border border-white text-white text-xs font-bold px-2 py-1 tracking-wider z-10">BESTSELLER</span>;
  return null;
}
