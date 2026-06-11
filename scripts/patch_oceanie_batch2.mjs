/**
 * Patcht NZ Zuidereiland dagfoto's (dag30–dag63) in reisData.ts.
 * SCOPED op `nzZuidereiland: {` zodat overlappende dag-ids in andere reizen ongemoeid blijven.
 * Gebruik: node scripts/patch_oceanie_batch2.mjs
 */
import { readFileSync, writeFileSync } from 'fs';

const photos = JSON.parse(readFileSync('scripts/photos_oceanie_batch2.json', 'utf-8'));
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const file = readFileSync('frontend/src/data/reisData.ts', 'utf-8');
const marker = '\n  nzZuidereiland: {';
const idx = file.indexOf(marker);
if (idx === -1) { console.error('Marker nzZuidereiland niet gevonden'); process.exit(1); }
const head = file.slice(0, idx);
let body = file.slice(idx);

let teller = 0;
for (const [key, p] of Object.entries(photos)) {
  if (!key.startsWith('dag')) continue;
  const re = new RegExp(`(id: '${esc(key)}',[\\s\\S]*?foto: ')[^']*(',\\s*fotoCredit: \\{ url: ')[^']*(' \\})`);
  if (re.test(body)) {
    body = body.replace(re, `$1${p.fotoUrl}$2${p.creditUrl}$3`);
    teller++;
  } else {
    console.log(`  ! ${key} niet gevonden in nzZuidereiland-sectie`);
  }
}

writeFileSync('frontend/src/data/reisData.ts', head + body);
console.log(`Klaar: ${teller} NZ Zuidereiland-dagfoto's gepatcht.`);
