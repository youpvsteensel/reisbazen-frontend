/**
 * Batch 2 — NZ Zuidereiland dagfoto's (dag30–dag63)
 * Gebruik: node scripts/fetch_oceanie_dagen_batch2.mjs <ACCESS_KEY>
 */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const ACCESS_KEY = process.argv[2];
if (!ACCESS_KEY) { console.error('Geef ACCESS_KEY mee als argument'); process.exit(1); }

const dagen = [
  { id: 'dag30', query: 'Queenstown New Zealand lake Remarkables mountains' },
  { id: 'dag31', query: 'Ben Lomond summit Queenstown New Zealand alpine' },
  { id: 'dag32', query: 'Glenorchy New Zealand valley beech forest lake' },
  { id: 'dag33', query: 'Arrowtown New Zealand historic gold mining town' },
  { id: 'dag34', query: 'Queenstown lakefront New Zealand sunset waterfront' },
  { id: 'dag35', query: 'Doubtful Sound New Zealand fjord rainforest waterfall' },
  { id: 'dag36', query: 'Doubtful Sound New Zealand fjord boat morning mist' },
  { id: 'dag37', query: 'Lake Te Anau New Zealand glowworm caves' },
  { id: 'dag38', query: 'Kepler Track New Zealand alpine ridgeline Te Anau' },
  { id: 'dag39', query: 'Routeburn Track New Zealand Lake Mackenzie hut alpine' },
  { id: 'dag40', query: 'Harris Saddle Routeburn Track New Zealand panorama' },
  { id: 'dag41', query: 'Routeburn Falls hut New Zealand waterfall valley' },
  { id: 'dag42', query: 'Wanaka tree lake New Zealand ThatWanakaTree' },
  { id: 'dag43', query: 'Isthmus Peak Wanaka Hawea New Zealand hike panorama' },
  { id: 'dag44', query: "Roy's Peak Wanaka New Zealand hike summit" },
  { id: 'dag45', query: 'Wanaka lake New Zealand mountains reflection calm' },
  { id: 'dag46', query: 'Brewster Hut New Zealand glacier alpine overnight' },
  { id: 'dag47', query: 'Blue Pools New Zealand Haast Pass turquoise river' },
  { id: 'dag48', query: 'Fox Glacier New Zealand rainforest lake Matheson reflection' },
  { id: 'dag49', query: 'Copland Track New Zealand Welcome Flat hot pools' },
  { id: 'dag50', query: 'Fox Glacier New Zealand village west coast rainforest' },
  { id: 'dag51', query: 'Pancake Rocks Punakaiki New Zealand west coast' },
  { id: 'dag52', query: 'Abel Tasman National Park New Zealand kayak golden beach' },
  { id: 'dag53', query: 'Nelson New Zealand coastal walk Cable Bay' },
  { id: 'dag54', query: 'Marlborough Sounds New Zealand Queen Charlotte Track' },
  { id: 'dag55', query: 'Kenepuru Sound New Zealand kayak calm water' },
  { id: 'dag56', query: 'Marlborough Sounds New Zealand lodge water view' },
  { id: 'dag57', query: 'Cloudy Bay Marlborough New Zealand sauvignon blanc vineyard' },
  { id: 'dag58', query: 'Mt Lyford New Zealand alpine hut hiking' },
  { id: 'dag59', query: 'Mount Somers Track New Zealand volcanic landscape' },
  { id: 'dag60', query: 'Canterbury Plains New Zealand Alps landscape' },
  { id: 'dag61', query: 'Lake Tekapo New Zealand turquoise church lupins stars' },
  { id: 'dag62', query: 'Mueller Hut Mount Cook New Zealand glacier overnight' },
  { id: 'dag63', query: 'Aoraki Mount Cook New Zealand glacier lake reflection' },
];

const gebruikt = new Set();
for (const f of ['scripts/photos_oceanie.json', 'scripts/photos_oceanie_dagen.json', 'scripts/photos_oceanie_batch2.json']) {
  if (existsSync(f)) {
    const data = JSON.parse(readFileSync(f, 'utf-8'));
    Object.values(data).forEach(p => p.unsplashId && gebruikt.add(p.unsplashId));
  }
}

async function fetchPhoto(query) {
  const url = `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&orientation=landscape&client_id=${ACCESS_KEY}`;
  const res = await fetch(url);
  if (!res.ok) return { error: `HTTP ${res.status}` };
  const d = await res.json();
  return {
    unsplashId: d.id,
    fotoUrl: d.urls.regular,
    creditUrl: `https://unsplash.com/photos/${d.id}`,
    fotograaf: d.user?.name ?? '',
    alt: d.alt_description ?? '',
    locatie: d.location?.name ?? '',
  };
}

const result = {};
console.log('Batch 2 — NZ Zuidereiland dagfoto\'s...\n');

for (const dag of dagen) {
  process.stdout.write(`  ${dag.id} (${dag.query})... `);
  let r = null;
  for (let poging = 0; poging < 5; poging++) {
    r = await fetchPhoto(dag.query);
    if (r.error) { console.log(`✗ ${r.error}`); break; }
    if (!gebruikt.has(r.unsplashId)) { gebruikt.add(r.unsplashId); break; }
    await new Promise(res => setTimeout(res, 1200));
  }
  if (r && !r.error) {
    result[dag.id] = r;
    console.log(`✓ ${r.fotograaf}${r.locatie ? ' — ' + r.locatie : ''}`);
  }
  await new Promise(res => setTimeout(res, 1300));
}

writeFileSync('scripts/photos_oceanie_batch2.json', JSON.stringify(result, null, 2));
console.log(`\nOpgeslagen: scripts/photos_oceanie_batch2.json (${Object.keys(result).length} foto's)`);
