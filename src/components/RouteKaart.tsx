import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';

// Stops met coördinaten (gegenereerd via geocoding)
const stops = [
  { naam: 'Puerto Montt',         lat: -41.4693, lng: -72.9424, onderdeel: 'Carretera Austral' },
  { naam: 'Parque Pumalín',       lat: -42.6500, lng: -72.5800, onderdeel: 'Carretera Austral' },
  { naam: 'Puyuhuapi',            lat: -44.3333, lng: -72.5667, onderdeel: 'Carretera Austral' },
  { naam: 'Queulat NP',           lat: -44.8167, lng: -72.7000, onderdeel: 'Carretera Austral' },
  { naam: 'Cerro Castillo',       lat: -46.1167, lng: -72.2167, onderdeel: 'Carretera Austral' },
  { naam: 'Coyhaique',            lat: -45.5752, lng: -72.0662, onderdeel: 'Carretera Austral' },
  { naam: 'Balmaceda',            lat: -45.9167, lng: -71.7000, onderdeel: 'Carretera Austral' },
  { naam: 'El Chaltén',           lat: -49.3306, lng: -72.8854, onderdeel: 'El Chaltén' },
  { naam: 'Ushuaia',              lat: -54.8019, lng: -68.3030, onderdeel: 'Ushuaia' },
  { naam: 'Stanley',              lat: -51.6938, lng: -57.8598, onderdeel: 'Falkland Islands' },
  { naam: 'Sea Lion Island',      lat: -52.4333, lng: -59.0833, onderdeel: 'Falkland Islands' },
];

const ONDERDEEL_KLEUREN: Record<string, string> = {
  'Carretera Austral': '#1a5c3a',
  'El Chaltén':        '#2d7a4f',
  'Ushuaia':           '#c4785a',
  'Falkland Islands':  '#4a6fa5',
};

export default function RouteKaart() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    // Dynamisch Leaflet importeren om SSR-problemen te vermijden
    import('leaflet').then((L) => {
      // Fix voor Leaflet marker icons in Vite
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      const map = L.map(mapRef.current!, {
        center: [-48, -68],
        zoom: 4,
        zoomControl: true,
        scrollWheelZoom: false,
      });

      mapInstance.current = map;

      // OpenStreetMap tiles (gratis, geen API key)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18,
      }).addTo(map);

      // Route als polyline
      const latlngs = stops.map((s) => [s.lat, s.lng] as [number, number]);
      L.polyline(latlngs, {
        color: '#1a5c3a',
        weight: 2.5,
        opacity: 0.7,
        dashArray: '6, 4',
      }).addTo(map);

      // Markers per stop
      stops.forEach((stop, i) => {
        const kleur = ONDERDEEL_KLEUREN[stop.onderdeel] ?? '#1a5c3a';

        const icon = L.divIcon({
          className: '',
          html: `<div style="
            width: 26px; height: 26px;
            background: ${kleur};
            border: 2px solid white;
            border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            font-size: 10px; font-weight: bold; color: white;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            font-family: sans-serif;
          ">${i + 1}</div>`,
          iconSize: [26, 26],
          iconAnchor: [13, 13],
        });

        L.marker([stop.lat, stop.lng], { icon })
          .addTo(map)
          .bindPopup(`
            <div style="font-family: sans-serif; min-width: 140px;">
              <div style="font-size: 10px; color: ${kleur}; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em;">${stop.onderdeel}</div>
              <div style="font-size: 14px; font-weight: bold; color: #1a1a1a; margin-top: 2px;">${stop.naam}</div>
            </div>
          `, { offset: [0, -8] });
      });

      // Zoom to fit all markers
      map.fitBounds(L.latLngBounds(latlngs), { padding: [30, 30] });
    });

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={mapRef}
      className="w-full h-72 rounded-xl overflow-hidden border border-groen/15 shadow-sm"
      style={{ zIndex: 0 }}
    />
  );
}
