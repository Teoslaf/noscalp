import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import HomeScreen from '../components/HomeScreen'

export default function Home() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated (you can replace this with actual auth logic)
    const authStatus = localStorage.getItem('isAuthenticated')
    if (!authStatus) {
      router.push('/auth')
    } else {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [router])

  if (isLoading) {
    return (
      <div className="screen-container min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-green border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect to auth
  }

  return (
    <>
      <Head>
        <title>Noscalp - Discover Amazing Events</title>
        <meta name="description" content="Discover and create amazing events with WorldID authentication" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </Head>
      <HomeScreen />
    </>
  )
} 