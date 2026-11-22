'use client';

import dynamic from 'next/dynamic';
import { Elevator, Review } from '@prisma/client';
import { useState } from "react";
import MapSidebar from '@/components/MapSidebar';

const MapItem = dynamic(() => import('@/components/MapItem'), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
});

const CampusMap = ({ elevators, reviews } : { elevators : Elevator[]; reviews: Review[]}) => {
    const [selected, setSelected] = useState<Elevator | null>(null);
    const [lastSelected, setLastSelected] = useState<Elevator | null>(null);
    const SIDEBAR_WIDTH = 320;
    const GAP = 10;

    const select = (elevator : Elevator | null) => {
        if (elevator) setLastSelected(elevator);
        setSelected(elevator);
    };

    return (
        <div 
        className={`map-wrapper ${selected ? "sidebar-open" : ""}`}
        style={{ position: "relative", height: "100%", width: "100%" }}
        >
            <MapItem elevators={elevators} onSelect={select}/>     
            <aside
                className="map-sidebar"
                style={{
                position: "absolute",
                top: GAP,
                left: GAP,
                bottom: GAP,
                width: SIDEBAR_WIDTH,
                zIndex: 1000,
                borderRadius: 8,
                background: "white",
                boxShadow: "0 1px 5px rgba(0,0,0,.4)",
                overflowY: "auto",
                transform: selected ? "translateX(0)" : `translateX(calc(-100% - ${GAP}px))`,
                transition: "transform 0.25s ease",
                }}
            >
                {/* <button onClick={() => setSelected(null)}>Close</button> */}
                {selected && (
                    <MapSidebar
                        elevator={lastSelected}
                        reviews={reviews}
                        onClose={() => select(null)}
                    />
                )}
            </aside> 
        </div>
        
    );
}

export default CampusMap;