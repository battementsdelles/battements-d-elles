import type { Metadata } from 'next';
import { SessionProvider } from 'next-auth/react';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Create Next App',
  description: `L'association Les Battements d'Elles accompagne les femmes en traitement et post-traitement pendant un an 
  (chimiothérapie, immunothérapie, radiothérapie, mastectomie) contre tous les cancers, à se reconstruire, à retrouver 
  un équilibre de vie, une estime de soi au travers d'activités créatives, culturelles et sportives adaptées et de bien être. `,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="autumn">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
