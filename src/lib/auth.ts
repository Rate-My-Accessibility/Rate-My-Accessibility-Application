import NextAuth, { type DefaultSession } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import { prisma } from './prisma';

declare module 'next-auth' {
  interface Session {
    user: { role?: string } & DefaultSession['user'];
  }
  interface User {
    role?: string;
    passwordVersion?: number;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: string;
    passwordVersion?: number;
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
          typeof credentials?.email !== 'string' ||
          typeof credentials?.password !== 'string' || credentials.password.length > 1024
        ) return null;
        const email = credentials.email.trim().toLowerCase();
        if (email.length > 254 || !/^[^\s@]+@hawaii\.edu$/.test(email)) return null;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user?.emailVerified || !(await bcrypt.compare(credentials.password, user.password))) return null;
        return {
          id: String(user.id),
          email: user.email,
          name: user.email,
          role: user.role,
          passwordVersion: user.passwordVersion,
        };
      },
    }),
  ],
  pages: { signIn: '/auth/signin', signOut: '/auth/signout' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.role = user.role;
        token.passwordVersion = user.passwordVersion;
        return token;
      }
      const id = Number(token.sub);
      if (!Number.isSafeInteger(id) || id <= 0 || typeof token.passwordVersion !== 'number') return null;
      const current = await prisma.user.findUnique({
        where: { id },
        select: { passwordVersion: true, emailVerified: true, role: true },
      });
      if (!current?.emailVerified || current.passwordVersion !== token.passwordVersion) return null;
      token.role = current.role;
      return token;
    },
    session({ session, token }) {
      return { ...session, user: { ...session.user, role: token.role } };
    },
  },
});
