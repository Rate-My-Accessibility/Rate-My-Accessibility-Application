'use client';

import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { dynamicMapLayer } from 'esri-leaflet';
import { useEffect } from 'react';

function CampusOverlay() {
  const map = useMap();

  useEffect(() => {
    const layer = dynamicMapLayer({
      url: 'https://map.hawaii.edu/server/rest/services/OneMap_Public/MA_OneMapPublic/MapServer',
      layers: [7003],
    }).addTo(map);

    return () => {
      map.removeLayer(layer);
    };
  }, [map]);

  return null;
}

export default function MapItem() {
  return (
    <MapContainer
      center={[21.2969, -157.8183]}
      zoom={16}
      scrollWheelZoom
      style={{ height: '600px', width: '100%' }}
    >
      
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <CampusOverlay />
    </MapContainer>
  );
}