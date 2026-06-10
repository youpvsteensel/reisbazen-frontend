/**
 * Refetch van dagen die in batch 1 geen resultaat gaven (HTTP 404), met bredere zoektermen.
 * Gebruik: node scripts/fetch_oceanie_dagen_refetch.mjs <ACCESS_KEY>
 */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const ACCESS_KEY = process.argv[2];
if (!ACCESS_KEY) { console.error('Geef ACCESS_KEY mee'); process.exit(1); }

const dagen = [
  { id: 'dag5',  query: 'Hobart Tasmania waterfront' },
  { id: 'dag6',  query: 'Tasmania sea cliffs coast' },
  { id: 'dag10', query: 'Cradle Mountain Tasmania' },
  { id: 'dag17', query: 'quokka Rottnest Island' },
  { id: 'dag23', query: 'Denmark Western Australia rocks ocean' },
  { id: 'dag25', query: 'Albany Western Australia beach' },
  { id: 'dag26', query: 'Western Australia wildflowers coast' },
];

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
    unsplashId: d.id, fotoUrl: d.urls.regular, creditUrl: `https://unsplash.com/photos/${d.id}`,
    fotograaf: d.user?.name ?? '', alt: d.alt_description ?? '', locatie: d.location?.name ?? '',
  };
}

const result = JSON.parse(readFileSync('scripts/photos_oceanie_dagen.json', 'utf-8'));
console.log('Refetch ontbrekende dagen...\n');
for (const dag of dagen) {
  process.stdout.write(`  ${dag.id} (${dag.query})... `);
  let r = null;
  for (let p = 0; p < 4; p++) {
    r = await fetchPhoto(dag.query);
    if (r.error) { console.log(`✗ ${r.error}`); break; }
    if (!gebruikt.has(r.unsplashId)) { gebruikt.add(r.unsplashId); break; }
    await new Promise(res => setTimeout(res, 1200));
  }
  if (r && !r.error) { result[dag.id] = r; console.log(`✓ ${r.fotograaf}${r.locatie ? ' — ' + r.locatie : ''}`); }
  await new Promise(res => setTimeout(res, 1300));
}

writeFileSync('scripts/photos_oceanie_dagen.json', JSON.stringify(result, null, 2));
console.log(`\nOpgeslagen (${Object.keys(result).length} dagfoto's totaal)`);
