'use client';
import { useCallback, useState } from 'react';

/**
 * This component handles WorldID authentication
 * Uses existing design system instead of WorldID UI components for compatibility
 */
export const AuthButton = () => {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = useCallback(async () => {
    try {
      setIsPending(true);
      setError(null);
      
      // For now, simulate authentication until WorldID is fully configured
      setTimeout(() => {
        localStorage.setItem('isAuthenticated', 'true');
        window.location.href = '/';
      }, 2000);
      
      // TODO: Replace with actual WorldID authentication
      // await signIn('worldid', { callbackUrl: '/home' });
    } catch (error) {
      console.error('Authentication error:', error);
      setError('Authentication failed: Please try again');
    } finally {
      setIsPending(false);
    }
  }, []);

  return (
    <div className="flex flex-col items-center gap-lg">
      <button
        onClick={handleSignIn}
        disabled={isPending}
        className="btn-primary w-full"
      >
        <div className="flex items-center justify-center gap-sm">
          <div className="w-6 h-6 bg-text-on-primary rounded-md flex items-center justify-center">
            <svg className="w-4 h-4 text-primary-green" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          {isPending ? 'Verifying with World ID...' : 'Authorize with WorldID'}
        </div>
      </button>
      {error && (
        <p className="text-caption text-status-error">{error}</p>
      )}
    </div>
  );
}; 