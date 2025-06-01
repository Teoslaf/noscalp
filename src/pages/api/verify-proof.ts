import {
  ISuccessResult,
  IVerifyResponse,
  verifyCloudProof,
} from '@worldcoin/minikit-js';
import { NextApiRequest, NextApiResponse } from 'next';

interface IRequestPayload {
  payload: ISuccessResult;
  action: string;
  signal?: string;
}

/**
 * This route verifies World ID proofs before allowing wallet authentication
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { payload, action, signal } = req.body as IRequestPayload;
    const app_id = process.env.NEXT_PUBLIC_APP_ID as `app_${string}`;

    if (!app_id) {
      return res.status(500).json({ error: 'APP_ID not configured' });
    }

    const verifyRes = await verifyCloudProof(
      payload,
      app_id,
      action,
      signal
    ) as IVerifyResponse;

    if (verifyRes.success) {
      // Store the verification status in your database if needed
      return res.status(200).json({ verifyRes, status: 200 });
    } else {
      return res.status(400).json({
        error: 'Verification failed',
        details: verifyRes
      });
    }
  } catch (error) {
    console.error('Verification error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 