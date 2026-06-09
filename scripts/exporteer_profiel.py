"""
Exporteert het laatste reizigersprofiel uit de database naar api/profiel.json.

Gebruik:
  python scripts/exporteer_profiel.py --preview   # toon wat er zou veranderen
  python scripts/exporteer_profiel.py --apply     # voer de wijzigingen door
"""
import sys
import json
import argparse
import psycopg2
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")

PAD = Path(__file__).parent.parent / "api" / "profiel.json"


def _haal_gegenereerd_op():
    conn = psycopg2.connect(
        host="localhost", port=5432, database="postgres",
        user="postgres", password="yvs20091994"
    )
    cur = conn.cursor()
    cur.execute("SELECT profiel_json, gegenereerd_op FROM reizigersprofiel ORDER BY gegenereerd_op DESC LIMIT 1")
    row = cur.fetchone()
    cur.close()
    conn.close()
    if not row:
        print("Geen profiel gevonden in database. Voer eerst reizigersprofiel.py uit.")
        sys.exit(1)
    return row[0], row[1]


def _laad_huidig():
    if PAD.exists():
        with open(PAD, encoding="utf-8") as f:
            return json.load(f)
    return {}


def _repr(waarde, max_len=120):
    """Korte leesbare representatie van een waarde."""
    if isinstance(waarde, str):
        return f'"{waarde[:max_len]}{"…" if len(waarde) > max_len else ""}"'
    if isinstance(waarde, list):
        items = ", ".join(f'"{v}"' if isinstance(v, str) else str(v) for v in waarde[:4])
        suffix = f" … (+{len(waarde)-4})" if len(waarde) > 4 else ""
        return f"[{items}{suffix}]"
    if isinstance(waarde, dict):
        return f"{{object met {len(waarde)} velden}}"
    return str(waarde)


def _toon_diff(huidig, nieuw):
    alle_sleutels = sorted(set(huidig) | set(nieuw))
    gewijzigd, toegevoegd, alleen_handmatig, ongewijzigd = [], [], [], []

    for sleutel in alle_sleutels:
        in_huidig = sleutel in huidig
        in_nieuw = sleutel in nieuw

        if in_huidig and not in_nieuw:
            alleen_handmatig.append(sleutel)
        elif in_nieuw and not in_huidig:
            toegevoegd.append(sleutel)
        elif huidig[sleutel] != nieuw[sleutel]:
            gewijzigd.append(sleutel)
        else:
            ongewijzigd.append(sleutel)

    print("\n" + "=" * 60)
    print("PREVIEW: wijzigingen in api/profiel.json")
    print("=" * 60)

    if gewijzigd:
        print(f"\n── GEWIJZIGD ({len(gewijzigd)}) ──")
        for s in gewijzigd:
            print(f"\n  [{s}]")
            print(f"  HUIDIG: {_repr(huidig[s])}")
            print(f"  NIEUW:  {_repr(nieuw[s])}")

    if toegevoegd:
        print(f"\n── NIEUW vanuit DB ({len(toegevoegd)}) ──")
        for s in toegevoegd:
            print(f"\n  [{s}]")
            print(f"  {_repr(nieuw[s])}")

    if alleen_handmatig:
        print(f"\n── ALLEEN HANDMATIG — blijven behouden ({len(alleen_handmatig)}) ──")
        for s in alleen_handmatig:
            print(f"  ✓ {s}")

    if ongewijzigd:
        print(f"\n── ONGEWIJZIGD ({len(ongewijzigd)}) ──")
        print("  " + ", ".join(ongewijzigd))

    print("\n" + "=" * 60)
    totaal_impact = len(gewijzigd) + len(toegevoegd)
    if totaal_impact == 0:
        print("Geen wijzigingen — profiel is al up-to-date.")
    else:
        print(f"{totaal_impact} veld(en) zouden veranderen, {len(alleen_handmatig)} handmatige velden blijven behouden.")
        print("Gebruik --apply om door te voeren.")
    print()


def _schrijf_merge(huidig, nieuw):
    """Schrijft nieuw profiel, behoudt handmatige velden die niet in nieuw zitten."""
    samengevoegd = {**nieuw}
    for sleutel, waarde in huidig.items():
        if sleutel not in nieuw:
            samengevoegd[sleutel] = waarde
    PAD.parent.mkdir(exist_ok=True)
    with open(PAD, "w", encoding="utf-8") as f:
        json.dump(samengevoegd, f, ensure_ascii=False, indent=2)
    return samengevoegd


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--preview", action="store_true", help="Toon wat er zou veranderen zonder te schrijven")
    parser.add_argument("--apply", action="store_true", help="Voer de wijzigingen door")
    args = parser.parse_args()

    if not args.preview and not args.apply:
        print("Geef --preview of --apply mee.")
        print("  --preview  toon wijzigingen zonder op te slaan")
        print("  --apply    sla wijzigingen op (handmatige velden blijven behouden)")
        sys.exit(0)

    nieuw, gegenereerd_op = _haal_gegenereerd_op()
    huidig = _laad_huidig()

    _toon_diff(huidig, nieuw)

    if args.apply:
        samengevoegd = _schrijf_merge(huidig, nieuw)
        print(f"Profiel opgeslagen naar {PAD}")
        print(f"Gegenereerd op: {gegenereerd_op}")
        print(f"Totaal velden in bestand: {len(samengevoegd)}")
