import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface BlokCardProps {
  route: string;
  naam: string;
  dagBereik: string;
  hero: string;
  beschrijving: string;
  stops: string[];
  accent: string;
  index: number;
}

export default function BlokCard({
  route,
  naam,
  dagBereik,
  hero,
  beschrijving,
  stops,
  accent,
  index,
}: BlokCardProps) {
  return (
    <Link
      to={route}
      className="group rounded-2xl overflow-hidden border border-gray-100 hover:border-groen/30 hover:shadow-lg transition-all duration-300 bg-white flex flex-col"
    >
      <div className="relative h-56 overflow-hidden bg-gray-200">
        <img
          src={hero}
          alt={naam}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <span className="text-xs font-bold text-white bg-groen/80 rounded-full px-3 py-1">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className="text-xs text-white/80 bg-black/30 backdrop-blur-sm rounded-full px-3 py-1">
            {accent}
          </span>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <p className="text-xs text-white/70 mb-1">{dagBereik}</p>
          <h3 className="font-serif text-2xl font-bold text-white">{naam}</h3>
        </div>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <p className="font-body text-sm text-muted leading-relaxed mb-4">{beschrijving}</p>
        <div className="flex flex-wrap gap-1.5 mb-4 flex-1 content-start">
          {stops.map((s) => (
            <span
              key={s}
              className="text-xs font-medium bg-groen-licht border border-groen/20 text-groen rounded-full px-2.5 py-1 h-fit"
            >
              {s}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-1.5 text-groen text-sm font-semibold group-hover:gap-2.5 transition-all">
          Bekijk deel van de route
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
