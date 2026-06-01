import sys
import psycopg2
from psycopg2.extras import RealDictCursor
import requests
import numpy as np
import anthropic
from pgvector.psycopg2 import register_vector

sys.stdout.reconfigure(encoding="utf-8")

client = anthropic.Anthropic()

def get_vector_db_connection():
    return psycopg2.connect(
        host="localhost",
        port=5433,
        database="postgres",
        user="postgres",
        password="yourpassword"
    )

def get_main_db_connection():
    return psycopg2.connect(
        host="localhost",
        port=5432,
        database="postgres",
        user="postgres",
        password="yvs20091994"
    )

def get_embedding(text):
    url = "http://localhost:11434/api/embeddings"
    payload = {
        "model": "nomic-embed-text",
        "prompt": text
    }
    try:
        response = requests.post(url, json=payload)
        response.raise_for_status()
        return np.array(response.json()['embedding'])
    except Exception as e:
        print(f"Fout bij ophalen embedding: {e}")
        return None

ENTITY_NAME_QUERY = {
    "activiteiten": "SELECT naam, beschrijving FROM activiteiten WHERE id = %s",
    "ervaringen":   "SELECT naam, reviewtekst AS beschrijving FROM ervaringen WHERE id = %s",
    "plekken":      "SELECT naam, NULL AS beschrijving FROM plekken WHERE id = %s",
    "accomodaties": "SELECT naam, NULL AS beschrijving FROM accomodaties WHERE id = %s",
    "food_drinks":  "SELECT naam, NULL AS beschrijving FROM food_drinks WHERE id = %s",
    "reisroutes":   "SELECT naam, beschrijving FROM reisroutes WHERE id = %s",
    "routestappen": "SELECT naam, beschrijving FROM routestappen WHERE id = %s",
    "artikel":      "SELECT titel, chunk_tekst AS beschrijving FROM artikelen WHERE id = %s",
}

def haal_context_op(
    query_tekst: str,
    bestemming: str | None = None,
    interesses: list[str] | None = None,
    reislengte_dagen: int | None = None,
    top_k: int = 10
) -> list[dict]:

    embedding = get_embedding(query_tekst)
    if embedding is None:
        return []

    # 1. Vector similarity search
    vec_conn = get_vector_db_connection()
    register_vector(vec_conn)
    cur = vec_conn.cursor()

    # IVFFlat index doesn't work well with few rows — force sequential scan
    cur.execute("SET enable_indexscan = OFF")
    cur.execute("""
        SELECT entity_type, entity_id, content_text,
               1 - (embedding_vector <=> %s) AS similarity
        FROM embeddings
        WHERE deleted_at IS NULL
          AND embedding_vector IS NOT NULL
        ORDER BY embedding_vector <=> %s
        LIMIT %s
    """, (embedding, embedding, top_k))

    hits = cur.fetchall()
    cur.close()
    vec_conn.close()

    if not hits:
        return []

    # 2. Enrich with naam/beschrijving from main DB
    main_conn = get_main_db_connection()
    main_cur = main_conn.cursor()
    results = []

    for entity_type, entity_id, content_text, similarity in hits:
        naam = entity_type
        beschrijving = content_text

        sql = ENTITY_NAME_QUERY.get(entity_type)
        if sql:
            main_cur.execute(sql, (entity_id,))
            row = main_cur.fetchone()
            if row:
                naam = row[0]
                beschrijving = row[1] or content_text

        results.append({
            "entity_type": entity_type,
            "entity_naam": naam,
            "entity_beschrijving": beschrijving,
            "similarity": round(float(similarity), 3),
            "extra_info": None,
        })

    main_cur.close()
    main_conn.close()
    return results

def bouw_prompt(gebruikersvraag: str, context: list[dict]) -> str:

    context_tekst = ""
    for item in context:
        context_tekst += f"""
[{item['entity_type'].upper()}] {item['entity_naam']}
{item['entity_beschrijving']}
Extra info: {item['extra_info'] or '-'}
---"""

    return context_tekst, gebruikersvraag

def genereer_antwoord(context_tekst: str, gebruikersvraag: str) -> str:
    system_prompt = """Je bent een ervaren reisplanner. Gebruik alleen de onderstaande informatie \
om de vraag van de gebruiker te beantwoorden. Verzin niets zelf.

BESCHIKBARE INFORMATIE:
""" + context_tekst

    result = []
    with client.messages.stream(
        model="claude-opus-4-7",
        max_tokens=2048,
        thinking={"type": "adaptive"},
        system=[
            {
                "type": "text",
                "text": system_prompt,
                "cache_control": {"type": "ephemeral"}
            }
        ],
        messages=[
            {"role": "user", "content": f"Geef een concreet en persoonlijk reisadvies op basis van bovenstaande informatie.\n\nVRAAG VAN DE GEBRUIKER:\n{gebruikersvraag}"}
        ]
    ) as stream:
        for text in stream.text_stream:
            print(text, end="", flush=True)
            result.append(text)

    print()
    return "".join(result)

