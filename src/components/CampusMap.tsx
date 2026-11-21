'use client';

import dynamic from 'next/dynamic';
import { Elevator } from '@prisma/client';
import { useState } from "react";

const MapItem = dynamic(() => import('@/components/MapItem'), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
});

const CampusMap = ({ elevators } : { elevators : Elevator[]}) => {
    const [selected, setSelected] = useState<Elevator | null>(null);
    const SIDEBAR_WIDTH = 320;
    const GAP = 10;

    return (
        <div 
        className={`map-wrapper ${selected ? "sidebar-open" : ""}`}
        style={{ position: "relative", height: "100%", width: "100%" }}
        >
            <MapItem elevators={elevators} onSelect={setSelected}/>     
            <aside
                className="map-sidebar"
                style={{
                position: "absolute",
                top: GAP,
                left: GAP,
                bottom: GAP,
                width: SIDEBAR_WIDTH,
                zIndex: 1000,
                background: "white",
                borderRadius: 8,
                boxShadow: "0 1px 5px rgba(0,0,0,.4)",
                overflowY: "auto",
                padding: 16,
                transform: selected ? "translateX(0)" : `translateX(calc(-100% - ${GAP}px))`,
                transition: "transform 0.25s ease",
                }}
            >
                <button onClick={() => setSelected(null)}>Close</button>
                {selected && (
                    <>
                        <h2>{selected.location}</h2>
                        {/* reviews, photos, add-review form, etc. */}
                    </>
                )}
            </aside> 
        </div>
        
    );
}

export default CampusMap;