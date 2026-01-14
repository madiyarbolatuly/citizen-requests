import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

export default function FitBounds({ positions }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    if (!positions || positions.length === 0) return;

    const bounds = L.latLngBounds(positions);
    // Padding keeps popups visible
    map.fitBounds(bounds, { padding: [20, 20], maxZoom: 16 });
  }, [map, positions]);

  return null;
}
