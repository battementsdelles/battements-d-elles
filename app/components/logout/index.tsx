import { auth } from '@/app/api/auth';
import Image from 'next/image';
import SignOutBtn from '../sign-out-btn';

import { redirect } from 'next/navigation';

const LogOut = async () => {
  const session = await auth();

  if (session === null) redirect('/login');
  return (
    <>
      {session?.user && (
        <>
          <p>You are signed in as : {session.user.email} </p>
          {session.user.image && (
            <Image
              src={session.user.image}
              alt={session.user.email || ''}
              width={80}
              height={80}
              className="rounded-full"
            />
          )}
        </>
      )}

      <SignOutBtn></SignOutBtn>
    </>
  );
};

export default LogOut;
