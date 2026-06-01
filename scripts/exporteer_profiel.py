"""
Exporteert het laatste reizigersprofiel uit de database naar api/profiel.json.
Voer dit uit na elke profielupdate zodat de API het nieuwste profiel gebruikt.

Gebruik: python scripts/exporteer_profiel.py
"""
import sys
import json
import psycopg2
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")


def exporteer():
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
        print("Geen profiel gevonden. Voer eerst reizigersprofiel.py uit.")
        sys.exit(1)

    profiel, gegenereerd_op = row
    pad = Path(__file__).parent.parent / "api" / "profiel.json"
    pad.parent.mkdir(exist_ok=True)

    with open(pad, "w", encoding="utf-8") as f:
        json.dump(profiel, f, ensure_ascii=False, indent=2)

    print(f"Profiel geëxporteerd naar {pad}")
    print(f"Gegenereerd op: {gegenereerd_op}")
    print(f"Samenvatting: {profiel.get('profiel_samenvatting', '')[:100]}...")


if __name__ == "__main__":
    exporteer()
