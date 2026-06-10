/**
 * Herhaalde fetches voor: dag6 (Tas hero-duplicaat), dag36/37/47 (Milford wrong), dag48 (duplicaat dag62)
 * Gebruik: node scripts/fetch_fixes.mjs <ACCESS_KEY>
 */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const ACCESS_KEY = process.argv[2];
if (!ACCESS_KEY) { console.error('Geef ACCESS_KEY mee'); process.exit(1); }

const fixes = [
  { file: 'batch1', id: 'dag6',  query: 'Cape Hauy dolerite cliffs Tasmania sea' },
  { file: 'batch2', id: 'dag36', query: 'Doubtful Sound fiord New Zealand overnight boat' },
  { file: 'batch2', id: 'dag37', query: 'Te Anau lake New Zealand blue calm water' },
  { file: 'batch2', id: 'dag47', query: 'Blue Pools turquoise water New Zealand swing bridge' },
  { file: 'batch2', id: 'dag48', query: 'Fox Glacier valley New Zealand ice rainforest' },
];

// Alle al-gebruikte IDs verzamelen
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

console.log('Fixes ophalen...\n');
for (const fix of fixes) {
  process.stdout.write(`  ${fix.id} (${fix.query})... `);
  let r = null;
  for (let p = 0; p < 6; p++) {
    r = await fetchPhoto(fix.query);
    if (r.error) { console.log(`✗ ${r.error}`); break; }
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
console.log('\nKlaar — nu patch_oceanie_photos.mjs en patch_oceanie_batch2.mjs draaien');
