# routebaas.py
import psycopg2
from psycopg2.extras import RealDictCursor
import requests

# 1. FUNCTIE OM MET POSTGRES TE PRATEN
def get_db_connection():
    """Maakt verbinding met de PostgreSQL database in Docker"""
    try:
        conn = psycopg2.connect(
            host="localhost",      # omdat de container poort 5433 naar localhost mapt
            port="5433",
            database="postgres",     # naam van je database
            user="postgres",       # zoals in docker-compose.yml
            password="yourpassword" # zoals in docker-compose.yml
        )
        print("✅ Verbinding met PostgreSQL succesvol!")
        return conn
    except Exception as e:
        print(f"❌ Fout bij connectie DB: {e}")
        return None

# 2. FUNCTIE OM MET OLLAMA TE PRATEN
def get_embedding(text):
    """Vraag een embedding aan aan de Ollama container"""
    url = "http://localhost:11434/api/embeddings" # omdat de container poort 11434 mapt
    payload = {
        "model": "nomic-embed-text", # Zorg dat dit model gedownload is!
        "prompt": text
    }
    try:
        response = requests.post(url, json=payload)
        response.raise_for_status()
        data = response.json()
        print("✅ Embedding opgehaald van Ollama!")
        return data['embedding']
    except Exception as e:
        print(f"❌ Fout bij ophalen embedding: {e}")
        return None

# 3. TEST DE VERBINDINGEN
if __name__ == "__main__":
    # Test de database connectie
    conn = get_db_connection()
    if conn:
        conn.close()

    # Test de Ollama connectie en of het model bestaat
    test_embedding = get_embedding("test")
    if test_embedding:
        print(f"Lengte van test embedding: {len(test_embedding)}")



from pgvector.psycopg2 import register_vector
from db import get_connection

def haal_context_op(
    query_tekst: str,
    bestemming: str | None = None,
    interesses: list[str] | None = None,
    reislengte_dagen: int | None = None
) -> list[dict]:

    embedding =get_embedding(query_tekst)

    conn = get_connection()
    register_vector(conn)  # zorgt dat pgvector begrijpt wat een vector is
    cur = conn.cursor()

    cur.execute("""
        -- hier plak je de volledige query die we hebben gebouwd
        -- de :parameters worden dan dit:
    """, {
        "query_embedding": embedding,
        "bestemming": bestemming,
        "query_interesses": interesses or [],
        "reislengte_dagen": reislengte_dagen
    })

    rijen = cur.fetchall()
    kolommen = [desc[0] for desc in cur.description]

    cur.close()
    conn.close()

    # Zet rijen om naar lijst van dicts voor makkelijk gebruik
    return [dict(zip(kolommen, rij)) for rij in rijen]



def bouw_prompt(gebruikersvraag: str, context: list[dict]) -> str:

    context_tekst = "ik zoek een avontuurlijke reisroute van 2 weken door Guatemala"
    for item in context:
        context_tekst += f"""
[{item['entity_type'].upper()}] {item['entity_naam']}
{item['entity_beschrijving']}
Extra info: {item['extra_info'] or '-'}
---"""

    prompt_template = f"""Je bent een ervaren reisplanner. Gebruik alleen de onderstaande informatie 
om de vraag van de gebruiker te beantwoorden. Verzin niets zelf.

BESCHIKBARE INFORMATIE:
{context_tekst}

VRAAG VAN DE GEBRUIKER:
{gebruikersvraag}

Geef een concreet en persoonlijk reisadvies op basis van bovenstaande informatie."""
    
    return prompt_template


import ollama

def genereer_antwoord(prompt: str) -> str:
    response = ollama.chat(
        model="llama3.2",  # of welk model je gebruikt
        messages=[
            {"role": "user", "content": prompt}
        ]
    )
    return response["message"]["content"]

def reisplanner(
    gebruikersvraag: str,
    bestemming: str | None = None,
    interesses: list[str] | None = None,
    reislengte_dagen: int | None = None
) -> str:

    # 1. Haal relevante context op uit de database
    context = haal_context_op(
        query_tekst=gebruikersvraag,
        bestemming=bestemming,
        interesses=interesses,
        reislengte_dagen=reislengte_dagen
    )

    if not context:
        return "Ik heb geen relevante reizen gevonden voor jouw zoekopdracht."

    # 2. Bouw de prompt
    prompt = bouw_prompt(gebruikersvraag, context)

    # 3. Genereer het antwoord
    return genereer_antwoord(prompt)


# --- Gebruik ---
antwoord = reisplanner(
    gebruikersvraag="Wat zijn leuke activiteiten voor een avontuurlijke reis?",
    bestemming="Japan",
    interesses=["avontuur", "natuur"],
    reislengte_dagen=10
)

print(antwoord)


