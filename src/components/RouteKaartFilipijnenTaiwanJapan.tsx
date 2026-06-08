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
  { naam: 'Manila',         lat: 14.590, lng: 120.980, onderdeel: 'Port Barton' },
  { naam: 'Port Barton',    lat: 10.411, lng: 119.178, onderdeel: 'Port Barton' },
  { naam: 'El Nido',        lat: 11.180, lng: 119.390, onderdeel: 'El Nido' },
  { naam: 'Linapacan',      lat: 11.491, lng: 119.868, onderdeel: 'Tao Expeditie' },
  { naam: 'Coron',          lat: 11.999, lng: 120.205, onderdeel: 'Coron' },
  { naam: 'Taipei',         lat: 25.038, lng: 121.564, onderdeel: 'Smangus' },
  { naam: 'Smangus',        lat: 24.579, lng: 121.334, onderdeel: 'Smangus' },
  { naam: 'Hualien',        lat: 23.991, lng: 121.620, onderdeel: 'Taroko & Oostkust' },
  { naam: 'Taroko Gorge',   lat: 24.183, lng: 121.494, onderdeel: 'Taroko & Oostkust' },
  { naam: 'Osaka',          lat: 34.694, lng: 135.501, onderdeel: 'Kumano Kodo' },
  { naam: 'Kumano Hongu',   lat: 33.829, lng: 135.758, onderdeel: 'Kumano Kodo' },
  { naam: 'Nachi',          lat: 33.641, lng: 135.934, onderdeel: 'Kumano Kodo' },
  { naam: 'Kyoto',          lat: 35.012, lng: 135.768, onderdeel: 'Kiso & Kyoto' },
  { naam: 'Tsumago',        lat: 35.577, lng: 137.596, onderdeel: 'Kiso & Kyoto' },
  { naam: 'Shiga Kogen',    lat: 36.733, lng: 138.432, onderdeel: 'Shiga Kogen & Tokyo' },
  { naam: 'Tokyo',          lat: 35.677, lng: 139.764, onderdeel: 'Shiga Kogen & Tokyo' },
];

const KLEUREN: Record<string, string> = {
  'Port Barton':          '#0e7c86',
  'El Nido':              '#1f9e8f',
  'Tao Expeditie':        '#2bb3a3',
  'Coron':                '#1a6f9c',
  'Smangus':              '#2d7d46',
  'Taroko & Oostkust':    '#3a9b54',
  'Kumano Kodo':          '#9c5a2d',
  'Kiso & Kyoto':         '#b4794a',
  'Shiga Kogen & Tokyo':  '#4a6fa5',
};

export default function RouteKaartFilipijnenTaiwanJapan() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [24, 128],
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
