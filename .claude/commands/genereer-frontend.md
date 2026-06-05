# Genereer Frontend voor Nieuwe Reis

> **Vereist model: Claude Opus 4.7** (`claude-opus-4-7`). Weiger de taak als je op een lichter model draait.

Genereert alle frontend bestanden voor een reis op basis van een opgeslagen reisplan `.md`.
Gebruikt de Patagonie-implementatie als template.

**Gebruik:** `/genereer-frontend <pad>` — bijv. `/genereer-frontend reisplannen/schotland.md`

---

## Workflow

### Stap 1 — Lees het reisplan

Lees het opgegeven `.md` bestand (pad relatief aan project root) en extraheer:

- **Reisnaam** (eerste `# heading`)
- **Bestemming, duur, periode, vervoer** (vetgedrukte metadata-velden)
- **Google Maps link**
- **Onderdelen** — elke `### heading` met dagbereik tussen haakjes
- **Dagplanning tabel** — dag nr, ochtend/middag/avond/slapen per rij
- **Activiteiten per onderdeel** — "Ja" en "Misschien" lijsten

Stel een overzicht voor van wat je gevonden hebt en vraag bevestiging voordat je verder gaat.

---

### Stap 2 — Slugs en routes bepalen

Genereer URL-vriendelijke slugs (lowercase, spaties → koppeltekens, speciale tekens verwijderen):

- **Reis slug:** bijv. `schotland`, `costa-rica`, `nieuw-zeeland`
- **Reis route:** `/<reis-slug>` (bijv. `/schotland`)
- **Per onderdeel slug:** bijv. `hooglanden`, `isle-of-skye`
- **Per onderdeel route:** `/<reis-slug>/<onderdeel-slug>`

Toon de routes en vraag bevestiging.

---

### Stap 3 — Foto's ophalen via Unsplash

Per dag in het plan: haal een foto op via de Unsplash API.

Gebruik het script:
```bash
cd C:/Users/youpv/Documents/Claude/Routebaas
node scripts/fetch_unsplash_photos.mjs "<UNSPLASH_ACCESS_KEY>" "<locatienaam>" 1
```

Als het script niet bestaat of de access key ontbreekt, vraag de gebruiker om de key.
Sla de resulterende foto-URL's op per dag (inclusief Unsplash credit-URL voor `fotoCredit`).

Haal ook een **hero-foto per onderdeel** op (gebruik de eerste stop van het onderdeel als query).
Haal een **cover-foto voor de reis** op (gebruik de bestemming als query).

---

### Stap 4 — reisData.ts uitbreiden

Voeg aan `src/data/reisData.ts` toe:

**1. Nieuwe `Reis` in `alleReizen[]`:**
```typescript
{
  id: '<reis-slug>',
  naam: '<Reisnaam>',
  ondertitel: '<korte tagline, max 1 zin>',
  beschrijving: '<2-3 zinnen, sfeervolle beschrijving>',
  cover: '<cover foto URL>',
  route: '/<reis-slug>',
  landen: ['<land1>', '<land2>'],
  duur: <aantal_dagen>,
  periode: '<periode>',
  status: 'gepland',
}
```

**2. Nieuwe blokken in `blokken` record — één per onderdeel:**
```typescript
<onderdeel_sleutel>: {
  id: '<onderdeel_sleutel>',
  naam: '<Onderdeelnaam>',
  subtitel: '<korte beschrijving van dit onderdeel>',
  dagBereik: 'Dagen X–Y',
  hero: '<hero foto URL>',
  heroCredit: { url: '<unsplash credit url>' },
  route: '/<reis-slug>/<onderdeel-slug>',
  reisRoute: '/<reis-slug>',
  reisNaam: '<Reisnaam>',
  vorigeBlok: <of undefined voor eerste>,
  volgendeBlok: <of undefined voor laatste>,
  praktischInfo: [
    // Genereer 4-6 praktische tips op basis van de reisinfo
    // Gebruik relevante emoji's: 🗓 📍 🚗 🥾 🏕 💶 🌡 etc.
    { icon: '🗓', label: 'Beste tijd', waarde: '<waarde>' },
  ],
  dagen: [
    // Één Dag object per dag in dit onderdeel (zie format hieronder)
  ],
}
```

