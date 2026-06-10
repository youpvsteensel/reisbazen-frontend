/**
 * Batch 1: dagfoto's voor de Australische dagen (dag 1-29) van de Oceanië-reis.
 * Locatie-specifieke zoektermen, dedup tegen reeds gebruikte foto's.
 * Gebruik: node scripts/fetch_oceanie_dagen_batch1.mjs <ACCESS_KEY>
 */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const ACCESS_KEY = process.argv[2];
if (!ACCESS_KEY) { console.error('Geef ACCESS_KEY mee'); process.exit(1); }

const dagen = [
  { id: 'dag1',  query: 'Melbourne St Kilda beach Australia' },
  { id: 'dag2',  query: 'Australian Open tennis Melbourne arena' },
  { id: 'dag3',  query: 'Melbourne Park tennis stadium night' },
  { id: 'dag4',  query: 'Fitzroy Melbourne laneway street art' },
  { id: 'dag5',  query: 'Hobart Tasmania harbour waterfront' },
  { id: 'dag6',  query: 'Cape Hauy Tasman Peninsula Tasmania cliffs' },
  { id: 'dag7',  query: 'Wineglass Bay Freycinet Tasmania' },
  { id: 'dag8',  query: 'Bay of Fires Tasmania orange rocks beach' },
  { id: 'dag9',  query: 'Tamar Valley Tasmania vineyard wine' },
  { id: 'dag10', query: 'Cradle Mountain summit Tasmania alpine' },
  { id: 'dag11', query: 'Dove Lake Cradle Mountain boatshed Tasmania' },
  { id: 'dag12', query: 'Tasmanian devil wildlife Tasmania' },
  { id: 'dag13', query: 'Salamanca Market Hobart Tasmania' },
  { id: 'dag14', query: 'Perth city skyline Swan River Western Australia' },
  { id: 'dag15', query: 'Kings Park Perth Western Australia' },
  { id: 'dag16', query: 'Fremantle harbour Western Australia' },
  { id: 'dag17', query: 'Rottnest Island quokka beach Western Australia' },
  { id: 'dag18', query: 'Bunbury Western Australia coastline' },
  { id: 'dag19', query: 'Busselton Jetty Western Australia' },
  { id: 'dag20', query: 'Yallingup Margaret River coast Western Australia' },
  { id: 'dag21', query: 'Margaret River vineyard Western Australia' },
  { id: 'dag22', query: 'Margaret River surf beach Western Australia' },
  { id: 'dag23', query: 'Greens Pool Denmark Western Australia' },
  { id: 'dag24', query: 'Valley of the Giants tree top walk Western Australia' },
  { id: 'dag25', query: 'Little Beach Two Peoples Bay Albany Western Australia' },
  { id: 'dag26', query: 'Fitzgerald River National Park Western Australia coast' },
  { id: 'dag27', query: 'Lucky Bay Esperance kangaroo beach Western Australia' },
  { id: 'dag28', query: 'Esperance Western Australia turquoise beach' },
  { id: 'dag29', query: 'Wave Rock Hyden Western Australia' },
];

// Dedup tegen reeds gebruikte foto-ID's (heroes + eerdere batches)
const gebruikt = new Set();
for (const f of ['scripts/photos_oceanie.json', 'scripts/photos_oceanie_dagen.json']) {
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

const result = existsSync('scripts/photos_oceanie_dagen.json')
  ? JSON.parse(readFileSync('scripts/photos_oceanie_dagen.json', 'utf-8')) : {};

console.log('Batch 1 — Australië dagfoto\'s...\n');
for (const dag of dagen) {
  process.stdout.write(`  ${dag.id} (${dag.query})... `);
  let r = null;
  for (let p = 0; p < 4; p++) {
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

writeFileSync('scripts/photos_oceanie_dagen.json', JSON.stringify(result, null, 2));
console.log(`\nOpgeslagen: scripts/photos_oceanie_dagen.json (${Object.keys(result).length} dagfoto's)`);
