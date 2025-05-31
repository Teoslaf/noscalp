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
    const { finalPayload } = await MiniKit.commandsAsync.walletAuth({
      nonce: loginNonce,
    });
    
    if (finalPayload.status === 'error') {
      throw new Error('Wallet authentication failed');
    }

    // Here you would typically send this to your backend to verify
    // and create a session
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
      throw new Error('Failed to authenticate with server');
    }

    return await response.json();
  } catch (error) {
    console.error('Wallet authentication error:', error);
    throw error;
  }
}; 