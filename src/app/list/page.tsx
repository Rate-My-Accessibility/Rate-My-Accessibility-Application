import { Col, Container, Row, Table } from 'react-bootstrap';
import { prisma } from '@/lib/prisma';
// import StuffItem from '@/components/StuffItem';
import { loggedInProtectedPage } from '@/lib/page-protection';
import { auth } from '@/lib/auth';
import ElevatorCard from '@/components/ElevatorCard';

/** Render a list of elevators for the logged in user. */
const ListPage = async () => {
  // Protect the page, only logged in users can access it.
  const session = await auth();
  loggedInProtectedPage(
    session as {
      user: { email: string; id: string; name: string };
    } | null,
  );
  const owner = (session && session.user && session.user.email) || '';
  const elevators = await prisma.elevator.findMany({
    where: {}
  })
  const scores = elevators.map(async (elevator) => {
    const ratings = await prisma.elevatorRating.findMany({
      where: { elevatorName: elevator.name}
    });
    if (ratings.length === 0) {
      return [];
    }
    const averaged = [0, 0, 0, 0, 0, 0]
    return averaged.map((_, i) => {
      return ratings.reduce((acc, rating) => acc + rating.scores[i], 0) / ratings.length;
    });
  })
  // const stuff = await prisma.stuff.findMany({
  //   where: {
  //     owner,
  //   },
  // });
  // console.log(stuff);
  return (
    <main>
      <Container id="list" fluid className="py-3 justify-content-center align-items-center">
        <Row>
          <Col>
            <h1>Elevators</h1>
            </Col>
        </Row>
        <Row>
            {elevators.map(async (elevator, i) => (
              <ElevatorCard key = {elevator.name} {...elevator} scores={await scores[i]} />
            ))}
        </Row>
      </Container>
    </main>
  );
};

export default ListPage;
