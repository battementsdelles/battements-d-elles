import { ICustomError } from '@/lib/helpers/custom-error';
import { Providers } from '@/lib/helpers/enums';
import { DefaultUser } from 'next-auth';
import { DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user?: {
      email: string;
      id: string;
      image?: string;
      username: string;
      isActive: boolean;
    };
    tokens?: {
      accessToken: string | null;
      refreshToken: string | null;
      accessTokenExpires: number | null;
      provider: Providers;
      error: string;
    };
    error?: ICustomError;
  }

  interface User extends DefaultUser {
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
    provider: Providers;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    user?: {
      email: string;
      id: string;
      image?: string;
      username: string;
      isActive: boolean;
    };
    accessToken: string | null;
    refreshToken: string | null;
    accessTokenExpires: number | null;
    error?: ICustomError;
    provider: Providers;
  }
}
