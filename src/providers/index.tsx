'use client';
import { MiniKit } from '@worldcoin/minikit-js';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';

// Define props for ClientProviders
interface ClientProvidersProps {
  children: ReactNode;
  session?: any; // Simplified session type for now
}

export default function ClientProviders({ children, session }: ClientProvidersProps) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Install MiniKit as per official documentation
    const initializeMiniKit = async () => {
      try {
        // Check if we're in a browser environment
        if (typeof window === 'undefined') {
          setIsReady(true);
          return;
        }

        console.log('🚀 Installing MiniKit...');
        
        // Install MiniKit - this is crucial for World App detection
        MiniKit.install();
        
        // Wait a bit for MiniKit to fully initialize
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Log initialization success
        console.log('✅ MiniKit installed! isInstalled():', MiniKit.isInstalled());
        if (navigator.userAgent.includes('WorldApp')) {
          console.log('📱 Detected World App environment');
        }
        
        setIsReady(true);
      } catch (error) {
        console.error('❌ Error initializing MiniKit:', error);
        // Even if there's an error, we should still render the app
        setIsReady(true);
      }
    };

    // Set a timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      console.warn('⚠️ MiniKit initialization timed out, proceeding anyway');
      setIsReady(true);
    }, 5000); // 5 second timeout

    initializeMiniKit().finally(() => {
      clearTimeout(timeout);
    });

    // Cleanup timeout on unmount
    return () => clearTimeout(timeout);
  }, []);

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        <div className="text-center space-y-lg">
          <div className="w-12 h-12 border-4 border-primary-green border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-body text-text-secondary">Initializing MiniKit...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {children}
    </>
  );
} 