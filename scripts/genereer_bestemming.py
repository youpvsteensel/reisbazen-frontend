"""
Genereer een nieuwe bestemming voor Routebaas via de Claude API.

Gebruik:
    python genereer_bestemming.py "<bestemming>" <dagen> "<interesse1,interesse2,...>"

Voorbeeld:
    python genereer_bestemming.py "Patagonië" 21 "natuur,hiken,wildkamperen"

Wat het doet:
    1. Stuurt bestemming + reizigersprofiel naar Claude
    2. Claude genereert een volledige reisroute als gestructureerde JSON
    3. JSON wordt opgeslagen in de hoofddatabase via sla_nieuwe_reis_op.py
    4. Embeddings worden aangemaakt voor alle nieuwe entiteiten
"""

import sys
import os
import json
import time
import psycopg2
import numpy as np
import requests
import anthropic
from pgvector.psycopg2 import register_vector

sys.stdout.reconfigure(encoding="utf-8")

# ── Database connecties ──────────────────────────────────────────────────────

def get_main_conn():
    return psycopg2.connect(
        host="localhost", port=5432, database="postgres",
        user="postgres", password="yvs20091994"
    )

def get_vec_conn():
    return psycopg2.connect(
        host="localhost", port=5433, database="postgres",
        user="postgres", password="yourpassword"
    )

# ── Embeddings ───────────────────────────────────────────────────────────────

def get_embedding(tekst: str):
    try:
        r = requests.post(
            "http://localhost:11434/api/embeddings",
            json={"model": "nomic-embed-text", "prompt": tekst},
            timeout=30
        )
        r.raise_for_status()
        return np.array(r.json()["embedding"])
    except Exception as e:
        print(f"  ⚠ Embedding mislukt voor '{tekst[:40]}': {e}")
        return None

def sla_embedding_op(vec_cur, entity_type: str, entity_id: int, tekst: str):
    embedding = get_embedding(tekst)
    if embedding is None:
        return False
    vec_cur.execute("""
        INSERT INTO embeddings (entity_type, entity_id, embedding_vector, content_text, needs_embedding)
        VALUES (%s, %s, %s, %s, FALSE)
        ON CONFLICT (entity_type, entity_id) DO UPDATE
          SET embedding_vector = EXCLUDED.embedding_vector,
              content_text     = EXCLUDED.content_text,
              needs_embedding  = FALSE
    """, (entity_type, entity_id, embedding, tekst[:2000]))
    time.sleep(0.05)  # Ollama niet overbelasten
    return True

# ── Reizigersprofiel ─────────────────────────────────────────────────────────

REIZIGERSPROFIEL = """
Reisstijl: Avontuurlijke natuurreiziger, 3-5 weken, 4x4/camper, wildkamperen,
uitdagende hikes, bergen en vulkanen, authenticiteit, off-the-beaten-path.
Vervoer: 4x4/jeep met daktent, camper, huurauto.
Accommodatie: wildkamperen, authentieke lodges en katuns, boutique hotels.
Top interesses: natuur & wildernis, off-road avontuur, hiken & bergwandelen,
wildkamperen, wildlife, vulkanische landschappen, roadtrips, lokale gastronomie.
Vermijden: massatoerisme, commerciële attracties, cruise-hubs.
Beste ervaringen: wildkamperen bij bergmeren Montenegro, nachtelijke hike Pico,
orka's spotten kayak Canada, off-road Lada Niva Durmitor.
"""

# ── Claude: genereer reisdata ────────────────────────────────────────────────

def genereer_reisdata(bestemming: str, dagen: int, interesses: list[str]) -> dict:
    client = anthropic.Anthropic()

    prompt = f"""Je bent een reisdata-generator voor een persoonlijk reisplanningssysteem.

Genereer een gedetailleerde reisroute voor de volgende parameters:
- Bestemming: {bestemming}
- Reisduur: {dagen} dagen
- Interesses: {', '.join(interesses)}

Reizigersprofiel:
{REIZIGERSPROFIEL}

Genereer een reisroute die past bij dit profiel. Wees specifiek: gebruik echte
plaatsnamen, trails, campsites, lodges en activiteiten. Geen vage algemeenheden.

Geef de output als UITSLUITEND geldige JSON (geen tekst erbuiten), in dit exacte formaat:
{{
  "bestemming": "<naam van de bestemming>",
  "land": "<land of landen>",
  "naam": "<beschrijvende naam van de route>",
  "beschrijving": "<2-3 zinnen over de route>",
  "routestappen": [
    {{
      "naam": "<naam van de dagstap>",
      "plek": "<hoofdplek van de dag>",
      "dag_nr": <dagnummer als integer>,
      "accomodatie": "<naam van accommodatie of wildkampeerlocatie>",
      "activiteiten_ja": ["<activiteit 1>", "<activiteit 2>"],
      "activiteiten_misschien": ["<optionele activiteit>"]
    }}
  ]
}}

Regels:
- Elke dag krijgt een eigen routestap (dag_nr 1 t/m {dagen})
- activiteiten_ja: 2-4 concrete activiteiten die zeker gedaan worden
- activiteiten_misschien: 0-2 optionele activiteiten
- Gebruik echte namen van trails, bergpassen, kampeerplekken, restaurants
- Pas het profiel toe: wildkamperen boven hotels, avontuur boven comfort
"""

    print(f"Claude genereert reisdata voor {bestemming} ({dagen} dagen)...")

    message = client.messages.create(
        model="claude-opus-4-5",
        max_tokens=4096,
        messages=[{"role": "user", "content": prompt}]
    )

    raw = message.content[0].text.strip()

    # Verwijder eventuele markdown-codeblokken
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
        raw = raw.strip()

    data = json.loads(raw)
    print(f"  ✓ {len(data['routestappen'])} routestappen gegenereerd")
    return data

