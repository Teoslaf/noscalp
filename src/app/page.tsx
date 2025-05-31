'use client'

import { MiniKit } from '@worldcoin/minikit-js'
import { ISuccessResult } from '@worldcoin/idkit'
import { useState } from 'react'

// ✅ Constants — committed, no env needed
const WORLD_ID_APP_ID = "app_f3477523033966cba3409a67092fad28"
const WORLD_ID_ACTION = "buy_ticket"

export default function Home() {
  const [proof, setProof] = useState<ISuccessResult | null>(null)
  const [verified, setVerified] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)

  const isInWorldApp = MiniKit.isInstalled()

  const handleLogin = async () => {
    setIsVerifying(true)
    setError(null)

    try {
      const { finalPayload } = await MiniKit.commandsAsync.verify({
        action: WORLD_ID_ACTION,
        signal: 'user-wallet-address', // replace with real wallet address later
      })

      if (finalPayload.status === 'error') {
        throw new Error('Verification failed')
      }

      console.log('✅ Proof received:', finalPayload)
      setProof(finalPayload as ISuccessResult)
      setVerified(true)

      const response = await fetch('/api/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payload: finalPayload,
          action: WORLD_ID_ACTION,
        }),
      })

      if (!response.ok) throw new Error('Verification failed')

      const data = await response.json()
      console.log('✅ Verification successful:', data)
    } catch (err) {
      console.error('❌ Error during verification:', err)
      setVerified(false)
      setError('Verification failed. Please try again.')
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
      <h1 className="text-3xl font-bold mb-4">Welcome to Noscalp Tickets</h1>

      {isInWorldApp ? (
        <>
          {verified ? (
            <p className="mb-4 text-green-600 font-semibold">
              ✅ You are verified with World ID — you can buy 2 tickets!
            </p>
          ) : (
            <>
              {error && <p className="mb-2 text-red-500">{error}</p>}
              {isVerifying ? (
                <p className="text-gray-600">Verifying your World ID proof...</p>
              ) : (
                <button
                  onClick={handleLogin}
                  className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
                >
                  Log in with World ID
                </button>
              )}
            </>
          )}
        </>
      ) : (
        <p className="text-gray-500">
          ⚠️ Please open this app inside the World App to use World ID verification.
        </p>
      )}

      {proof && (
        <pre className="mt-6 text-sm bg-gray-100 p-4 rounded w-full max-w-xl overflow-auto">
          {JSON.stringify(proof, null, 2)}
        </pre>
      )}
    </main>
  )
}
