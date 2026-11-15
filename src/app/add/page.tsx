import { loggedInProtectedPage } from '@/lib/page-protection';
import ReviewButton from '@/components/ReviewButton';
import { auth } from '@/lib/auth';


const AddStuff = async () => {
  // Protect the page, only logged in users can access it.
  
  const session = await auth();
  loggedInProtectedPage(
    session as {
      user: { email: string; id: string; name: string };
    } | null,
  );
  return (
    <main className='h-100 d-flex justify-content-center align-items-center'>
      <ReviewButton />
    </main>
  );
};

export default AddStuff;
