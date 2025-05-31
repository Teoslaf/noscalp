'use client'

//import { MiniKitProvider } from '@worldcoin/minikit-js/minikit-provider'
import { MiniKitProvider } from '@worldcoin/minikit-react'
import { ReactNode } from 'react'

export default function MiniKitClientWrapper({
  children,
}: {
  children: ReactNode
}) {
  return (
    <MiniKitProvider>
      {children}
    </MiniKitProvider>
  )
}
