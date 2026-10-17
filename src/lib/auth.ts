import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { createHash, timingSafeEqual } from 'crypto';

// Compare two strings without leaking their length or content through timing.
function safeEqual(a: string, b: string) {
  const ha = createHash('sha256').update(a).digest();
  const hb = createHash('sha256').update(b).digest();
  return timingSafeEqual(ha, hb);
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // The single admin account lives in environment variables (ADMIN_EMAIL / ADMIN_PASSWORD).
        // If either is missing, nobody can sign in.
        const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
        const adminPassword = process.env.ADMIN_PASSWORD;
        if (!adminEmail || !adminPassword) return null;
        if (!credentials?.email || !credentials?.password) return null;

        const emailOk = safeEqual(credentials.email.trim().toLowerCase(), adminEmail);
        const passwordOk = safeEqual(credentials.password, adminPassword);
        if (!emailOk || !passwordOk) return null;

        return { id: 'admin', email: adminEmail, name: 'Admin', role: 'admin' };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role || 'user';
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: '/admin/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24 * 7, // stay signed in for 7 days
  },
  secret: process.env.AUTH_SECRET,
};
