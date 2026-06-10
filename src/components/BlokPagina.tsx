import { useEffect } from 'react';
import Hero from '../components/Hero';
import DagKaart from '../components/DagKaart';
import BlokNavigatie from '../components/BlokNavigatie';
import type { Blok } from '../data/reisData';

interface BlokPaginaProps {
  blok: Blok;
}

function Dagindeling({ blok }: { blok: Blok }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-xs font-semibold text-muted uppercase tracking-widest mb-2">Dagindeling</p>
      {blok.dagen.map((dag) => (
        <a
          key={dag.id}
          href={`#${dag.id}`}
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-groen-licht border border-transparent hover:border-groen/15 transition-all duration-200 group"
        >
          <div className="min-w-[2rem] h-8 px-1.5 rounded-full bg-groen/10 group-hover:bg-groen/20 flex items-center justify-center flex-shrink-0 transition-colors">
            <span className="text-xs font-bold text-groen whitespace-nowrap">{dag.dag}</span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-tekst truncate">{dag.titel}</p>
            <p className="text-xs text-muted truncate">{dag.locatie}</p>
          </div>
        </a>
      ))}
    </div>
  );
}

function Praktisch({ blok }: { blok: Blok }) {
  return (
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
  );
}

export default function BlokPagina({ blok }: BlokPaginaProps) {
  return (
    <div>
      <Hero
        image={blok.hero}
        creditUrl={blok.heroCredit?.url}
        title={blok.naam}
        subtitle={blok.subtitel}
        dagBereik={blok.dagBereik}
        reisRoute={blok.reisRoute}
        reisNaam={blok.reisNaam}
      />

      {/* Mobiel: dagindeling direct onder hero */}
      <div className="lg:hidden border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
          <Dagindeling blok={blok} />
        </div>
      </div>

      {/* Hoofdcontent */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid lg:grid-cols-[1fr_300px] gap-12">
          {/* Dagkaarten */}
          <div>
            {blok.dagen.map((dag) => (
              <DagKaart key={dag.id} dag={dag} />
            ))}
          </div>

          {/* Desktop sidebar — pt-10 aligned met py-10 van eerste DagKaart */}
          <aside className="hidden lg:block pt-10">
            <Praktisch blok={blok} />
            <div className="mt-6">
              <Dagindeling blok={blok} />
            </div>
          </aside>
        </div>
      </div>

      {/* Mobiel: praktisch onderaan */}
      <div className="lg:hidden max-w-6xl mx-auto px-4 sm:px-6 pb-12">
        <Praktisch blok={blok} />
      </div>

      <BlokNavigatie
        vorigeBlok={blok.vorigeBlok}
        volgendeBlok={blok.volgendeBlok}
        reisRoute={blok.reisRoute}
        reisNaam={blok.reisNaam}
      />

      {/* Footer */}
      <footer className="bg-achtergrond border-t border-gray-200 py-8 px-4 text-center">
        <a href="/" className="font-logo text-lg text-groen hover:text-groen-mid transition-colors">
          Routebaas
        </a>
        <p className="text-xs text-muted mt-1">{blok.reisNaam}</p>
      </footer>
    </div>
  );
}
