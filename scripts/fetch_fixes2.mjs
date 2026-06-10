import { readFileSync, writeFileSync, existsSync } from 'fs';
const ACCESS_KEY = process.argv[2];
if (!ACCESS_KEY) { process.exit(1); }

const fixes = [
  { file: 'batch1', id: 'dag6',  query: 'Tasmania dramatic coast cliffs sea stack' },
  { file: 'batch2', id: 'dag36', query: 'Fiordland New Zealand fjord mist rainforest remote' },
  { file: 'batch2', id: 'dag47', query: 'New Zealand alpine river glacier melt blue water' },
];

const gebruikt = new Set();
for (const f of ['scripts/photos_oceanie.json','scripts/photos_oceanie_dagen.json','scripts/photos_oceanie_batch2.json']) {
  if (existsSync(f)) Object.values(JSON.parse(readFileSync(f,'utf-8'))).forEach(p => p.unsplashId && gebruikt.add(p.unsplashId));
}

async function fetchPhoto(query) {
  const url = `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&orientation=landscape&client_id=${ACCESS_KEY}`;
  const res = await fetch(url);
  if (!res.ok) return { error: `HTTP ${res.status}` };
  const d = await res.json();
  return { unsplashId: d.id, fotoUrl: d.urls.regular, creditUrl: `https://unsplash.com/photos/${d.id}`, fotograaf: d.user?.name ?? '', locatie: d.location?.name ?? '' };
}

const b1 = JSON.parse(readFileSync('scripts/photos_oceanie_dagen.json', 'utf-8'));
const b2 = JSON.parse(readFileSync('scripts/photos_oceanie_batch2.json', 'utf-8'));

for (const fix of fixes) {
  process.stdout.write(`  ${fix.id} (${fix.query})... `);
  let r = null;
  for (let p = 0; p < 8; p++) {
    r = await fetchPhoto(fix.query);
    if (r.error) { console.log(`✗ ${r.error}`); break; }
    // Weiger Milford Sound voor dag36
    if (fix.id === 'dag36' && r.locatie?.toLowerCase().includes('milford')) { await new Promise(res => setTimeout(res, 1500)); continue; }
    if (!gebruikt.has(r.unsplashId)) { gebruikt.add(r.unsplashId); break; }
    await new Promise(res => setTimeout(res, 1500));
  }
  if (r && !r.error) {
    if (fix.file === 'batch1') b1[fix.id] = r; else b2[fix.id] = r;
    console.log(`✓ ${r.fotograaf}${r.locatie ? ' — ' + r.locatie : ''}`);
  }
  await new Promise(res => setTimeout(res, 1400));
}

writeFileSync('scripts/photos_oceanie_dagen.json', JSON.stringify(b1, null, 2));
writeFileSync('scripts/photos_oceanie_batch2.json', JSON.stringify(b2, null, 2));
console.log('Klaar');
