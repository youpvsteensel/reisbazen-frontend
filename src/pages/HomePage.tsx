import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Calendar, Heart, Car, Plane, Sun, Compass } from 'lucide-react';
import { alleReizen } from '../data/reisData';
import type { Reis } from '../data/reisData';

const statusLabel: Record<Reis['status'], { label: string; kleur: string }> = {
  gedaan: { label: 'Gedaan', kleur: 'bg-groen/80 text-white' },
  gepland: { label: 'Gepland', kleur: 'bg-amber-500/80 text-white' },
  bucket_list: { label: 'Bucket list', kleur: 'bg-white/20 text-white' },
};

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <div className="relative w-full h-[600px] overflow-hidden">
        <img
          src="/cover-routebaas.jpg"
          alt="Routebaas — onze reizen"
          className="w-full h-full object-cover"
          style={{ objectPosition: 'center 40%' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end px-6 pb-14 max-w-6xl mx-auto left-0 right-0">
          <h1 className="font-serif text-5xl sm:text-6xl font-bold text-white leading-tight mb-3">
            Routebaas
          </h1>
          <p className="font-body text-lg text-white/75 font-light max-w-xl leading-relaxed">
            Onze mooiste bucketlistreizen, dag voor dag uitgewerkt. Van Patagonië tot Japan.
          </p>
        </div>
      </div>

      {/* Reizen grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {alleReizen.map((reis) => (
            <ReisKaart key={reis.id} reis={reis} />
          ))}

          {/* Placeholder voor komende reizen */}
          <div className="rounded-2xl border-2 border-dashed border-gray-400 flex flex-col items-center justify-center p-10 text-center min-h-[420px]">
            <div className="w-12 h-12 rounded-full bg-groen-licht flex items-center justify-center mb-4">
              <MapPin className="w-5 h-5 text-groen/50" />
            </div>
            <p className="font-serif text-lg font-semibold text-tekst/50 mb-1">Volgende bestemming</p>
            <p className="text-sm text-muted">Suggesties? Laat het ons weten!</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-achtergrond border-t border-gray-200 py-8 px-4 text-center">
        <a
          href="https://www.reisbazen.nl"
          className="font-logo text-xl text-groen hover:text-groen-mid transition-colors"
        >
          Reisbazen
        </a>
        <p className="text-xs text-muted mt-1">Bucketlistreizen, dag voor dag uitgewerkt</p>
      </footer>
    </div>
  );
}

function ReisKaart({ reis }: { reis: Reis }) {
  const status = statusLabel[reis.status];

  // Type-icoon: hartje alleen bij huwelijksreis, anders kompas
  const TypeIcon = reis.typeReis?.toLowerCase().includes('huwelijk') ? Heart : Compass;
  // Vervoer-icoon: jeep bij camper-reis, vliegtuig bij vlucht/boot-reis
  const v = (reis.vervoer ?? '').toLowerCase();
  const VervoerIcon = v.includes('camper')
    ? Car
    : v.includes('vlucht') || v.includes('boot')
      ? Plane
      : Car;

  return (
    <Link
      to={reis.route}
      className="group rounded-2xl overflow-hidden border border-gray-100 hover:border-groen/30 hover:shadow-xl transition-all duration-300 bg-white flex flex-col"
    >
      {/* Cover foto */}
      <div className="relative h-56 overflow-hidden bg-gray-100">
        <img
          src={reis.cover}
          alt={reis.naam}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <div className="absolute top-4 left-4">
          <span className={`text-[10px] font-bold uppercase tracking-widest rounded-full px-3 py-1 ${status.kleur} backdrop-blur-sm`}>
            {status.label}
          </span>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="font-serif text-2xl font-bold text-white leading-tight">{reis.naam}</h3>
        </div>
      </div>

      {/* Stats strip */}
      {(reis.typeReis || reis.vervoer || reis.besteTijd) && (
        <div className="grid grid-cols-2 border-t border-b border-gray-100">
          <div className="flex items-center gap-2 px-4 py-3 border-r border-b border-gray-100">
            <Calendar className="w-3.5 h-3.5 text-groen/50 flex-shrink-0" />
            <span className="text-xs font-medium text-tekst/70">{reis.duur} Dagen</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
            <TypeIcon className="w-3.5 h-3.5 text-groen/50 flex-shrink-0" />
            <span className="text-xs font-medium text-tekst/70">{reis.typeReis ?? '—'}</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-3 border-r border-gray-100">
            <VervoerIcon className="w-3.5 h-3.5 text-groen/50 flex-shrink-0" />
            <span className="text-xs font-medium text-tekst/70">{reis.vervoer ?? '—'}</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-3">
            <Sun className="w-3.5 h-3.5 text-groen/50 flex-shrink-0" />
            <span className="text-xs font-medium text-tekst/70">{reis.besteTijd ?? '—'}</span>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <p className="text-sm text-muted leading-relaxed mb-4 flex-1">{reis.beschrijving}</p>

        {/* Meta */}
        <div className="flex items-center gap-4 mb-4 text-xs text-muted">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            {reis.landen.join(' · ')}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-groen text-sm font-semibold group-hover:gap-2.5 transition-all">
          Bekijk de route
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
