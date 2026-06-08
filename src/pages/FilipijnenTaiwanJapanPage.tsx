import { Link } from 'react-router-dom';
import { MapPin, Calendar, Sun, Plane, Compass, ArrowRight, ArrowLeft } from 'lucide-react';
import BlokCard from '../components/BlokCard';
import RouteKaartFilipijnenTaiwanJapan from '../components/RouteKaartFilipijnenTaiwanJapan';

const blokken = [
  {
    route: '/filipijnen-taiwan-japan/port-barton',
    naam: 'Port Barton',
    dagBereik: 'Dagen 1–5',
    hero: 'https://images.unsplash.com/photo-1709710496658-b96d070f38bd?w=900&h=600&fit=crop&auto=format',
    beschrijving: 'Slow start op het rustige, ongepolijste West-Palawan. Snorkelen met schildpadden, sandbanks vol zeesterren en een jungle-waterval, ver van de massa.',
    stops: ['Manila', 'Port Barton', 'Twin Reef', 'Pamuayan Falls'],
    accent: 'Filipijnen',
  },
  {
    route: '/filipijnen-taiwan-japan/el-nido',
    naam: 'El Nido',
    dagBereik: 'Dagen 6–8',
    hero: 'https://images.unsplash.com/photo-1561459832-f79f04d51e4a?w=900&h=600&fit=crop&auto=format',
    beschrijving: 'Kalkstenen kliffen en lagunes, maar dan de stille kant. Een afgelegen lodge, Nacpan Beach en kajakken naar Cadlao Island.',
    stops: ['Nacpan Beach', 'Las Cabanas', 'Cadlao Island'],
    accent: 'Filipijnen',
  },
  {
    route: '/filipijnen-taiwan-japan/tao-expeditie',
    naam: 'Tao Expeditie',
    dagBereik: 'Dagen 9–12',
    hero: 'https://images.unsplash.com/photo-1602587921225-3cca658d31bb?w=900&h=600&fit=crop&auto=format',
    beschrijving: 'Een meerdaagse boottocht van El Nido naar Coron door de Linapacan-archipel. Slapen in bamboehutten op verlaten eilanden, volledig offline.',
    stops: ['Verborgen lagunes', 'Linapacan', 'Strandcamping'],
    accent: 'Filipijnen',
  },
  {
    route: '/filipijnen-taiwan-japan/coron',
    naam: 'Coron',
    dagBereik: 'Dagen 13–17',
    hero: 'https://images.unsplash.com/photo-1728042743634-9e7189add952?w=900&h=600&fit=crop&auto=format',
    beschrijving: 'Kristalheldere meren, Japanse WOII-wrakken en een afgelegen luxe-eiland als tegenwicht voor de expeditie.',
    stops: ['Barracuda Lake', 'Mt. Tapyas', 'Wrakduiken', 'Eilandresort'],
    accent: 'Filipijnen',
  },
  {
    route: '/filipijnen-taiwan-japan/smangus',
    naam: 'Smangus',
    dagBereik: 'Dagen 18–21',
    hero: 'https://images.unsplash.com/photo-1690502833165-50b37b194cf0?w=900&h=600&fit=crop&auto=format',
    beschrijving: 'Een afgelegen Atayal-bergdorp aan het einde van de weg, met reuzencipressen van meer dan duizend jaar oud en een ongerepte sterrenhemel.',
    stops: ['Taipei', 'Giant Trees Trail', 'Atayal-dorp'],
    accent: 'Taiwan',
  },
  {
    route: '/filipijnen-taiwan-japan/taroko',
    naam: 'Taroko & Oostkust',
    dagBereik: 'Dagen 22–26',
    hero: 'https://images.unsplash.com/photo-1635245728738-e47dffdd4763?w=900&h=600&fit=crop&auto=format',
    beschrijving: 'De marmeren kloof van Taroko, de dramatische Qingshui Cliffs en fietsen door de rijstvelden van de East Rift Valley.',
    stops: ['Hualien', 'Taroko Gorge', 'Qingshui Cliffs', 'Chishang'],
    accent: 'Taiwan',
  },
  {
    route: '/filipijnen-taiwan-japan/kumano-kodo',
    naam: 'Kumano Kodo',
    dagBereik: 'Dagen 27–32',
    hero: 'https://images.unsplash.com/photo-1699444118063-d4457ecace26?w=900&h=600&fit=crop&auto=format',
    beschrijving: 'Een meerdaagse pelgrimshike door de Kii-bergen, met Oud & Nieuw in het afgelegen Yunomine Onsen en de Nachi-waterval op nieuwjaarsdag.',
    stops: ['Osaka', 'Nakahechi', 'Yunomine Onsen', 'Nachi'],
    accent: 'Japan',
  },
  {
    route: '/filipijnen-taiwan-japan/kiso-kyoto',
    naam: 'Kiso & Kyoto',
    dagBereik: 'Dagen 33–36',
    hero: 'https://images.unsplash.com/photo-1763507989868-028e5c4efda1?w=900&h=600&fit=crop&auto=format',
    beschrijving: 'Oud Kyoto in alle vroegte en de historische Nakasendo-postweg van Magome naar Tsumago, door bewaarde Edo-dorpjes.',
    stops: ['Kyoto', 'Arashiyama', 'Narai-juku', 'Tsumago'],
    accent: 'Japan',
  },
  {
    route: '/filipijnen-taiwan-japan/shiga-tokyo',
    naam: 'Shiga Kogen & Tokyo',
    dagBereik: 'Dagen 37–42',
    hero: 'https://images.unsplash.com/photo-1642753176692-ddac25863ff7?w=900&h=600&fit=crop&auto=format',
    beschrijving: 'Poedersneeuw in het grootste skigebied van Japan en een zachte landing in de lokale buurten van Tokyo.',
    stops: ['Shiga Kogen', 'Shimokitazawa', 'Nonbei Yokocho'],
    accent: 'Japan',
  },
];

