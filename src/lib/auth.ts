
import NextAuth, { type DefaultSession } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { prisma } from './prisma';
import bcrypt from 'bcrypt';

declare module 'next-auth' {
  interface Session {
    user: {
      role?: string;
    } & DefaultSession['user'];
  }
}

// Export v5 handlers and helpers
export const { auth, signIn, signOut, handlers } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'john@foo.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // Validate credentials
        if (
          !credentials ||
          typeof credentials.email !== 'string' ||
          typeof credentials.password !== 'string'
        ) {
          return null;
        }

        const email = credentials.email.trim().toLowerCase();

        // Only allow @hawaii.edu email addresses
        const emailRegex = /^[^\s@]+@hawaii\.edu$/;

        if (!emailRegex.test(email)) {
          return null;
        }

        // Find user in database
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || typeof user.password !== 'string') {
          return null;
        }

        // Verify password
        const isValid = await bcrypt.compare(
          credentials.password,
          user.password,
        );

        if (!isValid) {
          return null;
        }

        // Return authenticated user
        return {
          id: user.id.toString(),
          email: user.email,
          name: user.email,
          role: user.role,
        };
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
  },
  callbacks: {
    session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          role: (token as { role?: string }).role,
        },
      };
    },
    jwt({ token, user }) {
      // user is type: { id?: string; email?: string; name?: string; role?: string }
      if (user && typeof (user as { role?: string }).role === 'string') {
        token.role = (user as { role?: string }).role;
      }
      return token;
    },
  },
});
