export interface FotoCredit {
  url: string; // Link naar Unsplash foto-pagina
}

export interface Dag {
  id: string;
  dag: number | string;
  titel: string;
  locatie: string;
  badges: string[];
  foto: string;
  fotoCredit: FotoCredit;
  beschrijving: string;
  activiteiten?: string[];
  praktisch?: { icon: string; label: string; waarde: string }[];
}

export interface Blok {
  id: string;
  naam: string;
  subtitel: string;
  dagBereik: string;
  hero: string;
  heroCredit: FotoCredit;
  dagen: Dag[];
  praktischInfo: { icon: string; label: string; waarde: string }[];
  route: string;
  vorigeBlok?: { naam: string; route: string };
  volgendeBlok?: { naam: string; route: string };
}

export const alleStops = [
  { naam: 'Puerto Montt', route: '/carretera-austral' },
  { naam: 'Parque Pumalín', route: '/carretera-austral' },
  { naam: 'Puyuhuapi', route: '/carretera-austral' },
  { naam: 'Queulat NP', route: '/carretera-austral' },
  { naam: 'Cerro Castillo', route: '/carretera-austral' },
  { naam: 'Coyhaique', route: '/carretera-austral' },
  { naam: 'El Chaltén', route: '/el-chalten' },
  { naam: 'Ushuaia', route: '/ushuaia' },
  { naam: 'Stanley', route: '/falklands' },
  { naam: 'Sea Lion Island', route: '/falklands' },
];

