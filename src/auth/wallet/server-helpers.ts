import { hashNonce } from './client-helpers';

/**
 * Generates new nonces for wallet authentication
 * @returns Object containing nonce and signedNonce
 */
export const getNewNonces = async (): Promise<{
  nonce: string;
  signedNonce: string;
}> => {
  const nonce = crypto.randomUUID();
  const signedNonce = hashNonce({ nonce });
  
  return {
    nonce,
    signedNonce,
  };
}; 