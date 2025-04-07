import { UserEntity } from '@/lib/typeorm/entities/user.entity';
import * as JWT from 'jsonwebtoken';
import { ICustomError, REFRESH_ACCESS_TOKEN_ERROR } from '../custom-error';
import { Providers } from '../enums';
import { parseExpiresInToSeconds } from '../utils';

interface IGeneratedTokens {
  accessToken: string;
  accessTokenExpires: number;
  refreshToken: string;
  provider: Providers.CREDENTIALS;
  error?: ICustomError;
}

export const refreshAccessToken = async (
  refreshToken: string,
  provider: Providers,
  audience: string = '',
): Promise<Partial<IGeneratedTokens>> => {
  let newTokens: Partial<IGeneratedTokens> = { error: undefined };

  if (provider === Providers.GOOGLE) {
    newTokens = await refreshGoogleAccessToken(refreshToken);
  } else {
    newTokens = await refreshCredentialsAccessToken(refreshToken, audience);
  }
  return newTokens;
};

export async function refreshGoogleAccessToken(
  refreshToken: string,
): Promise<Partial<IGeneratedTokens>> {
  let newTokens: Partial<IGeneratedTokens> = { error: undefined };
  try {
    const url = new URL('https://oauth2.googleapis.com/token');
    url.searchParams.append('client_id', process.env.GOOGLE_CLIENT_ID || '');
    url.searchParams.append(
      'client_secret',
      process.env.GOOGLE_CLIENT_SECRET || '',
    );
    url.searchParams.append('refresh_token', refreshToken as string);
    url.searchParams.append('grant_type', 'refresh_token');

    const response = await fetch(url.toString(), { method: 'POST' });
    const refreshedTokens = await response.json();

    if (!response.ok) throw refreshedTokens;

    newTokens = {
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Math.floor(
        Date.now() / 1000 + refreshedTokens.expires_in,
      ),
      refreshToken: refreshedTokens.refresh_token ?? refreshToken,
    };
  } catch (error) {
    console.error('Error refreshing google access token', error);
    newTokens = { error: REFRESH_ACCESS_TOKEN_ERROR };
  }
  return newTokens;
}

export const refreshCredentialsAccessToken = async (
  refreshToken: string,
  audience: string,
): Promise<Partial<IGeneratedTokens>> => {
  let newTokens: Partial<IGeneratedTokens> = { error: undefined };
  const verified = verifyRefreshToken(refreshToken, audience);

  if (!verified) {
    newTokens = { error: REFRESH_ACCESS_TOKEN_ERROR };
  } else {
    newTokens = await generateTokens(verified);
  }

  return newTokens;
};

export const verifyRefreshToken = (token: string, audience: string) => {
  try {
    return JWT.verify(
      token,
      process.env.REFRESH_KEY_SECRET || 'MYREFRESH_KEY_SECRET',
      { issuer: 'battement-d-elles', audience },
    ) as Partial<UserEntity>;
  } catch (error) {
    return null;
  }
};

export const generateTokens = async (
  user: Record<string, any>,
): Promise<IGeneratedTokens> => {
  const { token: accessToken, expires_at: accessTokenExpires } =
    await signAccessToken(user);
  const { token: refreshToken } = await signRefreshToken(user);
  return {
    accessToken,
    accessTokenExpires,
    refreshToken,
    provider: Providers.CREDENTIALS,
  };
};

export const signAccessToken = (payload: Record<string, any>) => {
  return signToken(
    process.env.ACCESS_KEY_SECRET || 'MYACCESS_KEY_SECRET',
    payload,
    '1d',
  );
};

export const signRefreshToken = (payload: Record<string, any>) => {
  return signToken(
    process.env.REFRESH_KEY_SECRET || 'MYREFRESH_KEY_SECRET',
    payload,
    '30d',
  );
};

const signToken = (
  secret: string,
  payload: Record<string, any>,
  expiresIn: string | number,
): Promise<{
  token: string;
  expires_at: number;
}> => {
  return new Promise((resolve, reject) => {
    const options = {
      expiresIn,
      issuer: 'battement-d-elles',
      audience: payload.id,
    } as any;

    // to remove
    delete payload.exp;
    delete payload.iat;
    delete payload.aud;
    delete payload.iss;

    JWT.sign(payload, secret, options, (err, token) => {
      if (err || !token) return reject(err);

      // Calculate expires_at in UNIX timestamp (seconds)
      const now = Math.floor(Date.now() / 1000);
      const durationSeconds =
        typeof expiresIn === 'string'
          ? parseExpiresInToSeconds(expiresIn)
          : expiresIn;

      const expires_at = now + durationSeconds;

      return resolve({ token, expires_at });
    });
  });
};
