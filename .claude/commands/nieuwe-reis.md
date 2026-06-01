# Nieuwe Reis Toevoegen

Begeleidt de gebruiker bij het toevoegen van een nieuwe geplande of bucket-list reis zonder CSV. Aan het einde staat de reis in de database en is het reizigersprofiel bijgewerkt.

## Workflow

### Stap 1 — Input verzamelen

Vraag wat je nog niet weet:
- **Bestemming** (land/regio)
- **Reisduur** (aantal dagen)
- **Periode** (wanneer globaal, mag vaag zijn)
- **Interesses** (kies uit: avontuur, bergen, fietsen, fotografie, hiken & wandelen, kamperen, nationale_parken, natuur, roadtrip, strand, watersport, wildlife, wintersport, architectuur, cultuur, festivals, geschiedenis, lokale_markten, musea, gastronomie, streetfood, wellness, off_the_beaten, slow_travel)
- **Extra wensen** (vervoer, accommodatiestijl, budget, etc.) — optioneel

### Stap 2 — Routevoorstel genereren

Lees het reizigersprofiel uit `api/profiel.json` en genereer op basis daarvan een gepersonaliseerde route. Gebruik je eigen kennis van de bestemming gecombineerd met het profiel — geen Python-script nodig.

Presenteer altijd **twee dingen**:

**1. Dagplanning tabel**

| | Ochtend | Middag | Avond | Slapen |
|---|---|---|---|---|
| **Dag 1** | ... | ... | ... | stad |
| **Dag 2** | ... | ... | ... | stad |

Gebruik ochtend/middag/avond als kolommen. Voeg afstanden + rijtijden toe bij verplaatsingen (bijv. "Edinburgh → St Andrews (90km, 1u15)"). Markeer aankomst- en vertrekdag als halve dag.

**2. Google Maps routelink**

Genereer een klikbare link met alle hoofdstops als waypoints:
`https://www.google.com/maps/dir/Stop1/Stop2/Stop3/...`

Vervang spaties door `+` en gebruik Engelse plaatsnamen. Voorbeeld:
`[Bekijk route op Google Maps](https://www.google.com/maps/dir/Edinburgh/St+Andrews/Glencoe/Edinburgh+Airport)`

Vraag de gebruiker of de structuur klopt of aanpassingen nodig zijn. Pas aan op basis van feedback voordat je verder gaat.

### Stap 3 — Activiteiten selecteren per blok

Raadpleeg vóór het opstellen van de activiteitenlijst de volgende blogs voor inspiratie per bestemming:
- `https://www.saltinhour.com` — zoek op de bestemming
- `https://www.reisjunk.nl` — zoek op de bestemming
- `https://www.betterplaces.nl` — zoek op de bestemming
- `https://www.travelbase.nl` — zoek op de bestemming

Verwerk relevante suggesties in de activiteitenlijst. Markeer activiteiten die uit een blog komen met de bronnaam tussen haakjes, bijv. `(Reisjunk)`, `(Salt in Hour)`, `(Better Places)` of `(Travelbase)`. Activiteiten zonder markering komen uit eigen kennis of het reizigersprofiel.

Presenteer per blok een genummerde lijst van **6-10 concrete activiteiten** passend bij de regio en het reizigersprofiel. Gebruik dit formaat:

```
**Blok 1 — <regio> (Dag 1-X)**
1. <activiteit>
2. <activiteit> (Reisjunk)
3. <activiteit> (Salt in Hour)
...

Welke wil je doen? Geef aan: ja (nummers), misschien (nummers), rest = nee
```

Verwerk de keuzes en ga door naar het volgende blok. Houd alle ja/misschien-keuzes bij.

**Let op:** de bloginhoud is alleen inspiratie voor de activiteitenlijst. Alleen de keuzes van de gebruiker (ja/misschien) gaan de database in — niet de blogsuggesties zelf.

### Stap 4 — KML bestand genereren

Bouw eerst de JSON-structuur op met de bevestigde route en activiteitenkeuzes. Voeg per routestap een `blok` veld toe voor kleurcodering op de kaart. Sla op als `scripts/reis_data.json`:

```json
{
  "naam": "Reisroute <bestemming>",
  "bestemming": "<bestemming>",
  "land": "<land>",
  "beschrijving": "<1-2 zinnen over de reis>",
  "routestappen": [
    {
      "dag_nr": 1,
      "blok": "<bloknaam, bijv. 'Carretera Austral'>",
      "naam": "<beschrijvende naam voor de dag>",
      "plek": "<plaatsnaam>",
      "accomodatie": "<accommodatienaam of leeglaten>",
      "activiteiten_ja": ["activiteit A", "activiteit B"],
      "activiteiten_misschien": ["activiteit C"]
    }
  ]
}
```

Genereer daarna het KML-bestand:

```bash
cd C:/Users/youpv/Documents/Claude/Routebaas
python scripts/genereer_kml.py scripts/reis_data.json
```

Dit maakt `scripts/reis_kml.kml` aan. Importeer via **mymaps.google.com → Nieuw → Importeren** voor een interactieve kaart met gekleurde blokken per regiofase.

### Stap 5 — Data opslaan in database

```bash
cd C:/Users/youpv/Documents/Claude/Routebaas
python scripts/sla_nieuwe_reis_op.py scripts/reis_data.json
```

### Stap 5 — Reizigersprofiel bijwerken

Na succesvol opslaan:

```bash
cd C:/Users/youpv/Documents/Claude/Routebaas
python scripts/reizigersprofiel.py
```

Bevestig aan de gebruiker welke reisroute is aangemaakt (id + naam) en dat het profiel is bijgewerkt met de nieuwe activiteitsvoorkeuren.
