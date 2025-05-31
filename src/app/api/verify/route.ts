import { NextResponse } from 'next/server'
import { ISuccessResult } from '@worldcoin/idkit'

const WORLD_ID_APP_ID = "app_f3477523033966cba3409a67092fad28"

export async function POST(req: Request) {
  try {
    const { payload, action } = await req.json()
    
    const verifyRes = await fetch(
      `https://developer.worldcoin.org/api/v2/verify/${WORLD_ID_APP_ID}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nullifier_hash: payload.nullifier_hash,
          merkle_root: payload.merkle_root,
          proof: payload.proof,
          verification_level: payload.verification_level,
          action: action
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