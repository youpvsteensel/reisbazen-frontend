/**
 * Patcht de dagfoto's van de Oceanië-reis in reisData.ts met de opgehaalde foto's.
 * BELANGRIJK: scoped op het deel vanaf `melbourne: {` — de dag-id's (dag1..dag29)
 * bestaan ook in de Patagonië- en Filipijnen-reizen, dus alleen het Oceanië-deel patchen.
 * Gebruik: node scripts/patch_oceanie_photos.mjs
 */
import { readFileSync, writeFileSync } from 'fs';

const photos = JSON.parse(readFileSync('scripts/photos_oceanie_dagen.json', 'utf-8'));
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const file = readFileSync('frontend/src/data/reisData.ts', 'utf-8');
const marker = '\n  melbourne: {';
const idx = file.indexOf(marker);
if (idx === -1) { console.error('Marker melbourne niet gevonden'); process.exit(1); }
const head = file.slice(0, idx);
let body = file.slice(idx);

let teller = 0;
for (const [key, p] of Object.entries(photos)) {
  if (!key.startsWith('dag')) continue;
  const re = new RegExp(`(id: '${esc(key)}',[\\s\\S]*?foto: ')[^']*(',\\s*fotoCredit: \\{ url: ')[^']*(' \\})`);
  if (re.test(body)) { body = body.replace(re, `$1${p.fotoUrl}$2${p.creditUrl}$3`); teller++; }
  else { console.log(`  ! ${key} niet gevonden in Oceanië-sectie`); }
}

writeFileSync('frontend/src/data/reisData.ts', head + body);
console.log(`Klaar: ${teller} Oceanië-dagfoto's gepatcht.`);