export const blokken: Record<string, Blok> = {
  carretera: {
    id: 'carretera',
    naam: 'Carretera Austral',
    subtitel: 'Chili\'s wilde ruggengraat per camper',
    dagBereik: 'Dagen 1–14',
    hero: 'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=1600&h=900&fit=crop&auto=format',
    heroCredit: { url: 'https://unsplash.com/photos/1508193638397-1c4234db14d8' },
    route: '/carretera-austral',
    volgendeBlok: { naam: 'El Chaltén', route: '/el-chalten' },
    praktischInfo: [
      { icon: '🗓', label: 'Beste tijd', waarde: 'November – maart' },
      { icon: '🚐', label: 'Vervoer', waarde: '4x4 camper met daktent' },
      { icon: '🛣', label: 'Weg', waarde: 'Deels onverhard (ripio)' },
      { icon: '⛽', label: 'Benzine', waarde: 'Vol tanken bij elke stop' },
      { icon: '🛂', label: 'Grens', waarde: 'Geen grensovergang nodig (volledig Chili)' },
    ],
    dagen: [
      {
        id: 'dag1',
        dag: 1,
        titel: 'Aankomst & Camper Ophalen',
        locatie: 'Puerto Montt',
        _unsplashQuery:'puerto montt chile',
        badges: ['Vlucht aankomst', 'Camper ophalen', 'Halve dag'],
        foto: 'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=1200&h=700&fit=crop&auto=format',
        fotoCredit: { url: 'https://unsplash.com/photos/1585208798174-6cedd86e019a' },
        beschrijving: 'Na een lange vlucht vanuit Amsterdam via Santiago de Chile landen we in Puerto Montt — de poort naar Patagonië. We halen de camper op en bereiden ons voor op 14 dagen van pure wildernis.',
        praktisch: [
          { icon: '✈️', label: 'Vlucht', waarde: 'AMS → SCL → PMC' },
          { icon: '🚐', label: 'Camper', waarde: 'One-way, inleveren Balmaceda dag 14' },
          { icon: '💡', label: 'Tip', waarde: 'Voor 15:00 aan? Rijd direct door naar Hornopirén' },
        ],
      },
      {
        id: 'dag2',
        dag: '2–3',
        titel: 'Ferry & Eerste Hikes',
        locatie: 'Parque Pumalín',
        _unsplashQuery:'patagonia forest park',
        badges: ['Ferry Hornopirén', 'Oud-groeiwoud'],
        foto: 'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=1200&h=700&fit=crop&auto=format',
        fotoCredit: { url: 'https://unsplash.com/photos/1586348943529-beaae6c28db9' },
        beschrijving: 'Met de veerboot steken we over naar Caleta Gonzalo, het hart van Parque Pumalín. Oud-groeiwoud, bamboe-jungle en de sluimerende Volcán Chaitén wachten op ons.',
        activiteiten: [
          'Sendero Cascadas trail door het oud-groeiwoud',
          'Volcán Chaitén wandeling (uitzicht op de lava-dome)',
          'Wildkamperen in het nationaal park',
        ],
      },
      {
        id: 'dag4',
        dag: '4–5',
        titel: 'Fjorden & Warmwaterbronnen',
        locatie: 'Puyuhuapi',
        _unsplashQuery:'patagonia fjord',
        badges: ['Fjord', 'Warmwaterbronnen'],
        foto: 'https://images.unsplash.com/photo-1508785942-40807a1543e5?w=1200&h=700&fit=crop&auto=format',
        fotoCredit: { url: 'https://unsplash.com/photos/1508785942-40807a1543e5' },
        beschrijving: 'Het verregende, mysterieuze Puyuhuapi ligt aan een smal fjord. De absolute highlight: Termas de Puyuhuapi — warmwaterbronnen direct aan het water, omgeven door bos en mist.',
        activiteiten: [
          'Termas de Puyuhuapi — hot springs aan het fjord (dag of overnachting)',
          'Kajakken door het fjord (optioneel)',
          'Dorpje Puyuhuapi verkennen (Duits koloniale architectuur)',
        ],
      },
      {
        id: 'dag6',
        dag: '6–7',
        titel: 'De Hangende Gletsjer',
        locatie: 'Queulat NP',
        _unsplashQuery:'glacier patagonia',
        badges: ['Nationaal Park', 'Gletsjer'],
        foto: 'https://images.unsplash.com/photo-1467746474745-41dd2c7524ce?w=1200&h=700&fit=crop&auto=format',
        beschrijving: 'Queulat is misschien wel het meest dramatische landschap van de Carretera. De Ventisquero Colgante — een gletsjer die letterlijk boven een watermassa hangt — is een van de meest gefotografeerde plekken van Patagonië.',
        activiteiten: [
          'Ventisquero Colgante trail (hangend gletsjer viewpoint)',
          'Laguna Los Témpanos (bootje naar de gletsjer)',
          'Río Guillermo wilde camping',
        ],
      },
      {
        id: 'dag8',
        dag: '8–11',
        titel: 'Cerro Castillo Circuit',
        locatie: 'Cerro Castillo',
        _unsplashQuery:'cerro castillo patagonia',
        badges: ['Meerdaagse hike', 'Wildkamperen'],
        foto: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1200&h=700&fit=crop&auto=format',
        beschrijving: 'Vier dagen te voet door een van Patagonië\'s meest spectaculaire maar minder bekende parken. Het Cerro Castillo Circuit (70 km) voert langs dramatische basaltzuilen, turquoise meren en zwarte rotswanden — en condors cirkelen boven je hoofd.',
        activiteiten: [
          'Cerro Castillo Circuit — 4 dagen, ~70 km wildkamperen',
          'Basaltzuilen landschap en glaciale valleien',
          'Condors spotten boven de toppen',
          'Uitzicht op de ijzige Cerro Castillo piek (2675m)',
        ],
      },
      {
        id: 'dag12',
        dag: '12–13',
        titel: 'Doorrijden naar het Zuiden',
        locatie: 'Villa Cerro Castillo & Coyhaique',
        _unsplashQuery:'coyhaique patagonia',
        badges: ['Roadtrip'],
        foto: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&h=700&fit=crop&auto=format',
        beschrijving: 'Na de intensiteit van het circuit genieten we van twee rustigere roadtrip-dagen richting het zuiden. De lokale markt van Villa Cerro Castillo biedt zelfgemaakte kazen en wol, en Coyhaique is de laatste grote stad voor een bevoorradingsronde.',
        activiteiten: [
          'Lokale markt Villa Cerro Castillo (artesanía)',
          'Reserva Nacional Coyhaique dagwandeling (optioneel)',
          'Coyhaique: supermarkt, restaurant, laatste bevoorradingsronde',
        ],
      },
      {
        id: 'dag14',
        dag: 14,
        titel: 'Camper Inleveren & Vlucht',
        locatie: 'Balmaceda',
        _unsplashQuery:'patagonia airport',
        badges: ['Vlucht', 'Halve dag'],
        foto: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&h=700&fit=crop&auto=format',
        beschrijving: 'Het eerste hoofdstuk sluit af in Balmaceda. We leveren de camper in na 13 dagen Carretera Austral en nemen de vlucht naar El Calafate of Río Gallegos richting Argentinië.',
        praktisch: [
          { icon: '🚐', label: 'Camper', waarde: 'Inleveren Balmaceda (SAME depot)' },
          { icon: '✈️', label: 'Vlucht', waarde: 'Balmaceda → El Calafate of Río Gallegos' },
          { icon: '🌅', label: 'Laatste tip', waarde: 'Vroeg vertrekken, vlucht tijdig inpassen' },
        ],
      },
    ],
  },

  chalten: {
    id: 'chalten',
    naam: 'El Chaltén',
    subtitel: 'Fitz Roy — de meest iconische berg van Patagonië',
    dagBereik: 'Dagen 15–18',
    hero: 'https://images.unsplash.com/photo-1531761535209-180857e963b9?w=1600&h=900&fit=crop&auto=format',
    route: '/el-chalten',
    vorigeBlok: { naam: 'Carretera Austral', route: '/carretera-austral' },
    volgendeBlok: { naam: 'Ushuaia', route: '/ushuaia' },
    praktischInfo: [
      { icon: '🗓', label: 'Beste tijd', waarde: 'November – maart' },
      { icon: '🎫', label: 'Nationaal Park', waarde: 'Gratis toegang' },
      { icon: '🌦', label: 'Weer', waarde: 'Extreem wisselvallig, check Windy.com' },
      { icon: '⏰', label: 'Tip', waarde: 'Laguna de los Tres bij zonsopgang (start 05:00)' },
    ],
    dagen: [
      {
        id: 'dag15',
        dag: 15,
        titel: 'Aankomst & Acclimatiseren',
        locatie: 'El Chaltén',
        _unsplashQuery:'el chalten fitz roy',
        badges: ['Fitz Roy', 'Weercheck'],
        foto: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1200&h=700&fit=crop&auto=format',
        beschrijving: 'El Chaltén — het kleine wandeldorpje aan de voet van Fitz Roy. Dag één is voor acclimatiseren, het dorp verkennen en cruciale weersinformatie ophalen voor de komende dagen.',
        activiteiten: [
          'Mirador de los Cóndores (korte acclimatisatiewandeling, 1–2u)',
          'El Chaltén dorpje verkennen, restaurant & supplies',
          'Weersvoorspelling checken via Windy.com en lokale bergschool',
          'Plan de dagwandelingen op basis van het weer',
        ],
      },
      {
        id: 'dag16',
        dag: '16–17',
        titel: 'Fitz Roy Hikes',
        locatie: 'El Chaltén',
        _unsplashQuery:'laguna de los tres',
        badges: ['Dagwandelingen', 'Iconisch uitzicht'],
        foto: 'https://images.unsplash.com/photo-1531761535209-180857e963b9?w=1200&h=700&fit=crop&auto=format',
        beschrijving: 'De twee absolute hoogtepunten van Patagonië op twee dagen: Laguna de los Tres met het basecamp-uitzicht op Fitz Roy, en Laguna Torre met Cerro Torre in het verschiet. Bij vroeg vertrek op dag 1 zijn beide haalbaar.',
        activiteiten: [
          'Laguna de los Tres — 23 km dagwandeling, Fitz Roy basecamp uitzicht (dé highlight)',
          'Laguna Torre — 18 km, Cerro Torre uitzicht',
          'Tip: Start Laguna de los Tres om 05:00 voor de beste lichtomstandigheden',
          'Kunnen gecombineerd worden bij vroeg vertrek',
        ],
      },
      {
        id: 'dag18',
        dag: 18,
        titel: 'Extra Dag & Vertrek',
        locatie: 'El Chaltén',
        _unsplashQuery:'patagonia waterfall',
        badges: ['Flexibele dag'],
        foto: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&h=700&fit=crop&auto=format',
        beschrijving: 'Een flexibele dag als buffer voor slecht weer, of voor een rustigere hike naar Laguna Capri. \'s Middags vertrekken we richting Ushuaia.',
        activiteiten: [
          'Laguna Capri (rustiger alternatief, 12 km, prachtig uitzicht)',
          'Chorrillo del Salto waterval (makkelijke wandeling)',
          'Vertrek richting Ushuaia via Río Gallegos',
        ],
      },
    ],
  },

  ushuaia: {
    id: 'ushuaia',
    naam: 'Ushuaia',
    subtitel: 'Het einde van de wereld — begin van het avontuur',
    dagBereik: 'Dagen 19–20',
    hero: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1600&h=900&fit=crop&auto=format',
    route: '/ushuaia',
    vorigeBlok: { naam: 'El Chaltén', route: '/el-chalten' },
    volgendeBlok: { naam: 'Falkland Islands', route: '/falklands' },
    praktischInfo: [
      { icon: '🗓', label: 'Beste tijd', waarde: 'December – februari' },
      { icon: '⛵', label: 'Beagle Channel', waarde: 'Boottocht ~3 uur' },
      { icon: '✈️', label: 'FIGAS vlucht', waarde: 'Reserveer 3+ maanden van tevoren' },
    ],
    dagen: [
      {
        id: 'dag19',
        dag: 19,
        titel: 'Aankomst & Beagle Channel',
        locatie: 'Ushuaia',
        _unsplashQuery:'ushuaia patagonia',
        badges: ['Zuidelijkste stad', 'Beagle Channel'],
        foto: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1200&h=700&fit=crop&auto=format',
        beschrijving: 'Ushuaia — de zuidelijkste stad ter wereld, hangend boven het Beagle-kanaal. Na aankomst nemen we een boottocht over het kanaal langs pinguïns, zeehonden en zeeleeuwen.',
        activiteiten: [
          'Beagle Channel boottocht (~3 uur, pinguïns, zeehonden, zeeleeuwen)',
          'Ushuaia stad wandeling langs de kleurrijke havenhuizen',
          'Museo del Fin del Mundo (geschiedenis van Vuurland)',
        ],
      },
      {
        id: 'dag20',
        dag: 20,
        titel: 'Tierra del Fuego NP & Vlucht',
        locatie: 'Ushuaia',
        _unsplashQuery:'tierra del fuego national park',
        badges: ['Nationaal Park', 'Vlucht Falklands'],
        foto: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&h=700&fit=crop&auto=format',
        beschrijving: 'Een laatste ochtend in het meest zuidelijke nationaal park van de wereld, langs het Beagle-kanaal. \'s Middags vliegen we richting Stanley — de Falkland Islands wachten.',
        activiteiten: [
          'Tierra del Fuego NP — Senda Costera langs het kanaal (8 km)',
          'Tren del Fin del Mundo (optioneel, historische treintocht)',
          'Check-in vlucht naar Stanley, Falkland Islands',
        ],
      },
    ],
  },

  falklands: {
    id: 'falklands',
    naam: 'Falkland Islands',
    subtitel: 'Ongerepte wildlife op de rand van Antarctica',
    dagBereik: 'Dagen 21–25',
    hero: 'https://images.unsplash.com/photo-1551244072-5d12893278bc?w=1600&h=900&fit=crop&auto=format',
    route: '/falklands',
    vorigeBlok: { naam: 'Ushuaia', route: '/ushuaia' },
    praktischInfo: [
      { icon: '💷', label: 'Valuta', waarde: 'Falkland Pound (FKP, 1:1 met GBP)' },
      { icon: '🗣', label: 'Taal', waarde: 'Engels' },
      { icon: '✈️', label: 'Vlucht', waarde: 'LATAM vanuit Santiago of via Montevideo' },
      { icon: '🛩', label: 'FIGAS charter', waarde: 'Enige optie voor buitenste eilanden' },
    ],
    dagen: [
      {
        id: 'dag21',
        dag: '21–22',
        titel: 'Stanley Verkennen',
        locatie: 'Stanley',
        _unsplashQuery:'falkland islands stanley',
        badges: ['Falkland Islands', 'Wildlife'],
        foto: 'https://images.unsplash.com/photo-1551244072-5d12893278bc?w=1200&h=700&fit=crop&auto=format',
        beschrijving: 'Stanley is de meest geïsoleerde hoofdstad ter wereld — en een van de meest charming. Kleurrijke houten huizen langs de harbour, scheepswrakken in de baai en het vriendelijkste publiek ter wereld.',
        activiteiten: [
          'Stanley harbour wandeling langs de kleurrijke gevel-huizen',
          'Christ Church Cathedral (meest zuidelijke Anglicaanse kathedraal)',
          'Scheepswrakken & Whalebone Arch',
          'Lokale pub — Rose Bar (het bruisende hart van Stanley)',
        ],
      },
      {
        id: 'dag23',
        dag: '23–24',
        titel: 'Sea Lion Island — Wildlife Paradijs',
        locatie: 'Sea Lion Island',
        _unsplashQuery:'penguin sea lion wildlife',
        badges: ['Sea Lions', '5 pinguïnsoorten'],
        foto: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=1200&h=700&fit=crop&auto=format',
        beschrijving: 'Het absolute hoogtepunt van de reis: Sea Lion Island. Dit kleine eiland aan de zuidrand van de Falklands heeft de hoogste wildlife-dichtheid ter wereld — en de Sea Lion Island Lodge is de perfecte honeymoon-uitvalsbasis.',
        activiteiten: [
          'Sea Lion Island Lodge (exclusieve honeymoon accommodatie)',
          'King penguins & rockhopper penguins op steenworp afstand',
          'Olifantzeehonden — kolos op het strand',
          'Striated Caracara (Johnny Rook) roofvogel verkenning',
          'Magellanic, gentoo en macaroni pinguïns spotten',
        ],
      },
      {
        id: 'dag25',
        dag: 25,
        titel: 'Terugreis',
        locatie: 'Stanley',
        _unsplashQuery:'plane travel sky',
        badges: ['Vertrek', 'Halve dag'],
        foto: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&h=700&fit=crop&auto=format',
        beschrijving: 'Het avontuur eindigt waar het begon — in de lucht. FIGAS charter terug naar Stanley, daarna de lange vlucht naar huis via Santiago de Chile en Amsterdam.',
        praktisch: [
          { icon: '🛩', label: 'FIGAS charter', waarde: 'Sea Lion Island → Stanley' },
          { icon: '✈️', label: 'Vlucht', waarde: 'Stanley → Santiago → Amsterdam' },
          { icon: '💚', label: 'Herinnering', waarde: '25 dagen Patagonië & Falklands — voor altijd' },
        ],
      },
    ],
  },
};
