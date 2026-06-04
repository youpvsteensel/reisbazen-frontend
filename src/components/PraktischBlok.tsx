interface PraktischRij {
  icon: string;
  label: string;
  waarde: string;
}

interface PraktischBlokProps {
  items: PraktischRij[];
  titel?: string;
}

export default function PraktischBlok({ items, titel = 'Praktisch' }: PraktischBlokProps) {
  return (
    <div className="border-l-4 border-groen bg-groen-licht rounded-r-xl p-5 mt-4">
      <p className="text-xs font-semibold text-groen uppercase tracking-widest mb-3">{titel}</p>
      <div className="flex flex-col gap-2.5">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-3">
            <span className="text-base leading-none mt-0.5 w-5 flex-shrink-0">{item.icon}</span>
            <div className="flex flex-col sm:flex-row sm:gap-2 min-w-0">
              <span className="text-sm font-semibold text-groen whitespace-nowrap">{item.label}</span>
              <span className="text-sm text-tekst/80 leading-snug">{item.waarde}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
