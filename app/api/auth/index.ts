import { getUserRepository } from '@/app/helpers/typeorm/datasrc';
import NextAuth, { NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

const users = [
  {
    email: 'mehdicheref@gmail.com',
    password: '%PitchouX',
  },
  {
    email: 'mehdi@gmail.com',
    password: 'cdsdgdsfds',
  },
];

const getUserByEmail = (email: string = '') =>
  users.find((em) => em.email === email);

export const authOptions: NextAuthConfig = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
    CredentialsProvider({
      async authorize(credentials) {
        let user = null;
        const userRepo = await getUserRepository();
        const users = await userRepo.find();
        console.log({ users });
        try {
          user = getUserByEmail(credentials?.email as string);
        } catch (error) {
          return null;
        }
        if (!user || credentials.password !== user.password) {
          return null;
        }
        return user;
      },
    }),
  ],
  session: { strategy: 'jwt' },
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async jwt({ token }) {
      return token;
    },
    async session({ session, token }) {
      return { ...session, token };
    },
  },
  trustHost: true,
};

export const { auth, signIn, signOut, handlers } = NextAuth(authOptions);
