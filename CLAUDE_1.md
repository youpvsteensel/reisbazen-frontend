# CLAUDE.md – Reisplanningtool met RAG & Voorkeursprofiel

## Projectoverzicht

Een intelligente reisplanningtool die historische reisdata combineert met een RAG-pipeline (Retrieval-Augmented Generation) om een persoonlijk voorkeursprofiel op te bouwen. Met dit profiel worden nieuwe reisplannen gegenereerd voor nog niet bezochte bestemmingen.

---

## Architectuur

```
Historische reisdata (Reisroutes + Routestappen + Ervaringen)
        │
        ▼
PostgreSQL (structurele data – zie schema hieronder)
        │
        ▼
pgvector (embeddings van Ervaringen + Activiteiten + Routestappen)
        │
        ▼
RAG-pipeline → Voorkeursprofiel (gebaseerd op ratings & reviewteksten)
        │
        ▼
Nieuwe bestemming → Reisplan genereren op maat
```

---

## Technische Stack

| Laag | Technologie |
|---|---|
| Database | PostgreSQL + pgvector |
| Embeddings | OpenAI `text-embedding-3-small` of lokaal (e.g. `nomic-embed-text`) |
| LLM | Claude via Anthropic API (`claude-sonnet-4-20250514`) |
| Backend | Python (FastAPI aanbevolen) |
| Frontend | React of CLI (fase 1) |

---

## Databaseschema (werkelijk)

### Kernentiteiten

```sql
-- Geografisch
CREATE TABLE Bestemmingen (
    id        INT PRIMARY KEY,
    naam      VARCHAR,
    land      VARCHAR
);

CREATE TABLE Plekken (
    id               INT PRIMARY KEY,
    naam             VARCHAR,
    bestemmingen_id  INT REFERENCES Bestemmingen(id),
    latitude         BIGINT,
    longitude        BIGINT
);

-- Reisroutes (de historische reizen)
CREATE TABLE Reisroutes (
    id            INT PRIMARY KEY,
    naam          VARCHAR,
    status_id     INT REFERENCES Status(id),
    beschrijving  TEXT
);

-- Dag-voor-dag stappen binnen een reisroute
CREATE TABLE Routestappen (
    id                INT PRIMARY KEY,
    naam              VARCHAR,
    dag               INT,           -- dag nummer binnen de route
    reisroutes_id     INT REFERENCES Reisroutes(id),
    bestemmingen_id   INT REFERENCES Bestemmingen(id),
    accomodaties_id   INT REFERENCES Accomodaties(id),
    beschrijving      TEXT
);
```

### Activiteiten & Interesses

```sql
CREATE TABLE Activiteiten (
    id                   INT PRIMARY KEY,
    naam                 VARCHAR,
    plekken_id           INT REFERENCES Plekken(id),
    duur_activiteiten_id INT REFERENCES Duur_activiteiten(id),
    beschrijving         TEXT,
    locatie              VARCHAR,
    status_id            INT REFERENCES Status(id)
);

CREATE TABLE Duur_activiteiten (
    id    INT PRIMARY KEY,
    naam  VARCHAR        -- bijv. "kort", "half dag", "hele dag"
);

CREATE TABLE Interesses (
    id         INT PRIMARY KEY,
    naam       VARCHAR,
    categorie  VARCHAR    -- bijv. "cultuur", "natuur", "sport"
);

-- Koppeltabel: welke interesses passen bij welke activiteit
CREATE TABLE Activiteit_interesses (
    id              INT PRIMARY KEY,
    activiteiten_id INT REFERENCES Activiteiten(id),
    interesses_id   INT REFERENCES Interesses(id)
);

-- Koppeltabel: welke activiteiten zitten in een routestap
CREATE TABLE Routestap_activiteiten (
    id               INT PRIMARY KEY,
    routestappen_id  INT REFERENCES Routestappen(id),
    activiteiten_id  INT REFERENCES Activiteiten(id),
    volgorde         INT
);
```

### Accommodaties & Food & Drinks

