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


def _laad_huidig_profiel() -> dict:
    pad = Path(__file__).parent.parent / "api" / "profiel.json"
    if pad.exists():
        with open(pad, encoding="utf-8") as f:
            return json.load(f)
    return {}


def genereer_profiel(extra_input: str | None = None) -> dict:
    print("Profieldata ophalen uit database...")
    data = _haal_profieldata_op()
    huidig = _laad_huidig_profiel()

    vijf_sterren = [e for e in data["ervaringen"] if e["rating"] == 5][:25]
    lage_ratings = [e for e in data["ervaringen"] if e["rating"] <= 2][:15]

    artikel_tekst = ""
    for artikel in data.get("artikelen", []):
        artikel_tekst += f"\n[{artikel['titel']}]\n{artikel['tekst'][:600]}\n"

    huidig_tekst = json.dumps(huidig, ensure_ascii=False, indent=2) if huidig else "Geen bestaand profiel."

    prompt = f"""Je analyseert de reisdata van één reiziger en maakt een gedetailleerd reizigersprofiel.

Er is al een handmatig bijgewerkt profiel. Gebruik dit als basis — behoud en verfijn het waar de nieuwe reisdata dat ondersteunt. Voeg alleen toe of pas aan als de data daar duidelijke aanleiding voor geeft.

## Huidig profiel (handmatig bijgewerkt — gebruik als basis)
{huidig_tekst}

## Gemaakte reizen (uit database)
{json.dumps(data['reisroutes'], ensure_ascii=False, indent=2)}

## Beste ervaringen (rating 5/5)
{json.dumps(vijf_sterren, ensure_ascii=False, indent=2)}

## Teleurstellingen (rating 1-2/5)
{json.dumps(lage_ratings, ensure_ascii=False, indent=2)}

## Meest voorkomende interesses
{json.dumps(data['top_interesses'], ensure_ascii=False, indent=2)}

## Gebruikte accommodaties
{json.dumps(data['accommodaties'][:30], ensure_ascii=False)}

## Vervoermiddel hints
{json.dumps(data['vervoer_hints'], ensure_ascii=False)}

## Persoonlijke reisartikelen
{artikel_tekst[:4000]}
{"" if not extra_input else f"\n## Extra input van de reiziger zelf\n{extra_input}"}

Geef het bijgewerkte profiel terug als JSON met ALLE onderstaande velden. Behoud velden uit het huidige profiel tenzij de nieuwe data daar duidelijk aanleiding toe geeft:
{{
  "reisstijl": "omschrijving van de algemene reisstijl inclusief tempo en tegenwichten",
  "reisduur_voorkeur": "typische reisduur en voorkeur voor één vs. meerdere bestemmingen",
  "vervoer": ["lijst van vervoermiddelen"],
  "accommodatie_voorkeur": ["lijst van accommodatietypes op volgorde van voorkeur"],
  "accommodatie_principe": "karakter en locatie gaan boven prijsklasse — uitleg",
  "top_interesses": {{
    "kern": ["max 5 kern-interesses op volgorde"],
    "secundair": ["overige interesses"],
    "toelichting": "uitleg over weging per bestemmingstype"
  }},
  "vermijden": ["wat de reiziger actief vermijdt, met concrete voorbeelden"],
  "beste_ervaringen": ["3-5 concrete hoogtepunten met locatie en waarom"],
  "geleerde_lessen": ["concrete dingen die anders zouden worden gedaan"],
  "otb_filosofie": "uitleg over de off-the-beaten-track filosofie en balans",
  "gastronomie": "rol van eten/drinken per bestemmingstype",
  "ontspanning": "betekenis van wellness/ontspanning in de reisbalans",
  "steden": "hoe om te gaan met stedelijke bestemmingen",
  "drukte_en_timing": "aanpak bij drukke periodes en toeristische pieken",
  "klimaat_seizoen": "voorkeur voor seizoen en klimaat",
  "fysieke_grens": "fysiek niveau, hike-voorkeur en hersteldagen",
  "reisgezelschap": "samenstelling en implicaties voor planning",
  "budget": "benadering van budget en prijs-kwaliteitverhouding",
  "fotografie": "rol van fotografie en lichtvoorkeur",
  "planning_stijl": "hoe ver vooruit gepland wordt en wat vast vs. flexibel is",
  "duurzaamheid": "houding ten opzichte van CO2 en verre reizen",
  "profiel_samenvatting": "2-3 zinnen die de reiziger perfect omschrijven"
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
