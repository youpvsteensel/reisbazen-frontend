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
  { naam: 'Melbourne',       lat: -37.814, lng: 144.963, onderdeel: 'Melbourne' },
  { naam: 'Hobart',          lat: -42.882, lng: 147.331, onderdeel: 'Tasmanië' },
  { naam: 'Freycinet NP',    lat: -42.137, lng: 148.296, onderdeel: 'Tasmanië' },
  { naam: 'Bay of Fires',    lat: -41.236, lng: 148.282, onderdeel: 'Tasmanië' },
  { naam: 'Cradle Mountain', lat: -41.684, lng: 145.943, onderdeel: 'Tasmanië' },
  { naam: 'Perth',           lat: -31.953, lng: 115.857, onderdeel: 'West-Australië' },
  { naam: 'Margaret River',  lat: -33.955, lng: 115.075, onderdeel: 'West-Australië' },
  { naam: 'Denmark',         lat: -34.961, lng: 117.353, onderdeel: 'West-Australië' },
  { naam: 'Albany',          lat: -35.027, lng: 117.884, onderdeel: 'West-Australië' },
  { naam: 'Esperance',       lat: -33.861, lng: 121.891, onderdeel: 'West-Australië' },
  { naam: 'Queenstown',      lat: -45.031, lng: 168.662, onderdeel: 'NZ Zuidereiland' },
  { naam: 'Doubtful Sound',  lat: -45.470, lng: 167.157, onderdeel: 'NZ Zuidereiland' },
  { naam: 'Te Anau',         lat: -45.414, lng: 167.718, onderdeel: 'NZ Zuidereiland' },
  { naam: 'Wanaka',          lat: -44.700, lng: 169.142, onderdeel: 'NZ Zuidereiland' },
  { naam: 'Fox Glacier',     lat: -43.464, lng: 170.018, onderdeel: 'NZ Zuidereiland' },
  { naam: 'Nelson',          lat: -41.270, lng: 173.284, onderdeel: 'NZ Zuidereiland' },
  { naam: 'Marlborough',     lat: -41.150, lng: 173.850, onderdeel: 'NZ Zuidereiland' },
  { naam: 'Lake Tekapo',     lat: -44.004, lng: 170.477, onderdeel: 'NZ Zuidereiland' },
  { naam: 'Mt Cook NP',      lat: -43.735, lng: 170.097, onderdeel: 'NZ Zuidereiland' },
];

const KLEUREN: Record<string, string> = {
  'Melbourne':        '#4a6fa5',
  'Tasmanië':         '#2d7d46',
  'West-Australië':   '#b4794a',
  'NZ Zuidereiland':  '#0e7c86',
};

export default function RouteKaartOceanie() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [-40, 150],
      zoom: 3,
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
