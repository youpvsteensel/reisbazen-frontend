# Test Routebaas Pipeline

Test all connections and the full RAG pipeline end-to-end: vector DB (5433), main DB (5432), Ollama embeddings, and a Claude-powered travel query.

Run this Python test script:

```python
import subprocess, sys

script = """
import sys
sys.stdout.reconfigure(encoding='utf-8')
import psycopg2, requests, numpy as np
from pgvector.psycopg2 import register_vector

PASS = "OK"
FAIL = "FAIL"
results = []

# --- 1. Main DB (5432) ---
try:
    conn = psycopg2.connect(host='localhost', port=5432, database='postgres', user='postgres', password='yvs20091994')
    cur = conn.cursor()
    cur.execute("SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='public'")
    n = cur.fetchone()[0]
    cur.close(); conn.close()
    results.append((PASS, f"Main DB (5432): {n} tabellen gevonden"))
except Exception as e:
    results.append((FAIL, f"Main DB (5432): {e}"))

# --- 2. Vector DB (5433) ---
try:
    conn = psycopg2.connect(host='localhost', port=5433, database='postgres', user='postgres', password='yourpassword')
    cur = conn.cursor()
    cur.execute("SELECT COUNT(*) FROM embeddings WHERE embedding_vector IS NOT NULL")
    n = cur.fetchone()[0]
    cur.execute("SELECT extname FROM pg_extension WHERE extname = 'vector'")
    has_vec = cur.fetchone() is not None
    cur.close(); conn.close()
    results.append((PASS, f"Vector DB (5433): {n} embeddings, pgvector={'aanwezig' if has_vec else 'NIET gevonden'}"))
except Exception as e:
    results.append((FAIL, f"Vector DB (5433): {e}"))

# --- 3. Ollama embedding ---
try:
    resp = requests.post('http://localhost:11434/api/embeddings',
                         json={'model': 'nomic-embed-text', 'prompt': 'test'}, timeout=15)
    resp.raise_for_status()
    dims = len(resp.json()['embedding'])
    results.append((PASS, f"Ollama embedding: {dims} dimensies (nomic-embed-text)"))
except Exception as e:
    results.append((FAIL, f"Ollama embedding: {e}"))

# --- 4. Vector similarity search ---
try:
    resp = requests.post('http://localhost:11434/api/embeddings',
                         json={'model': 'nomic-embed-text', 'prompt': 'avontuurlijke reis activiteiten'}, timeout=15)
    emb = np.array(resp.json()['embedding'])
    conn = psycopg2.connect(host='localhost', port=5433, database='postgres', user='postgres', password='yourpassword')
    register_vector(conn)
    cur = conn.cursor()
    cur.execute("SET enable_indexscan = OFF")
    cur.execute('''SELECT entity_type, entity_id, 1-(embedding_vector <=> %s) AS sim
                   FROM embeddings WHERE embedding_vector IS NOT NULL
                   ORDER BY embedding_vector <=> %s LIMIT 3''', (emb, emb))
    hits = cur.fetchall()
    cur.close(); conn.close()
    top = ', '.join(f"{r[0]}:{r[1]} ({round(float(r[2]),2)})" for r in hits)
    results.append((PASS, f"Vector search: top-3 hits -> {top}"))
except Exception as e:
    results.append((FAIL, f"Vector search: {e}"))

# --- 5. Main DB entity lookup ---
try:
    conn = psycopg2.connect(host='localhost', port=5432, database='postgres', user='postgres', password='yvs20091994')
    cur = conn.cursor()
    cur.execute("SELECT naam FROM activiteiten ORDER BY RANDOM() LIMIT 3")
    names = [r[0] for r in cur.fetchall()]
    cur.close(); conn.close()
    results.append((PASS, f"Entity lookup: {names}"))
except Exception as e:
    results.append((FAIL, f"Entity lookup: {e}"))

# --- 6. Full RAG pipeline via Claude ---
try:
    import importlib.util, os
    spec = importlib.util.spec_from_file_location('rc', 'scripts/routebaas-claude.py')
    rc = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(rc)
    ctx = rc.haal_context_op('avontuurlijke activiteiten natuur', top_k=3)
    if not ctx:
        raise ValueError("Geen context opgehaald uit vector DB")
    ctx_tekst, vraag = rc.bouw_prompt('Geef 1 korte activiteitstip.', ctx)
    antwoord = rc.genereer_antwoord(ctx_tekst, vraag)
    preview = antwoord[:120].replace('\\n', ' ')
    results.append((PASS, f"Claude RAG antwoord: {preview}..."))
except Exception as e:
    results.append((FAIL, f"Claude RAG pipeline: {e}"))

# --- Report ---
print()
print("=" * 60)
print("  ROUTEBAAS PIPELINE TEST RESULTATEN")
print("=" * 60)
for status, msg in results:
    icon = "[OK]" if status == "OK" else "[FAIL]"
    print(f"  {icon}  {msg}")
print("=" * 60)
failed = [r for r in results if r[0] == "FAIL"]
print(f"  {len(results) - len(failed)}/{len(results)} tests geslaagd")
print("=" * 60)
"""

result = subprocess.run(
    [sys.executable, "-c", script],
    cwd="C:/Users/youpv/Documents/Claude/Routebaas",
    capture_output=True, text=True, encoding="utf-8"
)
print(result.stdout)
if result.stderr:
    print("STDERR:", result.stderr[-500:])
```

Execute the script above with `python` and report the results. If any test fails, diagnose the issue and suggest a fix.