const tripStats = [
  { icon: Calendar, label: '42 Dagen',            sub: 'Reisduur' },
  { icon: Sun,      label: 'Dec tot jan',         sub: 'Beste reistijd' },
  { icon: Plane,    label: 'Boot · Vlucht · Trein', sub: 'Vervoer' },
  { icon: Compass,  label: 'Avontuur',            sub: 'Type reis' },
];

export default function FilipijnenTaiwanJapanPage() {
  return (
    <div>
      {/* Hero */}
      <div className="relative w-full h-[600px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1753482770920-aab0bc38319c?w=1600&h=900&fit=crop&auto=format"
          alt="Filipijnen, Taiwan & Japan"
          className="w-full h-full object-cover"
          style={{ objectPosition: 'center 45%' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent h-24" />
        <div className="absolute inset-0 flex flex-col justify-end px-6 pb-16 max-w-6xl mx-auto left-0 right-0">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-6">
            <Link to="/" className="text-xs text-white/60 hover:text-white/90 transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" />
              Routebaas
            </Link>
            <span className="text-white/30 text-xs">/</span>
            <span className="text-xs text-white/80">Filipijnen, Taiwan & Japan</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl font-bold text-white leading-tight mb-4">
            Filipijnen, Taiwan & Japan
          </h1>
          <p className="font-body text-xl text-white/75 font-light max-w-2xl leading-relaxed">
            Zes weken off the beaten track: van een eilandexpeditie op Palawan en afgelegen bergen in Taiwan tot de Kumano Kodo, Oud & Nieuw in een onsendorp en poedersneeuw in Shiga Kogen.
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
          <div className="grid sm:grid-cols-2 gap-8 items-stretch">

            {/* Links: reisoverzicht blok */}
            <div className="rounded-2xl overflow-hidden border border-groen/15 bg-white shadow-sm flex flex-col h-full">
              {/* Header */}
              <div className="bg-groen px-5 py-4">
                <p className="text-[10px] font-semibold text-white/60 uppercase tracking-widest mb-1">42 Dagen</p>
                <h3 className="font-serif text-2xl font-bold text-white leading-tight">Filipijnen, Taiwan & Japan</h3>
              </div>

              {/* Beschrijving */}
              <div className="px-5 pt-4 pb-3">
                <p className="text-xs text-muted leading-relaxed">
                  Zes weken dwars door drie landen: slow travel en een eilandexpeditie op Palawan, afgelegen bergen en reuzencipressen in Taiwan, en in Japan de Kumano Kodo, Oud & Nieuw in een onsendorp, de Nakasendo en skiën in Shiga Kogen.
                </p>
              </div>

              {/* reisdelen grid */}
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

              {/* Knop */}
              <div className="px-5 py-3 border-t border-gray-100 mt-auto">
                <Link
                  to="/filipijnen-taiwan-japan/port-barton"
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
                <RouteKaartFilipijnenTaiwanJapan />
              </div>
              <a
                href="https://www.google.com/maps/dir/Manila/Puerto+Princesa/Port+Barton/El+Nido,+Palawan/Coron,+Palawan/Taipei/Smangus/Hualien/Osaka/Kii-Tanabe/Kumano+Hongu+Taisha/Nachi+Falls/Kyoto/Narai,+Nagano/Yudanaka/Shiga+Kogen/Tokyo"
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
            Van de eilanden van Palawan en de bergen van Taiwan tot de pelgrimspaden, post-stadjes en skihellingen van Japan. 42 dagen avontuur voor twee.
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
        <p className="text-xs text-muted mt-1">Filipijnen, Taiwan & Japan · Avontuur · Slow travel</p>
      </footer>
    </div>
  );
}
