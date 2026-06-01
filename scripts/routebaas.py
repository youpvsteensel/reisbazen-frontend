# routebaas.py
import psycopg2
from psycopg2.extras import RealDictCursor
import requests

# 1. FUNCTIE OM MET POSTGRES TE PRATEN
def get_db_connection():
    """Maakt verbinding met de PostgreSQL database in Docker"""
    try:
        conn = psycopg2.connect(
            host="localhost",      # omdat de container poort 5432 naar localhost mapt
            port="5432",
            database="postgres",     # naam van je database
            user="postgres",       # zoals in docker-compose.yml
            password="yvs20091994" # zoals in docker-compose.yml
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
