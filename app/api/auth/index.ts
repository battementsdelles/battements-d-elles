import { getUserRepository } from '@/lib/helpers/typeorm/datasrc';
import { ILoginDto } from '@/lib/helpers/zod/schemas/auth';
import * as bcrypt from 'bcrypt';
import NextAuth, { NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

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
        const { email, password } = credentials as ILoginDto;
        let user = null;

        try {
          const [UserRepository] = await getUserRepository();
          user = await UserRepository.findOne({
            where: { email },
          });

          if (!user || !bcrypt.compareSync(password, user.password)) {
            return null;
          }
        } catch (error) {
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
