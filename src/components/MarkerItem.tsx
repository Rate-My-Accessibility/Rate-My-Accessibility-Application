'use client';

import { Marker, Popup } from 'react-leaflet';
import { Elevator } from '@prisma/client';
import { FaElevator } from "react-icons/fa6";
import L from 'leaflet';
import { renderToString } from 'react-dom/server';

const SIZE = 24;

const elevatorIcon = L.divIcon({
    html: renderToString(<FaElevator size={SIZE}/>),
    className: "",
    iconSize: [SIZE, SIZE],
    iconAnchor: [SIZE/2, SIZE/2]
})

type MarkerItemProps = {
  elevator: Elevator;
  onSelect: (elevator: Elevator) => void;
};

const MarkerItem = ({ elevator, onSelect } : MarkerItemProps ) => {

    return (
        <>
            <Marker 
            position={[elevator.latitude, elevator.longitude]} 
            icon={elevatorIcon}
            eventHandlers={{ click: () => onSelect(elevator)}}
            >

            </Marker>      
        </>

    )
    
}

export default MarkerItem