import sys, json
import psycopg2

sys.stdout.reconfigure(encoding="utf-8")

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


def sla_op(data: dict, bron: str = "handmatig") -> int:
    conn = get_conn()
    cur = conn.cursor()

    # Bestemming
    bestemming_id = haal_of_maak(
        cur, "bestemmingen", "naam", data["bestemming"],
        "INSERT INTO bestemmingen (naam, land) VALUES (%s, %s) RETURNING id",
        (data["bestemming"], data["land"])
    )
    print(f"Bestemming: {data['bestemming']} (id={bestemming_id})")

    # Reisroute
    reisroute_id = haal_of_maak(
        cur, "reisroutes", "naam", data["naam"],
        "INSERT INTO reisroutes (naam, status_id, beschrijving, bron) VALUES (%s, %s, %s, %s) RETURNING id",
        (data["naam"], STATUS_GEPLAND, data.get("beschrijving", ""), bron)
    )
    print(f"Reisroute: {data['naam']} (id={reisroute_id})")

    for stap in data["routestappen"]:
        plek_naam = stap.get("plek", stap["naam"])

        # Plek
        plek_id = haal_of_maak(
            cur, "plekken", "naam", plek_naam,
            "INSERT INTO plekken (naam, bestemmingen_id) VALUES (%s, %s) RETURNING id",
            (plek_naam, bestemming_id)
        )

        # Accommodatie
        accom_id = None
        if stap.get("accomodatie"):
            accom_id = haal_of_maak(
                cur, "accomodaties", "naam", stap["accomodatie"],
                "INSERT INTO accomodaties (naam, plekken_id, status_id) VALUES (%s, %s, %s) RETURNING id",
                (stap["accomodatie"], plek_id, STATUS_GEPLAND)
            )

        # Routestap
        cur.execute(
            """INSERT INTO routestappen (naam, dag_nr, reisroutes_id, bestemmingen_id, accomodaties_id)
               VALUES (%s, %s, %s, %s, %s) RETURNING id""",
            (stap["naam"], stap["dag_nr"], reisroute_id, bestemming_id, accom_id)
        )
        stap_id = cur.fetchone()[0]

        # Plek koppelen
        cur.execute(
            "INSERT INTO routestap_plekken (routestappen_id, plekken_id, volgorde) VALUES (%s, %s, 0)"
            " ON CONFLICT DO NOTHING",
            (stap_id, plek_id)
        )

        # Activiteiten ja
        for act_naam in stap.get("activiteiten_ja", []):
            act_id = haal_of_maak(
                cur, "activiteiten", "naam", act_naam,
                "INSERT INTO activiteiten (naam, beschrijving) VALUES (%s, %s) RETURNING id",
                (act_naam, f"Activiteit in {plek_naam}")
            )
            cur.execute(
                "INSERT INTO routestap_activiteiten (routestappen_id, activiteiten_id) VALUES (%s, %s)"
                " ON CONFLICT DO NOTHING",
                (stap_id, act_id)
            )

        # Activiteiten misschien — beschrijving begint met 'Misschien' zodat queries ze herkennen
        for act_naam in stap.get("activiteiten_misschien", []):
            act_id = haal_of_maak(
                cur, "activiteiten", "naam", act_naam,
                "INSERT INTO activiteiten (naam, beschrijving) VALUES (%s, %s) RETURNING id",
                (act_naam, f"Misschien: activiteit in {plek_naam}")
            )
            cur.execute(
                "INSERT INTO routestap_activiteiten (routestappen_id, activiteiten_id) VALUES (%s, %s)"
                " ON CONFLICT DO NOTHING",
                (stap_id, act_id)
            )

        n_ja = len(stap.get("activiteiten_ja", []))
        n_mis = len(stap.get("activiteiten_misschien", []))
        print(f"  Dag {stap['dag_nr']:2d} | {stap['naam'][:45]:<45} | ja: {n_ja}  misschien: {n_mis}")

    conn.commit()
    cur.close()
    conn.close()
    print(f"\nOpgeslagen. Reisroute id={reisroute_id}")
    return reisroute_id


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Gebruik: python sla_nieuwe_reis_op.py <reis_data.json>")
        sys.exit(1)

    json_pad = sys.argv[1]
    with open(json_pad, encoding="utf-8") as f:
        data = json.load(f)

    sla_op(data)
