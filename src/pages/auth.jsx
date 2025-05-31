import Head from 'next/head'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { AuthButton } from '../components/AuthButton'

export default function AuthPage() {
  const router = useRouter()

  return (
    <>
      <Head>
        <title>Sign In - Noscalp</title>
        <meta name="description" content="Sign in to Noscalp with WorldID" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </Head>
      
      <div className="screen-container min-h-screen flex flex-col justify-center items-center px-3 bg-bg-primary">
        {/* App Logo - Center of page */}
        <div className="flex-1 flex flex-col justify-center items-center">
          <div className="mb-xxxl text-center">
            {/* Logo */}
            <div className="w-32 h-32 bg-primary-green rounded-xl flex items-center justify-center mb-lg mx-auto shadow-lg">
              <svg className="w-16 h-16 text-text-on-primary" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
              </svg>
            </div>
            <h1 className="text-app-title font-bold text-text-primary mb-sm">
              Noscalp
            </h1>
            <p className="text-body text-text-secondary max-w-xs">
              Discover amazing events with verified identity
            </p>
          </div>

          {/* WorldID Authorization Button */}
          <div className="w-full max-w-sm">
            <AuthButton />
          </div>
        </div>

        {/* Terms and Privacy - Bottom */}
        <div className="pb-xl text-center max-w-xs">
          <p className="text-small text-text-muted">
            By continuing, you verify your identity and agree to our{' '}
            <a href="#" className="text-primary-green hover:text-primary-green-hover">
              Terms of Service
            </a>
          </p>
        </div>
      </div>
    </>
  )
} 