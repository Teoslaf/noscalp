'use client'

import { IDKitWidget, ISuccessResult } from '@worldcoin/idkit'
import { useState } from 'react'

export default function Home() {
  const [proof, setProof] = useState<ISuccessResult | null>(null)

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">Buy Ticket</h1>

      <IDKitWidget
        app_id="app_f3477523033966cba3409a67092fad28" // real
        action="buy_ticket"
        signal="user-wallet-address" // optional: for now, use a static string
        onSuccess={(result: ISuccessResult) => {
          console.log('Proof received:', result)
          setProof(result)
        }}
        handleVerify={() => {
          console.log('Verification request sent to World ID')
        }}
      >
        {({ open }: { open: () => void }) => <button onClick={open}>Verify with World ID</button>}
      </IDKitWidget>

      {proof && (
        <pre className="mt-4 text-sm bg-gray-100 p-4 rounded w-full max-w-xl overflow-auto">
          {JSON.stringify(proof, null, 2)}
        </pre>
      )}
    </main>
  )
}
