"""
Genereert een KML-bestand uit reis_data.json voor import in Google My Maps.
Geocodeert plaatsnamen via Nominatim (OpenStreetMap, gratis, geen API key nodig).

Gebruik: python scripts/genereer_kml.py scripts/reis_data.json
Output:  scripts/reis_kml.kml

Import in Google My Maps:
  mymaps.google.com → Nieuw → Importeren → upload reis_kml.kml
"""
import sys
import json
import time
import requests
from pathlib import Path
from xml.etree.ElementTree import Element, SubElement, tostring
import xml.dom.minidom

sys.stdout.reconfigure(encoding="utf-8")

# KML kleur per bloknaam (formaat: aabbggrr — alpha, blue, green, red)
BLOK_KLEUREN = {
    "default":          ("ff0000ff", "ffaaaaff"),  # rood
}
VASTE_KLEUREN = [
    ("ff00aa00", "ff88ff88"),  # groen
    ("ff0055ff", "ffaaddff"),  # oranje
    ("ffaa00aa", "ffddaadd"),  # paars
    ("ff00aaaa", "ffaaffff"),  # cyaan
    ("ff0000ff", "ffaaaaff"),  # rood
    ("ff005599", "ffaaddff"),  # blauw
]


def geocode(plek: str, bestemming: str, land: str) -> tuple[float, float] | tuple[None, None]:
    """Geocodeer een plaatsnaam via Nominatim.

    Probeert eerst de meest specifieke combinatie (plek + land). Het `land`
    moet de werkelijke locatie zijn — bij een reis door meerdere landen geef je
    daarom per routestap een eigen `land` mee, niet de algemene bestemming.
    """
    queries = [f"{plek}, {land}", plek]
    # Alleen op bestemming terugvallen als die uit één land bestaat
    if bestemming and "," not in bestemming and bestemming != land:
        queries.insert(1, f"{plek}, {bestemming}")
    for query in queries:
        url = "https://nominatim.openstreetmap.org/search"
        params = {"q": query, "format": "json", "limit": 1}
        headers = {"User-Agent": "Routebaas-Travel-Planner/1.0 (contact@reisbazen.nl)"}
        try:
            resp = requests.get(url, params=params, headers=headers, timeout=10)
            resp.raise_for_status()
            results = resp.json()
            if results:
                return float(results[0]["lat"]), float(results[0]["lon"])
        except Exception as e:
            print(f"  Geocoding fout voor '{query}': {e}")
        time.sleep(1.1)  # Nominatim rate limit: max 1 req/sec
    return None, None


def kleur_voor_blok(blok: str, blok_index: dict) -> tuple[str, str]:
    """Geef een vaste kleur terug voor een bloknaam."""
    if blok not in blok_index:
        blok_index[blok] = len(blok_index) % len(VASTE_KLEUREN)
    idx = blok_index[blok]
    return VASTE_KLEUREN[idx]


