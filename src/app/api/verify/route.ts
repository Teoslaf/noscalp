import { NextResponse } from 'next/server'
import { verifyCloudProof, IVerifyResponse, MiniAppVerifyActionSuccessPayload } from '@worldcoin/minikit-js'

const WORLD_ID_APP_ID = "app_f3477523033966cba3409a67092fad28" as `app_${string}`

interface IRequestPayload {
  payload: MiniAppVerifyActionSuccessPayload
  action: string
  signal?: string
}

export async function POST(req: Request) {
  try {
    const { payload, action, signal } = await req.json() as IRequestPayload
    
    if (payload.status !== 'success') {
      throw new Error('Invalid proof status')
    }

    const verifyRes = await verifyCloudProof(
      payload,
      WORLD_ID_APP_ID,
      action,
      signal
    ) as IVerifyResponse

    if (!verifyRes.success) {
      throw new Error('Verification failed')
    }

    return NextResponse.json({ 
      success: true,
      verifyRes 
    })
  } catch (error) {
    console.error('Error verifying proof:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Invalid proof', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 400 }
    )
  }
} 