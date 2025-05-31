import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { MiniAppWalletAuthSuccessPayload, verifySiweMessage } from '@worldcoin/minikit-js';

interface IRequestPayload {
  payload: MiniAppWalletAuthSuccessPayload;
  nonce: string;
}

export async function POST(req: NextRequest) {
  try {
    const { payload, nonce } = (await req.json()) as IRequestPayload;
    
    // Verify the nonce matches what we stored in the cookie
    const storedNonce = cookies().get('siwe')?.value;
    if (nonce !== storedNonce) {
      return NextResponse.json({
        status: 'error',
        isValid: false,
        message: 'Invalid nonce',
      });
    }

    // Verify the SIWE message signature
    const validMessage = await verifySiweMessage(payload, nonce);
    
    if (validMessage.isValid) {
      // Clear the used nonce
      cookies().delete('siwe');
      
      return NextResponse.json({
        status: 'success',
        isValid: true,
        address: validMessage.siweMessageData.address,
        message: 'Authentication successful',
      });
    } else {
      return NextResponse.json({
        status: 'error',
        isValid: false,
        message: 'Invalid signature',
      });
    }
  } catch (error: any) {
    console.error('SIWE verification error:', error);
    return NextResponse.json({
      status: 'error',
      isValid: false,
      message: error.message || 'Verification failed',
    });
  }
} 