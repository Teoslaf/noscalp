import { MiniKit } from '@worldcoin/minikit-js';
import { ReactNode, useEffect, useState } from 'react';

export const MiniKitInitializer = ({ children }: { children: ReactNode }) => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeMiniKit = async () => {
      if (isInitialized) return;

      try {
        // Install MiniKit with the app ID
        await MiniKit.install(process.env.NEXT_PUBLIC_WORLD_APP_ID || '');
        
        // Verify installation
        const isInstalled = await MiniKit.isInstalled();
        if (!isInstalled) {
          throw new Error('MiniKit installation verification failed');
        }

        console.log('MiniKit initialized and verified successfully');
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize MiniKit:', error);
        // Retry initialization after a delay
        setTimeout(() => {
          setIsInitialized(false);
        }, 2000);
      }
    };

    initializeMiniKit();
  }, [isInitialized]);

  // Show loading state while initializing
  if (!isInitialized) {
    return <div>Loading MiniKit...</div>;
  }

  return <>{children}</>;
}; 