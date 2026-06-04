import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface BlokNavigatieProps {
  vorigeBlok?: { naam: string; route: string };
  volgendeBlok?: { naam: string; route: string };
  reisRoute?: string;
  reisNaam?: string;
}

export default function BlokNavigatie({ vorigeBlok, volgendeBlok, reisRoute = '/', reisNaam = 'Overzicht' }: BlokNavigatieProps) {
  return (
    <div className="bg-groen mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex items-center justify-between gap-4">
        {vorigeBlok ? (
          <Link
            to={vorigeBlok.route}
            className="flex items-center gap-3 text-white/90 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <div>
              <p className="text-[10px] uppercase tracking-widest text-white/60">Vorig onderdeel</p>
              <p className="text-sm font-semibold">{vorigeBlok.naam}</p>
            </div>
          </Link>
        ) : (
          <Link
            to={reisRoute}
            className="flex items-center gap-3 text-white/90 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <div>
              <p className="text-[10px] uppercase tracking-widest text-white/60">Terug naar</p>
              <p className="text-sm font-semibold">{reisNaam}</p>
            </div>
          </Link>
        )}

        <div className="w-px h-8 bg-white/20 hidden sm:block" />

        {volgendeBlok ? (
          <Link
            to={volgendeBlok.route}
            className="flex items-center gap-3 text-white/90 hover:text-white transition-colors group text-right"
          >
            <div>
              <p className="text-[10px] uppercase tracking-widest text-white/60">Volgend blok</p>
              <p className="text-sm font-semibold">{volgendeBlok.naam}</p>
            </div>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        ) : (
          <Link
            to={reisRoute}
            className="flex items-center gap-3 text-white/90 hover:text-white transition-colors group text-right"
          >
            <div>
              <p className="text-[10px] uppercase tracking-widest text-white/60">Terug naar</p>
              <p className="text-sm font-semibold">{reisNaam}</p>
            </div>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        )}
      </div>
    </div>
  );
}
