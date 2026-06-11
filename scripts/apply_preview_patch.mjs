import { readFileSync, writeFileSync } from 'fs';

const preview = JSON.parse(readFileSync('scripts/photos_preview.json', 'utf-8'));

function norm(v) {
  return {
    unsplashId: v.unsplashId || v.id,
    fotoUrl: v.fotoUrl || v.url,
    creditUrl: v.creditUrl || v.credit,
  };
}

// Bouw vervangingstabel
const replacements = {};
for (const [dag, v] of Object.entries(preview)) {
  const n = norm(v);
  // Maak een vaste URL zonder expirerende ixid
  const cleanUrl = `https://images.unsplash.com/photo-${n.fotoUrl.match(/photo-([0-9a-f-]+)/)?.[1]}?w=1080&auto=format&fit=crop`;
  replacements[dag] = {
    fotoUrl: cleanUrl,
    creditUrl: n.creditUrl,
    unsplashId: n.unsplashId,
  };
}

function patchFile(path) {
  let src = readFileSync(path, 'utf-8');
  let count = 0;

  for (const [dag, rep] of Object.entries(replacements)) {
    // Vind de dag-entry: id: 'dagN', ...
    // Vervang de foto: '...' regel en fotoCredit: { url: '...' } regel
    const dagPattern = new RegExp(
      `(id: '${dag}'[^}]*?foto: ')(https://[^']+)('[\\s\\S]*?fotoCredit: \\{ url: ')(https://[^']+)(')`,
      'g'
    );

    const newSrc = src.replace(dagPattern, (match, p1, _oldFoto, p3, _oldCredit, p5) => {
      count++;
      return p1 + rep.fotoUrl + p3 + rep.creditUrl + p5;
    });

    if (newSrc === src) {
      console.warn(`  ⚠ ${dag}: geen match gevonden in ${path}`);
    }
    src = newSrc;
  }

  writeFileSync(path, src);
  console.log(`Gepatcht: ${path} (${count} vervangingen)`);
}

const files = [
  'frontend/src/data/reisData.ts',
  'src/data/reisData.ts',
];

for (const f of files) {
  patchFile(f);
}

console.log('Klaar.');
