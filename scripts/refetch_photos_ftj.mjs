/**
 * Refetch ontbrekende/verkeerde foto's met fallback-zoektermen.
 * Leest scripts/photos_ftj.json, vult/vervangt opgegeven id's, dedupe op id.
 * Gebruik: node scripts/refetch_photos_ftj.mjs <ACCESS_KEY>
 */
import { readFileSync, writeFileSync } from 'fs';

const ACCESS_KEY = process.argv[2];
if (!ACCESS_KEY) { console.error('Geef ACCESS_KEY mee'); process.exit(1); }

const bestaand = JSON.parse(readFileSync('scripts/photos_ftj.json', 'utf-8'));
const gebruikteIds = new Set(Object.values(bestaand).map(p => p.unsplashId));

const fallback = [
  { id: 'dag4',  query: 'Philippines beach island turquoise' },
];

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

console.log('Refetch...\n');
for (const loc of fallback) {
  process.stdout.write(`  ${loc.id} (${loc.query})... `);
  let result = null;
  for (let p = 0; p < 4; p++) {
    result = await fetchPhoto(loc.query);
    if (result.error) { console.log(`✗ ${result.error}`); break; }
    if (!gebruikteIds.has(result.unsplashId)) { gebruikteIds.add(result.unsplashId); break; }
    await new Promise(r => setTimeout(r, 1200));
  }
  if (result && !result.error) {
    bestaand[loc.id] = result;
    console.log(`✓ ${result.fotograaf}${result.locatie ? ' — ' + result.locatie : ''}`);
  }
  await new Promise(r => setTimeout(r, 1300));
}

writeFileSync('scripts/photos_ftj.json', JSON.stringify(bestaand, null, 2));
console.log(`\nOpgeslagen: scripts/photos_ftj.json (${Object.keys(bestaand).length} foto's)`);
