# Nieuwe Bestemming Genereren

Genereert automatisch een volledige reisroute voor een nieuwe bestemming via de Claude API en slaat alles op in de database inclusief embeddings.

**Gebruik:** `/nieuwe-bestemming <bestemming> <dagen> <interesses>`

**Voorbeeld:** `/nieuwe-bestemming "Patagonië" 21 "natuur,hiken,wildkamperen"`

## Workflow

### Stap 1 — Arguments verwerken

De argumenten worden meegegeven als: `$ARGUMENTS`

Parseer de drie argumenten:
1. **Bestemming** — naam van het land of de regio (tussen aanhalingstekens als er spaties in zitten)
2. **Dagen** — aantal reisdagen als integer
3. **Interesses** — kommagescheiden lijst van interesses

Als er argumenten ontbreken, vraag dan:
- Bestemming (land of regio)?
- Reisduur in dagen?
- Interesses (kommagescheiden, bijv. natuur,hiken,wildkamperen)?

### Stap 2 — Script uitvoeren

Voer het generatiescript uit met de opgegeven parameters:

```bash
cd C:/Users/youpv/Documents/Claude/Routebaas
python scripts/genereer_bestemming.py "<bestemming>" <dagen> "<interesses>"
```

Het script:
1. Roept de Claude API aan om een gedetailleerde reisroute te genereren (claude-opus-4-5)
2. Slaat de route op in de hoofddatabase via `sla_nieuwe_reis_op.py`
3. Maakt embeddings aan voor alle nieuwe entiteiten (bestemmingen, reisroutes, routestappen, activiteiten, plekken)

### Stap 3 — Bevestiging

Na succesvol uitvoeren:
- Meld welke reisroute is aangemaakt (naam + database-id)
- Meld hoeveel routestappen zijn gegenereerd
- Geef aan dat de bestemming nu beschikbaar is via `/reisplanner`

Bij fouten: toon de volledige foutmelding zodat het probleem duidelijk is.
