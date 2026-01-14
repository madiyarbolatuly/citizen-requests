import { Box, Paper, Skeleton, Typography } from '@mui/material';
import { MapContainer, Marker, Popup, TileLayer, CircleMarker } from 'react-leaflet';
import L from 'leaflet';

import 'leaflet/dist/leaflet.css';

import { getMapCenter, hasValidCoordinates } from '../lib/geo';
import FitBounds from './FitBounds';

// Fix default marker icons for Vite bundling
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function RequestsMap({ items, onSelect, selectedId }) {
  const center = getMapCenter(items);
  const markers = (items ?? []).filter(hasValidCoordinates);
  const positions = markers.map((r) => [r.latitude, r.longitude]);

  return (
    <Paper
      variant="outlined"
      sx={{
        height: { xs: 420, lg: 640 },
        overflow: 'hidden',
        transition: 'box-shadow 180ms ease, transform 180ms ease',
        '&:hover': { boxShadow: 2 },
      }}
    >
      <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography variant="subtitle1">Карта</Typography>
        <Typography variant="caption" color="text.secondary">
          Маркеры отображают обращения (по текущим фильтрам)
        </Typography>
      </Box>

      <Box sx={{ height: 'calc(100% - 56px)', position: 'relative' }}>
        {/* Small skeleton overlay to make map mount feel less "jumpy" */}
        <Skeleton
          variant="rectangular"
          animation="wave"
          sx={{ position: 'absolute', inset: 0, zIndex: 0 }}
        />
        <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%', zIndex: 1 }} scrollWheelZoom>
          <FitBounds positions={positions} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {markers.map((r) => (
            <Marker key={r.id} position={[r.latitude, r.longitude]}>
              <Popup>
                <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                  #{r.id} — {r.category}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  {r.address}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                  Статус: {r.status}
                </Typography>
                <Typography
                  component="button"
                  onClick={() => onSelect?.(r)}
                  style={{
                    cursor: 'pointer',
                    border: 0,
                    padding: '6px 10px',
                    borderRadius: 10,
                    background: 'rgba(37, 99, 235, 0.12)',
                    color: '#1d4ed8',
                    fontWeight: 600,
                  }}
                >
                  Открыть карточку
                </Typography>
              </Popup>
              {selectedId != null && r.id === selectedId ? (
                <CircleMarker
                  center={[r.latitude, r.longitude]}
                  radius={16}
                  pathOptions={{ color: '#1976d2', weight: 2, fillOpacity: 0.08 }}
                />
              ) : null}
            </Marker>
          ))}
        </MapContainer>
      </Box>
    </Paper>
  );
}
