/**
 * Haalt de beste Unsplash foto per locatie op en print de nieuwe reisData URLs.
 * Gebruik: node scripts/fetch_unsplash_photos.mjs <JOUW_ACCESS_KEY>
 */

const ACCESS_KEY = process.argv[2];
if (!ACCESS_KEY) {
  console.error('Gebruik: node scripts/fetch_unsplash_photos.mjs <ACCESS_KEY>');
  process.exit(1);
}

const locaties = [
  { id: 'hero_carretera', query: 'carretera austral patagonia road mountains' },
  { id: 'dag1',           query: 'puerto montt chile harbor patagonia' },
  { id: 'dag2',           query: 'parque pumalin patagonia temperate rainforest' },
  { id: 'dag4',           query: 'puyuhuapi patagonia fjord hot springs' },
  { id: 'dag6',           query: 'queulat ventisquero colgante hanging glacier patagonia' },
  { id: 'dag8',           query: 'cerro castillo patagonia basalt hiking' },
  { id: 'dag12',          query: 'coyhaique patagonia landscape road' },
  { id: 'dag14',          query: 'patagonia airport plane balmaceda' },
  { id: 'hero_chalten',   query: 'fitz roy el chalten patagonia sunrise' },
  { id: 'dag15',          query: 'el chalten fitz roy village patagonia' },
  { id: 'dag16',          query: 'laguna de los tres fitz roy reflection' },
  { id: 'dag18',          query: 'patagonia waterfall mountain lake' },
  { id: 'hero_ushuaia',   query: 'ushuaia tierra del fuego beagle channel' },
  { id: 'dag19',          query: 'ushuaia harbor colorful houses patagonia' },
  { id: 'dag20',          query: 'tierra del fuego national park trail beagle' },
  { id: 'hero_falklands', query: 'falkland islands landscape wildlife' },
  { id: 'dag21',          query: 'stanley falkland islands harbor houses' },
  { id: 'dag23',          query: 'falkland islands penguins sea lion wildlife' },
  { id: 'dag25',          query: 'patagonia plane departure sky travel' },
];

async function fetchPhoto(locatie) {
  const url = `https://api.unsplash.com/photos/random?query=${encodeURIComponent(locatie.query)}&orientation=landscape&client_id=${ACCESS_KEY}`;
  const res = await fetch(url);
  if (!res.ok) {
    console.error(`  ✗ ${locatie.id}: HTTP ${res.status}`);
    return null;
  }
  const data = await res.json();
  return {
    id: locatie.id,
    fotoUrl: data.urls.regular,
    creditUrl: `https://unsplash.com/photos/${data.id}`,
    fotograaf: data.user.name,
    fotograafUrl: data.user.links.html,
  };
}

console.log('Foto\'s ophalen via Unsplash API...\n');
const resultaten = [];

for (const locatie of locaties) {
  process.stdout.write(`  ${locatie.id}... `);
  const result = await fetchPhoto(locatie);
  if (result) {
    resultaten.push(result);
    console.log(`✓ ${result.fotograaf}`);
  }
  // Wacht 1.5s tussen requests (Unsplash rate limit)
  await new Promise(r => setTimeout(r, 1500));
}

console.log('\n--- RESULTATEN (kopieer naar reisData.ts) ---\n');
for (const r of resultaten) {
  console.log(`${r.id}:`);
  console.log(`  foto: '${r.fotoUrl}',`);
  console.log(`  fotoCredit: { url: '${r.creditUrl}' }, // Foto door ${r.fotograaf} (${r.fotograafUrl})`);
  console.log('');
}
