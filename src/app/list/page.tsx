import { Col, Container, Row } from 'react-bootstrap';
import { prisma } from '@/lib/prisma';
import ReviewCard from '@/components/ReviewCard';
import { loggedInProtectedPage } from '@/lib/page-protection';
import { auth } from '@/lib/auth';

/** Render a list of stuff for the logged in user. */
const ListPage = async () => {
  // Protect the page, only logged in users can access it.
  const session = await auth();
  loggedInProtectedPage(
    session as {
      user: { email: string; id: string; name: string };
    } | null,
  );
  const owner = (session && session.user && session.user.email) || '';
  const review = await prisma.review.findMany({
    where: {
      owner,
    },
    orderBy: {
      createdAt: "desc",
    }
  });
  // console.log(stuff);
  return (
    <main>
      <Container id="list" fluid className="py-3">
        <Container>
          <Row>
            <Col>
              <h1 className='text-center'>Reviews</h1>
              <Row xs={1} className="g-4">
                {review.map((item) =>
                  <Col key={item.id}>
                    <ReviewCard review={item}/>
                  </Col>
                )}
              </Row>            
            </Col>
          </Row>  
        </Container>
      </Container>
    </main>
  );
};

export default ListPage;
