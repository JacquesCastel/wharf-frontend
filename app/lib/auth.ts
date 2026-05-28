import { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Mot de passe', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // Try Strapi admin login first
        const adminRes = await fetch(`${process.env.STRAPI_URL}/admin/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: credentials.email, password: credentials.password }),
        });

        if (adminRes.ok) {
          const { data } = await adminRes.json();
          const firstname = data.user.firstname ?? '';
          const lastname = data.user.lastname ?? '';
          return {
            id: String(data.user.id),
            email: data.user.email,
            name: `${firstname} ${lastname}`.trim() || data.user.email,
            jwt: data.token,
            role: 'admin' as const,
            strapiUserId: null,
            organizationId: null,
            organizationName: null,
            clientDocumentId: null,
            roleLabel: 'Wharf',
            initials: (firstname[0] ?? 'W').toUpperCase(),
          };
        }

        // Fall back to client login
        const clientRes = await fetch(`${process.env.STRAPI_URL}/api/auth/local`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identifier: credentials.email, password: credentials.password }),
        });

        if (!clientRes.ok) return null;

        const { jwt, user } = await clientRes.json();

        const profileRes = await fetch(
          `${process.env.STRAPI_URL}/api/users/me?populate[client][fields][0]=id&populate[client][fields][1]=documentId&populate[client][fields][2]=nom`,
          { headers: { Authorization: `Bearer ${jwt}` } }
        );
        const profile = profileRes.ok ? await profileRes.json() : user;

        return {
          id: String(user.id),
          email: user.email,
          name: profile.display_name || user.username,
          jwt,
          role: 'client' as const,
          strapiUserId: String(user.id),
          organizationId: profile.client?.id ?? null,
          organizationName: profile.client?.nom ?? null,
          clientDocumentId: profile.client?.documentId ?? null,
          roleLabel: profile.role_label ?? null,
          initials: profile.initials ?? null,
        };
      },
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.jwt = user.jwt;
        token.role = user.role;
        token.strapiUserId = user.strapiUserId;
        token.organizationId = user.organizationId;
        token.organizationName = user.organizationName;
        token.clientDocumentId = user.clientDocumentId;
        token.roleLabel = user.roleLabel;
        token.initials = user.initials;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.jwt = token.jwt as string;
      session.user.role = token.role as 'admin' | 'client';
      session.user.strapiUserId = token.strapiUserId as string | null;
      session.user.organizationId = token.organizationId as number | null;
      session.user.organizationName = token.organizationName as string | null;
      session.user.clientDocumentId = token.clientDocumentId as string | null;
      session.user.roleLabel = token.roleLabel as string | null;
      session.user.initials = token.initials as string | null;
      return session;
    },
  },
  pages: { signIn: '/login' },
};