```sql
CREATE TABLE Accomodaties (
    id          INT PRIMARY KEY,
    naam        VARCHAR,
    plekken_id  INT REFERENCES Plekken(id),
    status_id   INT REFERENCES Status(id)
);

CREATE TABLE Food_Drinks (
    id          INT PRIMARY KEY,
    naam        VARCHAR,
    plekken_id  INT REFERENCES Plekken(id),
    status_id   BIGINT REFERENCES Status(id)
);

-- Koppeltabel: food & drinks aan routestap koppelen
CREATE TABLE Routestap_food_drinks (
    id               INT PRIMARY KEY,
    routestappen_id  INT REFERENCES Routestappen(id),
    food_drinks_id   INT REFERENCES Food_Drinks(id),
    volgorde         INT
);

-- Koppeltabel: plekken aan routestap koppelen
CREATE TABLE Routestap_plekken (
    id               INT PRIMARY KEY,
    routestappen_id  INT REFERENCES Routestappen(id),
    plekken_id       INT REFERENCES Plekken(id),
    volgorde         INT
);
```

### Ervaringen & Status

```sql
-- Ervaringen zijn ratings + reviews op alle entiteiten (polymorfisch)
CREATE TABLE Ervaringen (
    id            INT PRIMARY KEY,
    naam          VARCHAR,
    reisroutes_id INT REFERENCES Reisroutes(id),
    entity_type   VARCHAR,   -- 'activiteit' | 'accomodatie' | 'food_drinks' | 'plek'
    entity_id     INT,       -- FK naar de betreffende entiteit
    rating        INT,       -- 1-5
    reviewtekst   TEXT
);

CREATE TABLE Status (
    id    INT PRIMARY KEY,
    naam  VARCHAR           -- bijv. 'actief', 'inactief', 'concept'
);
```

### Entity Relationship Overzicht

```
Reisroutes (1) ──── (N) Routestappen
                          │
              ┌───────────┼──────────────┐
              ▼           ▼              ▼
          Plekken    Activiteiten   Food&Drinks
              │           │
          Bestemmingen  Interesses (via Activiteit_interesses)
              │
          Accomodaties

Ervaringen → koppelt aan Reisroutes + polymorfisch aan elk entiteitstype
             via (entity_type, entity_id)
```

---

## RAG-Pipeline: Voorkeursprofiel opbouwen

De rijkste bron voor het voorkeursprofiel zijn de **Ervaringen** (rating + reviewtekst),
aangevuld met de **Activiteiten** en **Interesses** van goed beoordeelde routestappen.

### Stap 1 – Retrieval (pgvector similarity search)

```python
def get_relevant_experiences(query: str, top_k: int = 15) -> list[dict]:
    """
    Zoek de meest relevante ervaringen op basis van semantische similariteit.
    De embeddings zijn gemaakt van: reviewtekst + activiteitnaam + interessecategorie.
    """
    query_embedding = embed(query)

    sql = """
        SELECT
            e.id,
            e.entity_type,
            e.entity_id,
            e.rating,
            e.reviewtekst,
            r.naam          AS reisroute_naam,
            b.naam          AS bestemming,
            b.land,
            te.content,
            1 - (te.embedding <=> %s::vector) AS similarity
        FROM trip_embeddings te
        JOIN Ervaringen e    ON e.id = te.entity_id AND te.entity_type = 'ervaring'
        JOIN Reisroutes r    ON r.id = e.reisroutes_id
        JOIN Routestappen rs ON rs.reisroutes_id = r.id
        JOIN Bestemmingen b  ON b.id = rs.bestemmingen_id
        ORDER BY similarity DESC
        LIMIT %s;
    """
    return db.execute(sql, [query_embedding, top_k])
```

### Stap 2 – Interesses ophalen voor context

```python
def get_interests_for_route(reisroutes_id: int) -> list[str]:
    """
    Haal alle interesses op die gekoppeld zijn aan activiteiten in deze reisroute.
    """
    sql = """
        SELECT DISTINCT i.naam, i.categorie
        FROM Reisroutes r
        JOIN Routestappen rs           ON rs.reisroutes_id = r.id
        JOIN Routestap_activiteiten ra ON ra.routestappen_id = rs.id
        JOIN Activiteiten a            ON a.id = ra.activiteiten_id
        JOIN Activiteit_interesses ai  ON ai.activiteiten_id = a.id
        JOIN Interesses i              ON i.id = ai.interesses_id
        WHERE r.id = %s;
    """
    rows = db.execute(sql, [reisroutes_id])
    return [f"{r['naam']} ({r['categorie']})" for r in rows]
```

### Stap 3 – Augmentation (contextopbouw voor profiel)

