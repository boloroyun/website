import { auth } from '@/lib/auth';
import CrispClient from './CrispClient';

interface CrispUser {
  id: string | null;
  email: string | null;
  name: string | null;
  role: string | null;
}

export default async function CrispProvider() {
  try {
    const session = await auth();

    const user: CrispUser = {
      id: session?.user?.id ?? null,
      email: session?.user?.email ?? null,
      name: session?.user?.name ?? null,
      role: (session?.user as any)?.role ?? null,
    };

    return <CrispClient user={user} />;
  } catch (error) {
    console.error('Failed to fetch session for Crisp:', error);

    // Fallback to anonymous user
    const fallbackUser: CrispUser = {
      id: null,
      email: null,
      name: null,
      role: null,
    };

    return <CrispClient user={fallbackUser} />;
  }
}
