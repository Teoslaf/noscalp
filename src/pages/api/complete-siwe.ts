import { NextApiRequest, NextApiResponse } from 'next';
import { recoverMessageAddress } from 'viem';

interface SIWEPayload {
  status: 'success' | 'error';
  address: string;
  message: string;
  signature: string;
  version: number;
}

interface RequestBody {
  payload: SIWEPayload;
  nonce: string;
}

// Function to parse SIWE message and extract components
function parseSIWEMessage(message: string) {
  const lines = message.split('\n');
  const result: any = {};
  
  // Extract domain and wants you to sign in
  const domainMatch = message.match(/^(.+) wants you to sign in with your Ethereum account:/);
  if (domainMatch) {
    result.domain = domainMatch[1];
  }
  
  // Extract address (should be the line after "wants you to sign in")
  const addressMatch = message.match(/wants you to sign in with your Ethereum account:\n(.+)/);
  if (addressMatch) {
    result.addressInMessage = addressMatch[1].trim();
  }
  
  // Extract nonce
  const nonceMatch = message.match(/Nonce: (.+)/);
  if (nonceMatch) {
    result.nonceInMessage = nonceMatch[1];
  }
  
  // Extract chain ID
  const chainMatch = message.match(/Chain ID: (.+)/);
  if (chainMatch) {
    result.chainId = chainMatch[1];
  }
  
  return result;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { payload, nonce } = req.body as RequestBody;

    console.log('🔍 SIWE Verification Request:');
    console.log('- Nonce:', nonce);
    console.log('- Payload status:', payload?.status);
    console.log('- Payload address:', payload?.address);
    console.log('- Message length:', payload?.message?.length);
    console.log('- Signature length:', payload?.signature?.length);

    if (!payload || !nonce) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing payload or nonce'
      });
    }

    if (payload.status === 'error') {
      return res.status(400).json({
        status: 'error',
        message: 'Wallet authentication was cancelled or failed'
      });
    }

    // Verify that the nonce in the message matches our stored nonce
    const storedNonce = req.cookies.siwe;
    console.log('🍪 Stored nonce:', storedNonce);
    console.log('🍪 Received nonce:', nonce);
    
    if (!storedNonce || storedNonce !== nonce) {
      console.log('❌ Nonce mismatch!');
      return res.status(400).json({
        status: 'error',
        message: 'Invalid or expired nonce'
      });
    }

    // Parse and analyze the SIWE message
    const parsedMessage = parseSIWEMessage(payload.message);
    console.log('📄 Parsed SIWE message components:');
    console.log('- Domain:', parsedMessage.domain);
    console.log('- Address in message:', parsedMessage.addressInMessage);
    console.log('- Nonce in message:', parsedMessage.nonceInMessage);
    console.log('- Chain ID:', parsedMessage.chainId);
    console.log('- Claimed address:', payload.address);

    // Log the full message for debugging
    console.log('📄 Full SIWE message:');
    console.log(payload.message);
    console.log('✍️ Signature:', payload.signature);

    // Check if the address in the message matches the claimed address
    if (parsedMessage.addressInMessage && 
        parsedMessage.addressInMessage.toLowerCase() !== payload.address.toLowerCase()) {
      console.log('⚠️ Address in message differs from claimed address!');
      console.log('- Message address:', parsedMessage.addressInMessage);
      console.log('- Claimed address:', payload.address);
    }

    // Verify the signature
    try {
      const recoveredAddress = await recoverMessageAddress({
        message: payload.message,
        signature: payload.signature as `0x${string}`,
      });

      console.log('🔐 Address verification:');
      console.log('- Claimed address:', payload.address.toLowerCase());
      console.log('- Recovered address:', recoveredAddress.toLowerCase());
      console.log('- Address in message:', parsedMessage.addressInMessage?.toLowerCase());
      console.log('- Match (claimed vs recovered):', recoveredAddress.toLowerCase() === payload.address.toLowerCase());
      console.log('- Match (message vs recovered):', recoveredAddress.toLowerCase() === parsedMessage.addressInMessage?.toLowerCase());

      // Check if the recovered address matches the claimed address
      if (recoveredAddress.toLowerCase() !== payload.address.toLowerCase()) {
        console.log('❌ Address mismatch detected!');
        
        // In development mode, allow bypass for debugging
        if (process.env.NODE_ENV === 'development') {
          console.log('🚧 Development mode: Bypassing signature verification');
          
          // Clear the nonce cookie since it's been used
          res.setHeader('Set-Cookie', [
            'siwe=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0'
          ]);

          return res.status(200).json({
            status: 'success',
            isValid: true,
            address: payload.address, // Use claimed address in dev mode
            message: 'Authentication successful (development bypass)',
            debug: {
              claimedAddress: payload.address,
              recoveredAddress: recoveredAddress,
              addressInMessage: parsedMessage.addressInMessage
            }
          });
        }
        
        return res.status(400).json({
          status: 'error',
          message: `Signature verification failed: address mismatch. Expected ${payload.address}, got ${recoveredAddress}`
        });
      }

      // Clear the nonce cookie since it's been used
      res.setHeader('Set-Cookie', [
        'siwe=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0'
      ]);

      console.log('✅ SIWE verification successful!');

      // Authentication successful
      return res.status(200).json({
        status: 'success',
        isValid: true,
        address: recoveredAddress,
        message: 'Authentication successful'
      });

    } catch (signatureError) {
      console.error('❌ Signature verification error:', signatureError);
      console.error('Error details:', {
        message: payload.message,
        signature: payload.signature,
        error: signatureError
      });
      
      // In development mode, allow bypass for debugging signature issues
      if (process.env.NODE_ENV === 'development') {
        console.log('🚧 Development mode: Bypassing signature error');
        
        // Clear the nonce cookie
        res.setHeader('Set-Cookie', [
          'siwe=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0'
        ]);

        return res.status(200).json({
          status: 'success',
          isValid: true,
          address: payload.address,
          message: 'Authentication successful (development bypass - signature error)'
        });
      }
      
      return res.status(400).json({
        status: 'error',
        message: `Invalid signature: ${signatureError instanceof Error ? signatureError.message : 'Unknown error'}`
      });
    }

  } catch (error) {
    console.error('❌ SIWE verification error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
} 