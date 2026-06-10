import { readFileSync, writeFileSync, existsSync } from 'fs';

const ACCESS_KEY = process.argv[2];
if (!ACCESS_KEY) { console.error('Geef ACCESS_KEY mee'); process.exit(1); }

const dagen = [
  { id: 'dag31', query: 'New Zealand mountain trail hiking summit' },
  { id: 'dag50', query: 'New Zealand rainforest river south island' },
  { id: 'dag55', query: 'New Zealand sounds water fjord inlet calm' },
  { id: 'dag57', query: 'New Zealand winery wine grapes countryside' },
  { id: 'dag60', query: 'New Zealand alps snow mountains south island' },
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
    unsplashId: d.id, fotoUrl: d.urls.regular, creditUrl: `https://unsplash.com/photos/${d.id}`,
    fotograaf: d.user?.name ?? '', alt: d.alt_description ?? '', locatie: d.location?.name ?? '',
  };
}

const result = JSON.parse(readFileSync('scripts/photos_oceanie_batch2.json', 'utf-8'));
console.log('Laatste refetch...\n');

for (const dag of dagen) {
  process.stdout.write(`  ${dag.id} (${dag.query})... `);
  let r = null;
  for (let p = 0; p < 5; p++) {
    r = await fetchPhoto(dag.query);
    if (r.error) { console.log(`✗ ${r.error}`); break; }
    if (!gebruikt.has(r.unsplashId)) { gebruikt.add(r.unsplashId); break; }
    await new Promise(res => setTimeout(res, 1500));
  }
  if (r && !r.error) { result[dag.id] = r; console.log(`✓ ${r.fotograaf}${r.locatie ? ' — ' + r.locatie : ''}`); }
  await new Promise(res => setTimeout(res, 1500));
}

writeFileSync('scripts/photos_oceanie_batch2.json', JSON.stringify(result, null, 2));
console.log(`\nOpgeslagen (${Object.keys(result).length} foto's totaal)`);
