import {
  ISuccessResult,
  IVerifyResponse,
  verifyCloudProof,
} from '@worldcoin/minikit-js';
import { NextRequest, NextResponse } from 'next/server';

interface IRequestPayload {
  payload: ISuccessResult;
  action: string;
  signal?: string;
}

/**
 * This route verifies World ID proofs before allowing wallet authentication
 */
export async function POST(req: NextRequest) {
  try {
    const { payload, action, signal } = (await req.json()) as IRequestPayload;
    const app_id = process.env.NEXT_PUBLIC_APP_ID as `app_${string}`;

    if (!app_id) {
      return NextResponse.json(
        { error: 'APP_ID not configured' },
        { status: 500 }
      );
    }

    const verifyRes = await verifyCloudProof(
      payload,
      app_id,
      action,
      signal
    ) as IVerifyResponse;

    if (verifyRes.success) {
      // Store the verification status in your database if needed
      return NextResponse.json({ verifyRes, status: 200 });
    } else {
      console.error('Verification failed:', verifyRes);
      return NextResponse.json(
        { error: 'Verification failed', verifyRes },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error verifying proof:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
