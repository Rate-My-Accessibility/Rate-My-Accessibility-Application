import { loggedInProtectedPage } from '@/lib/page-protection';
import { auth } from '@/lib/auth';
import AddSuggestion from '@/components/AddSuggestion';

const AddStuff = async () => {
  // Protect the page, only logged in users can access it.
  const session = await auth();
  loggedInProtectedPage(
    session as {
      user: { email: string; id: string; name: string };
    } | null,
  );
  return (
    <main>
      <AddSuggestion />
    </main>
  );
};

export default AddStuff;
