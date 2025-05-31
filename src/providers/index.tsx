'use client';
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
    // Initialize any client-side setup here
    setIsReady(true);
  }, []);

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        <div className="text-center space-y-lg">
          <div className="w-12 h-12 border-4 border-primary-green border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-body text-text-secondary">Loading...</p>
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