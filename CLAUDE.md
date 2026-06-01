# Routebaas — Claude Code Project Context

Routebaas is a Dutch-language RAG-based travel planning system. It retrieves relevant travel experiences and activities from a PostgreSQL database and generates personalized itinerary advice using Claude.

## Architecture

- **Main DB** (port 5432, password: `yvs20091994`) — travel data: destinations, activities, places, itineraries, interests
- **Vector DB** (port 5433, password: `yourpassword`) — pgvector embeddings (nomic-embed-text, 768 dims, 601 rows)
- **Ollama** (port 11434) — local embedding model (`nomic-embed-text`)
- **Claude API** — `claude-opus-4-7` for response generation (key in `.claude/settings.json`)

## Key Files

- `scripts/routebaas-claude.py` — full RAG pipeline: embed query → vector search → enrich from main DB → Claude response
- `scripts/routebaas.py` — connection test helpers
- `scripts/retrieval_query_aanroepen.py` — original Ollama-based pipeline (reference only)
- `scripts/db.py` — legacy connection helper

## Available Destinations (5 total)

| Bestemming | Land | Activiteiten |
|---|---|---|
| Japan | Japan | 89 |
| Canada | Canada | 120 |
| Costa Rica | Costa Rica | 30 |
| Azoren | Portugal | 49 |
| Montenegro | Montenegro | 35 |

## Interest Categories

- **natuur_outdoor**: avontuur, bergen, fietsen, fotografie, hiken & wandelen, kamperen, nationale_parken, natuur, roadtrip, strand, watersport, wildlife, wintersport
- **cultuur**: architectuur, art, cultuur, festivals, geschiedenis, lokale_markten, musea, shopping, sport & entertainment
- **food_drinks**: biercultuur, fine_dining, gastronomie, koffie & ontbijt, nightlife, streetfood, wijnproeverij
- **luxe_ontspanning**: glamping, luxe, wellness
- **reisstijl**: off_the_beaten, slow_travel

## Available Slash Commands

- `/test-routebaas` — tests all connections (main DB, vector DB, Ollama) and runs the full RAG pipeline end-to-end

## How to Help Users

### Running a test
When the user asks to test the system, run `/test-routebaas`.

### Creating a new itinerary
When the user asks for a new itinerary or travel advice:
1. Ask for: destination, trip length (days), and interests from the list above
2. Call `haal_context_op()` in `scripts/routebaas-claude.py` with those parameters
3. The pipeline handles retrieval and Claude generation automatically

You can also run the pipeline directly:
```bash
cd C:/Users/youpv/Documents/Claude/Routebaas/scripts
python routebaas-claude.py
```

Or import it in Python:
```python
import importlib.util
spec = importlib.util.spec_from_file_location('rc', 'scripts/routebaas-claude.py')
rc = importlib.util.module_from_spec(spec)
spec.loader.exec_module(rc)
rc.reisplanner(gebruikersvraag="...", bestemming="Japan", interesses=["natuur", "avontuur"], reislengte_dagen=14)
```

### Adding a new destination
The main DB schema supports new destinations via the `bestemmingen` table. New activities go in `activiteiten` linked via `plekken`. After adding data, run the embedding pipeline to index new entries in the vector DB.

## Important Notes

- The IVFFlat index requires `SET enable_indexscan = OFF` when fewer than ~3000 rows are embedded (workaround already in `routebaas-claude.py`)
- `needs_embedding = TRUE` does NOT mean "no embedding" — it means "embedding may be stale". Filter on `embedding_vector IS NOT NULL` instead
- All user-facing text should be in Dutch