```python
def build_profile_prompt(experiences: list[dict], interests: list[str]) -> str:
    context = "\n\n".join([
        f"Bestemming: {e['bestemming']}, {e['land']}\n"
        f"Entiteit: {e['entity_type']} (id: {e['entity_id']})\n"
        f"Beoordeling: {e['rating']}/5\n"
        f"Review: {e['reviewtekst']}"
        for e in experiences
    ])

    interests_str = ", ".join(interests) if interests else "geen data"

    return f"""
Je bent een reisexpert. Analyseer de historische reiservaringen van deze gebruiker
en maak een gedetailleerd voorkeursprofiel.

ERVARINGEN (met ratings en reviews):
{context}

GEKOPPELDE INTERESSES UIT ACTIVITEITEN:
{interests_str}

Geef een voorkeursprofiel terug als JSON met de velden:
- travel_styles: lijst van reistijlen (bijv. ["cultuur", "avontuur", "gastronomie"])
- favorite_activity_types: top activiteitscategorieën op basis van interesses
- preferred_entity_types: welke entiteiten (accomodatie, food_drinks, activiteit) scoorden het best
- accommodation_preference: voorkeur op basis van hoogst beoordeelde accomodaties
- food_preferences: patronen in food & drinks ervaringen
- avoid: entiteitstypes of kenmerken met lage ratings
- top_destinations: best beoordeelde bestemmingen/landen
- profile_summary: vrije tekstsamenvatting (max 200 woorden)
"""
```

### Stap 4 – Generatie via Claude

```python
import anthropic, json

client = anthropic.Anthropic()

def generate_preference_profile(experiences: list[dict], interests: list[str]) -> dict:
    prompt = build_profile_prompt(experiences, interests)

    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=1000,
        messages=[{"role": "user", "content": prompt}]
    )

    raw = response.content[0].text
    clean = raw.replace("```json", "").replace("```", "").strip()
    return json.loads(clean)
```

---

## Nieuwe Reisplanning op Basis van Profiel

```python
def plan_new_trip(
    bestemming: str,
    land: str,
    profile: dict,
    duration_days: int = 7
) -> str:
    prompt = f"""
Je bent een persoonlijke reisplanner. Maak een gedetailleerd dag-voor-dag reisplan voor:

BESTEMMING: {bestemming}, {land}
DUUR: {duration_days} dagen

VOORKEURSPROFIEL VAN DE REIZIGER:
- Reistijlen: {', '.join(profile['travel_styles'])}
- Favoriete activiteitscategorieën: {', '.join(profile['favorite_activity_types'])}
- Accommodatievoorkeur: {profile['accommodation_preference']}
- Food & drinks voorkeuren: {profile['food_preferences']}
- Eerder positief over: {', '.join(profile['preferred_entity_types'])}
- Vermijden: {', '.join(profile['avoid'])}

Structureer het plan als routestappen per dag (zoals in het schema: Routestappen met dag-nummer),
inclusief per dag:
- Naam en beschrijving van de dag (routestap)
- 2-3 aanbevolen activiteiten (met interessecategorie uit Interesses.categorie)
- Aanbevolen accommodatie
- 1-2 food & drinks tips
- Praktische tips en budgetschatting
"""

    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=2000,
        messages=[{"role": "user", "content": prompt}]
    )

    return response.content[0].text
```

---

## Embedding Strategie

Embeddings worden gegenereerd per entiteitstype en opgeslagen in één centrale tabel.

```python
def build_embedding_content(entity_type: str, row: dict) -> str:
    """Maak een rijke tekst voor embedding per entiteitstype."""
    if entity_type == "ervaring":
        return (
            f"Ervaring bij {row['entity_type']} in {row['bestemming']}, {row['land']}. "
            f"Beoordeling: {row['rating']}/5. Review: {row['reviewtekst']}"
        )
    elif entity_type == "activiteit":
        return (
            f"Activiteit: {row['naam']}. Locatie: {row['locatie']}. "
            f"Beschrijving: {row['beschrijving']}. Duur: {row['duur']}."
        )
    elif entity_type == "routestap":
        return (
            f"Dag {row['dag']}: {row['naam']} in {row['bestemming']}. "
            f"Beschrijving: {row['beschrijving']}"
        )
    else:
        return f"{entity_type}: {row.get('naam', '')} – {row.get('beschrijving', '')}"
```

```sql
-- pgvector tabel voor alle embeddings
CREATE TABLE trip_embeddings (
    id           SERIAL PRIMARY KEY,
    entity_type  VARCHAR,          -- 'ervaring' | 'activiteit' | 'routestap' | 'plek'
    entity_id    INT,
    content      TEXT,             -- de tekst die geëmbed is
    embedding    VECTOR(1536),     -- dimensie afhankelijk van model
    created_at   TIMESTAMP DEFAULT NOW()
);
```

