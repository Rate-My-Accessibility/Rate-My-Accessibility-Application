import NextAuth, { type DefaultSession } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import { prisma } from './prisma';
import { HawaiiEmailSchema } from './validationSchemas';

declare module 'next-auth' {
  interface Session {
    user: { role?: string } & DefaultSession['user'];
  }
  interface User {
    role?: string;
  }
}

export const { auth, signIn, signOut, handlers } = NextAuth({
  session: { strategy: 'jwt' },
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'you@hawaii.edu' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (
          !credentials ||
          typeof credentials.email !== 'string' ||
          typeof credentials.password !== 'string' ||
          credentials.password.length > 1024
        ) return null;

        let email: string;
        try {
          email = await HawaiiEmailSchema.validate(credentials.email);
        } catch {
          return null;
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.emailVerified || typeof user.password !== 'string') return null;
        if (!(await bcrypt.compare(credentials.password, user.password))) return null;

        return { id: String(user.id), email: user.email, name: user.email, role: user.role };
      },
    }),
  ],
  pages: { signIn: '/auth/signin', signOut: '/auth/signout' },
  callbacks: {
    session({ session, token }) {
      return {
        ...session,
        user: { ...session.user, role: typeof token.role === 'string' ? token.role : undefined },
      };
    },
    jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },
  },
});
