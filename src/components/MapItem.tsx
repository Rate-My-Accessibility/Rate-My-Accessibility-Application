'use client';

import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import MarkerItem from '@/components/MarkerItem'; 
import { Elevator } from '@prisma/client';
import MarkerClusterGroup from "react-leaflet-cluster";
import { FaElevator } from "react-icons/fa6";
import L from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';

const CLUSTER_SIZE = 36;

const createElevatorClusterIcon = () => {
  const html = renderToStaticMarkup(
    <div className="elevator-cluster">
      <FaElevator size={18} />
    </div>
  );

  return L.divIcon({
    html,
    className: '', // Keeps Leaflet's default white box away, just like your single icon
    iconSize: [CLUSTER_SIZE, CLUSTER_SIZE],
    iconAnchor: [CLUSTER_SIZE / 2, CLUSTER_SIZE / 2],
  });
};

type MapItemProps = {
  elevators: Elevator[];
  onSelect: (elevator: Elevator) => void;
};

const MapItem = ({ elevators, onSelect } : MapItemProps) => {

  return (
    <MapContainer
      center={[21.2969, -157.8183]}
      zoom={16}
      scrollWheelZoom
      style={{ height: '100%', width: '100%' }}
    >
      
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxNativeZoom={19}
        maxZoom={20}
      />

      <MarkerClusterGroup
        chunkedLoading
        disableClusteringAtZoom={19}
        iconCreateFunction={createElevatorClusterIcon}
      >
        {elevators.map((item) =>
          <MarkerItem key={item.id} elevator={item} onSelect={onSelect}/>
        )}        
      </MarkerClusterGroup>

    </MapContainer>
  );
}

export default MapItem
