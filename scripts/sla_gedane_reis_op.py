"""
Importeert een gedane (of bucket-list) reis in de database vanuit een licht JSON-formaat.
Schrijft ook naar de ervaringen-tabel (ratings + reviews) — het belangrijkste signaal voor het reizigersprofiel.

JSON-formaat:
{
  "naam": "Zuid-Amerika — Argentinië & Peru",
  "bestemming": "Argentinië",        // primaire bestemming (voor DB-koppeling)
  "landen": ["Argentinië", "Peru"],  // optioneel: meerdere landen
  "land": "Argentinië",
  "duur_dagen": 30,
  "periode": "2019-03",              // YYYY-MM of YYYY
  "status": "gedaan",                // "gedaan" of "bucket_list"
  "beschrijving": "Korte omschrijving van de reis",
  "hoogtepunten": [
    { "naam": "...", "rating": 5, "review": "Waarom was dit zo goed?" }
  ],
  "teleurstellingen": [
    { "naam": "...", "rating": 2, "review": "Waarom viel dit tegen?" }
  ],
  "activiteiten": ["hiken", "wildkamperen", "wildlife"],
  "accommodaties": ["naam lodge", "wildkamperen"]
}

Gebruik: python scripts/sla_gedane_reis_op.py scripts/reis_<slug>.json
"""
import sys
import json
import psycopg2
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")

# Status IDs (aanpassen als jouw DB andere IDs gebruikt)
STATUS_GEDAAN      = 1
STATUS_BUCKET_LIST = 2
STATUS_GEPLAND     = 3


def get_conn():
    return psycopg2.connect(
        host="localhost", port=5432, database="postgres",
        user="postgres", password="yvs20091994"
    )


def haal_of_maak(cur, tabel, zoek_kolom, zoek_waarde, insert_sql, insert_waarden):
    cur.execute(f"SELECT id FROM {tabel} WHERE {zoek_kolom} = %s", (zoek_waarde,))
    rij = cur.fetchone()
    if rij:
        return rij[0]
    cur.execute(insert_sql, insert_waarden)
    return cur.fetchone()[0]


def status_id(status_str: str) -> int:
    mapping = {
        "gedaan":      STATUS_GEDAAN,
        "bucket_list": STATUS_BUCKET_LIST,
        "gepland":     STATUS_GEPLAND,
    }
    val = mapping.get(status_str.lower())
    if val is None:
        print(f"Onbekende status '{status_str}', gebruik 'gedaan', 'bucket_list' of 'gepland'.")
        sys.exit(1)
    return val


def sla_op(data: dict) -> int:
    conn = get_conn()
    cur = conn.cursor()

    # Bestemming (primair)
    bestemming_id = haal_of_maak(
        cur, "bestemmingen", "naam", data["bestemming"],
        "INSERT INTO bestemmingen (naam, land) VALUES (%s, %s) RETURNING id",
        (data["bestemming"], data.get("land", data["bestemming"]))
    )

    # Reisroute
    reisroute_id = haal_of_maak(
        cur, "reisroutes", "naam", data["naam"],
        "INSERT INTO reisroutes (naam, status_id, beschrijving, bron) VALUES (%s, %s, %s, %s) RETURNING id",
        (data["naam"], status_id(data.get("status", "gedaan")), data.get("beschrijving", ""), "gedaan_reis")
    )
    print(f"Reisroute: {data['naam']} (id={reisroute_id})")

    # Één generieke routestap per bestemming (voor de koppeling)
    landen = data.get("landen", [data["bestemming"]])
    for i, land_naam in enumerate(landen):
        land_bestemming_id = haal_of_maak(
            cur, "bestemmingen", "naam", land_naam,
            "INSERT INTO bestemmingen (naam, land) VALUES (%s, %s) RETURNING id",
            (land_naam, land_naam)
        )
        plek_id = haal_of_maak(
            cur, "plekken", "naam", land_naam,
            "INSERT INTO plekken (naam, bestemmingen_id) VALUES (%s, %s) RETURNING id",
            (land_naam, land_bestemming_id)
        )
        cur.execute(
            """INSERT INTO routestappen (naam, dag_nr, reisroutes_id, bestemmingen_id)
               VALUES (%s, %s, %s, %s) RETURNING id""",
            (land_naam, i + 1, reisroute_id, land_bestemming_id)
        )
        stap_id = cur.fetchone()[0]
        cur.execute(
            "INSERT INTO routestap_plekken (routestappen_id, plekken_id, volgorde) VALUES (%s, %s, 0)"
            " ON CONFLICT DO NOTHING",
            (stap_id, plek_id)
        )

    # Hoogtepunten → ervaringen (rating 4-5)
    for h in data.get("hoogtepunten", []):
        cur.execute(
            """INSERT INTO ervaringen (naam, reisroutes_id, entity_type, rating, reviewtekst)
               VALUES (%s, %s, %s, %s, %s)""",
            (h["naam"], reisroute_id, "activiteit", h.get("rating", 5), h.get("review", ""))
        )
        print(f"  ★ {h['rating']}/5  {h['naam'][:60]}")

    # Teleurstellingen → ervaringen (rating 1-2)
    for t in data.get("teleurstellingen", []):
        cur.execute(
            """INSERT INTO ervaringen (naam, reisroutes_id, entity_type, rating, reviewtekst)
               VALUES (%s, %s, %s, %s, %s)""",
            (t["naam"], reisroute_id, "activiteit", t.get("rating", 2), t.get("review", ""))
        )
        print(f"  ✗ {t['rating']}/5  {t['naam'][:60]}")

    # Activiteiten (interesses-signaal)
    for act_naam in data.get("activiteiten", []):
        act_id = haal_of_maak(
            cur, "activiteiten", "naam", act_naam,
            "INSERT INTO activiteiten (naam, beschrijving) VALUES (%s, %s) RETURNING id",
            (act_naam, f"Activiteit op gedane reis: {data['naam']}")
        )

    # Accommodaties
    for acc_naam in data.get("accommodaties", []):
        haal_of_maak(
            cur, "accomodaties", "naam", acc_naam,
            "INSERT INTO accomodaties (naam, status_id) VALUES (%s, %s) RETURNING id",
            (acc_naam, status_id(data.get("status", "gedaan")))
        )
        print(f"  🏠 {acc_naam}")

    conn.commit()
    cur.close()
    conn.close()
    print(f"\nOpgeslagen. Reisroute id={reisroute_id}")
    return reisroute_id


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Gebruik: python scripts/sla_gedane_reis_op.py scripts/reis_<slug>.json")
        sys.exit(1)

    pad = Path(sys.argv[1])
    if not pad.exists():
        print(f"Bestand niet gevonden: {pad}")
        sys.exit(1)

    with open(pad, encoding="utf-8") as f:
        data = json.load(f)

    sla_op(data)
