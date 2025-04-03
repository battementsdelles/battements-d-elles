'use server';
import { signIn, signOut } from '@/app/api/auth';
import { ILoginDto } from '../helpers/zod/schemas/auth';

export const googleSignIn = async () => {
  await signIn('google', { redirectTo: '/' });
};

export const credentialsSignIn = async (data: ILoginDto) => {
  let result = { response: undefined };
  try {
    result.response = await signIn('credentials', { redirect: false, ...data });
  } catch (error) {
    console.log({ error });
  }
  return result;
};

export const logOut = async () => {
  await signOut({ redirectTo: '/login' });
};
