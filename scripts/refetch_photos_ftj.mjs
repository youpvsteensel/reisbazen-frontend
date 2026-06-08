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
  { id: 'hero_tao',         query: 'Palawan island hopping boat ocean Philippines' },
  { id: 'hero_smangus',     query: 'Taiwan alpine mountain forest fog' },
  { id: 'hero_kumano',      query: 'Japan forest shrine torii moss path' },
  { id: 'hero_port-barton', query: 'Palawan beach palm trees turquoise water' },
  { id: 'hero_coron',       query: 'Coron Palawan limestone lagoon viewpoint' },
  { id: 'dag4',  query: 'sandbank tropical island clear water Philippines' },
  { id: 'dag5',  query: 'tropical rainforest waterfall jungle' },
  { id: 'dag6',  query: 'El Nido Palawan beach sunset' },
  { id: 'dag7',  query: 'long white sand beach Palawan Philippines' },
  { id: 'dag8',  query: 'kayak tropical lagoon limestone cliffs' },
  { id: 'dag10', query: 'turquoise lagoon limestone cliffs Palawan' },
  { id: 'dag12', query: 'Coron Palawan town boats harbor' },
  { id: 'dag23', query: 'Taroko Gorge marble cliff Taiwan' },
  { id: 'dag25', query: 'rice terrace fields Taiwan countryside' },
  { id: 'dag28', query: 'Wakayama Japan coast town' },
  { id: 'dag31', query: 'Japanese onsen town winter steam mountain' },
  { id: 'dag36', query: 'Japan forest hiking trail mountain village' },
  { id: 'dag42', query: 'airplane window clouds travel sky' },
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
