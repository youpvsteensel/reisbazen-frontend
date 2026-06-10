import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Sun, Plane, Compass, ArrowRight, ArrowLeft } from 'lucide-react';
import BlokCard from '../components/BlokCard';
import RouteKaartOceanie from '../components/RouteKaartOceanie';

const blokken = [
  {
    route: '/oceanie/melbourne',
    naam: 'Melbourne',
    dagBereik: 'Dagen 1–5',
    hero: 'https://images.unsplash.com/photo-1610221734835-38a23314acbe?w=900&h=600&fit=crop&auto=format',
    beschrijving: 'Stadse start met de Australian Open, vroege markten, straatkunst en de craft-beer-scene van Fitzroy en Collingwood. Alles per tram, geen auto nodig.',
    stops: ['Australian Open', 'Queen Victoria Market', 'St Kilda', 'Fitzroy'],
    accent: 'Australië',
  },
  {
    route: '/oceanie/tasmanie',
    naam: 'Tasmanië',
    dagBereik: 'Dagen 6–13',
    hero: 'https://images.unsplash.com/photo-1570169639557-5b4e4428d7d3?w=900&h=600&fit=crop&auto=format',
    beschrijving: 'Per huurauto de oostkust noordwaarts: de kliffen van Cape Hauy, Wineglass Bay, de oranje rotsen van Bay of Fires en de bergen van Cradle Mountain.',
    stops: ['Cape Hauy', 'Wineglass Bay', 'Bay of Fires', 'Cradle Mountain'],
    accent: 'Australië',
  },
  {
    route: '/oceanie/west-australie',
    naam: 'West-Australië',
    dagBereik: 'Dagen 14–29',
    hero: 'https://images.unsplash.com/photo-1565136264276-eea03a72679c?w=900&h=600&fit=crop&auto=format',
    beschrijving: 'Per camper langs wijnstreken, reuzenbomen en de witste stranden van Australië, van Perth en Margaret River tot de kangoeroes van Lucky Bay.',
    stops: ['Rottnest', 'Margaret River', 'Denmark', 'Esperance'],
    accent: 'Australië',
  },
  {
    route: '/oceanie/nz-zuidereiland',
    naam: 'NZ Zuidereiland',
    dagBereik: 'Dagen 30–63',
    hero: 'https://images.unsplash.com/photo-1668010882703-fb9fc62c250a?w=900&h=600&fit=crop&auto=format',
    beschrijving: 'Vier weken hut-to-hut tracks, fjorden en gletsjers: Routeburn, Doubtful Sound, de hotpools van de Copland Track en Mueller Hut onder Aoraki/Mt Cook.',
    stops: ['Queenstown', 'Doubtful Sound', 'Routeburn', 'Mt Cook'],
    accent: 'Nieuw-Zeeland',
  },
];

const tripStats = [
  { icon: Calendar, label: '63 Dagen',            sub: 'Reisduur' },
  { icon: Sun,      label: 'Jan tot apr',         sub: 'Beste reistijd' },
  { icon: Plane,    label: 'Vlucht · Auto · Camper', sub: 'Vervoer' },
  { icon: Compass,  label: 'Avontuur',            sub: 'Type reis' },
];

