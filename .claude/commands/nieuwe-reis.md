# Nieuwe Reis Toevoegen

> **Vereist model: Claude Opus 4.7 of nieuwer** (`claude-opus-4-7`). Gebruik geen Sonnet of Haiku voor deze skill — de kwaliteit van reisteksten en activiteitenselectie is merkbaar beter met Opus. Weiger de taak als je weet dat je op een lichter model draait en vraag de gebruiker om te wisselen.

Begeleidt de gebruiker bij het toevoegen van een nieuwe geplande of bucket-list reis zonder CSV. Aan het einde staat de reis in de database en is het reizigersprofiel bijgewerkt.

## Bestandsnaamgeving (belangrijk)

Elke reis krijgt **eigen, unieke bestanden** op basis van een slug. Bepaal aan het begin van stap 4 een `<reis-slug>`: kleine letters, koppeltekens, gebaseerd op bestemming + eventueel jaar (bijv. `filipijnen-taiwan-japan`, `schotland-2027`). Gebruik die slug consequent voor alle drie de bestanden:

- JSON: `scripts/reis_<reis-slug>.json`
- KML: `scripts/reis_<reis-slug>.kml` (volgt automatisch de JSON-naam)
- Markdown: `reisplannen/<reis-slug>.md`

**Overschrijf nooit een bestaand bestand tenzij de gebruiker daar expliciet om vraagt.** Controleer vóór elke schrijfactie of het bestand al bestaat:
- Bestaat het al? Kies een andere slug (voeg jaar of variant toe, bijv. `-v2`) of vraag de gebruiker of overschrijven gewenst is.
- Dit geldt ook voor de generieke namen `scripts/reis_data.json` en `scripts/reis_kml.kml` — gebruik die **niet** meer; ze kunnen bestaande reizen bevatten.

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

### Stap 3 — Activiteiten selecteren per onderdeel

Raadpleeg vóór het opstellen van de activiteitenlijst de volgende blogs voor inspiratie per bestemming:
- `https://www.saltinhour.com` — zoek op de bestemming
- `https://www.reisjunk.nl` — zoek op de bestemming
- `https://www.betterplaces.nl` — zoek op de bestemming
- `https://www.travelbase.nl` — zoek op de bestemming

Verwerk relevante suggesties in de activiteitenlijst. Noteer bij het ophalen van blogsuggesties de exacte URL van het artikel waar de activiteit vandaan komt.

**Linkformat per activiteit:**
- Activiteit uit een blog → label is een klikbare link naar het bronartikel: `[(Reisjunk)](https://www.reisjunk.nl/artikel-url)`
- Activiteit uit eigen kennis of reizigersprofiel → geen link, geen label

Presenteer per onderdeel een genummerde lijst van **6-10 concrete activiteiten** passend bij de regio en het reizigersprofiel. Gebruik dit formaat:

```
**Blok 1 — <regio> (Dag 1-X)**
1. <activiteit> — korte omschrijving
2. <activiteit> — korte omschrijving [(Reisjunk)](https://www.reisjunk.nl/artikel-url)
3. <activiteit> — korte omschrijving [(Salt in Hour)](https://www.saltinhour.com/artikel-url)
...

Welke wil je doen? Geef aan: ja (nummers), misschien (nummers), rest = nee
```

Verwerk de keuzes en ga door naar het volgende onderdeel. Houd alle ja/misschien-keuzes bij.

**Let op:** de bloginhoud is alleen inspiratie voor de activiteitenlijst. Alleen de keuzes van de gebruiker (ja/misschien) gaan de database in — niet de blogsuggesties zelf.

### Stap 4 — KML bestand genereren

Bepaal eerst de `<reis-slug>` (zie "Bestandsnaamgeving"). Bouw daarna de JSON-structuur op met de bevestigde route en activiteitenkeuzes. Voeg per routestap een `blok` veld toe voor kleurcodering op de kaart (het KML-script groepeert en kleurt op `blok`). Sla op als `scripts/reis_<reis-slug>.json` — controleer eerst dat dit bestand nog niet bestaat:

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

Genereer daarna het KML-bestand (geef het slug-JSON-pad mee):

```bash
cd C:/Users/youpv/Documents/Claude/Routebaas
python scripts/genereer_kml.py scripts/reis_<reis-slug>.json
```

Dit maakt `scripts/reis_<reis-slug>.kml` aan (de KML-naam volgt automatisch de JSON-naam). Het script weigert te overschrijven als het KML-bestand al bestaat; alleen met `--force` wordt het vervangen. Importeer via **mymaps.google.com → Nieuw → Importeren** voor een interactieve kaart met gekleurde onderdelen per regiofase.

### Stap 5 — Reisplan opslaan als Markdown

Schrijf het volledige reisplan weg als `reisplannen/<reis-slug>.md` (bijv. `reisplannen/schotland-2027.md`) — gebruik dezelfde slug als bij de JSON/KML en controleer eerst dat het bestand nog niet bestaat. Gebruik deze structuur:

```markdown
# <Reisnaam>

**Bestemming:** <bestemming>  
**Duur:** <aantal> dagen  
**Periode:** <periode>  
**Vervoer:** <vervoer>  

[Bekijk route op Google Maps](<url>)

---

## Dagplanning

| | Ochtend | Middag | Avond | Slapen |
|---|---|---|---|---|
| Dag 1 | ... | ... | ... | ... |
...

---

## Onderdelen & Activiteiten

### <Onderdeelnaam> (Dag X–Y)

**Ja:**
- activiteit A
- activiteit B

**Misschien:**
- activiteit C

...
```

Bevestig aan de gebruiker dat het bestand is opgeslagen en vraag daarna expliciet: **"Wil je de reis ook in de database opslaan?"** Ga pas verder met stap 6 als de gebruiker dit bevestigt.

### Stap 6 — Data opslaan in database

```bash
cd C:/Users/youpv/Documents/Claude/Routebaas
python scripts/sla_nieuwe_reis_op.py scripts/reis_<reis-slug>.json
```

### Stap 7 — Reizigersprofiel bijwerken

Na succesvol opslaan:

```bash
cd C:/Users/youpv/Documents/Claude/Routebaas
python scripts/reizigersprofiel.py
```

Bevestig aan de gebruiker welke reisroute is aangemaakt (id + naam) en dat het profiel is bijgewerkt met de nieuwe activiteitsvoorkeuren.