def reisplanner(
    gebruikersvraag: str,
    bestemming: str | None = None,
    interesses: list[str] | None = None,
    reislengte_dagen: int | None = None
) -> str:

    context = haal_context_op(
        query_tekst=gebruikersvraag,
        bestemming=bestemming,
        interesses=interesses,
        reislengte_dagen=reislengte_dagen
    )

    if not context:
        return "Ik heb geen relevante reizen gevonden voor jouw zoekopdracht."

    context_tekst, vraag = bouw_prompt(gebruikersvraag, context)

    return genereer_antwoord(context_tekst, vraag)


def plan_nieuwe_bestemming(
    bestemming: str,
    reislengte_dagen: int,
    interesses: list[str],
    extra_wensen: str | None = None,
) -> str:
    import json
    import importlib.util, os

    # Laad reizigersprofiel
    profiel_path = os.path.join(os.path.dirname(__file__), "reizigersprofiel.py")
    spec = importlib.util.spec_from_file_location("rp", profiel_path)
    rp = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(rp)
    profiel = rp.laad_profiel()

    if not profiel:
        print("Geen reizigersprofiel gevonden. Genereer eerst een profiel via scripts/reizigersprofiel.py")
        profiel = {}

    # RAG: haal analoge ervaringen op die overeenkomen met de reisstijl
    query = f"{bestemming} {' '.join(interesses)} avontuur natuur"
    analoge_context = haal_context_op(query_tekst=query, top_k=8)
    analoog_tekst = ""
    for item in analoge_context:
        analoog_tekst += f"\n[{item['entity_type'].upper()} uit eerdere reis] {item['entity_naam']}\n{item['entity_beschrijving']}\n---"

    profiel_tekst = profiel.get("profiel_samenvatting", "")
    if profiel:
        profiel_tekst += f"""

Reisstijl: {profiel.get('reisstijl', '')}
Vervoer: {', '.join(profiel.get('vervoer', []))}
Accommodatie voorkeur: {', '.join(profiel.get('accommodatie_voorkeur', []))}
Top interesses: {', '.join(profiel.get('top_interesses', [])[:8])}
Vermijden: {', '.join(profiel.get('vermijden', []))}
Beste ervaringen ooit: {'; '.join(profiel.get('beste_ervaringen', [])[:3])}
Geleerde lessen: {'; '.join(profiel.get('geleerde_lessen', [])[:3])}"""

    system_prompt = f"""Je bent Routebaas, een persoonlijke reisplanner die een reiziger door en door kent.

REIZIGERSPROFIEL:
{profiel_tekst}

ANALOGE ERVARINGEN UIT EERDERE REIZEN (gebruik dit als inspiratie voor vergelijkbare dingen op de nieuwe bestemming):
{analoog_tekst if analoog_tekst else "Geen directe analogieën gevonden."}

Gebruik het reizigersprofiel én je eigen kennis van de bestemming om een gepersonaliseerde reisroute te maken.
Verzin geen activiteiten die niet bestaan. Geef concrete namen van plekken, trails, accommodaties.
Verwijs expliciet naar overeenkomsten met eerdere reizen waar relevant ("net als bij X in Montenegro/Canada/etc.")."""

    vraag = (
        f"Maak een {reislengte_dagen}-daagse reisroute voor {bestemming}. "
        f"Interesses: {', '.join(interesses)}."
        + (f" Extra wensen: {extra_wensen}" if extra_wensen else "")
        + " Geef een dag-voor-dag indeling met concrete activiteiten, logistiek en accommodatietips passend bij mijn reisstijl."
    )

    result = []
    with client.messages.stream(
        model="claude-opus-4-7",
        max_tokens=4096,
        thinking={"type": "adaptive"},
        system=[{"type": "text", "text": system_prompt, "cache_control": {"type": "ephemeral"}}],
        messages=[{"role": "user", "content": vraag}]
    ) as stream:
        for text in stream.text_stream:
            print(text, end="", flush=True)
            result.append(text)

    print()
    return "".join(result)


if __name__ == "__main__":
    plan_nieuwe_bestemming(
        bestemming="Patagonië",
        reislengte_dagen=21,
        interesses=["hiken & wandelen", "natuur", "kamperen", "wildlife"],
    )