---

## Projectstructuur

```
travel-planner/
├── CLAUDE.md                       # dit bestand
├── README.md
├── .env                            # ANTHROPIC_API_KEY, DATABASE_URL
├── requirements.txt
│
├── db/
│   ├── schema.sql                  # werkelijk schema (zie boven)
│   ├── migrations/
│   └── seed_data.sql
│
├── embeddings/
│   ├── generate_embeddings.py      # bouw embeddings van Ervaringen, Activiteiten, Routestappen
│   ├── embedding_model.py          # wrapper voor embedding-model
│   └── content_builder.py          # build_embedding_content() per entity_type
│
├── rag/
│   ├── retrieval.py                # pgvector similarity search op trip_embeddings
│   ├── interests.py                # get_interests_for_route()
│   ├── profile_builder.py          # voorkeursprofiel genereren via Claude
│   └── trip_planner.py             # nieuwe reisplanning genereren via Claude
│
├── api/
│   ├── main.py                     # FastAPI applicatie
│   ├── routes/
│   │   ├── profile.py              # GET/POST /profile
│   │   ├── planning.py             # POST /plan
│   │   └── reisroutes.py           # CRUD voor Reisroutes + Routestappen
│   └── models.py                   # Pydantic schemas
│
└── frontend/                       # optioneel (React)
    └── src/
```

---

## Environment Variables

```env
# .env
ANTHROPIC_API_KEY=sk-ant-...
DATABASE_URL=postgresql://user:password@localhost:5432/travel_db
EMBEDDING_MODEL=text-embedding-3-small   # of lokaal model
OPENAI_API_KEY=sk-...                    # alleen indien OpenAI embeddings gebruikt
```

---

## API Endpoints (FastAPI)

| Method | Endpoint | Beschrijving |
|---|---|---|
| `POST` | `/profile/generate` | Genereer voorkeursprofiel op basis van Ervaringen + Interesses |
| `GET` | `/profile/{user_id}` | Haal opgeslagen profiel op |
| `POST` | `/plan/new` | Maak reisplan voor nieuwe bestemming op basis van profiel |
| `GET` | `/reisroutes` | Lijst alle historische reisroutes |
| `GET` | `/reisroutes/{id}/stappen` | Routestappen + activiteiten + ervaringen per route |
| `POST` | `/ervaringen` | Voeg een nieuwe ervaring (rating + review) toe |
| `GET` | `/bestemmingen` | Lijst alle bestemmingen |
| `GET` | `/interesses` | Lijst alle interesses per categorie |

---

## Volgende Stappen

1. **[x]** Databaseschema gedocumenteerd (Reisroutes, Routestappen, Ervaringen, Plekken, etc.)
2. **[ ]** Valideren welke entiteiten al embeddings hebben in pgvector (`trip_embeddings`)
3. **[ ]** `build_embedding_content()` testen op werkelijke data uit de DB
4. **[ ]** RAG-retrieval testen: similarity search op Ervaringen met testquery
5. **[ ]** Profielgeneratie testen met bestaande ervaringsdata + interessekoppeling
6. **[ ]** `Activiteit_interesses → Interesses.categorie` koppeling valideren
7. **[ ]** FastAPI backend opzetten met bovenstaande endpoints
8. **[ ]** Frontend bouwen (React of CLI)
9. **[ ]** Multigebruiker ondersteuning (user_id toevoegen aan Reisroutes of apart profiel)

---

## Aandachtspunten

- **Polymorfisch `entity_type` in Ervaringen**: zorg dat de waarden consistent zijn ('activiteit', 'accomodatie', 'food_drinks', 'plek') — gebruik nooit tabelnamen met hoofdletters
- **Interesses zijn de sleutel tot het profiel**: de koppeling `Activiteit_interesses → Interesses.categorie` levert de rijkste profielinput
- **Embedding-consistentie**: gebruik altijd hetzelfde model voor indexeren én querien
- **Profielcaching**: sla het profiel op en ververs alleen bij nieuwe Ervaringen
- **Routestap volgorde**: gebruik het `dag`-veld in `Routestappen` én `volgorde` in koppeltabellen voor correct gesorteerde plannen
- **Status-filtering**: filter op `Status.naam = 'actief'` bij ophalen van Activiteiten, Accomodaties en Food&Drinks
- **Kosten**: begrens `max_tokens` en cache profielen om API-kosten te beheersen
