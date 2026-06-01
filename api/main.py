import json
import os
from pathlib import Path

import anthropic
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

app = FastAPI(title="Routebaas API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://reisbazen.nl", "https://www.reisbazen.nl"],
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)

client = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

# Laad reizigersprofiel eenmalig bij opstarten
_profiel_pad = Path(__file__).parent / "profiel.json"
if not _profiel_pad.exists():
    raise RuntimeError("profiel.json niet gevonden — voer eerst scripts/exporteer_profiel.py uit")

with open(_profiel_pad, encoding="utf-8") as _f:
    _PROFIEL = json.load(_f)

PROFIEL_TEKST = f"""{_PROFIEL.get('profiel_samenvatting', '')}

Reisstijl: {_PROFIEL.get('reisstijl', '')}
Vervoer: {', '.join(_PROFIEL.get('vervoer', []))}
Accommodatie: {', '.join(_PROFIEL.get('accommodatie_voorkeur', []))}
Top interesses: {', '.join(_PROFIEL.get('top_interesses', [])[:8])}
Vermijden: {', '.join(_PROFIEL.get('vermijden', []))}
Hoogtepunten uit eerdere reizen: {'; '.join(_PROFIEL.get('beste_ervaringen', [])[:3])}
Geleerde lessen: {'; '.join(_PROFIEL.get('geleerde_lessen', [])[:3])}"""

SYSTEM_PROMPT = f"""Je bent Routebaas, de persoonlijke reisplanner van reisbazen.nl.

Je geeft gepersonaliseerd reisadvies gebaseerd op het profiel van de reisbazen — twee avontuurlijke reizigers die houden van natuur, actieve vakanties en off-the-beaten-path bestemmingen.

REIZIGERSPROFIEL:
{PROFIEL_TEKST}

Richtlijnen:
- Geef een dag-voor-dag indeling met concrete activiteiten, logistiek en accommodatietips
- Verwijs expliciet naar overeenkomsten met eerdere reizen waar relevant ("net als bij X in Canada/Japan/etc.")
- Schrijf in het Nederlands
- Gebruik geen markdown, kopjes of opsommingstekens — gewone lopende tekst per dag
- Wees concreet: echte plaatsnamen, trail-namen, accommodatietypes"""


class ItineraryRequest(BaseModel):
    bestemming: str
    dagen: int
    interesses: list[str]
    extra_wensen: str | None = None


def genereer_stream(req: ItineraryRequest):
    if req.dagen < 1 or req.dagen > 90:
        raise ValueError("Reisduur moet tussen 1 en 90 dagen zijn")

    vraag = (
        f"Maak een {req.dagen}-daagse reisroute voor {req.bestemming}. "
        f"Interesses: {', '.join(req.interesses)}."
        + (f" Extra wensen: {req.extra_wensen}" if req.extra_wensen else "")
        + " Geef een dag-voor-dag indeling passend bij ons reizigersprofiel."
    )

    with client.messages.stream(
        model="claude-opus-4-7",
        max_tokens=4096,
        thinking={"type": "adaptive"},
        system=[{"type": "text", "text": SYSTEM_PROMPT, "cache_control": {"type": "ephemeral"}}],
        messages=[{"role": "user", "content": vraag}],
    ) as stream:
        for text in stream.text_stream:
            yield f"data: {json.dumps({'text': text}, ensure_ascii=False)}\n\n"

    yield "data: [DONE]\n\n"


@app.post("/itinerary")
def itinerary(req: ItineraryRequest):
    try:
        return StreamingResponse(
            genereer_stream(req),
            media_type="text/event-stream",
            headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/health")
def health():
    return {"status": "ok", "bestemming_count": None}
