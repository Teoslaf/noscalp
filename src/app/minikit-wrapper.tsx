'use client'

import React, { type ReactNode } from 'react'
import { MiniKitProvider } from '@worldcoin/minikit-js/minikit-provider'

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