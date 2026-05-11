export function ProductSizeSelector({ sizes, selected, onSelect }) {
  if (!sizes?.length) return null;
  return (
    <div>
      <p className="text-xs font-semibold tracking-widest uppercase text-textSecondary mb-3">
        Size: <span className="text-white">{selected || 'Select'}</span>
      </p>
      <div className="flex flex-wrap gap-2">
        {sizes.map(size => (
          <button
            key={size}
            onClick={() => onSelect(size)}
            className={`px-4 py-2 text-xs font-semibold tracking-wider uppercase border transition-colors ${selected === size ? 'bg-white text-black border-white' : 'border-border text-textSecondary hover:border-white hover:text-white'}`}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
}

export function ProductColorSelector({ colors, selected, onSelect }) {
  if (!colors?.length) return null;
  return (
    <div>
      <p className="text-xs font-semibold tracking-widest uppercase text-textSecondary mb-3">
        Color: <span className="text-white">{selected?.color || 'Select'}</span>
      </p>
      <div className="flex flex-wrap gap-3">
        {colors.map(c => (
          <button
            key={c.color}
            onClick={() => onSelect(c)}
            title={c.color}
            className={`w-8 h-8 rounded-full border-2 transition-all ${selected?.color === c.color ? 'border-white scale-110' : 'border-border hover:border-textSecondary'}`}
            style={{ backgroundColor: c.colorHex || '#000' }}
          />
        ))}
      </div>
    </div>
  );
}
