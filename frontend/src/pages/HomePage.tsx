import { Link } from 'react-router-dom';
import { MapPin, Calendar, Users, Compass, ArrowRight } from 'lucide-react';
import { useUnsplashPhoto } from '../hooks/useUnsplashPhoto';
import BlokCard from '../components/BlokCard';

const blokken = [
  {
    route: '/carretera-austral',
    naam: 'Carretera Austral',
    dagBereik: 'Dagen 1–14',
    hero: 'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=900&h=600&fit=crop&auto=format',
    unsplashQuery: 'patagonia carretera austral',
    beschrijving: 'Chili\'s wilde ruggengraat per camper. Van Puerto Montt tot Balmaceda langs fjorden, gletsjers en onverharde wegen.',
    stops: ['Puerto Montt', 'Parque Pumalín', 'Puyuhuapi', 'Queulat', 'Cerro Castillo'],
    accent: 'Chili',
  },
  {
    route: '/el-chalten',
    naam: 'El Chaltén',
    dagBereik: 'Dagen 15–18',
    hero: 'https://images.unsplash.com/photo-1531761535209-180857e963b9?w=900&h=600&fit=crop&auto=format',
    unsplashQuery: 'fitz roy el chalten',
    beschrijving: 'Fitz Roy — de meest iconische berg van Patagonië. Dagwandelingen naar Laguna de los Tres en Laguna Torre.',
    stops: ['Fitz Roy', 'Laguna de los Tres', 'Laguna Torre', 'Cerro Torre'],
    accent: 'Argentinië',
  },
  {
    route: '/ushuaia',
    naam: 'Ushuaia',
    dagBereik: 'Dagen 19–20',
    hero: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=900&h=600&fit=crop&auto=format',
    unsplashQuery: 'ushuaia tierra del fuego',
    beschrijving: 'De zuidelijkste stad ter wereld. Beagle Channel, Tierra del Fuego Nationaal Park en de sprong naar de Falklands.',
    stops: ['Beagle Channel', 'Tierra del Fuego NP', 'Stanley vlucht'],
    accent: 'Argentinië',
  },
  {
    route: '/falklands',
    naam: 'Falkland Islands',
    dagBereik: 'Dagen 21–25',
    hero: 'https://images.unsplash.com/photo-1551244072-5d12893278bc?w=900&h=600&fit=crop&auto=format',
    unsplashQuery: 'falkland islands penguins',
    beschrijving: 'Ongerepte wildlife op de rand van Antarctica. Vijf pinguïnsoorten, olifantzeehonden en de sfeervolle hoofdstad Stanley.',
    stops: ['Stanley', 'Sea Lion Island', 'King Penguins', 'FIGAS charter'],
    accent: 'Falkland Islands',
  },
];

const tripStats = [
  { icon: Calendar, label: '25 Dagen', sub: 'Totale reisduur' },
  { icon: Compass, label: '4 Regio\'s', sub: 'Chili · Argentinië · Falklands' },
  { icon: Users, label: '2 Reizigers', sub: 'Huwelijksreis' },
  { icon: MapPin, label: '5 Routes', sub: 'Puerto Montt → Amsterdam' },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <div className="relative w-full h-[600px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1600&h=900&fit=crop&auto=format"
          alt="Patagonia landscape"
          className="w-full h-full object-cover"
          style={{ objectPosition: 'center 35%' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end px-6 pb-16 max-w-5xl mx-auto left-0 right-0">
          <div className="flex items-center gap-3 mb-5">
            <span className="text-xs font-medium text-white/80 bg-white/15 backdrop-blur-sm border border-white/25 rounded-full px-4 py-1.5 uppercase tracking-widest">
              Huwelijksreis 2025
            </span>
            <span className="text-xs font-medium bg-groen/70 text-white backdrop-blur-sm border border-groen/40 rounded-full px-4 py-1.5">
              25 Dagen
            </span>
          </div>
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-bold text-white leading-tight mb-4">
            Patagonia &<br />Falkland Islands
          </h1>
          <p className="text-xl text-white/75 font-light max-w-2xl leading-relaxed">
            Van de wilde Carretera Austral tot de ongerepte wildlife van de Falklands — 25 dagen aan het einde van de wereld.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-2 sm:grid-cols-4 gap-6">
          {tripStats.map(({ icon: Icon, label, sub }) => (
            <div key={label} className="text-center">
              <div className="flex justify-center mb-2">
                <Icon className="w-6 h-6 text-white/70" />
              </div>
              <p className="font-serif text-2xl font-bold">{label}</p>
              <p className="text-xs text-white/60 mt-0.5">{sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Route overview */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold text-groen uppercase tracking-widest mb-2">De Route</p>
          <h2 className="font-serif text-4xl font-bold text-tekst">25 Dagen, 4 Blokken</h2>
          <p className="text-muted mt-3 max-w-xl mx-auto leading-relaxed">
            Van het noorden van Patagonië richting het zuiden — camper, vlucht, boot en FIGAS charter.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-8">
          {blokken.map((blok, i) => (
            <BlokCard
              key={blok.route}
              route={blok.route}
              naam={blok.naam}
              dagBereik={blok.dagBereik}
              fallbackHero={blok.hero}
              unsplashQuery={blok.unsplashQuery}
              beschrijving={blok.beschrijving}
              stops={blok.stops}
              accent={blok.accent}
              index={i}
            />
          ))}
        </div>
      </div>

      {/* Route strip visual */}
      <div className="bg-groen-licht border-y border-groen/10 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-semibold text-groen uppercase tracking-widest text-center mb-8">
            De volledige route
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {[
              'Puerto Montt', 'Parque Pumalín', 'Puyuhuapi', 'Queulat NP', 'Cerro Castillo',
              'El Chaltén', 'Ushuaia', 'Stanley', 'Sea Lion Island',
            ].map((stop, i, arr) => (
              <div key={stop} className="flex items-center gap-3">
                <span className="text-sm font-medium text-groen bg-white border border-groen/20 rounded-full px-4 py-1.5 shadow-sm">
                  {stop}
                </span>
                {i < arr.length - 1 && (
                  <ArrowRight className="w-3.5 h-3.5 text-groen/40" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-8 px-4 text-center">
        <p className="font-serif text-lg text-groen font-semibold mb-1">reisbazen</p>
        <p className="text-xs text-muted">Patagonia & Falkland Islands — Huwelijksreis 2025</p>
      </footer>
    </div>
  );
}
