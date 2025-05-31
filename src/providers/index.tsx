'use client';
import { MiniKit, ResponseEvent } from '@worldcoin/minikit-js';
import { MiniKitProvider } from '@worldcoin/minikit-js/minikit-provider';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import dynamic from 'next/dynamic';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';

const ErudaProvider = dynamic(
  () => import('@/providers/Eruda').then((c) => c.ErudaProvider),
  { ssr: false },
);

// Define props for ClientProviders
interface ClientProvidersProps {
  children: ReactNode;
  session: Session | null; // Use the appropriate type for session from next-auth
}

function MiniKitInitializer({ children }: { children: ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initMiniKit = async () => {
      try {
        await MiniKit.install();
        
        // Add event handlers for permissions using subscribe
        MiniKit.subscribe(ResponseEvent.MiniAppGetPermissions, (payload) => {
          console.log('Received permissions:', payload);
          // Return the payload as is since it's already in the correct format
          return payload;
        });

        console.log('MiniKit initialized successfully');
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize MiniKit:', error);
      }
    };

    initMiniKit();

    // Cleanup function
    return () => {
      // Unsubscribe from events when component unmounts
      MiniKit.unsubscribe(ResponseEvent.MiniAppGetPermissions);
    };
  }, []);

  if (!isInitialized) {
    return <div>Loading MiniKit...</div>;
  }

  return <>{children}</>;
}

/**
 * ClientProvider wraps the app with essential context providers.
 *
 * - ErudaProvider:
 *     - Should be used only in development.
 *     - Enables an in-browser console for logging and debugging.
 *
 * - MiniKitProvider:
 *     - Required for MiniKit functionality.
 *     - Initializes MiniKit on mount
 *
 * This component ensures both providers are available to all child components.
 */
export default function ClientProviders({
  children,
  session,
}: ClientProvidersProps) {
  return (
    <ErudaProvider>
      <MiniKitProvider>
        <MiniKitInitializer>
          <SessionProvider session={session}>{children}</SessionProvider>
        </MiniKitInitializer>
      </MiniKitProvider>
    </ErudaProvider>
  );
}
