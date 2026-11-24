

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
    const reviews = await prisma.review.findMany({
        where: {},
        orderBy: {
            createdAt: "desc",
        }
    });
    
    return (
        <CampusMap elevators={elevators} reviews={reviews}/>  
    );
}

export default MapPage;
