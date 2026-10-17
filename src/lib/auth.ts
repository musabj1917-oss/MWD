import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: 'user', 
        };
      },
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'admin@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const userResults = await db.select().from(users).where(eq(users.email, credentials.email)).limit(1);
        const user = userResults[0];

        if (!user || !user.passwordHash) {
          return null; 
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.passwordHash);

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: String(user.id),
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, profile }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || 'user'; 
      }
      if (token.email) {
          const dbUser = await db.select({ role: users.role }).from(users).where(eq(users.email, token.email)).limit(1);
          if (dbUser.length > 0) {
              token.role = (dbUser as any)[0].role;
          }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
        if (account?.provider === 'google') {
            const email = user.email;
            if (!email) return false;

            const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
            if ((existingUser as any).length === 0) {
                 await db.insert(users).values({
                    email: email,
                    name: user.name,
                    image: user.image,
                    role: 'user'
                });
            }
        }
        return true;
    }
  },
  pages: {
    signIn: '/admin/login', 
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.AUTH_SECRET,
};