export default function OceaniePage() {
  useEffect(() => { document.title = 'Australië & Nieuw-Zeeland — Routebaas'; }, []);

  return (
    <div>
      {/* Hero */}
      <div className="relative w-full h-[520px] sm:h-[600px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1602306066800-7e953ad61a95?w=1600&h=900&fit=crop&auto=format"
          alt="Oceanië — Australië & Nieuw-Zeeland"
          className="w-full h-full object-cover"
          style={{ objectPosition: 'center 50%' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent h-24" />
        <div className="absolute inset-0 flex flex-col justify-end px-6 pb-10 sm:pb-16 max-w-6xl mx-auto left-0 right-0">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <Link to="/" className="text-xs text-white/60 hover:text-white/90 transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" />
              Routebaas
            </Link>
            <span className="text-white/30 text-xs">/</span>
            <span className="text-xs text-white/80">Oceanië</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-6xl font-bold text-white leading-tight mb-3 sm:mb-4">
            Australië & Nieuw-Zeeland
          </h1>
          <p className="font-body text-base sm:text-xl text-white/75 font-light max-w-2xl leading-relaxed line-clamp-3 sm:line-clamp-none">
            Drie maanden door Oceanië: Australian Open in Melbourne, de wildernis van Tasmanië, de afgelegen zuidwestkust van West-Australië per camper en de hut-to-hut tracks van het Zuidereiland van Nieuw-Zeeland.
          </p>

          {/* Quick blok links — alleen desktop */}
          <div className="hidden sm:flex flex-wrap gap-3 mt-6">
            {blokken.map((b) => (
              <Link
                key={b.route}
                to={b.route}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white text-sm font-medium rounded-full px-5 py-2 transition-all duration-200 group"
              >
                {b.naam}
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Trip stats */}
      <div className="bg-groen text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {tripStats.map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex items-center gap-2.5">
              <Icon className="w-4 h-4 text-white/50 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold leading-tight">{label}</p>
                <p className="text-[11px] text-white/55 leading-tight">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Route strip — 2 kolommen */}
      <div className="bg-groen-licht border-y border-groen/10 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <p className="text-xs font-semibold text-groen uppercase tracking-widest text-center mb-8">
            De volledige route
          </p>
          <div className="grid sm:grid-cols-2 gap-8 items-stretch">

            {/* Links: reisoverzicht blok */}
            <div className="rounded-2xl overflow-hidden border border-groen/15 bg-white shadow-sm flex flex-col h-full">
              <div className="bg-groen px-5 py-4">
                <p className="text-[10px] font-semibold text-white/60 uppercase tracking-widest mb-1">63 Dagen</p>
                <h3 className="font-serif text-2xl font-bold text-white leading-tight">Australië & Nieuw-Zeeland</h3>
              </div>

              <div className="px-5 pt-4 pb-3">
                <p className="text-xs text-muted leading-relaxed">
                  Drie maanden dwars door Oceanië: van de Australian Open en de wildernis van Tasmanië, via de camperkust van West-Australië, naar de fjorden, gletsjers en hut-to-hut tracks van het Zuidereiland van Nieuw-Zeeland.
                </p>
              </div>

              <div className="grid grid-cols-2 divide-x divide-y divide-gray-100 border-t border-gray-100">
                {blokken.map((blok, i) => (
                  <Link
                    key={blok.route}
                    to={blok.route}
                    className="px-4 py-3 flex flex-col gap-1 hover:bg-groen-licht transition-colors group"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-groen/10 group-hover:bg-groen/20 flex items-center justify-center text-[10px] font-bold text-groen flex-shrink-0 transition-colors">
                        {i + 1}
                      </span>
                      <span className="text-sm font-semibold text-tekst leading-tight">{blok.naam}</span>
                    </div>
                    <p className="text-xs text-muted ml-7">{blok.dagBereik}</p>
                  </Link>
                ))}
              </div>

              <div className="px-5 py-3 border-t border-gray-100 mt-auto">
                <Link
                  to="/oceanie/melbourne"
                  className="flex items-center gap-1.5 text-groen text-sm font-semibold transition-all group"
                >
                  Bekijk de route dag voor dag
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Rechts: interactieve Leaflet kaart */}
            <div className="flex flex-col gap-3 h-full">
              <div className="flex-1 min-h-0">
                <RouteKaartOceanie />
              </div>
              <a
                href="https://www.google.com/maps/dir/Melbourne/Hobart/Freycinet+National+Park/Bay+of+Fires/Cradle+Mountain/Perth/Margaret+River/Denmark+WA/Albany+WA/Esperance/Queenstown+NZ/Te+Anau/Wanaka/Fox+Glacier/Nelson+NZ/Blenheim/Lake+Tekapo/Aoraki+Mount+Cook"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-groen/30 bg-white text-groen text-sm font-semibold hover:bg-groen hover:text-white transition-all duration-200"
              >
                <MapPin className="w-4 h-4" />
                Bekijk volledige route op Google Maps
              </a>
            </div>

          </div>
        </div>
      </div>

      {/* Blokken grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-10">
          <p className="text-xs font-semibold text-groen uppercase tracking-widest mb-3">
            De route in {blokken.length} delen
          </p>
          <p className="font-body text-xl font-light max-w-2xl mx-auto leading-relaxed text-tekst/60">
            Van een tennisstadion in Melbourne en de stranden van West-Australië tot de pelgrimspaden en gletsjers van het Zuidereiland. 63 dagen avontuur voor twee.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-8">
          {blokken.map((blok, i) => (
            <BlokCard
              key={blok.route}
              route={blok.route}
              naam={blok.naam}
              dagBereik={blok.dagBereik}
              hero={blok.hero}
              beschrijving={blok.beschrijving}
              stops={blok.stops}
              accent={blok.accent}
              index={i}
            />
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-achtergrond border-t border-gray-200 py-8 px-4 text-center">
        <Link to="/" className="font-logo text-lg text-groen hover:text-groen-mid transition-colors">
          Routebaas
        </Link>
        <p className="text-xs text-muted mt-1">Oceanië · Australië & Nieuw-Zeeland · Avontuur · Roadtrip</p>
      </footer>
    </div>
  );
}
