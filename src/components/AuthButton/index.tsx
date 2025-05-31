'use client';
import { Button, LiveFeedback } from '@worldcoin/mini-apps-ui-kit-react';
import { signIn } from 'next-auth/react';
import { useCallback, useState } from 'react';

/**
 * This component handles both World ID verification and wallet authentication
 * World ID verification must be completed before wallet authentication
 */
export const AuthButton = () => {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = useCallback(async () => {
    try {
      setIsPending(true);
      setError(null);
      
      // Sign in with World ID using OIDC
      await signIn('worldid', { callbackUrl: '/home' });
    } catch (error) {
      console.error('Authentication error:', error);
      setError('Authentication failed: Please try again');
    } finally {
      setIsPending(false);
    }
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      <LiveFeedback
        label={{
          failed: 'Failed to authenticate',
          pending: 'Verifying with World ID',
          success: 'Authenticated',
        }}
        state={isPending ? 'pending' : undefined}
      >
        <Button
          onClick={handleSignIn}
          disabled={isPending}
          size="lg"
          variant="primary"
        >
          Sign in with World ID
        </Button>
      </LiveFeedback>
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};
