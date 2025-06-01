'use client';
import { MiniKit } from '@worldcoin/minikit-js';
import { useCallback, useState, useEffect } from 'react';

// Extend Window interface for MiniKit
declare global {
  interface Window {
    MiniKit?: typeof MiniKit;
  }
}

/**
 * WorldID Wallet Authentication Component
 * Implements the official Wallet Auth flow from Mini Apps documentation
 * Uses Sign in with Ethereum (SIWE) protocol
 */
export const AuthButton = () => {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isWorldApp, setIsWorldApp] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if we're in World App - now that MiniKit.install() is called in providers
    const detectWorldApp = async () => {
      try {
        // Small delay to ensure MiniKit is ready
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Check MiniKit installation
        const isInstalled = MiniKit.isInstalled();
        
        console.log('🔍 AuthButton: MiniKit.isInstalled() =', isInstalled);
        
        setIsWorldApp(isInstalled);
      } catch (error) {
        console.error('Error detecting World App:', error);
        setIsWorldApp(false);
      }
    };

    detectWorldApp();
  }, []);

  const handleWorldIDAuth = useCallback(async () => {
    try {
      setIsPending(true);
      setError(null);

      console.log('🚀 Starting WorldID authentication...');

      // Step 1: Get nonce from backend
      console.log('📡 Fetching nonce from /api/nonce...');
      const nonceResponse = await fetch('/api/nonce');
      
      if (!nonceResponse.ok) {
        throw new Error(`Failed to fetch nonce: ${nonceResponse.status} ${nonceResponse.statusText}`);
      }
      
      const nonceData = await nonceResponse.json();
      console.log('✅ Nonce received:', nonceData);

      if (!nonceData.nonce) {
        throw new Error('No nonce received from server');
      }

      // Step 2: Perform wallet authentication with MiniKit
      console.log('🔐 Starting MiniKit wallet authentication...');
      const result = await MiniKit.commandsAsync.walletAuth({
        nonce: nonceData.nonce,
        requestId: '0', // Optional
        expirationTime: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days
        notBefore: new Date(new Date().getTime() - 24 * 60 * 60 * 1000), // 24 hours ago
        statement: 'Sign in to Noscalp - Discover amazing events with verified identity',
        // Add these for better SIWE compatibility
        chainId: 1, // Ethereum mainnet
        domain: window.location.host,
        uri: window.location.origin,
        version: '1'
      });

      console.log('📋 MiniKit wallet auth result:', result);

      const { commandPayload, finalPayload } = result;

      if (finalPayload.status === 'error') {
        throw new Error(`Wallet authentication failed: ${finalPayload.error_code || 'Unknown error'}`);
      }

      if (finalPayload.status !== 'success') {
        throw new Error(`Unexpected wallet auth status: ${finalPayload.status}`);
      }

      // Log details about the payload for debugging
      console.log('📋 Final payload details:');
      console.log('- Address:', finalPayload.address);
      console.log('- Message preview:', finalPayload.message?.substring(0, 100) + '...');
      console.log('- Signature:', finalPayload.signature?.substring(0, 20) + '...');

      // Step 3: Verify the signature on the backend
      console.log('🔍 Verifying signature on backend...');
      const verificationResponse = await fetch('/api/complete-siwe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payload: finalPayload,
          nonce: nonceData.nonce,
        }),
      });

      console.log('📡 Verification response status:', verificationResponse.status);

      if (!verificationResponse.ok) {
        const errorText = await verificationResponse.text();
        console.error('❌ Verification request failed:', errorText);
        throw new Error(`Verification failed: ${verificationResponse.status} - ${errorText}`);
      }

      const verificationResult = await verificationResponse.json();
      console.log('📋 Verification result:', verificationResult);

      if (verificationResult.isValid) {
        // Authentication successful!
        console.log('🎉 Authentication successful!');
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('walletAddress', verificationResult.address);
        
        // Access username from MiniKit if available
        const username = MiniKit.user?.username;
        
        if (username) {
          localStorage.setItem('username', username);
          console.log('👤 Username stored:', username);
        }

        // Redirect to home page
        console.log('🏠 Redirecting to home...');
        window.location.href = '/';
      } else {
        throw new Error(`Authentication verification failed: ${verificationResult.message || 'Unknown verification error'}`);
      }
    } catch (error) {
      console.error('❌ Authentication error:', error);
      
      // More detailed error messages
      if (error instanceof Error) {
        setError(`Authentication failed: ${error.message}`);
      } else {
        setError('Authentication failed: Unknown error occurred');
      }
    } finally {
      setIsPending(false);
    }
  }, []);

  const handleFallbackAuth = useCallback(async () => {
    try {
      setIsPending(true);
      setError(null);

      // Simulate authentication delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Set fallback authentication data
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('walletAddress', '0x' + Math.random().toString(16).substr(2, 40));
      localStorage.setItem('username', 'dev_user_' + Math.random().toString(36).substr(2, 5));
      
      // Redirect to home page
      window.location.href = '/';
    } catch (error) {
      console.error('Fallback authentication error:', error);
      setError('Authentication failed: Please try again');
    } finally {
      setIsPending(false);
    }
  }, []);

  const handleTestWorldIDAPI = useCallback(async () => {
    try {
      setIsPending(true);
      setError(null);

      // Test the WorldID API endpoints
      console.log('Testing WorldID API endpoints...');
      
      // Step 1: Test nonce generation
      const nonceResponse = await fetch('/api/nonce');
      const nonceData = await nonceResponse.json();
      
      if (!nonceData.nonce) {
        setError('Nonce generation failed');
        return;
      }
      
      console.log('✅ Nonce generated:', nonceData.nonce);
      
      // Step 2: Test verification endpoint with mock data
      const mockPayload = {
        status: 'success' as const,
        address: '0x742d35Cc6569C6732317ac1e2c5f1e4F9E6f0000',
        message: `noscalp.vercel.app wants you to sign in with your Ethereum account:\n0x742d35Cc6569C6732317ac1e2c5f1e4F9E6f0000\n\nSign in to Noscalp - Discover amazing events with verified identity\n\nURI: https://noscalp.vercel.app\nVersion: 1\nChain ID: 10\nNonce: ${nonceData.nonce}\nIssued At: ${new Date().toISOString()}`,
        signature: '0x' + '0'.repeat(130), // Mock signature
        version: 1
      };

      console.log('🧪 Testing verification with mock data...');
      
      // This will fail signature verification but test the endpoint
      const verificationResponse = await fetch('/api/complete-siwe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payload: mockPayload,
          nonce: nonceData.nonce,
        }),
      });

      const verificationResult = await verificationResponse.json();
      console.log('📡 API Response:', verificationResult);
      
      if (verificationResult.status === 'error' && verificationResult.message.includes('signature')) {
        console.log('✅ Verification endpoint working (expected signature failure)');
        setError('WorldID API endpoints are working! Signature verification failed as expected with mock data.');
      } else {
        setError(`API test result: ${verificationResult.message}`);
      }

    } catch (error) {
      console.error('API test error:', error);
      setError(`API test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsPending(false);
    }
  }, []);

  // Loading state while checking for World App
  if (isWorldApp === null) {
    return (
      <div className="flex flex-col items-center gap-lg">
        <div className="btn-primary w-full opacity-50 cursor-not-allowed">
          <div className="flex items-center justify-center gap-sm">
            <div className="w-6 h-6 bg-text-on-primary rounded-md flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-primary-green border-t-transparent rounded-full animate-spin"></div>
            </div>
            Checking World App...
          </div>
        </div>
        <p className="text-small text-text-muted text-center">
          Detecting MiniKit environment...
        </p>
      </div>
    );
  }

  // In World App - show WorldID authentication
  if (isWorldApp) {
    return (
      <div className="flex flex-col items-center gap-lg">
        <button
          onClick={handleWorldIDAuth}
          disabled={isPending}
          className="btn-primary w-full"
        >
          <div className="flex items-center justify-center gap-sm">
            <div className="w-6 h-6 bg-text-on-primary rounded-md flex items-center justify-center">
              <svg className="w-4 h-4 text-primary-green" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            {isPending ? 'Authenticating with World ID...' : 'Sign in with World ID'}
          </div>
        </button>
        {error && (
          <p className="text-caption text-status-error text-center">{error}</p>
        )}
        <p className="text-small text-text-muted text-center max-w-xs">
          Secure wallet authentication using Sign in with Ethereum (SIWE)
        </p>
      </div>
    );
  }

  // Not in World App - show both options
  return (
    <div className="flex flex-col items-center gap-lg">
      {/* Debug Information */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-surface-secondary border border-border-muted rounded-lg p-sm w-full">
          <h4 className="text-small font-medium text-text-primary mb-xs">Debug Info</h4>
          <div className="text-small text-text-muted space-y-xs">
            <div>MiniKit Installed: {MiniKit.isInstalled() ? '✅ Yes' : '❌ No'}</div>
            <div>Has walletAuth: {typeof MiniKit.commandsAsync?.walletAuth === 'function' ? '✅ Yes' : '❌ No'}</div>
            <div>User Agent: {navigator.userAgent.slice(0, 50)}...</div>
          </div>
        </div>
      )}

      {/* World App Notice */}
      <div className="bg-surface-secondary border border-border-muted rounded-lg p-md w-full">
        <div className="flex items-start gap-sm">
          <div className="w-5 h-5 text-primary-green mt-0.5">
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-body-sm font-medium text-text-primary mb-xs">
              For Full WorldID Authentication
            </h3>
            <p className="text-small text-text-muted mb-sm">
              Open this app in World App to use proper WorldID Wallet Authentication with SIWE protocol.
            </p>
            <a 
              href="worldapp://mini-app?mini_app_id=noscalp" 
              className="text-small text-primary-green hover:text-primary-green-hover underline"
            >
              Open in World App →
            </a>
          </div>
        </div>
      </div>

      {/* Development Authentication */}
      <div className="w-full">
        <button
          onClick={handleFallbackAuth}
          disabled={isPending}
          className="btn-secondary w-full"
        >
          <div className="flex items-center justify-center gap-sm">
            <div className="w-6 h-6 bg-text-on-secondary rounded-md flex items-center justify-center">
              <svg className="w-4 h-4 text-secondary" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 7h-1V6a6 6 0 0 0-12 0v1H5a1 1 0 0 0-1 1v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8a1 1 0 0 0-1-1zM8 6a4 4 0 0 1 8 0v1H8V6zm6 9a1 1 0 0 1-2 0v-2a1 1 0 0 1 2 0v2z"/>
              </svg>
            </div>
            {isPending ? 'Signing in (Development)...' : 'Continue with Demo Auth'}
          </div>
        </button>
        <p className="text-small text-text-muted text-center mt-sm">
          Development authentication for testing purposes
        </p>
      </div>

      {/* API Testing */}
      <div className="w-full">
        <button
          onClick={handleTestWorldIDAPI}
          disabled={isPending}
          className="btn-secondary w-full"
        >
          <div className="flex items-center justify-center gap-sm">
            <div className="w-6 h-6 border border-primary-green rounded-md flex items-center justify-center">
              <svg className="w-4 h-4 text-primary-green" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
              </svg>
            </div>
            {isPending ? 'Testing API...' : 'Test WorldID API'}
          </div>
        </button>
        <p className="text-small text-text-muted text-center mt-sm">
          Test the nonce generation and verification endpoints
        </p>
      </div>

      {error && (
        <p className="text-caption text-status-error text-center">{error}</p>
      )}
    </div>
  );
}; 