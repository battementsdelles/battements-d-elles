import { auth } from '@/app/api/auth';
import { redirect } from 'next/navigation';

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (session !== null) redirect('/');

  return <>{children}</>;
}
