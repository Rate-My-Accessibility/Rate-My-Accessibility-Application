import { Col, Container, Row } from 'react-bootstrap';
import { prisma } from '@/lib/prisma';
// import StuffItem from '@/components/StuffItem';
import FeatureCard from '@/components/FeatureCard';

/** Render a list of elevators for the logged in user. */
const ListPage = async () => {
  // const stuff = await prisma.stuff.findMany({
  //   where: {
  //     owner,
  //   },
  // });
  // console.log(stuff);
  const features = await prisma.feature.findMany({
    orderBy: { name: "asc" },
    include: {
      featuredPhotos: { where: { priority: 1 }, take: 1 },
      _count: { select: { reviews: true } }
    }
    
  });
  // console.log(features);
  return (
    <main>
      <Container id="list" fluid className="py-3">
        <h1>Features</h1>
        <Row>
          {features.map((feature) => (
            <FeatureCard
              key={feature.id}
              name={feature.name}
              accessScore={feature.accessScore}
              reviewCount={feature._count.reviews}
              image={feature.featuredPhotos[0] ?? null}
            />
          ))}
        </Row>
      </Container>
    </main>
  );
};

export default ListPage;
