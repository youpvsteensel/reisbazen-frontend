/**
 * Haalt unieke, locatie-specifieke Unsplash-foto's op voor de reis
 * Filipijnen-Taiwan-Japan en schrijft het resultaat naar JSON.
 * Gebruik: node scripts/fetch_photos_ftj.mjs <ACCESS_KEY>
 */
import { writeFileSync } from 'fs';

const ACCESS_KEY = process.argv[2];
if (!ACCESS_KEY) {
  console.error('Gebruik: node scripts/fetch_photos_ftj.mjs <ACCESS_KEY>');
  process.exit(1);
}

const locaties = [
  { id: 'cover',            query: 'El Nido Palawan limestone islands Philippines' },
  { id: 'hero_port-barton', query: 'Port Barton Palawan beach Philippines' },
  { id: 'hero_el-nido',     query: 'Nacpan beach El Nido Palawan' },
  { id: 'hero_tao',         query: 'Linapacan island Palawan boat Philippines' },
  { id: 'hero_coron',       query: 'Kayangan Lake Coron Palawan' },
  { id: 'hero_smangus',     query: 'Taiwan mountain cypress cedar forest' },
  { id: 'hero_taroko',      query: 'Taroko Gorge Taiwan marble canyon' },
  { id: 'hero_kumano',      query: 'Kumano Kodo Japan forest trail' },
  { id: 'hero_kiso',        query: 'Tsumago Nakasendo Japan post town' },
  { id: 'hero_shiga',       query: 'Shiga Kogen Japan ski snow Nagano' },

  { id: 'dag1',  query: 'Manila Philippines skyline' },
  { id: 'dag2',  query: 'Puerto Princesa Palawan Philippines' },
  { id: 'dag3',  query: 'Palawan snorkeling coral reef Philippines' },
  { id: 'dag4',  query: 'Palawan starfish sandbank island Philippines' },
  { id: 'dag5',  query: 'Palawan jungle waterfall Philippines' },
  { id: 'dag6',  query: 'Las Cabanas beach El Nido sunset Palawan' },
  { id: 'dag7',  query: 'Nacpan beach El Nido Palawan aerial' },
  { id: 'dag8',  query: 'El Nido Cadlao island kayak Palawan' },
  { id: 'dag9',  query: 'Palawan island hopping snorkeling boat' },
  { id: 'dag10', query: 'Palawan hidden lagoon island Philippines' },
  { id: 'dag11', query: 'Palawan beach camping bamboo hut island' },
  { id: 'dag12', query: 'Coron town Palawan Philippines harbor' },
  { id: 'dag13', query: 'Barracuda Lake Coron Palawan' },
  { id: 'dag14', query: 'Mount Tapyas Coron sunset Palawan' },
  { id: 'dag15', query: 'Coron island resort Palawan beach' },
  { id: 'dag17', query: 'Philippines airplane travel sky' },
  { id: 'dag18', query: 'Taipei Taiwan skyline' },
  { id: 'dag19', query: 'Raohe night market Taipei Taiwan' },
  { id: 'dag20', query: 'Taiwan mountain village starry night sky' },
  { id: 'dag21', query: 'Taiwan giant ancient cypress tree forest' },
  { id: 'dag22', query: 'Hualien Taiwan night market food' },
  { id: 'dag23', query: 'Taroko Gorge Taiwan canyon river road' },
  { id: 'dag24', query: 'Qingshui Cliffs Taiwan coast ocean' },
  { id: 'dag25', query: 'Taiwan rice fields Chishang cycling' },
  { id: 'dag26', query: 'Taipei Taiwan street alley' },
  { id: 'dag27', query: 'Osaka Japan Kuromon market food' },
  { id: 'dag28', query: 'Tanabe Wakayama Japan coast' },
  { id: 'dag29', query: 'Kumano Kodo mountain village mist Japan' },
  { id: 'dag30', query: 'Kumano Kodo cedar forest stone trail Japan' },
  { id: 'dag31', query: 'Yunomine Onsen Japan hot spring village' },
  { id: 'dag32', query: 'Nachi Falls Japan waterfall pagoda' },
  { id: 'dag33', query: 'Kyoto Pontocho alley Japan night' },
  { id: 'dag34', query: 'Arashiyama bamboo grove Kyoto Japan' },
  { id: 'dag35', query: 'Narai juku Kiso valley Japan wooden town' },
  { id: 'dag36', query: 'Tsumago Magome Nakasendo trail Japan' },
  { id: 'dag37', query: 'Shiga Kogen Japan ski resort snow slope' },
  { id: 'dag38', query: 'Japan powder snow skiing Nagano mountains' },
  { id: 'dag40', query: 'Shimokitazawa Tokyo Japan street vintage' },
  { id: 'dag41', query: 'Tokyo izakaya alley lantern night Japan' },
  { id: 'dag42', query: 'Tokyo Japan airport departure' },
];

const gebruikteIds = new Set();

async function fetchPhoto(query) {
  const url = `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&orientation=landscape&client_id=${ACCESS_KEY}`;
  const res = await fetch(url);
  if (!res.ok) return { error: `HTTP ${res.status}` };
  const data = await res.json();
  return {
    unsplashId: data.id,
    fotoUrl: data.urls.regular,
    creditUrl: `https://unsplash.com/photos/${data.id}`,
    fotograaf: data.user?.name ?? '',
    alt: data.alt_description ?? '',
    locatie: data.location?.name ?? '',
  };
}

const resultaten = {};
console.log("Foto's ophalen via Unsplash API...\n");

for (const loc of locaties) {
  process.stdout.write(`  ${loc.id} (${loc.query})... `);
  let result = null;
  for (let poging = 0; poging < 4; poging++) {
    result = await fetchPhoto(loc.query);
    if (result.error) { console.log(`✗ ${result.error}`); break; }
    if (!gebruikteIds.has(result.unsplashId)) {
      gebruikteIds.add(result.unsplashId);
      break;
    }
    // duplicaat -> opnieuw proberen
    await new Promise(r => setTimeout(r, 1200));
  }
  if (result && !result.error) {
    resultaten[loc.id] = result;
    console.log(`✓ ${result.fotograaf}${result.locatie ? ' — ' + result.locatie : ''}`);
  }
  await new Promise(r => setTimeout(r, 1300));
}

writeFileSync('scripts/photos_ftj.json', JSON.stringify(resultaten, null, 2));
console.log(`\nOpgeslagen: scripts/photos_ftj.json (${Object.keys(resultaten).length} foto's)`);
