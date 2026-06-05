import { Link } from 'react-router-dom';
import { MapPin, Calendar, Sun, Truck, Heart, ArrowRight, ArrowLeft } from 'lucide-react';
import BlokCard from '../components/BlokCard';
import RouteKaart from '../components/RouteKaart';

const blokken = [
  {
    route: '/patagonie/carretera-austral',
    naam: 'Carretera Austral',
    dagBereik: 'Dagen 1–14',
    hero: 'https://images.unsplash.com/photo-1518787289325-94c6917b88ef?w=900&h=600&fit=crop&auto=format',
    beschrijving: 'Chili\'s wilde ruggengraat per camper. Van Puerto Montt tot Balmaceda langs fjorden, gletsjers en onverharde wegen.',
    stops: ['Puerto Montt', 'Parque Pumalín', 'Puyuhuapi', 'Queulat', 'Cerro Castillo'],
    accent: 'Chili',
  },
  {
    route: '/patagonie/el-chalten',
    naam: 'El Chaltén',
    dagBereik: 'Dagen 15–18',
    hero: 'https://images.unsplash.com/photo-1626368185783-7c928d6f0133?w=900&h=600&fit=crop&auto=format',
    beschrijving: 'Fitz Roy — de meest iconische berg van Patagonië. Dagwandelingen naar Laguna de los Tres en Laguna Torre.',
    stops: ['Fitz Roy', 'Laguna de los Tres', 'Laguna Torre', 'Cerro Torre'],
    accent: 'Argentinië',
  },
  {
    route: '/patagonie/ushuaia',
    naam: 'Ushuaia',
    dagBereik: 'Dagen 19–20',
    hero: 'https://images.unsplash.com/photo-1727876242321-adfd8fc68669?w=900&h=600&fit=crop&auto=format',
    beschrijving: 'De zuidelijkste stad ter wereld. Beagle Channel, Tierra del Fuego Nationaal Park en de sprong naar de Falklands.',
    stops: ['Beagle Channel', 'Tierra del Fuego NP', 'Stanley vlucht'],
    accent: 'Argentinië',
  },
  {
    route: '/patagonie/falklands',
    naam: 'Falkland Islands',
    dagBereik: 'Dagen 21–25',
    hero: 'https://images.unsplash.com/photo-1493825402953-2eb41bfdbba2?w=900&h=600&fit=crop&auto=format',
    beschrijving: 'Ongerepte wildlife op de rand van Antarctica. Vijf pinguïnsoorten, olifantzeehonden en de sfeervolle hoofdstad Stanley.',
    stops: ['Stanley', 'Sea Lion Island', 'King Penguins', 'FIGAS charter'],
    accent: 'Falkland Islands',
  },
];

const tripStats = [
  { icon: Calendar, label: '25 Dagen',       sub: 'Reisduur' },
  { icon: Sun,      label: 'Nov – Mrt',      sub: 'Beste reistijd' },
  { icon: Truck,    label: 'Camper · Jeep',  sub: 'Vervoer' },
  { icon: Heart,    label: 'Huwelijksreis',  sub: 'Type reis' },
];

export default function PatagoniePage() {
  return (
    <div>
      {/* Hero */}
      <div className="relative w-full h-[600px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1558517286-8a9cb0b8c793?w=1600&h=900&fit=crop&auto=format"
          alt="Patagonië & Falklands"
          className="w-full h-full object-cover"
          style={{ objectPosition: 'center 35%' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end px-6 pb-16 max-w-6xl mx-auto left-0 right-0">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-6">
            <Link to="/" className="text-xs text-white/60 hover:text-white/90 transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" />
              Routebaas
            </Link>
            <span className="text-white/30 text-xs">/</span>
            <span className="text-xs text-white/80">Patagonië & Falklands</span>
          </div>

          <h1 className="font-serif text-5xl sm:text-6xl font-bold text-white leading-tight mb-4 whitespace-nowrap">
            Patagonië & Falkland Islands
          </h1>
          <p className="font-body text-xl text-white/75 font-light max-w-2xl leading-relaxed">
            Van de wilde Carretera Austral tot de ongerepte wildlife van de Falklands — 25 dagen aan het einde van de wereld.
          </p>

          {/* Quick blok links */}
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
          <div className="grid md:grid-cols-2 gap-8 items-stretch">

            {/* Links: reisoverzicht blok */}
            <div className="rounded-2xl overflow-hidden border border-groen/15 bg-white shadow-sm flex flex-col h-full">
              {/* Cover */}
              <div className="relative h-48 overflow-hidden flex-shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1558517286-8a9cb0b8c793?w=900&h=600&fit=crop&auto=format"
                  alt="Patagonië & Falklands"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-[10px] font-semibold text-white/70 uppercase tracking-widest mb-1">25 Dagen</p>
                  <h3 className="font-serif text-2xl font-bold text-white leading-tight">Patagonië & Falklands</h3>
                </div>
              </div>

              {/* Tekst + knop */}
              <div className="p-5 flex flex-col flex-1 justify-end gap-4">
                <p className="font-body text-sm text-muted leading-relaxed">
                  Bekijk de uitgebreide dagplanningen van deze avontuurlijke reis — van de Carretera Austral tot de Falkland Islands, dag voor dag uitgewerkt.
                </p>
                <Link
                  to="/patagonie/volledig"
                  className="flex items-center gap-1.5 text-groen text-sm font-semibold group-hover:gap-2.5 transition-all group"
                >
                  Bekijk uitgebreide dagindeling
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Rechts: interactieve Leaflet kaart */}
            <div className="flex flex-col gap-3 h-full">
              <div className="flex-1 min-h-0">
                <RouteKaart />
              </div>
              <a
                href="https://www.google.com/maps/dir/Puerto+Montt,Chile/Parque+Pumalin,Chile/Puyuhuapi,Chile/Queulat,Chile/Villa+Cerro+Castillo,Chile/El+Chalten,Argentina/Ushuaia,Argentina/Stanley,Falkland+Islands"
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
            Van de wilde Carretera Austral tot de ongerepte wildlife van de Falklands — 25 dagen aan het einde van de wereld.
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
        <p className="text-xs text-muted mt-1">Patagonië & Falkland Islands — Huwelijksreis</p>
      </footer>
    </div>
  );
}
