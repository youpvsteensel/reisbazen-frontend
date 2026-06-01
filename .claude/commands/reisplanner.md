# Reisplanner — Genereer een gepersonaliseerde reisroute

Gebruik de Routebaas RAG-pipeline én het reizigersprofiel om een reisroute te maken.

De gebruiker heeft opgegeven: $ARGUMENTS

**Parseer de invoer** uit `$ARGUMENTS`:
- Formaat: `<bestemming> <dagen> <interesse1,interesse2,...> [extra wensen]`
- Voorbeeld: `Patagonië 21 natuur,kamperen,hiken`
- Als de invoer ontbreekt of onduidelijk is, vraag dan naar bestemming, reisduur en interesses.

Bepaal daarna of de bestemming al in de database zit (Japan, Canada, Costa Rica, Azoren, Montenegro):
- **Bekende bestemming** → gebruik `reisplanner()` met RAG-context uit de eigen database
- **Nieuwe bestemming** → gebruik `plan_nieuwe_bestemming()` met het reizigersprofiel + analoge RAG-ervaringen

Voer het juiste script uit:

```python
import subprocess, sys

args = """$ARGUMENTS""".strip()
parts = args.split(None, 3)

bestemming = parts[0] if len(parts) > 0 else "Japan"
dagen = int(parts[1]) if len(parts) > 1 and parts[1].isdigit() else 14
interesses_str = parts[2] if len(parts) > 2 else "natuur,avontuur"
interesses = [i.strip() for i in interesses_str.split(",")]
extra = parts[3] if len(parts) > 3 else ""

bekende_bestemmingen = ["japan", "canada", "costa rica", "azoren", "montenegro"]
is_bekend = bestemming.lower() in bekende_bestemmingen

vraag = f"Stel een {dagen}-daagse reisroute samen voor {bestemming} met interesses: {', '.join(interesses)}."
if extra:
    vraag += f" Extra wensen: {extra}"

if is_bekend:
    script = f"""
import sys, importlib.util
sys.stdout.reconfigure(encoding='utf-8')
spec = importlib.util.spec_from_file_location('rc', 'scripts/routebaas-claude.py')
rc = importlib.util.module_from_spec(spec)
spec.loader.exec_module(rc)
print("Routebaas doorzoekt ervaringen en activiteiten voor {bestemming}...")
print()
rc.reisplanner(
    gebruikersvraag={repr(vraag)},
    bestemming={repr(bestemming)},
    interesses={repr(interesses)},
    reislengte_dagen={dagen}
)
"""
else:
    script = f"""
import sys, importlib.util
sys.stdout.reconfigure(encoding='utf-8')
spec = importlib.util.spec_from_file_location('rc', 'scripts/routebaas-claude.py')
rc = importlib.util.module_from_spec(spec)
spec.loader.exec_module(rc)
print("Nieuwe bestemming: Routebaas laadt reizigersprofiel en analoge ervaringen...")
print()
rc.plan_nieuwe_bestemming(
    bestemming={repr(bestemming)},
    reislengte_dagen={dagen},
    interesses={repr(interesses)},
    extra_wensen={repr(extra) if extra else repr(None)}
)
"""

result = subprocess.run(
    [sys.executable, "-c", script],
    cwd="C:/Users/youpv/Documents/Claude/Routebaas",
    capture_output=False, text=True, encoding="utf-8"
)
```

Als het profiel ontbreekt bij een nieuwe bestemming, vraag de gebruiker om eerst `/reizigersprofiel genereer` uit te voeren.
