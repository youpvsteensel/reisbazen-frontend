import sys, csv, json, psycopg2
import anthropic

sys.stdout.reconfigure(encoding="utf-8")

conn = psycopg2.connect(host="localhost", port=5432, database="postgres",
                        user="postgres", password="yvs20091994")
cur = conn.cursor()

cur.execute("""
    SELECT
        rs.id, rs.dag_nr, rs.naam,
        r.naam as reisroute,
        b.naam as bestemming,
        a_acc.naam as accomodatie,
        rs.beschrijving as bestaande_desc,
        STRING_AGG(
            act.naam || CASE WHEN act.beschrijving ILIKE 'Misschien%' THEN ' (?)' ELSE '' END,
            ', ' ORDER BY act.naam
        ) as activiteiten
    FROM routestappen rs
    JOIN reisroutes r ON r.id = rs.reisroutes_id
    JOIN bestemmingen b ON b.id = rs.bestemmingen_id
    LEFT JOIN accomodaties a_acc ON a_acc.id = rs.accomodaties_id
    LEFT JOIN routestap_activiteiten rsa ON rsa.routestappen_id = rs.id
    LEFT JOIN activiteiten act ON act.id = rsa.activiteiten_id
    WHERE rs.reisroutes_id = 6
    GROUP BY rs.id, rs.dag_nr, rs.naam, r.naam, b.naam, a_acc.naam, rs.beschrijving
    ORDER BY rs.dag_nr
""")
stappen = cur.fetchall()
print(f"{len(stappen)} routestappen opgehaald")

client = anthropic.Anthropic()


def genereer_batch(batch):
    dag_tekst = ""
    for row in batch:
        stap_id, dag, stap, route, bestemming, accom, _, activiteiten = row
        dag_tekst += f"Dag {dag} - {stap} ({bestemming})\n"
        if activiteiten:
            dag_tekst += f"Activiteiten: {activiteiten}\n"
        if accom:
            dag_tekst += f"Overnachting: {accom}\n"
        dag_tekst += "\n"

    prompt = (
        "Schrijf voor elke dag hieronder een korte beschrijving van 1-2 zinnen in het Nederlands. "
        "Gebruik de activiteiten en locatie als basis. Geen opsommingen, gewoon lopende tekst. "
        'Geef terug als JSON met dag nummer als key: {"1": "beschrijving", "2": "beschrijving", ...}\n\n'
        + dag_tekst
        + "\nAntwoord ALLEEN met geldige JSON."
    )

    response = client.messages.create(
        model="claude-opus-4-7",
        max_tokens=2000,
        messages=[{"role": "user", "content": prompt}]
    )
    raw = response.content[0].text.strip()
    if raw.startswith("```"):
        raw = raw.split("\n", 1)[1].rsplit("```", 1)[0].strip()
    return json.loads(raw)


beschrijvingen = {}
for i in range(0, len(stappen), 10):
    batch = stappen[i:i+10]
    print(f"Genereer beschrijvingen dag {batch[0][1]}-{batch[-1][1]}...")
    result = genereer_batch(batch)
    for dag_str, desc in result.items():
        beschrijvingen[int(dag_str)] = desc

# Update DB + bouw CSV
csv_rijen = []
for row in stappen:
    stap_id, dag, stap, route, bestemming, accom, bestaande_desc, activiteiten = row
    desc = beschrijvingen.get(dag, "")

    # Vervoer uit bestaande beschrijving
    vervoer_val = ""
    if bestaande_desc and "Vervoer:" in bestaande_desc:
        vervoer_val = bestaande_desc.split("Vervoer:")[1].split("\n")[0].strip()

    # Alleen ja-activiteiten (geen misschien)
    act_ja = ""
    if activiteiten:
        items = [a.replace(" (?)", "").strip() for a in activiteiten.split(", ") if "(?)" not in a]
        act_ja = ", ".join(items)

    cur.execute("UPDATE routestappen SET beschrijving = %s WHERE id = %s", (desc, stap_id))

    csv_rijen.append({
        "Routestap": stap,
        "Dag": dag,
        "Reisroute": route,
        "Bestemming": bestemming,
        "Plek": stap,
        "Accomodatie": accom or "",
        "Food & Drinks": "",
        "Activiteiten": act_ja,
        "Vervoersmiddel": vervoer_val,
        "Beschrijving": desc,
    })

conn.commit()

pad = r"C:\Users\youpv\Downloads\Reisroute_Oceanie_compleet.csv"
velden = ["Routestap", "Dag", "Reisroute", "Bestemming", "Plek",
          "Accomodatie", "Food & Drinks", "Activiteiten", "Vervoersmiddel", "Beschrijving"]

with open(pad, "w", newline="", encoding="utf-8-sig") as f:
    writer = csv.DictWriter(f, fieldnames=velden)
    writer.writeheader()
    writer.writerows(csv_rijen)

print(f"\nCSV opgeslagen: {pad}")
cur.close()
conn.close()
