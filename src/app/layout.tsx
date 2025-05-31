import ClientProviders from '@/providers';
import type { Metadata } from 'next';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'Noscalp - Event Discovery App',
  description: 'A dark-themed mobile event discovery app with WorldID integration',
  manifest: '/manifest.json',
  other: {
    'worldcoin:enable-minikit': 'true',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // TODO: Add session management when WorldID is fully configured
  // const session = await auth();

  return (
    <html lang="en">
      <body className="bg-bg-primary text-text-primary min-h-screen font-sans">
        <ClientProviders>
          <div className="max-w-[400px] mx-auto bg-bg-primary min-h-screen">
            {children}
          </div>
        </ClientProviders>
      </body>
    </html>
  );
} 