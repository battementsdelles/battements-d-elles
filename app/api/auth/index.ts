import {
  DB_CONNECTION_ERROR,
  USER_NOT_FOUND_IN_DB,
} from '@/lib/helpers/custom-error';
import { Providers } from '@/lib/helpers/enums';
import { generateTokens, refreshAccessToken } from '@/lib/helpers/jwt';
import { getUserRepository } from '@/lib/typeorm/datasrc';
import { ILoginDto } from '@/lib/zod/schemas/auth';
import * as bcrypt from 'bcrypt';
import { instanceToPlain } from 'class-transformer';
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
        try {
          const { email, password } = credentials as ILoginDto;
          const [UserRepository] = await getUserRepository();

          let user = await UserRepository.findOne({
            where: { email },
          });

          if (!user || !bcrypt.compareSync(password, user.password)) {
            return null;
          }

          const PlainUser = instanceToPlain(user);
          const tokens = await generateTokens(PlainUser);

          user.accessToken = tokens.accessToken;
          user.accessTokenExpires = tokens.accessTokenExpires;
          user.refreshToken = tokens.refreshToken;

          await UserRepository.save(user);

          return { ...PlainUser, ...tokens };
        } catch (error) {
          return null;
        }
      },
    }),
  ],
  session: { strategy: 'jwt' },
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async jwt({ token, account, user }) {
      try {
        const [UserRepository] = await getUserRepository();
        const userEmail = user?.email || token?.email;

        let userInDB = await UserRepository.findOne({
          where: { email: userEmail || '' },
        });

        if (
          user &&
          account &&
          account.provider === Providers.GOOGLE &&
          userInDB === null
        ) {
          // JWT callback is triggered after GOOGLE OAuthConfig.profile callback
          // user perform Login for the first time
          // Save user in DB
          userInDB = UserRepository.create({
            email: user.email as string,
            username: user.name as string,
            provider: account.provider,
            accessToken: account.access_token as string,
            refreshToken: account.refresh_token as string,
            accessTokenExpires: account.expires_at as number,
          });
          userInDB = await UserRepository.save(userInDB);
        }

        if (userInDB) {
          if (user) {
            // JWT callback is triggered after OAuthConfig.profile or the CredentialsConfig.authorize callback
            if (account && account.provider === Providers.GOOGLE) {
              userInDB.accessToken = account.access_token as string;
              userInDB.refreshToken = account.refresh_token as string;
              userInDB.accessTokenExpires = account.expires_at as number;
              userInDB = await UserRepository.save(userInDB);
            }
          }

          token.accessToken = userInDB.accessToken;
          token.refreshToken = userInDB.refreshToken;
          token.provider = userInDB.provider;
          token.accessTokenExpires = userInDB.accessTokenExpires;
          token.user = instanceToPlain(userInDB) as any;

          const now = Math.floor(Date.now() / 1000);

          if (token.refreshToken && now > token.accessTokenExpires) {
            // Refresh access token if expired
            const newTokens = await refreshAccessToken(
              token.refreshToken,
              token.provider,
              token.sub,
            );

            if (!newTokens.error) {
              userInDB.accessToken = newTokens.accessToken as string;
              userInDB.refreshToken = newTokens.refreshToken as string;
              userInDB.accessTokenExpires =
                newTokens.accessTokenExpires as number;
              userInDB = await UserRepository.save(userInDB);
            }

            token = {
              ...token,
              ...newTokens,
            };
          }
        } else {
          token = { ...token, error: USER_NOT_FOUND_IN_DB };
        }
      } catch (error) {
        console.error('JWT callback DB error:', error);
        token = { ...token, error: DB_CONNECTION_ERROR };
      }

      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: { ...session.user, ...token.user },
        tokens: {
          accessToken: token.accessToken,
          refreshToken: token.refreshToken,
          accessTokenExpires: token.accessTokenExpires,
          provider: token.provider,
        },
        error: token.error,
      };
    },
  },
  trustHost: true,
};

export const { auth, signIn, signOut, handlers } = NextAuth(authOptions);
