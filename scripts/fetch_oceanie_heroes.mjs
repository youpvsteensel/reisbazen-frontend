/**
 * Haalt de hero/cover foto's voor de Oceanië-reis op (6 stuks, binnen rate limit).
 * Gebruik: node scripts/fetch_oceanie_heroes.mjs <ACCESS_KEY>
 */
import { writeFileSync } from 'fs';

const ACCESS_KEY = process.argv[2];
if (!ACCESS_KEY) { console.error('Geef ACCESS_KEY mee'); process.exit(1); }

const locaties = [
  { id: 'cover',            query: 'Wanaka New Zealand lake mountains' },
  { id: 'route_hero',       query: 'Mount Cook New Zealand alpine glacier' },
  { id: 'hero_melbourne',   query: 'Melbourne city skyline Australia' },
  { id: 'hero_tasmanie',    query: 'Cradle Mountain Tasmania Australia' },
  { id: 'hero_west-australie', query: 'Lucky Bay Esperance Western Australia beach' },
  { id: 'hero_nz-zuidereiland', query: 'Fiordland New Zealand mountains fjord' },
];

const gebruikt = new Set();

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
console.log('Fetch Oceanië hero-foto\'s...\n');
for (const loc of locaties) {
  process.stdout.write(`  ${loc.id} (${loc.query})... `);
  let r = null;
  for (let p = 0; p < 4; p++) {
    r = await fetchPhoto(loc.query);
    if (r.error) { console.log(`✗ ${r.error}`); break; }
    if (!gebruikt.has(r.unsplashId)) { gebruikt.add(r.unsplashId); break; }
    await new Promise(res => setTimeout(res, 1200));
  }
  if (r && !r.error) {
    result[loc.id] = r;
    console.log(`✓ ${r.fotograaf}${r.locatie ? ' — ' + r.locatie : ''} | ${r.alt.slice(0, 50)}`);
  }
  await new Promise(res => setTimeout(res, 1300));
}

writeFileSync('scripts/photos_oceanie.json', JSON.stringify(result, null, 2));
console.log(`\nOpgeslagen: scripts/photos_oceanie.json (${Object.keys(result).length} foto's)`);
