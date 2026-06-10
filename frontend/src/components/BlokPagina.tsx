import { useEffect } from 'react';
import Hero from '../components/Hero';
import RouteStrip from '../components/RouteStrip';
import DagKaart from '../components/DagKaart';
import PraktischBlok from '../components/PraktischBlok';
import BlokNavigatie from '../components/BlokNavigatie';
import type { Blok } from '../data/reisData';

interface BlokPaginaProps {
  blok: Blok;
}

export default function BlokPagina({ blok }: BlokPaginaProps) {
  useEffect(() => {
    document.title = `${blok.naam} — Routebaas`;
    return () => { document.title = 'Routebaas'; };
  }, [blok.naam]);

  return (
    <div>
      <Hero
        image={blok.hero}
        tag="Reisblok"
        title={blok.naam}
        subtitle={blok.subtitel}
        dagBereik={blok.dagBereik}
      />

      <RouteStrip />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid lg:grid-cols-[1fr_300px] gap-12">
          {/* Main content */}
          <div>
            <div className="mb-8">
              <p className="text-xs font-semibold text-groen uppercase tracking-widest mb-1">{blok.dagBereik}</p>
              <h2 className="font-serif text-3xl font-bold text-tekst">{blok.naam}</h2>
              <p className="text-muted mt-2 leading-relaxed">{blok.subtitel}</p>
            </div>

            {blok.dagen.map((dag) => (
              <DagKaart key={dag.id} dag={dag} />
            ))}
          </div>

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-20 lg:self-start">
            <div className="rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
              <div className="bg-groen p-5">
                <p className="text-xs font-semibold text-white/70 uppercase tracking-widest mb-1">Praktisch</p>
                <h3 className="font-serif text-xl font-bold text-white">{blok.naam}</h3>
                <p className="text-xs text-white/60 mt-1">{blok.dagBereik}</p>
              </div>
              <div className="p-5 bg-white">
                <div className="flex flex-col gap-3">
                  {blok.praktischInfo.map((item, i) => (
                    <div key={i} className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0">
                      <span className="text-base w-5 flex-shrink-0">{item.icon}</span>
                      <div>
                        <p className="text-xs font-semibold text-groen">{item.label}</p>
                        <p className="text-sm text-tekst/75 leading-snug">{item.waarde}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Navigation hints */}
            <div className="mt-6 flex flex-col gap-2">
              <p className="text-xs font-semibold text-muted uppercase tracking-widest mb-2">Dagindeling</p>
              {blok.dagen.map((dag) => (
                <a
                  key={dag.id}
                  href={`#${dag.id}`}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-groen-licht border border-transparent hover:border-groen/15 transition-all duration-200 group"
                >
                  <div className="w-8 h-8 rounded-full bg-groen/10 group-hover:bg-groen/20 flex items-center justify-center flex-shrink-0 transition-colors">
                    <span className="text-xs font-bold text-groen">{dag.dag}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-tekst truncate">{dag.titel}</p>
                    <p className="text-xs text-muted truncate">{dag.locatie}</p>
                  </div>
                </a>
              ))}
            </div>
          </aside>
        </div>
      </div>

      <BlokNavigatie vorigeBlok={blok.vorigeBlok} volgendeBlok={blok.volgendeBlok} />

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-8 px-4 text-center">
        <p className="font-serif text-lg text-groen font-semibold mb-1">reisbazen</p>
        <p className="text-xs text-muted">Patagonia & Falkland Islands — Huwelijksreis 2025</p>
      </footer>
    </div>
  );
}
