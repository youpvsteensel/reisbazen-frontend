import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface HeroProps {
  image: string;
  creditUrl?: string;
  title: string;
  subtitle: string;
  dagBereik: string;
  reisRoute?: string;
  reisNaam?: string;
}

export default function Hero({ image, creditUrl, title, subtitle, dagBereik, reisRoute, reisNaam }: HeroProps) {
  return (
    <div className="relative w-full h-[520px] overflow-hidden bg-gray-200">
      <img
        src={image}
        alt={title}
        className="w-full h-full object-cover"
        style={{ objectPosition: 'center 40%' }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
      <div className="absolute inset-0 flex flex-col justify-end px-6 pb-12 max-w-5xl mx-auto w-full left-0 right-0">

        {/* Breadcrumb */}
        {reisRoute && reisNaam && (
          <div className="flex items-center gap-2 mb-5">
            <Link to="/" className="text-xs text-white/55 hover:text-white/90 transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" />
              Routebaas
            </Link>
            <span className="text-white/30 text-xs">/</span>
            <Link to={reisRoute} className="text-xs text-white/55 hover:text-white/90 transition-colors">
              {reisNaam}
            </Link>
          </div>
        )}

        {/* DagBereik pill */}
        <div className="mb-4">
          <span className="text-xs font-medium text-white/80 bg-white/15 backdrop-blur-sm border border-white/25 rounded-full px-4 py-1.5 uppercase tracking-widest">
            {dagBereik}
          </span>
        </div>

        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-3">
          {title}
        </h1>
        <p className="font-body text-lg text-white/80 font-light max-w-xl leading-relaxed">
          {subtitle}
        </p>
      </div>
      {creditUrl && (
        <a
          href={creditUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-2 right-3 text-[10px] text-white/50 hover:text-white/80"
        >
          Foto: Unsplash
        </a>
      )}
    </div>
  );
}
