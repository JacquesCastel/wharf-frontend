import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface User {
    jwt: string;
    role: 'admin' | 'client';
    strapiUserId: string | null;
    organizationId: number | null;
    organizationName: string | null;
    clientDocumentId: string | null;
    roleLabel: string | null;
    initials: string | null;
  }

  interface Session {
    user: {
      jwt: string;
      role: 'admin' | 'client';
      strapiUserId: string | null;
      organizationId: number | null;
      organizationName: string | null;
      clientDocumentId: string | null;
      roleLabel: string | null;
      initials: string | null;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    jwt: string;
    role: 'admin' | 'client';
    strapiUserId: string | null;
    organizationId: number | null;
    organizationName: string | null;
    clientDocumentId: string | null;
    roleLabel: string | null;
    initials: string | null;
  }
}
