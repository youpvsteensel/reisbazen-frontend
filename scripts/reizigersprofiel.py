import sys
import json
import psycopg2
import anthropic

sys.stdout.reconfigure(encoding="utf-8")

client = anthropic.Anthropic()


def _get_conn():
    return psycopg2.connect(
        host="localhost", port=5432, database="postgres",
        user="postgres", password="yvs20091994"
    )


def _haal_profieldata_op() -> dict:
    conn = _get_conn()
    cur = conn.cursor()

    cur.execute("""
        SELECT r.naam, r.beschrijving, MAX(rs.dag_nr) as dagen
        FROM reisroutes r
        LEFT JOIN routestappen rs ON rs.reisroutes_id = r.id
        GROUP BY r.id, r.naam, r.beschrijving
        ORDER BY r.naam
    """)
    reisroutes = [{"naam": r[0], "beschrijving": r[1], "dagen": r[2]} for r in cur.fetchall()]

    cur.execute("""
        SELECT r.naam as route, e.entity_type, e.rating, e.reviewtekst
        FROM ervaringen e
        JOIN reisroutes r ON e.reisroutes_id = r.id
        WHERE e.rating IS NOT NULL AND e.reviewtekst IS NOT NULL
        ORDER BY e.rating DESC, r.naam
    """)
    ervaringen = [{"route": r[0], "type": r[1], "rating": r[2], "review": r[3]} for r in cur.fetchall()]

    cur.execute("""
        SELECT i.naam, i.categorie, COUNT(*) as cnt
        FROM activiteit_interesses ai
        JOIN interesses i ON ai.interesse_id = i.id
        GROUP BY i.naam, i.categorie
        ORDER BY cnt DESC
        LIMIT 20
    """)
    interesses = [{"naam": r[0], "categorie": r[1], "count": r[2]} for r in cur.fetchall()]

    cur.execute("""
        SELECT DISTINCT a.naam
        FROM accomodaties a
        JOIN routestappen rs ON rs.accomodaties_id = a.id
        ORDER BY a.naam
    """)
    accommodaties = [r[0] for r in cur.fetchall()]

    cur.execute("""
        SELECT naam FROM activiteiten
        WHERE naam ILIKE '%camper%' OR naam ILIKE '%jeep%' OR naam ILIKE '%4x4%'
           OR naam ILIKE '%daktent%' OR naam ILIKE '%wildkamp%' OR naam ILIKE '%boot%'
        LIMIT 20
    """)
    vervoer_hints = [r[0] for r in cur.fetchall()]

    cur.execute("""
        SELECT titel, bestemming, chunk_tekst FROM artikelen
        ORDER BY bestemming NULLS LAST, chunk_index
    """)
    artikelen = [{"titel": r[0], "bestemming": r[1], "tekst": r[2]} for r in cur.fetchall()]

    cur.close()
    conn.close()

    return {
        "reisroutes": reisroutes,
        "ervaringen": ervaringen,
        "top_interesses": interesses,
        "accommodaties": accommodaties,
        "vervoer_hints": vervoer_hints,
        "artikelen": artikelen,
    }


