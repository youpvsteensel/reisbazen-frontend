# Reizigersprofiel — Genereer of toon het reizigersprofiel

Beheer het reizigersprofiel dat wordt gebruikt voor nieuwe bestemmingen.

De gebruiker heeft opgegeven: $ARGUMENTS

Verwerk als volgt:

- Geen argumenten of `toon` → toon het huidige profiel uit de DB
- `genereer` → genereer een nieuw profiel op basis van de DB-data
- `genereer <extra input>` → genereer een profiel met extra context van de reiziger zelf (bijv. "genereer Ik reis het liefst in de herfst en spreek Spaans")

Voer het juiste commando uit:

```python
import subprocess, sys

args = """$ARGUMENTS""".strip()

if not args or args == "toon":
    cmd = [sys.executable, "scripts/reizigersprofiel.py", "--toon"]
elif args.startswith("genereer"):
    extra = args[len("genereer"):].strip()
    if extra:
        cmd = [sys.executable, "scripts/reizigersprofiel.py", "--extra", extra]
    else:
        cmd = [sys.executable, "scripts/reizigersprofiel.py"]
else:
    cmd = [sys.executable, "scripts/reizigersprofiel.py"]

result = subprocess.run(
    cmd,
    cwd="C:/Users/youpv/Documents/Claude/Routebaas",
    capture_output=True, text=True, encoding="utf-8"
)
print(result.stdout)
if result.stderr:
    print("STDERR:", result.stderr[-300:])
```

Na uitvoer: als het profiel getoond of gegenereerd is, geef een korte Nederlandse samenvatting van de reisstijl en bied aan om een nieuwe bestemming te plannen via `/reisplanner`.
