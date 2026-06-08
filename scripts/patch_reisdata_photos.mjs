/**
 * Patcht de foto-URL's in reisData.ts en FilipijnenTaiwanJapanPage.tsx
 * met de definitieve foto's uit photos_ftj.json.
 * Gebruik: node scripts/patch_reisdata_photos.mjs
 */
import { readFileSync, writeFileSync } from 'fs';

const photos = JSON.parse(readFileSync('scripts/photos_ftj.json', 'utf-8'));

const heroKeyByBlok = {
  portBarton: 'hero_port-barton',
  elNido: 'hero_el-nido',
  tao: 'hero_tao',
  coron: 'hero_coron',
  smangus: 'hero_smangus',
  taroko: 'hero_taroko',
  kumano: 'hero_kumano',
  kiso: 'hero_kiso',
  shiga: 'hero_shiga',
};

const slugToHero = {
  'port-barton': 'hero_port-barton',
  'el-nido': 'hero_el-nido',
  'tao-expeditie': 'hero_tao',
  'coron': 'hero_coron',
  'smangus': 'hero_smangus',
  'taroko': 'hero_taroko',
  'kumano-kodo': 'hero_kumano',
  'kiso-kyoto': 'hero_kiso',
  'shiga-tokyo': 'hero_shiga',
};

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
let teller = 0;

// --- reisData.ts ---
let data = readFileSync('src/data/reisData.ts', 'utf-8');

// Heroes
for (const [blok, key] of Object.entries(heroKeyByBlok)) {
  const p = photos[key];
  if (!p) continue;
  const re = new RegExp(`(${esc(blok)}: \\{[\\s\\S]*?hero: ')[^']*(',\\s*heroCredit: \\{ url: ')[^']*(' \\})`);
  if (re.test(data)) { data = data.replace(re, `$1${p.fotoUrl}$2${p.creditUrl}$3`); teller++; }
}

// Dagen (dag1 t/m dag42 die als id bestaan)
for (const key of Object.keys(photos)) {
  if (!key.startsWith('dag')) continue;
  const p = photos[key];
  const re = new RegExp(`(id: '${esc(key)}',[\\s\\S]*?foto: ')[^']*(',\\s*fotoCredit: \\{ url: ')[^']*(' \\})`);
  if (re.test(data)) { data = data.replace(re, `$1${p.fotoUrl}$2${p.creditUrl}$3`); teller++; }
}

writeFileSync('src/data/reisData.ts', data);

// --- FilipijnenTaiwanJapanPage.tsx (blok-thumbnails) ---
let page = readFileSync('src/pages/FilipijnenTaiwanJapanPage.tsx', 'utf-8');
for (const [slug, key] of Object.entries(slugToHero)) {
  const p = photos[key];
  if (!p) continue;
  const base = p.fotoUrl.split('?')[0];
  const thumb = `${base}?w=900&h=600&fit=crop&auto=format`;
  const re = new RegExp(`(route: '/filipijnen-taiwan-japan/${esc(slug)}',[\\s\\S]*?hero: ')[^']*(')`);
  if (re.test(page)) { page = page.replace(re, `$1${thumb}$2`); teller++; }
}
writeFileSync('src/pages/FilipijnenTaiwanJapanPage.tsx', page);

console.log(`Klaar: ${teller} foto-URL's gepatcht.`);
