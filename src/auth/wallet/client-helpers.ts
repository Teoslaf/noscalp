import { createHash } from 'crypto';

/**
 * Hashes a nonce for wallet authentication
 * @param nonce - The nonce to hash
 * @returns The hashed nonce
 */
export const hashNonce = ({ nonce }: { nonce: string }): string => {
  return createHash('sha256').update(nonce).digest('hex');
}; 