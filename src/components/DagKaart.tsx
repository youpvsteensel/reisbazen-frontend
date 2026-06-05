import { MapPin, CheckCircle2 } from 'lucide-react';
import Badge from './Badge';
import PraktischBlok from './PraktischBlok';
import type { Dag } from '../data/reisData';

interface DagKaartProps {
  dag: Dag;
}

export default function DagKaart({ dag }: DagKaartProps) {
  return (
    <div id={dag.id} className="scroll-mt-20 grid md:grid-cols-2 gap-8 py-10 border-b border-gray-100 last:border-0">
      {/* Left: content */}
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-[52px] h-[52px] rounded-full bg-groen flex flex-col items-center justify-center shadow-md">
            <span className="text-[8px] font-bold text-white/70 uppercase tracking-widest leading-none">DAG</span>
            <span className="text-base font-bold text-white leading-tight">{dag.dag}</span>
          </div>
          <div>
            <h3 className="font-serif text-2xl font-semibold text-tekst leading-tight">{dag.titel}</h3>
            <div className="flex items-center gap-1.5 mt-1">
              <MapPin className="w-3.5 h-3.5 text-muted" />
              <span className="text-sm text-muted">{dag.locatie}</span>
            </div>
          </div>
        </div>

        {dag.badges.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {dag.badges.map((b) => (
              <Badge key={b} label={b} />
            ))}
          </div>
        )}

        <p className="font-body text-[15px] text-tekst/80 leading-relaxed">{dag.beschrijving}</p>

        {dag.activiteiten && dag.activiteiten.length > 0 && (
          <div className="flex flex-col gap-2">
            {dag.activiteiten.map((act, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-groen-mid flex-shrink-0 mt-0.5" />
                <span className="font-body text-sm text-tekst/75 leading-snug">{act}</span>
              </div>
            ))}
          </div>
        )}

        {dag.praktisch && dag.praktisch.length > 0 && (
          <PraktischBlok items={dag.praktisch} />
        )}
      </div>

      {/* Right: photo */}
      <div className="relative photo-wrapper">
        <img
          src={dag.foto}
          alt={`${dag.locatie} — ${dag.titel}`}
          className="dag-photo"
          loading="lazy"
        />
        <a
          href={dag.fotoCredit.url}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-2 right-2 text-[10px] text-white/70 hover:text-white bg-black/30 px-1.5 py-0.5 rounded"
        >
          Foto: Unsplash
        </a>
      </div>
    </div>
  );
}
