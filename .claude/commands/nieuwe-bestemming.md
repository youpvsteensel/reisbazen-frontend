# Nieuwe Bestemming Genereren

AI genereert een volledig reisplan als startpunt. Daarna volgt het interactieve verfijningsproces van /nieuwe-reis: activiteiten selecteren, aanpassen, en pas dan opslaan.

**Gebruik:** `/nieuwe-bestemming <bestemming> <dagen> <interesses>`

**Voorbeeld:** `/nieuwe-bestemming "Patagonië" 21 "natuur,hiken,wildkamperen"`

---

## Stap 1 — Reisplan genereren

Genereer het AI-skelet via:

```bash
cd C:/Users/youpv/Documents/Claude/Routebaas
python scripts/genereer_bestemming.py "<bestemming>" <dagen> "<interesses>" --preview
```

Dit geeft een JSON-structuur met alle dagen, plekken en activiteiten — zonder iets op te slaan.

## Stap 2 — Dagplanning presenteren

Zet de JSON om naar een overzichtelijke tabel (zie /nieuwe-reis stap 2):

| | Ochtend | Middag | Avond | Slapen |
|---|---|---|---|---|
| **Dag 1** | ... | ... | ... | locatie |

Voeg rijtijden toe bij verplaatsingen en genereer een Google Maps routelink:
`[Bekijk route op Google Maps](https://www.google.com/maps/dir/Stop1/Stop2/...)`

Vraag of de structuur klopt. Pas aan op basis van feedback.

## Stap 3 — Activiteiten verfijnen

Gebruik de door AI gegenereerde activiteiten als startpunt. Presenteer per regioblok:

```
**Blok 1 — <regio> (Dag 1-X)**
AI heeft gegenereerd:
1. <activiteit_ja_1>
2. <activiteit_ja_2>
3. <activiteit_misschien_1>

Aanpassen? Geef aan: ja (nummers), misschien (nummers), verwijderen, of voeg toe
```

Verwerk de keuzes per blok. Houd ja/misschien bij.

## Stap 4 — Opslaan

Bouw de definitieve JSON op en sla op (zie /nieuwe-reis stap 4):

```bash
cd C:/Users/youpv/Documents/Claude/Routebaas
python scripts/sla_nieuwe_reis_op.py scripts/reis_data.json
```

## Stap 5 — Reizigersprofiel bijwerken

```bash
cd C:/Users/youpv/Documents/Claude/Routebaas
python scripts/reizigersprofiel.py
```

Bevestig: reisroute aangemaakt (id + naam), profiel bijgewerkt.
