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
  _unsplashQuery?: string; // legacy, niet meer in gebruik
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
  reisRoute: string;
  reisNaam: string;
  vorigeBlok?: { naam: string; route: string };
  volgendeBlok?: { naam: string; route: string };
}

export interface Reis {
  id: string;
  naam: string;
  ondertitel: string;
  beschrijving: string;
  cover: string;
  route: string;
  landen: string[];
  duur: number;
  periode?: string;
  status: 'gepland' | 'bucket_list' | 'gedaan';
  typeReis?: string;
  vervoer?: string;
  besteTijd?: string;
}

export const alleStops = [
  { naam: 'Bariloche', route: '/patagonie/bariloche' },
  { naam: 'Puerto Montt', route: '/patagonie/carretera-austral' },
  { naam: 'Parque Pumalín', route: '/patagonie/carretera-austral' },
  { naam: 'Puyuhuapi', route: '/patagonie/carretera-austral' },
  { naam: 'Queulat NP', route: '/patagonie/carretera-austral' },
  { naam: 'Cerro Castillo', route: '/patagonie/carretera-austral' },
  { naam: 'Coyhaique', route: '/patagonie/carretera-austral' },
  { naam: 'El Chaltén', route: '/patagonie/el-chalten' },
  { naam: 'Ushuaia', route: '/patagonie/ushuaia' },
  { naam: 'Stanley', route: '/patagonie/falklands' },
  { naam: 'Sea Lion Island', route: '/patagonie/falklands' },
];

export const alleReizen: Reis[] = [
  {
    id: 'patagonie',
    naam: 'Patagonië & Falklands',
    ondertitel: 'Huwelijksreis langs het einde van de wereld',
    beschrijving: 'Van het Argentijnse merengebied rond Bariloche en de wilde Carretera Austral tot de ongerepte natuur van de Falklands. 29 dagen door het meest spectaculaire landschap op aarde, met camper, vluchten en boottochten.',
    cover: 'https://images.unsplash.com/photo-1558517286-8a9cb0b8c793?w=1200&h=700&fit=crop&auto=format',
    route: '/patagonie',
    landen: ['Argentinië', 'Chili', 'Falkland Islands'],
    duur: 29,
    periode: undefined,
    status: 'bucket_list',
    typeReis: 'Huwelijksreis',
    vervoer: 'Camper · Vlucht',
    besteTijd: 'Nov tot mrt',
  },
];