def genereer_profiel(extra_input: str | None = None) -> dict:
    print("Profieldata ophalen uit database...")
    data = _haal_profieldata_op()

    vijf_sterren = [e for e in data["ervaringen"] if e["rating"] == 5][:25]
    lage_ratings = [e for e in data["ervaringen"] if e["rating"] <= 2][:15]

    # Artikelen samenvatten per bestemming (evaluatiebaas-secties zijn het meest waardevol)
    artikel_tekst = ""
    for artikel in data.get("artikelen", []):
        artikel_tekst += f"\n[{artikel['titel']}]\n{artikel['tekst'][:600]}\n"

    prompt = f"""Je analyseert de reisdata van één reiziger en maakt een gedetailleerd reizigersprofiel.

## Gemaakte reizen
{json.dumps(data['reisroutes'], ensure_ascii=False, indent=2)}

## Beste ervaringen (rating 5/5) — wat de reiziger geweldig vindt
{json.dumps(vijf_sterren, ensure_ascii=False, indent=2)}

## Teleurstellingen (rating 1-2/5) — wat de reiziger niet leuk vindt
{json.dumps(lage_ratings, ensure_ascii=False, indent=2)}

## Meest voorkomende interesses (over alle activiteiten)
{json.dumps(data['top_interesses'], ensure_ascii=False, indent=2)}

## Gebruikte accommodaties
{json.dumps(data['accommodaties'][:30], ensure_ascii=False)}

## Vervoermiddel hints
{json.dumps(data['vervoer_hints'], ensure_ascii=False)}

## Persoonlijke reisartikelen van reisbazen.nl (narratieve reflecties in eigen woorden)
{artikel_tekst[:4000]}
{"" if not extra_input else f"\n## Extra input van de reiziger zelf\n{extra_input}"}

Maak op basis hiervan een gestructureerd reizigersprofiel als JSON met deze velden:
{{
  "reisstijl": "korte omschrijving van de algemene reisstijl",
  "reisduur_voorkeur": "typische reisduur",
  "vervoer": ["lijst van vervoermiddelen"],
  "accommodatie_voorkeur": ["lijst van accommodatietypes"],
  "top_interesses": ["geordende lijst van top interesses"],
  "vermijden": ["wat de reiziger actief vermijdt"],
  "beste_ervaringen": ["3-5 concrete hoogtepunten met locatie en waarom"],
  "geleerde_lessen": ["3-5 concrete dingen die ze nooit meer zouden doen"],
  "profiel_samenvatting": "2-3 zinnen die de reiziger perfect omschrijven voor gebruik in een nieuwe bestemmingsadvies"
}}

Antwoord ALLEEN met geldige JSON, geen markdown, geen uitleg eromheen."""

    print("Claude genereert reizigersprofiel...")
    response = client.messages.create(
        model="claude-opus-4-7",
        max_tokens=2048,
        messages=[{"role": "user", "content": prompt}]
    )

    raw = response.content[0].text.strip()
    if raw.startswith("```"):
        raw = raw.split("\n", 1)[1].rsplit("```", 1)[0].strip()

    profiel = json.loads(raw)
    return profiel


def sla_profiel_op(profiel: dict) -> int:
    conn = _get_conn()
    cur = conn.cursor()

    cur.execute("SELECT id FROM reizigersprofiel ORDER BY gegenereerd_op DESC LIMIT 1")
    existing = cur.fetchone()

    if existing:
        cur.execute("""
            UPDATE reizigersprofiel
            SET profiel_json = %s, profiel_samenvatting = %s, bijgewerkt_op = NOW()
            WHERE id = %s
            RETURNING id
        """, (json.dumps(profiel, ensure_ascii=False), profiel["profiel_samenvatting"], existing[0]))
        profiel_id = cur.fetchone()[0]
        print(f"Profiel bijgewerkt (id={profiel_id})")
    else:
        cur.execute("""
            INSERT INTO reizigersprofiel (profiel_json, profiel_samenvatting)
            VALUES (%s, %s)
            RETURNING id
        """, (json.dumps(profiel, ensure_ascii=False), profiel["profiel_samenvatting"]))
        profiel_id = cur.fetchone()[0]
        print(f"Nieuw profiel opgeslagen (id={profiel_id})")

    conn.commit()
    cur.close()
    conn.close()
    return profiel_id


def laad_profiel() -> dict | None:
    conn = _get_conn()
    cur = conn.cursor()
    cur.execute("SELECT profiel_json FROM reizigersprofiel ORDER BY gegenereerd_op DESC LIMIT 1")
    row = cur.fetchone()
    cur.close()
    conn.close()
    return row[0] if row else None


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--extra", type=str, default=None, help="Extra input van de reiziger zelf")
    parser.add_argument("--toon", action="store_true", help="Toon huidig profiel zonder opnieuw te genereren")
    args = parser.parse_args()

    if args.toon:
        profiel = laad_profiel()
        if profiel:
            print(json.dumps(profiel, ensure_ascii=False, indent=2))
        else:
            print("Geen profiel gevonden. Voer eerst uit zonder --toon.")
    else:
        profiel = genereer_profiel(extra_input=args.extra)
        sla_profiel_op(profiel)
        print("\n=== REIZIGERSPROFIEL ===")
        print(json.dumps(profiel, ensure_ascii=False, indent=2))
