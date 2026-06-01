import sys
import re
import time
import requests
import numpy as np
import psycopg2
from bs4 import BeautifulSoup
from pgvector.psycopg2 import register_vector

sys.stdout.reconfigure(encoding="utf-8")

PAGINAS = [
    {"url": "https://www.reisbazen.nl/reisroute-montenegro", "titel": "Reisroute Montenegro", "bestemming": "Montenegro"},
    {"url": "https://www.reisbazen.nl/reisroute-west-canada",  "titel": "Reisroute West-Canada",  "bestemming": "Canada"},
    {"url": "https://www.reisbazen.nl/reisroute-azoren",       "titel": "Reisroute Azoren",       "bestemming": "Azoren"},
    {"url": "https://www.reisbazen.nl/reisroute-costa-rica",   "titel": "Reisroute Costa Rica",   "bestemming": "Costa Rica"},
    {"url": "https://www.reisbazen.nl/over-ons",               "titel": "Over Reisbazen",         "bestemming": None},
]

CHUNK_GROOTTE = 400  # woorden per chunk


def haal_tekst_op(url: str) -> str:
    resp = requests.get(url, timeout=20, headers={"User-Agent": "Mozilla/5.0"})
    resp.raise_for_status()
    soup = BeautifulSoup(resp.text, "html.parser")

    # Verwijder navigatie, footer, scripts en styles
    for tag in soup(["nav", "footer", "script", "style", "header", "noscript"]):
        tag.decompose()

    # Haal alle zichtbare tekst op
    tekst = soup.get_text(separator="\n")

    # Opschonen
    lijnen = [lijn.strip() for lijn in tekst.splitlines()]
    lijnen = [lijn for lijn in lijnen if lijn and len(lijn) > 20]
    return "\n\n".join(lijnen)


def maak_chunks(tekst: str, chunk_grootte: int = CHUNK_GROOTTE) -> list[str]:
    zinnen = re.split(r"(?<=[.!?])\s+|\n\n+", tekst)
    chunks = []
    huidige = []
    woorden = 0

    for zin in zinnen:
        zin_woorden = len(zin.split())
        if woorden + zin_woorden > chunk_grootte and huidige:
            chunks.append(" ".join(huidige))
            huidige = [zin]
            woorden = zin_woorden
        else:
            huidige.append(zin)
            woorden += zin_woorden

    if huidige:
        chunks.append(" ".join(huidige))

    return [c for c in chunks if len(c.split()) > 30]


def maak_embedding(tekst: str) -> np.ndarray | None:
    try:
        resp = requests.post(
            "http://localhost:11434/api/embeddings",
            json={"model": "nomic-embed-text", "prompt": tekst},
            timeout=30,
        )
        resp.raise_for_status()
        return np.array(resp.json()["embedding"])
    except Exception as e:
        print(f"  Embedding fout: {e}")
        return None


def verwijder_bestaande_artikelen(main_cur, vec_cur, bestemming: str | None, url: str):
    main_cur.execute(
        "SELECT id FROM artikelen WHERE url = %s", (url,)
    )
    bestaande_ids = [r[0] for r in main_cur.fetchall()]
    if bestaande_ids:
        for aid in bestaande_ids:
            vec_cur.execute(
                "DELETE FROM embeddings WHERE entity_type = 'artikel' AND entity_id = %s",
                (aid,)
            )
        main_cur.execute("DELETE FROM artikelen WHERE url = %s", (url,))
        print(f"  {len(bestaande_ids)} bestaande chunks verwijderd")


def verwerk_pagina(pagina: dict, main_conn, vec_conn):
    url = pagina["url"]
    titel = pagina["titel"]
    bestemming = pagina["bestemming"]

    print(f"\n--- {titel} ---")
    print(f"  Ophalen: {url}")

    tekst = haal_tekst_op(url)
    chunks = maak_chunks(tekst)
    print(f"  {len(chunks)} chunks gemaakt")

    main_cur = main_conn.cursor()
    vec_cur = vec_conn.cursor()

    verwijder_bestaande_artikelen(main_cur, vec_cur, bestemming, url)

    for i, chunk in enumerate(chunks):
        # Sla chunk op in main DB
        main_cur.execute(
            """INSERT INTO artikelen (url, titel, bestemming, chunk_index, chunk_tekst)
               VALUES (%s, %s, %s, %s, %s) RETURNING id""",
            (url, titel, bestemming, i, chunk),
        )
        artikel_id = main_cur.fetchone()[0]

        # Maak embedding
        embedding = maak_embedding(f"{titel}\n\n{chunk}")
        if embedding is None:
            continue

        # Sla op in vector DB
        vec_cur.execute(
            """INSERT INTO embeddings (entity_type, entity_id, embedding_vector, content_text, needs_embedding)
               VALUES ('artikel', %s, %s, %s, FALSE)""",
            (artikel_id, embedding, chunk),
        )

        print(f"  chunk {i+1}/{len(chunks)} geïndexeerd ({len(chunk.split())} woorden)")
        time.sleep(0.1)  # Ollama niet overbelasten

    main_conn.commit()
    vec_conn.commit()
    main_cur.close()
    vec_cur.close()


def run():
    main_conn = psycopg2.connect(
        host="localhost", port=5432, database="postgres",
        user="postgres", password="yvs20091994"
    )
    vec_conn = psycopg2.connect(
        host="localhost", port=5433, database="postgres",
        user="postgres", password="yourpassword"
    )
    register_vector(vec_conn)

    print("Reisbazen.nl website indexeren...")
    totaal_chunks = 0

    for pagina in PAGINAS:
        verwerk_pagina(pagina, main_conn, vec_conn)

    main_cur = main_conn.cursor()
    main_cur.execute("SELECT COUNT(*) FROM artikelen")
    totaal_chunks = main_cur.fetchone()[0]
    main_cur.close()

    main_conn.close()
    vec_conn.close()

    print(f"\nKlaar. {totaal_chunks} chunks geïndexeerd in vector DB.")


if __name__ == "__main__":
    run()
