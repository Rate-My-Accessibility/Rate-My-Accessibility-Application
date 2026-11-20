'use client';

import dynamic from 'next/dynamic';

const MapItem = dynamic(() => import('@/components/MapItem'), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
});

const CampusMap = () => {

    return (
        <MapItem />  
    );
}

export default CampusMap;