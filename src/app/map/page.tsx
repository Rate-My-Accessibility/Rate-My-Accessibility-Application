

import { loggedInProtectedPage } from '@/lib/page-protection';
import { auth } from '@/lib/auth';
import CampusMap from '@/components/CampusMap';
import { prisma } from '@/lib/prisma';

const MapPage = async () => {
    // Protect the page, only logged in users can access it.
    const session = await auth();
    loggedInProtectedPage(
        session as {
        user: { email: string; id: string; name: string };
        } | null,
    );
    const elevators = await prisma.elevator.findMany({
        where: {}
    })
    
    return (
        <CampusMap elevators={elevators}/>  
    );
}

export default MapPage;
