import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import DagKaart from '../components/DagKaart';
import { blokken as alleBlokken } from '../data/reisData';

const blokVolgorde = ['carretera', 'chalten', 'ushuaia', 'falklands'];
const blokken = blokVolgorde.map((key) => alleBlokken[key]);

export default function PatagonieVolledigheidPage() {
  return (
    <div>
      {/* Hero */}
      <div className="relative w-full h-[400px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1558517286-8a9cb0b8c793?w=1600&h=900&fit=crop&auto=format"
          alt="Patagonië & Falklands — Volledige route"
          className="w-full h-full object-cover"
          style={{ objectPosition: 'center 35%' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end px-6 pb-12 max-w-5xl mx-auto left-0 right-0">
          <div className="flex items-center gap-2 mb-4">
            <Link to="/patagonie" className="text-xs text-white/60 hover:text-white/90 transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" />
              Patagonië & Falklands
            </Link>
          </div>
          <p className="text-[11px] font-semibold text-white/70 uppercase tracking-widest mb-2">Dagen 1–25 · Volledige route</p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white leading-tight mb-3">
            Patagonië & Falklands
          </h1>
          <p className="font-body text-lg text-white/75 font-light max-w-2xl">
            Alle 25 dagen achter elkaar — van Puerto Montt tot de Falkland Islands.
          </p>
        </div>
      </div>

      {/* Blok-navigatie balk */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-1 overflow-x-auto py-3 scrollbar-hide">
            {blokken.map((blok) => (
              <a
                key={blok.id}
                href={`#blok-${blok.id}`}
                className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-muted hover:text-groen hover:bg-groen-licht border border-transparent hover:border-groen/20 transition-all duration-150 whitespace-nowrap"
              >
                <span className="text-xs font-bold text-groen/60">{blok.dagBereik}</span>
                <span>{blok.naam}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Alle dagen */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        {blokken.map((blok, blokIndex) => (
          <section key={blok.id} id={`blok-${blok.id}`} className="scroll-mt-16 mb-16 last:mb-0">
            {/* Blok header */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b-2 border-groen/15">
              <div>
                <p className="text-xs font-semibold text-groen uppercase tracking-widest mb-1">{blok.dagBereik}</p>
                <h2 className="font-serif text-3xl font-bold text-tekst">{blok.naam}</h2>
                <p className="text-muted mt-1 leading-relaxed text-sm">{blok.subtitel}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-white bg-groen/80 rounded-full px-3 py-1">
                  {String(blokIndex + 1).padStart(2, '0')}
                </span>
                <Link
                  to={blok.route}
                  className="flex items-center gap-1.5 text-xs font-semibold text-groen hover:text-groen-mid transition-colors whitespace-nowrap"
                >
                  Onderdeel bekijken
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Dagen van dit blok */}
            {blok.dagen.map((dag) => (
              <DagKaart key={dag.id} dag={dag} />
            ))}
          </section>
        ))}
      </div>

      {/* Footer */}
      <footer className="bg-achtergrond border-t border-gray-200 py-8 px-4 text-center">
        <Link to="/patagonie" className="font-logo text-lg text-groen hover:text-groen-mid transition-colors">
          Routebaas
        </Link>
        <p className="text-xs text-muted mt-1">Patagonië & Falklands — Volledige route</p>
      </footer>
    </div>
  );
}
