import React from 'react'
import type { Metadata } from 'next'
import '../styles/globals.css'

export const metadata: Metadata = {
  title: 'Noscalp - Event Discovery App',
  description: 'A dark-themed mobile event discovery app with WorldID integration',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-bg-primary text-text-primary min-h-screen">
        <div className="max-w-[400px] mx-auto bg-bg-primary min-h-screen">
          {children}
        </div>
      </body>
    </html>
  )
} 