export const blokken: Record<string, Blok> = {
  bariloche: {
    id: 'bariloche',
    naam: 'Bariloche',
    subtitel: 'Het Argentijnse merengebied aan de voet van de Andes',
    dagBereik: 'Dagen 1–4',
    hero: 'https://images.unsplash.com/photo-1575393476573-6cdacd2e8c88?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1600',
    heroCredit: { url: 'https://unsplash.com/s/photos/bariloche' },
    route: '/patagonie/bariloche',
    reisRoute: '/patagonie',
    reisNaam: 'Patagonië & Falklands',
    volgendeBlok: { naam: 'Carretera Austral', route: '/patagonie/carretera-austral' },
    praktischInfo: [
      { icon: '🗓', label: 'Beste tijd', waarde: 'November tot maart' },
      { icon: '✈️', label: 'Aankomst', waarde: 'Internationale vlucht via Buenos Aires of Santiago' },
      { icon: '🚗', label: 'Vervoer', waarde: 'Huurauto of tours rond het merengebied' },
      { icon: '🛂', label: 'Naar Chili', waarde: 'Cruce Andino: boot en bus over de Andes' },
      { icon: '🍫', label: 'Tip', waarde: 'Bariloche staat bekend om chocolade en craft beer' },
    ],
    dagen: [
      {
        id: 'dag1',
        dag: 1,
        titel: 'Aankomst Bariloche',
        locatie: 'San Carlos de Bariloche',
        badges: ['Vlucht aankomst', 'Meren'],
        foto: 'https://images.unsplash.com/photo-1575819453111-abb276cd4973?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200',
        fotoCredit: { url: 'https://unsplash.com/s/photos/bariloche' },
        beschrijving: 'Het avontuur begint in Bariloche, de toegangspoort tot het Argentijnse merengebied. Na de internationale vlucht installeren we ons en maken we kennis met de bergmeren en met de bergen die over het Nahuel Huapi-meer uittorenen.',
        activiteiten: [
          'Cerro Campanario met de stoeltjeslift voor een van de mooiste panorama\'s',
          'Het Centro Cívico en de chocoladewinkels van Bariloche verkennen',
          'Eerste avond aan de oever van het Nahuel Huapi-meer',
        ],
      },
      {
        id: 'dag2',
        dag: 2,
        titel: 'Circuito Chico & Meren',
        locatie: 'Bariloche',
        badges: ['Roadtrip', 'Meren'],
        foto: 'https://images.unsplash.com/photo-1619710433881-f247da33a071?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200',
        fotoCredit: { url: 'https://unsplash.com/s/photos/bariloche' },
        beschrijving: 'De klassieke Circuito Chico voert langs het Nahuel Huapi-meer en het schiereiland Llao Llao. Een dag van uitzichtpunten, bossen en azuurblauwe baaien aan de voet van de Andes.',
        activiteiten: [
          'Circuito Chico rijden langs de meren en uitzichtpunten',
          'Wandeling door het bos van het schiereiland Llao Llao',
          'Bahía López en Punto Panorámico',
          'Optioneel kajakken op het Nahuel Huapi-meer',
        ],
      },
      {
        id: 'dag3',
        dag: 3,
        titel: 'Refugio Frey Trek',
        locatie: 'Cerro Catedral',
        badges: ['Dagtrek', 'Bergen'],
        foto: 'https://images.unsplash.com/photo-1596266519587-d6958ac51f31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200',
        fotoCredit: { url: 'https://unsplash.com/s/photos/cerro-catedral' },
        beschrijving: 'Een stevige dagtocht vanaf Cerro Catedral naar Refugio Frey, een berghut aan een alpenmeer omringd door granieten torens. De mooiste hike van het merengebied en een perfecte opwarmer voor wat komt.',
        activiteiten: [
          'Refugio Frey trek, zo\'n 20 kilometer heen en terug',
          'Granieten torens en de berglagune bij de hut',
          'Alternatief: dagtrip naar Cerro Tronador en de Ventisquero Negro',
        ],
      },
      {
        id: 'dag4',
        dag: 4,
        titel: 'Cruce Andino naar Chili',
        locatie: 'Bariloche → Puerto Montt',
        badges: ['Reisdag', 'Grensovergang'],
        foto: 'https://images.unsplash.com/photo-1579280456137-aa527151d36d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200',
        fotoCredit: { url: 'https://unsplash.com/s/photos/osorno-volcano' },
        beschrijving: 'Een volledige reisdag via de legendarische Cruce Andino: met boten en bussen steken we over drie Andesmeren de grens met Chili over, richting Puerto Montt. Onderweg passeren we vulkanen, watervallen en oerbos.',
        activiteiten: [
          'Boottochten over de Andesmeren (Nahuel Huapi en Todos los Santos)',
          'Busritten tussen de meren langs vulkaan Osorno',
          'Grensovergang Argentinië naar Chili',
          'Aankomst en overnachting in Puerto Montt',
        ],
      },
    ],
  },

  carretera: {
    id: 'carretera',
    naam: 'Carretera Austral',
    subtitel: 'Chili\'s wilde ruggengraat per camper',
    dagBereik: 'Dagen 5–18',
    hero: 'https://images.unsplash.com/photo-1586214096096-eb48f33f374e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1600',
    heroCredit: { url: 'https://unsplash.com/photos/_7RIy-UNfnI' },
    route: '/patagonie/carretera-austral',
    reisRoute: '/patagonie',
    reisNaam: 'Patagonië & Falklands',
    vorigeBlok: { naam: 'Bariloche', route: '/patagonie/bariloche' },
    volgendeBlok: { naam: 'El Chaltén', route: '/patagonie/el-chalten' },
    praktischInfo: [
      { icon: '🗓', label: 'Beste tijd', waarde: 'November tot maart' },
      { icon: '🚐', label: 'Vervoer', waarde: '4x4 camper' },
      { icon: '🛣', label: 'Weg', waarde: 'Deels onverhard (ripio)' },
      { icon: '⛽', label: 'Benzine', waarde: 'Vol tanken bij elke stop' },
      { icon: '🛂', label: 'Grens', waarde: 'Geen grensovergang nodig (volledig Chili)' },
    ],
    dagen: [
      {
        id: 'dag5',
        dag: 5,
        titel: 'Camper Ophalen in Puerto Montt',
        locatie: 'Puerto Montt',
        _unsplashQuery:'puerto montt chile',
        badges: ['Camper ophalen', 'Halve dag'],
        foto: 'https://images.unsplash.com/photo-1586976477037-0cf4ba43fec9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200',
        fotoCredit: { url: 'https://unsplash.com/photos/m96anQ8roAA' },
        beschrijving: 'Na de Cruce Andino-oversteek zijn we aangekomen in Puerto Montt, de poort naar de Carretera Austral. We halen de 4x4 camper op en bereiden ons voor op veertien dagen pure wildernis.',
        praktisch: [
          { icon: '🚐', label: 'Camper', waarde: 'Ophalen in Puerto Montt, inleveren in Balmaceda op dag 18' },
          { icon: '🛒', label: 'Proviand', waarde: 'Inslaan in Puerto Montt voor de eerste dagen' },
          { icon: '💡', label: 'Tip', waarde: 'Voor 15:00 klaar? Rijd direct door naar Hornopirén' },
        ],
      },
      {
        id: 'dag6',
        dag: '6–7',
        titel: 'Ferry & Eerste Hikes',
        locatie: 'Parque Pumalín',
        _unsplashQuery:'patagonia forest park',
        badges: ['Ferry Hornopirén', 'Oud regenwoud'],
        foto: 'https://images.unsplash.com/photo-1707892558527-6ef07b53d093?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200',
        fotoCredit: { url: 'https://unsplash.com/photos/M-HE0QWE-hY' },
        beschrijving: 'Met de veerboot steken we over naar Caleta Gonzalo, het hart van Parque Pumalín. Eeuwenoud regenwoud, dichte bamboebossen en de sluimerende Volcán Chaitén wachten op ons.',
        activiteiten: [
          'Sendero Cascadas door het eeuwenoude regenwoud',
          'Wandeling naar Volcán Chaitén met uitzicht op de lavakoepel',
          'Wildkamperen in het nationaal park',
        ],
      },
      {
        id: 'dag8',
        dag: '8–9',
        titel: 'Fjorden & Warmwaterbronnen',
        locatie: 'Puyuhuapi',
        _unsplashQuery:'patagonia fjord',
        badges: ['Fjord', 'Warmwaterbronnen'],
        foto: 'https://images.unsplash.com/photo-1603748849529-bca520039ef8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200',
        fotoCredit: { url: 'https://unsplash.com/photos/vayZXH63Y0s' },
        beschrijving: 'Het regenachtige, mysterieuze Puyuhuapi ligt aan een smalle fjord. Het hoogtepunt is Termas de Puyuhuapi, warmwaterbronnen pal aan het water, omgeven door bos en mist.',
        activiteiten: [
          'Termas de Puyuhuapi, warmwaterbronnen aan de fjord (dagbezoek of overnachting)',
          'Kajakken over de fjord (optioneel)',
          'Het dorpje Puyuhuapi verkennen met zijn Duitse koloniale architectuur',
        ],
      },
      {
        id: 'dag10',
        dag: 10,
        titel: 'De Hangende Gletsjer',
        locatie: 'Queulat NP',
        _unsplashQuery:'glacier patagonia',
        badges: ['Nationaal Park', 'Gletsjer'],
        foto: 'https://images.unsplash.com/photo-1705455596627-7080d015e426?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200',
        fotoCredit: { url: 'https://unsplash.com/photos/XNL8xBSPl2o' },
        beschrijving: 'Queulat is misschien wel het meest dramatische landschap van de hele Carretera. De Ventisquero Colgante, een gletsjer die letterlijk boven het water hangt, is een van de meest gefotografeerde plekken van Patagonië.',
        activiteiten: [
          'Wandeling naar het uitzichtpunt op de hangende gletsjer Ventisquero Colgante',
          'Boottocht over Laguna Los Témpanos naar de gletsjer',
        ],
      },
      {
        id: 'dag11',
        dag: 11,
        titel: 'Doorrijden naar Cerro Castillo',
        locatie: 'Naar Villa Cerro Castillo',
        _unsplashQuery:'carretera austral road',
        badges: ['Reisdag', 'Lange rit'],
        foto: 'https://images.unsplash.com/photo-1697816227475-bb402505ba5f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200',
        fotoCredit: { url: 'https://unsplash.com/photos/Yg5hhpstoFY' },
        beschrijving: 'Een volledige reisdag zuidwaarts: zo\'n 350 kilometer over deels onverharde weg van Queulat naar Villa Cerro Castillo, met onderweg de bossen en bergpassen van de Carretera. We slaan proviand in voor de meerdaagse trek die de volgende ochtend begint.',
        activiteiten: [
          'Rijden van Queulat naar Villa Cerro Castillo (zo\'n 6 tot 7 uur, deels ripio)',
          'Onderweg stoppen bij uitzichtpunten en bergpassen',
          'Proviand en gas inslaan in Villa Cerro Castillo voor de trek',
          'Vroeg naar bed voor de start van het circuit',
        ],
      },
      {
        id: 'dag12',
        dag: '12–15',
        titel: 'Cerro Castillo Circuit',
        locatie: 'Cerro Castillo',
        _unsplashQuery:'cerro castillo patagonia',
        badges: ['Meerdaagse hike', 'Wildkamperen'],
        foto: 'https://images.unsplash.com/photo-1570227354456-3de3cba2c5ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200',
        fotoCredit: { url: 'https://unsplash.com/photos/H0nwwsbHU20' },
        beschrijving: 'Vier dagen te voet door een van de meest spectaculaire maar minder bekende parken van Patagonië. Het Cerro Castillo Circuit van zeventig kilometer voert langs dramatische basaltzuilen, turquoise meren en zwarte rotswanden, terwijl condors boven je hoofd cirkelen.',
        activiteiten: [
          'Cerro Castillo Circuit: vier dagen wildkamperen over zo\'n zeventig kilometer',
          'Landschap van basaltzuilen en gletsjerdalen',
          'Condors spotten boven de toppen',
          'Uitzicht op de ijzige top van Cerro Castillo (2675 meter)',
        ],
      },
      {
        id: 'dag16',
        dag: '16–17',
        titel: 'Doorrijden naar het Zuiden',
        locatie: 'Villa Cerro Castillo & Coyhaique',
        _unsplashQuery:'coyhaique patagonia',
        badges: ['Roadtrip'],
        foto: 'https://images.unsplash.com/photo-1706983470039-179718ed9e3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200',
        fotoCredit: { url: 'https://unsplash.com/s/photos/carretera-austral' },
        beschrijving: 'Na de inspanning van het circuit genieten we van twee rustigere dagen op de weg naar het zuiden. De lokale markt van Villa Cerro Castillo verkoopt zelfgemaakte kaas en wol, en Coyhaique is de laatste grote stad om in te slaan.',
        activiteiten: [
          'Lokale ambachtsmarkt in Villa Cerro Castillo',
          'Dagwandeling in Reserva Nacional Coyhaique (optioneel)',
          'Coyhaique: supermarkt, restaurant en de laatste keer ruim inslaan',
        ],
      },
      {
        id: 'dag18',
        dag: 18,
        titel: 'Camper Inleveren & Vlucht',
        locatie: 'Balmaceda',
        _unsplashQuery:'patagonia airport',
        badges: ['Vlucht', 'Halve dag'],
        foto: 'https://images.unsplash.com/photo-1518787289325-94c6917b88ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200',
        fotoCredit: { url: 'https://unsplash.com/photos/G3OV4RbmSc4' },
        beschrijving: 'Het camperhoofdstuk sluit af in Balmaceda. We leveren de camper in na veertien dagen Carretera Austral en vliegen naar El Calafate, op weg naar Argentinië.',
        praktisch: [
          { icon: '🚐', label: 'Camper', waarde: 'Inleveren bij het huurdepot in Balmaceda' },
          { icon: '✈️', label: 'Vlucht', waarde: 'Balmaceda → El Calafate' },
          { icon: '🚗', label: 'Transfer', waarde: 'Huurauto of shuttle naar El Chaltén (zo\'n 3 uur)' },
        ],
      },
    ],
  },

  chalten: {
    id: 'chalten',
    naam: 'El Chaltén',
    subtitel: 'Fitz Roy, de meest iconische berg van Patagonië',
    dagBereik: 'Dagen 19–22',
    hero: 'https://images.unsplash.com/photo-1626368185783-7c928d6f0133?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1600',
    heroCredit: { url: 'https://unsplash.com/photos/NVtdpWi1PQE' },
    route: '/patagonie/el-chalten',
    reisRoute: '/patagonie',
    reisNaam: 'Patagonië & Falklands',
    vorigeBlok: { naam: 'Carretera Austral', route: '/patagonie/carretera-austral' },
    volgendeBlok: { naam: 'Ushuaia', route: '/patagonie/ushuaia' },
    praktischInfo: [
      { icon: '🗓', label: 'Beste tijd', waarde: 'November tot maart' },
      { icon: '🚗', label: 'Vervoer', waarde: 'Shuttle of huurauto vanaf El Calafate; hikes vanuit het dorp' },
      { icon: '🎫', label: 'Nationaal Park', waarde: 'Gratis toegang' },
      { icon: '🌦', label: 'Weer', waarde: 'Extreem wisselvallig, plan flexibel' },
      { icon: '⏰', label: 'Tip', waarde: 'Laguna de los Tres bij zonsopgang (start 05:00)' },
    ],
    dagen: [
      {
        id: 'dag19',
        dag: 19,
        titel: 'Aankomst & Acclimatiseren',
        locatie: 'El Chaltén',
        _unsplashQuery:'el chalten fitz roy',
        badges: ['Fitz Roy', 'Acclimatiseren'],
        foto: 'https://images.unsplash.com/photo-1615337138008-899c20f72404?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200',
        fotoCredit: { url: 'https://unsplash.com/photos/8CAFCS1BWME' },
        beschrijving: 'Na de transfer vanaf El Calafate komen we aan in El Chaltén, het kleine wandeldorp aan de voet van Fitz Roy. De eerste dag draait om acclimatiseren, het dorp verkennen en je voorbereiden op de wandelingen van de komende dagen.',
        activiteiten: [
          'Mirador de los Cóndores, een korte acclimatisatiewandeling van een tot twee uur',
          'Het dorp El Chaltén verkennen voor een restaurant en proviand',
          'De dagwandelingen voor de komende dagen indelen',
        ],
      },
      {
        id: 'dag20',
        dag: '20–21',
        titel: 'Fitz Roy Hikes',
        locatie: 'El Chaltén',
        _unsplashQuery:'laguna de los tres',
        badges: ['Dagwandelingen', 'Iconisch uitzicht'],
        foto: 'https://images.unsplash.com/photo-1653850591098-ade25e7a8387?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200',
        fotoCredit: { url: 'https://unsplash.com/photos/xShzsFjowPs' },
        beschrijving: 'De twee absolute hoogtepunten van Patagonië in twee dagen. Laguna de los Tres met het beroemde uitzicht op Fitz Roy, en Laguna Torre met Cerro Torre in het verschiet. Wie de eerste dag vroeg vertrekt, haalt ze allebei.',
        activiteiten: [
          'Laguna de los Tres: dagwandeling van 23 kilometer naar het beroemdste uitzicht op Fitz Roy',
          'Laguna Torre: 18 kilometer met uitzicht op Cerro Torre',
          'Tip: vertrek om 05:00 naar Laguna de los Tres voor het mooiste ochtendlicht',
          'Bij vroeg vertrek zijn beide wandelingen te combineren',
        ],
      },
      {
        id: 'dag22',
        dag: 22,
        titel: 'Reisdag naar Ushuaia',
        locatie: 'El Chaltén → Ushuaia',
        _unsplashQuery:'patagonia road travel',
        badges: ['Reisdag', 'Vlucht'],
        foto: 'https://images.unsplash.com/photo-1692889577629-2c2048419f8c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200',
        fotoCredit: { url: 'https://unsplash.com/photos/5RwAkpugU98' },
        beschrijving: 'Een volledige reisdag naar het zuiden. We rijden van El Chaltén terug naar El Calafate en vliegen vandaar naar Ushuaia. Wie \'s ochtends nog tijd heeft, maakt eerst de korte wandeling naar de waterval Chorrillo del Salto.',
        activiteiten: [
          'Optioneel in de ochtend: korte wandeling naar Chorrillo del Salto',
          'Transfer El Chaltén naar El Calafate (zo\'n 3 uur)',
          'Vlucht El Calafate naar Ushuaia (ongeveer 1u15)',
        ],
      },
    ],
  },

  ushuaia: {
    id: 'ushuaia',
    naam: 'Ushuaia',
    subtitel: 'Het einde van de wereld, het begin van het avontuur',
    dagBereik: 'Dagen 23–24',
    hero: 'https://images.unsplash.com/photo-1726510423030-db343e0d448a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1600',
    heroCredit: { url: 'https://unsplash.com/photos/WVvrIRLxox4' },
    route: '/patagonie/ushuaia',
    reisRoute: '/patagonie',
    reisNaam: 'Patagonië & Falklands',
    vorigeBlok: { naam: 'El Chaltén', route: '/patagonie/el-chalten' },
    volgendeBlok: { naam: 'Falkland Islands', route: '/patagonie/falklands' },
    praktischInfo: [
      { icon: '🗓', label: 'Beste tijd', waarde: 'December tot februari' },
      { icon: '⛵', label: 'Beagle Channel', waarde: 'Boottocht ~3 uur' },
      { icon: '🚗', label: 'Vervoer', waarde: 'Tours of huurauto; Tierra del Fuego ~12 km' },
      { icon: '✈️', label: 'Doorreis', waarde: 'Via Punta Arenas naar de Falklands' },
    ],
    dagen: [
      {
        id: 'dag23',
        dag: 23,
        titel: 'Beagle Channel',
        locatie: 'Ushuaia',
        _unsplashQuery:'ushuaia patagonia',
        badges: ['Zuidelijkste stad', 'Boottocht'],
        foto: 'https://images.unsplash.com/photo-1727791174121-835760e60cd4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200',
        fotoCredit: { url: 'https://unsplash.com/photos/IUs9fCzgwls' },
        beschrijving: 'Ushuaia is de zuidelijkste stad ter wereld, gelegen aan het Beaglekanaal. Vandaag verkennen we de stad en maken we een boottocht over het kanaal langs pinguïns, zeehonden en zeeleeuwen.',
        activiteiten: [
          'Boottocht over het Beaglekanaal van zo\'n drie uur langs pinguïns, zeehonden en zeeleeuwen',
          'Wandeling door Ushuaia langs de kleurrijke havenhuizen',
          'Museo del Fin del Mundo over de geschiedenis van Vuurland',
        ],
      },
      {
        id: 'dag24',
        dag: 24,
        titel: 'Tierra del Fuego & Reisdag',
        locatie: 'Ushuaia → Punta Arenas',
        _unsplashQuery:'tierra del fuego national park',
        badges: ['Nationaal Park', 'Reisdag'],
        foto: 'https://images.unsplash.com/photo-1655282413025-c6b64d36e4e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200',
        fotoCredit: { url: 'https://unsplash.com/photos/g2zRbguvHpE' },
        beschrijving: 'In de ochtend bezoeken we het meest zuidelijke nationale park ter wereld, langs het Beaglekanaal. Daarna reizen we door naar Punta Arenas, de vertrekplaats van de wekelijkse vlucht naar de Falklandeilanden.',
        activiteiten: [
          'Senda Costera in Tierra del Fuego langs het kanaal, zo\'n 8 kilometer',
          'Tren del Fin del Mundo, een optionele historische treintocht',
          'Doorreizen naar Punta Arenas voor de Falklands-vlucht',
        ],
      },
    ],
  },

  falklands: {
    id: 'falklands',
    naam: 'Falkland Islands',
    subtitel: 'Ongerepte natuur op de rand van Antarctica',
    dagBereik: 'Dagen 25–29',
    hero: 'https://images.unsplash.com/photo-1552244088-147c4c94b21d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1600',
    heroCredit: { url: 'https://unsplash.com/photos/WzxImIGmIjI' },
    route: '/patagonie/falklands',
    reisRoute: '/patagonie',
    reisNaam: 'Patagonië & Falklands',
    vorigeBlok: { naam: 'Ushuaia', route: '/patagonie/ushuaia' },
    praktischInfo: [
      { icon: '💷', label: 'Valuta', waarde: 'Falkland Pound (FKP, 1:1 met GBP)' },
      { icon: '🗣', label: 'Taal', waarde: 'Engels' },
      { icon: '✈️', label: 'Vlucht', waarde: 'LATAM vanaf Punta Arenas (wekelijks, za)' },
      { icon: '🛩', label: 'FIGAS charter', waarde: 'Enige optie voor de buitenste eilanden' },
    ],
    dagen: [
      {
        id: 'dag25',
        dag: '25–26',
        titel: 'Stanley Verkennen',
        locatie: 'Stanley',
        _unsplashQuery:'falkland islands stanley',
        badges: ['Falkland Islands', 'Wildlife'],
        foto: 'https://images.unsplash.com/photo-1590101890757-34e511bf7deb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200',
        fotoCredit: { url: 'https://unsplash.com/photos/K6aExp0SvCs' },
        beschrijving: 'Op dag 25 brengt de wekelijkse LATAM-vlucht vanuit Punta Arenas ons naar Stanley, de meest geïsoleerde hoofdstad ter wereld en meteen een van de charmantste. We hebben twee dagen voor de kleurrijke houten huizen langs de haven, de scheepswrakken in de baai en de hartelijke bewoners.',
        activiteiten: [
          'Wandeling langs de haven van Stanley met zijn kleurrijke huizen',
          'Christ Church Cathedral, de meest zuidelijke Anglicaanse kathedraal',
          'Scheepswrakken en de Whalebone Arch',
          'Een drankje in de Rose Bar, het bruisende hart van Stanley',
        ],
      },
      {
        id: 'dag27',
        dag: '27–28',
        titel: 'Sea Lion Island: Wildlife Paradijs',
        locatie: 'Sea Lion Island',
        _unsplashQuery:'penguin sea lion wildlife',
        badges: ['Sea Lions', '5 pinguïnsoorten'],
        foto: 'https://images.unsplash.com/photo-1673370525167-8b93e8437644?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200',
        fotoCredit: { url: 'https://unsplash.com/photos/Plw5TmGgPqg' },
        beschrijving: 'Het absolute hoogtepunt van de reis is Sea Lion Island. Dit kleine eiland aan de zuidrand van de Falklands kent een van de hoogste dierdichtheden ter wereld, en de Sea Lion Island Lodge is de perfecte uitvalsbasis voor een huwelijksreis.',
        activiteiten: [
          'Sea Lion Island Lodge, een exclusief verblijf voor de huwelijksreis',
          'Koningspinguïns en rotspinguïns op steenworp afstand',
          'Olifantzeehonden, kolossen op het strand',
          'Op zoek naar de Striated Caracara, ook wel Johnny Rook genoemd',
          'Magelhaenpinguïns, ezelspinguïns en macaronipinguïns spotten',
        ],
      },
      {
        id: 'dag29',
        dag: 29,
        titel: 'Terugreis',
        locatie: 'Stanley',
        _unsplashQuery:'plane travel sky',
        badges: ['Vertrek', 'Halve dag'],
        foto: 'https://images.unsplash.com/photo-1682188299490-1e6e9c98bac8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200',
        fotoCredit: { url: 'https://unsplash.com/photos/gKS6a_vHg7U' },
        beschrijving: 'Het avontuur eindigt waar het begon, in de lucht. Met een charter van FIGAS vliegen we terug naar Stanley, gevolgd door de lange reis naar huis via Punta Arenas en Amsterdam.',
        praktisch: [
          { icon: '🛩', label: 'FIGAS charter', waarde: 'Sea Lion Island → Stanley' },
          { icon: '✈️', label: 'Vlucht', waarde: 'Stanley → Punta Arenas → Amsterdam' },
          { icon: '💚', label: 'Herinnering', waarde: '29 dagen Patagonië en de Falklands, voor altijd' },
        ],
      },
    ],
  },
};
