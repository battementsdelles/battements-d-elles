'use server';
import { auth, signIn, signOut } from '@/app/api/auth';
import { getUserRepository } from '@/lib/typeorm/datasrc';
import { ILoginDto } from '../zod/schemas/auth';

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
  const session = await auth();

  if (session?.user) {
    const [UserRepository] = await getUserRepository();
    const user = await UserRepository.findOne({
      where: { email: session.user.email },
    });

    if (user) {
      user.accessToken = null;
      user.refreshToken = null;
      user.accessTokenExpires = 0;
      await UserRepository.save(user);
    }
  }
  await signOut({ redirectTo: '/login' });
};
