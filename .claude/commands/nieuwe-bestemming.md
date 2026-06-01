# Nieuwe Bestemming Genereren

Voegt automatisch een nieuwe bestemming toe aan de Routebaas database. Claude genereert de volledige reisroute en slaat alles op inclusief embeddings — geen interactie nodig.

Gebruik dit om de database te vullen met nieuwe bestemmingen voor de RAG-pipeline.
Gebruik /nieuwe-reis als je een reis echt wilt plannen en activiteiten wilt selecteren.

**Gebruik:** `/nieuwe-bestemming <bestemming> <dagen> <interesses>`

**Voorbeeld:** `/nieuwe-bestemming "Patagonië" 21 "natuur,hiken,wildkamperen"`

---

## Workflow

### Stap 1 — Arguments verwerken

Argumenten: `$ARGUMENTS`

Parseer:
1. **Bestemming** — land of regio
2. **Dagen** — aantal reisdagen (integer)
3. **Interesses** — kommagescheiden lijst

Ontbreken er argumenten? Vraag ze op.

### Stap 2 — Script uitvoeren

```bash
cd C:/Users/youpv/Documents/Claude/Routebaas
python scripts/genereer_bestemming.py "<bestemming>" <dagen> "<interesses>"
```

Het script genereert de route via Claude API, slaat op in de database en maakt embeddings aan voor alle nieuwe entiteiten.

### Stap 3 — Bevestiging

Meld:
- Reisroute aangemaakt (naam + database-id)
- Aantal routestappen
- Bestemming is nu beschikbaar via `/reisplanner`

Bij fouten: toon de volledige foutmelding.
