'use client'

import { MiniKitProvider } from '@worldcoin/minikit-js/minikit-provider'
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