def genereer_kml(data: dict, output_pad: Path):
    naam = data["naam"]
    bestemming = data["bestemming"]
    land = data["land"]
    stappen = data["routestappen"]

    # Geocodeer alle unieke plekken
    print("Plaatsnamen geocoderen via OpenStreetMap...")
    cache: dict[str, tuple] = {}
    for stap in stappen:
        plek = stap.get("plek", stap["naam"])
        # geocode_plek overschrijft alleen de geocoding (handig bij samengestelde
        # pleknamen met haakjes/slashes die Nominatim niet vindt); plek blijft intact
        geo_plek = stap.get("geocode_plek", plek)
        # Per-stap land heeft voorrang (belangrijk bij reizen door meerdere landen)
        stap_land = stap.get("land", land)
        sleutel = f"{geo_plek}|{stap_land}"
        if sleutel not in cache:
            print(f"  {geo_plek} ({stap_land})...", end=" ", flush=True)
            lat, lon = geocode(geo_plek, bestemming, stap_land)
            cache[sleutel] = (lat, lon)
            print(f"{'✓' if lat else '✗'}")
            time.sleep(1.1)

    # Bouw KML
    kml = Element("kml", xmlns="http://www.opengis.net/kml/2.2")
    doc = SubElement(kml, "Document")
    SubElement(doc, "name").text = naam
    SubElement(doc, "description").text = data.get("beschrijving", "")

    # Stijlen per blok
    blok_index: dict[str, int] = {}
    blokken_gezien: set[str] = set()
    for stap in stappen:
        blok = stap.get("blok", "Overig")
        if blok in blokken_gezien:
            continue
        blokken_gezien.add(blok)
        kleur_lijn, kleur_punt = kleur_voor_blok(blok, blok_index)

        # Lijnstijl
        style_lijn = SubElement(doc, "Style", id=f"lijn_{blok.replace(' ', '_')}")
        line_style = SubElement(style_lijn, "LineStyle")
        SubElement(line_style, "color").text = kleur_lijn
        SubElement(line_style, "width").text = "4"

        # Puntstijl
        style_punt = SubElement(doc, "Style", id=f"punt_{blok.replace(' ', '_')}")
        icon_style = SubElement(style_punt, "IconStyle")
        SubElement(icon_style, "color").text = kleur_lijn
        SubElement(icon_style, "scale").text = "1.2"
        icon = SubElement(icon_style, "Icon")
        SubElement(icon, "href").text = "http://maps.google.com/mapfiles/kml/paddle/wht-circle.png"
        SubElement(SubElement(style_punt, "LabelStyle"), "scale").text = "0.8"

    # Placemarks per routestap
    folder_punten = SubElement(doc, "Folder")
    SubElement(folder_punten, "name").text = "Stops"

    coords_per_blok: dict[str, list] = {}

    for stap in stappen:
        plek = stap.get("plek", stap["naam"])
        geo_plek = stap.get("geocode_plek", plek)
        blok = stap.get("blok", "Overig")
        stap_land = stap.get("land", land)
        lat, lon = cache.get(f"{geo_plek}|{stap_land}", (None, None))

        if lat is None:
            print(f"  Waarschuwing: geen coördinaten voor dag {stap['dag_nr']} ({plek})")
            continue

        coords_per_blok.setdefault(blok, []).append((lon, lat))

        pm = SubElement(folder_punten, "Placemark")
        SubElement(pm, "name").text = f"Dag {stap['dag_nr']} — {stap['naam']}"
        SubElement(pm, "styleUrl").text = f"#punt_{blok.replace(' ', '_')}"

        beschrijving = f"<b>Blok:</b> {blok}<br/>"
        if stap.get("accomodatie"):
            beschrijving += f"<b>Verblijf:</b> {stap['accomodatie']}<br/>"
        ja = stap.get("activiteiten_ja", [])
        if ja:
            beschrijving += f"<b>Activiteiten:</b> {', '.join(ja)}<br/>"
        misschien = stap.get("activiteiten_misschien", [])
        if misschien:
            beschrijving += f"<b>Misschien:</b> {', '.join(misschien)}<br/>"
        SubElement(pm, "description").text = beschrijving

        point = SubElement(pm, "Point")
        SubElement(point, "coordinates").text = f"{lon},{lat},0"

    # Routes per blok als LineString
    folder_routes = SubElement(doc, "Folder")
    SubElement(folder_routes, "name").text = "Routes"

    for blok, coords in coords_per_blok.items():
        if len(coords) < 2:
            continue
        pm = SubElement(folder_routes, "Placemark")
        SubElement(pm, "name").text = blok
        SubElement(pm, "styleUrl").text = f"#lijn_{blok.replace(' ', '_')}"
        ls = SubElement(pm, "LineString")
        SubElement(ls, "tessellate").text = "1"
        SubElement(ls, "coordinates").text = " ".join(f"{lon},{lat},0" for lon, lat in coords)

    # Schrijf KML
    xml_str = tostring(kml, encoding="unicode")
    dom = xml.dom.minidom.parseString(xml_str)
    pretty = dom.toprettyxml(indent="  ", encoding="UTF-8")

    output_pad.write_bytes(pretty)
    print(f"\nKML opgeslagen: {output_pad}")
    print(f"Importeer via: mymaps.google.com → Nieuw → Importeren")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Gebruik: python genereer_kml.py <reis_data.json>")
        sys.exit(1)

    json_pad = Path(sys.argv[1])
    with open(json_pad, encoding="utf-8") as f:
        data = json.load(f)

    # KML-naam volgt de JSON-naam, zodat elke reis een eigen bestand krijgt
    # (reis_data_japan.json -> reis_data_japan.kml). Niets wordt overschreven
    # tenzij expliciet --force wordt meegegeven.
    output = json_pad.with_suffix(".kml")
    if output.exists() and "--force" not in sys.argv:
        print(f"FOUT: {output} bestaat al. Kies een andere JSON-naam of geef --force mee om te overschrijven.")
        sys.exit(1)

    genereer_kml(data, output)
