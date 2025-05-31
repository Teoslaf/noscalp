import { NextResponse } from 'next/server'
import { ISuccessResult } from '@worldcoin/idkit'

export async function POST(req: Request) {
  try {
    const result: ISuccessResult = await req.json()
    
    const verifyRes = await fetch(
      `${process.env.WLD_API_BASE_URL}/api/v2/verify/${process.env.NEXT_PUBLIC_WLD_APP_ID}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nullifier_hash: result.nullifier_hash,
          merkle_root: result.merkle_root,
          proof: result.proof,
          verification_level: result.verification_level,
          action: process.env.NEXT_PUBLIC_WLD_ACTION
        }),
      }
    )

    if (!verifyRes.ok) {
      throw new Error('Verification failed')
    }

    const data = await verifyRes.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error verifying proof:', error)
    return NextResponse.json(
      { error: 'Invalid proof' },
      { status: 400 }
    )
  }
} 