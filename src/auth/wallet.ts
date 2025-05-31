import { MiniKit } from '@worldcoin/minikit-js';

// Generate a random nonce for authentication
const generateNonce = () => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

export const walletAuth = async () => {
  if (!MiniKit.isInstalled()) {
    throw new Error('World App is not installed');
  }

  try {
    const loginNonce = generateNonce();
    console.log('Requesting wallet authentication...');
    
    const { finalPayload } = await MiniKit.commandsAsync.walletAuth({
      nonce: loginNonce,
    });
    
    if (finalPayload.status === 'error') {
      throw new Error('Wallet authentication failed');
    }

    if (!finalPayload.address) {
      throw new Error('No wallet address received');
    }

    console.log('Wallet authentication successful, verifying with server...');

    // Send to backend to verify and create session
    const response = await fetch('/api/auth/wallet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        payload: finalPayload,
        nonce: loginNonce,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to authenticate with server');
    }

    const data = await response.json();
    console.log('Server verification successful');
    return data;
  } catch (error) {
    console.error('Wallet authentication error:', error);
    throw error;
  }
}; 