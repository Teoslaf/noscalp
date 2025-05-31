import Head from 'next/head'
import { useState } from 'react'
import { useRouter } from 'next/router'

export default function AuthPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleWorldIDAuth = async () => {
    setIsLoading(true)
    
    // Simulate WorldID authentication
    setTimeout(() => {
      setIsLoading(false)
      // Set authentication status
      localStorage.setItem('isAuthenticated', 'true')
      router.push('/')
    }, 2000)
  }

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

          {/* WorldID Authorization Button - Only button */}
          <div className="w-full max-w-sm">
            <button 
              className="btn-primary worldid-button w-full"
              onClick={handleWorldIDAuth}
              disabled={isLoading}
            >
              <div className="w-xxxl h-xxxl bg-text-on-primary rounded-md flex items-center justify-center">
                <svg className="w-6 h-6 text-primary-green" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              {isLoading ? 'Authorizing...' : 'Authorize with WorldID'}
            </button>
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