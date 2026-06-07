import { useEffect, useRef } from 'react';
import L from 'leaflet';

// Fix Leaflet default marker icons in Vite/webpack builds
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const stops = [
  { naam: 'Bariloche',        lat: -41.133, lng: -71.310, onderdeel: 'Bariloche' },
  { naam: 'Puerto Montt',     lat: -41.469, lng: -72.942, onderdeel: 'Carretera Austral' },
  { naam: 'Parque Pumalín',   lat: -42.650, lng: -72.580, onderdeel: 'Carretera Austral' },
  { naam: 'Puyuhuapi',        lat: -44.333, lng: -72.567, onderdeel: 'Carretera Austral' },
  { naam: 'Queulat NP',       lat: -44.817, lng: -72.700, onderdeel: 'Carretera Austral' },
  { naam: 'Cerro Castillo',   lat: -46.117, lng: -72.217, onderdeel: 'Carretera Austral' },
  { naam: 'Coyhaique',        lat: -45.575, lng: -72.066, onderdeel: 'Carretera Austral' },
  { naam: 'Balmaceda',        lat: -45.917, lng: -71.700, onderdeel: 'Carretera Austral' },
  { naam: 'El Chaltén',       lat: -49.331, lng: -72.885, onderdeel: 'El Chaltén' },
  { naam: 'Ushuaia',          lat: -54.802, lng: -68.303, onderdeel: 'Ushuaia' },
  { naam: 'Stanley',          lat: -51.694, lng: -57.860, onderdeel: 'Falkland Islands' },
  { naam: 'Sea Lion Island',  lat: -52.433, lng: -59.083, onderdeel: 'Falkland Islands' },
];

const KLEUREN: Record<string, string> = {
  'Bariloche':         '#a87332',
  'Carretera Austral': '#1a5c3a',
  'El Chaltén':        '#2d9c6a',
  'Ushuaia':           '#c4785a',
  'Falkland Islands':  '#4a6fa5',
};

export default function RouteKaart() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [-48, -68],
      zoom: 4,
      zoomControl: true,
      scrollWheelZoom: false,
      attributionControl: true,
    });

    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18,
    }).addTo(map);

    // Gestippelde route
    const latlngs = stops.map((s) => [s.lat, s.lng] as L.LatLngTuple);
    L.polyline(latlngs, {
      color: '#1a5c3a',
      weight: 2,
      opacity: 0.6,
      dashArray: '5, 5',
    }).addTo(map);

    // Genummerde markers
    stops.forEach((stop, i) => {
      const kleur = KLEUREN[stop.onderdeel] ?? '#1a5c3a';
      const icon = L.divIcon({
        className: '',
        html: `<div style="width:24px;height:24px;background:${kleur};border:2px solid white;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;color:white;box-shadow:0 2px 4px rgba(0,0,0,0.35);font-family:sans-serif">${i + 1}</div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      L.marker([stop.lat, stop.lng], { icon })
        .addTo(map)
        .bindPopup(
          `<div style="font-family:sans-serif;min-width:130px"><div style="font-size:10px;font-weight:700;color:${kleur};text-transform:uppercase;letter-spacing:.05em">${stop.onderdeel}</div><div style="font-size:13px;font-weight:600;color:#1a1a1a;margin-top:2px">${stop.naam}</div></div>`,
          { offset: [0, -6] }
        );
    });

    map.fitBounds(L.latLngBounds(latlngs), { padding: [24, 24] });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ height: '100%', minHeight: '288px', width: '100%', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(26,92,58,0.15)', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', zIndex: 0, position: 'relative' }}
    />
  );
}