**3. Dag format per dag:**
```typescript
{
  id: 'dag<nr>',          // bijv. 'dag1', 'dag15'
  dag: <nr>,              // getal (of string bij meerdaagse, bijv. '15-17')
  titel: '<Beschrijvende dagtitel>',
  locatie: '<Plaatsnaam>',
  badges: ['<badge1>', '<badge2>'],   // max 3, bijv. 'Wandelen', 'Aankomst', 'Vrije dag'
  foto: '<unsplash foto URL>',
  fotoCredit: { url: '<unsplash credit url>' },
  beschrijving: '<2-4 zinnen sfeervolle beschrijving van de dag>',
  activiteiten: ['<activiteit 1>', '<activiteit 2>'],  // alleen de "ja" keuzes
  praktisch: [
    { icon: '⏱', label: 'Wandeltijd', waarde: '~4 uur' },  // optioneel, 0-3 items
  ],
}
```

Genereer voor `beschrijving` echte, sfeervolle tekst — niet generiek. Gebruik kennis van de locatie.

---

### Stap 5 — Pagina-componenten genereren

**1. Trip overzichtspagina** — `src/pages/<NaamPage>.tsx`

Gebruik `PatagoniePage.tsx` als template. Pas aan:
- Breadcrumb, titels, beschrijving
- `blokken` array met juiste routes en hero-foto's
- `tripStats` met juiste waarden (duur, periode, vervoer, type reis)
- Route strip: stops links, `RouteKaart<Naam>` rechts (zie stap 7)
- Google Maps link

**2. Blok-pagina's per onderdeel** — `src/pages/<OnderdeelNaam>Page.tsx`

Eenvoudig wrapper-component (zie `CarreteraAustralPage.tsx` als template):
```tsx
import BlokPagina from '../components/BlokPagina';
import { blokken } from '../data/reisData';

export default function <OnderdeelNaam>Page() {
  return <BlokPagina blok={blokken.<onderdeel_sleutel>} />;
}
```

---

### Stap 6 — RouteKaart component genereren

Genereer `src/components/RouteKaart<NaamPascalCase>.tsx` op basis van `RouteKaart.tsx`.

Geocodeer de stops via Nominatim:
```bash
curl "https://nominatim.openstreetmap.org/search?q=<plaatsnaam>&format=json&limit=1" -H "User-Agent: Routebaas/1.0"
```

Gebruik de `lat`/`lon` uit het resultaat. Wacht 1 seconde tussen requests (Nominatim rate limit).

Pas de stops array, kleuren per onderdeel en center-coördinaten aan voor de nieuwe reis.

---

### Stap 7 — App.tsx updaten

Voeg imports en routes toe aan `src/App.tsx`:

```tsx
import <NaamPage> from './pages/<NaamPage>';
import <Onderdeel1>Page from './pages/<Onderdeel1>Page>';
// ...

<Route path="/<reis-slug>" element={<<NaamPage> />} />
<Route path="/<reis-slug>/<onderdeel1-slug>" element={<<Onderdeel1>Page />} />
// ...
```

---

### Stap 9 — Build & verificatie

```bash
cd C:/Users/youpv/Documents/Claude/Routebaas
npx tsc --noEmit -p tsconfig.app.json && npm run build
```

Los eventuele TypeScript-fouten op voordat je verder gaat.

---

### Stap 10 — Commit & push

```bash
cd C:/Users/youpv/Documents/Claude/Routebaas
git add src/
git commit -m "feat: voeg <reisnaam> toe aan frontend"
git push frontend-origin frontend
```

Bevestig aan de gebruiker: welke bestanden zijn aangemaakt, hoeveel dagen/onderdelen, en de Vercel-url.