# ── Opslaan + embedden ───────────────────────────────────────────────────────

def sla_op_en_embed(data: dict) -> int:
    """Sla reisdata op in hoofddatabase en maak embeddings aan."""
    from sla_nieuwe_reis_op import sla_op

    # 1. Sla op in hoofddatabase
    print("\nOpslaan in database...")
    reisroute_id = sla_op(data)

    # 2. Haal nieuwe entiteiten op en embed ze
    print("\nAanmaken embeddings...")
    main_conn = get_main_conn()
    vec_conn = get_vec_conn()
    register_vector(vec_conn)
    main_cur = main_conn.cursor()
    vec_cur = vec_conn.cursor()

    # Bestemming
    main_cur.execute("SELECT id, naam FROM bestemmingen WHERE naam = %s", (data["bestemming"],))
    row = main_cur.fetchone()
    if row:
        sla_embedding_op(vec_cur, "bestemmingen", row[0], f"{row[1]}: bestemming in {data['land']}")

    # Reisroute
    main_cur.execute("SELECT id, naam, beschrijving FROM reisroutes WHERE id = %s", (reisroute_id,))
    row = main_cur.fetchone()
    if row:
        tekst = f"{row[1]}\n{row[2] or ''}"
        sla_embedding_op(vec_cur, "reisroutes", row[0], tekst)

    # Routestappen
    main_cur.execute(
        "SELECT id, naam, beschrijving FROM routestappen WHERE reisroutes_id = %s",
        (reisroute_id,)
    )
    for row in main_cur.fetchall():
        tekst = f"{row[1]}\n{row[2] or ''}"
        sla_embedding_op(vec_cur, "routestappen", row[0], tekst)

    # Activiteiten (via routestap koppeling)
    main_cur.execute("""
        SELECT DISTINCT a.id, a.naam, a.beschrijving
        FROM activiteiten a
        JOIN routestap_activiteiten ra ON ra.activiteiten_id = a.id
        JOIN routestappen rs ON rs.id = ra.routestappen_id
        WHERE rs.reisroutes_id = %s
    """, (reisroute_id,))
    for row in main_cur.fetchall():
        tekst = f"{row[1]}\n{row[2] or ''}"
        sla_embedding_op(vec_cur, "activiteiten", row[0], tekst)

    # Plekken
    main_cur.execute("""
        SELECT DISTINCT p.id, p.naam
        FROM plekken p
        JOIN routestap_plekken rp ON rp.plekken_id = p.id
        JOIN routestappen rs ON rs.id = rp.routestappen_id
        WHERE rs.reisroutes_id = %s
    """, (reisroute_id,))
    for row in main_cur.fetchall():
        sla_embedding_op(vec_cur, "plekken", row[0], row[1])

    vec_conn.commit()
    main_conn.commit()
    main_cur.close()
    vec_cur.close()
    main_conn.close()
    vec_conn.close()

    print(f"\n✓ Klaar. Reisroute '{data['naam']}' opgeslagen en geïndexeerd (id={reisroute_id})")
    return reisroute_id


# ── Main ─────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("Gebruik: python genereer_bestemming.py \"<bestemming>\" <dagen> \"<interesses>\"")
        print("Voorbeeld: python genereer_bestemming.py \"Patagonië\" 21 \"natuur,hiken,wildkamperen\"")
        sys.exit(1)

    bestemming = sys.argv[1]
    dagen = int(sys.argv[2])
    interesses = [i.strip() for i in sys.argv[3].split(",")]

    print(f"\nRoutebaas — Nieuwe bestemming genereren")
    print(f"Bestemming : {bestemming}")
    print(f"Dagen      : {dagen}")
    print(f"Interesses : {', '.join(interesses)}\n")

    data = genereer_reisdata(bestemming, dagen, interesses)

    # ── Preview ──────────────────────────────────────────────────────────────
    print(f"\n{'─'*60}")
    print(f"Route      : {data['naam']}")
    print(f"Land       : {data['land']}")
    print(f"Beschrijving: {data['beschrijving']}")
    print(f"\nRoutestappen ({len(data['routestappen'])}):")
    for stap in data['routestappen']:
        activiteiten = ', '.join(stap.get('activiteiten_ja', [])[:2])
        print(f"  Dag {stap['dag_nr']:>2}  {stap['plek']:<20}  {activiteiten}")
    print(f"{'─'*60}\n")

    # ── Bevestiging ───────────────────────────────────────────────────────────
    antwoord = input("Opslaan in database? (ja/nee): ").strip().lower()
    if antwoord not in ("ja", "j", "yes", "y"):
        print("Geannuleerd. Niets opgeslagen.")
        sys.exit(0)

    sla_op_en_embed(data)
