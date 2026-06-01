import sys
import csv
import psycopg2

sys.stdout.reconfigure(encoding="utf-8")

CSV_PAD = r"C:\Users\youpv\Downloads\Reisroutes Template - AUS + NZ.csv"

STATUS_GEPLAND = 3


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


def importeer(csv_pad: str):
    conn = get_conn()
    cur = conn.cursor()

    with open(csv_pad, encoding="utf-8-sig") as f:
        rijen = list(csv.DictReader(f))

    print(f"{len(rijen)} rijen geladen uit CSV\n")

    # 1. Reisroute aanmaken
    reisroute_id = haal_of_maak(
        cur, "reisroutes", "naam", "Reisroute Oceanië",
        "INSERT INTO reisroutes (naam, status_id, beschrijving) VALUES (%s, %s, %s) RETURNING id",
        ("Reisroute Oceanië", STATUS_GEPLAND,
         "Geplande rondreis door Australië (Melbourne, Tasmanië, West-Australië) en Nieuw-Zeeland "
         "(Queenstown, Fjordland, West Coast, Nelson, Marlborough, Mt. Cook). Duur: 63 dagen.")
    )
    print(f"Reisroute id={reisroute_id}")

    # 2. Bestemmingen
    bestemming_ids = {}
    for naam, land in [("Australië", "Australië"), ("Nieuw-Zeeland", "Nieuw-Zeeland")]:
        bid = haal_of_maak(
            cur, "bestemmingen", "naam", naam,
            "INSERT INTO bestemmingen (naam, land) VALUES (%s, %s) RETURNING id",
            (naam, land)
        )
        bestemming_ids[naam] = bid
        print(f"Bestemming '{naam}' id={bid}")

    # 3. Per rij: plek, accommodatie, routestap aanmaken
    for rij in rijen:
        dag = int(rij["Dag"])
        bestemming_naam = rij["Bestemming"].strip()
        routestap_naam = rij["Routestap"].strip()
        plek_raw = rij["Plek"].strip()
        accom_raw = rij["Accomodatie"].strip()
        activiteiten_raw = rij["Activiteiten"].strip()
        vervoer = rij["Vervoersmiddel"].strip()
        bestemming_id = bestemming_ids.get(bestemming_naam)

        # Plekken (kommagescheiden → meerdere plekken per dag mogelijk)
        plek_namen = [p.strip() for p in plek_raw.split(",") if p.strip()]
        plek_ids = []
        for plek_naam in plek_namen:
            pid = haal_of_maak(
                cur, "plekken", "naam", plek_naam,
                "INSERT INTO plekken (naam, bestemmingen_id) VALUES (%s, %s) RETURNING id",
                (plek_naam, bestemming_id)
            )
            plek_ids.append(pid)

        # Accommodatie (neem eerste als er meerdere zijn)
        accom_id = None
        if accom_raw:
            accom_naam = accom_raw.split(",")[0].strip()
            accom_hoofd_plek = plek_ids[0] if plek_ids else None
            accom_id = haal_of_maak(
                cur, "accomodaties", "naam", accom_naam,
                "INSERT INTO accomodaties (naam, plekken_id, status_id) VALUES (%s, %s, %s) RETURNING id",
                (accom_naam, accom_hoofd_plek, STATUS_GEPLAND)
            )

        # Routestap
        beschrijving = f"Vervoer: {vervoer}" if vervoer else None
        if activiteiten_raw:
            beschrijving = (beschrijving or "") + f"\nActiviteiten: {activiteiten_raw}"

        cur.execute(
            """INSERT INTO routestappen (naam, dag_nr, reisroutes_id, bestemmingen_id, accomodaties_id, beschrijving)
               VALUES (%s, %s, %s, %s, %s, %s) RETURNING id""",
            (routestap_naam, dag, reisroute_id, bestemming_id, accom_id, beschrijving)
        )
        stap_id = cur.fetchone()[0]

        # Koppel plekken aan routestap
        for volgorde, pid in enumerate(plek_ids):
            cur.execute(
                "INSERT INTO routestap_plekken (routestappen_id, plekken_id, volgorde) VALUES (%s, %s, %s)"
                " ON CONFLICT DO NOTHING",
                (stap_id, pid, volgorde)
            )

        print(f"  Dag {dag:2d} | {routestap_naam[:40]:<40} | {bestemming_naam}")

    conn.commit()
    cur.close()
    conn.close()
    print("\nImport klaar.")


if __name__ == "__main__":
    importeer(CSV_PAD)
