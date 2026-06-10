/**
 * Refetch ontbrekende NZ batch 2 foto's met bredere zoektermen.
 * Gebruik: node scripts/fetch_oceanie_batch2_refetch.mjs <ACCESS_KEY>
 */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const ACCESS_KEY = process.argv[2];
if (!ACCESS_KEY) { console.error('Geef ACCESS_KEY mee'); process.exit(1); }

const dagen = [
  { id: 'dag31', query: 'Ben Lomond mountain New Zealand hike' },
  { id: 'dag32', query: 'Glenorchy New Zealand lake mountains' },
  { id: 'dag37', query: 'Te Anau lake New Zealand fiordland' },
  { id: 'dag46', query: 'New Zealand alpine glacier hut mountains' },
  { id: 'dag47', query: 'New Zealand turquoise river mountains Haast' },
  { id: 'dag48', query: 'Fox Glacier New Zealand west coast mountains' },
  { id: 'dag49', query: 'New Zealand hot springs natural pool mountains' },
  { id: 'dag50', query: 'West Coast New Zealand rainforest river' },
  { id: 'dag51', query: 'New Zealand west coast limestone rocks ocean' },
  { id: 'dag52', query: 'Abel Tasman New Zealand golden beach kayak' },
  { id: 'dag53', query: 'Nelson New Zealand coast beach sunny' },
  { id: 'dag55', query: 'Marlborough Sounds New Zealand water inlet' },
  { id: 'dag57', query: 'New Zealand vineyard sauvignon blanc Marlborough wine' },
  { id: 'dag60', query: 'Canterbury New Zealand mountains plains landscape' },
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

const result = JSON.parse(readFileSync('scripts/photos_oceanie_batch2.json', 'utf-8'));
console.log('Refetch ontbrekende NZ-dagen...\n');

for (const dag of dagen) {
  process.stdout.write(`  ${dag.id} (${dag.query})... `);
  let r = null;
  for (let p = 0; p < 5; p++) {
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
console.log(`\nOpgeslagen (${Object.keys(result).length} foto's totaal)`);
