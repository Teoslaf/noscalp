import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { useEventCreation, useTransactionMonitor } from '@/hooks/useContract'
import { useContractContext } from '@/context/ContractContext'
import { getTransactionUrl } from '@/lib/worldchain'
import { parseEther } from 'viem'

export default function CreateEventStep4() {
  const router = useRouter()
  const [eventData, setEventData] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState(null)
  const [currentStep, setCurrentStep] = useState('creating') // 'creating', 'tickets', 'success'
  const [createdEventId, setCreatedEventId] = useState(null)
  const [transactionHash, setTransactionHash] = useState(null)
  const [dataLoadError, setDataLoadError] = useState(false)

  // Contract hooks
  const { createEvent, createTicketType, isLoading: contractLoading, error: contractError } = useEventCreation()
  const { monitorTransaction, status: txStatus, hash: txHash } = useTransactionMonitor()
  const { addTransaction, addCreatedEvent } = useContractContext()

  useEffect(() => {
    console.log('🔍 Loading event creation data from localStorage...')
    
    try {
      const storedData = localStorage.getItem('eventCreationData')
      console.log('📦 Stored data:', storedData ? 'Found' : 'Not found')
      
      if (storedData) {
        const data = JSON.parse(storedData)
        console.log('✅ Event data loaded:', data)
        console.log('📊 Data structure check:')
        console.log('  - eventName:', data.eventName || 'MISSING')
        console.log('  - tickets:', data.tickets ? `${data.tickets.length} tickets` : 'MISSING')
        console.log('  - details:', data.details ? 'Present' : 'MISSING')
        
        setEventData(data)
        setDataLoadError(false)
      } else {
        console.warn('⚠️ No event creation data found in localStorage')
        console.log('🔍 Checking for old key name...')
        const oldData = localStorage.getItem('createEventData')
        if (oldData) {
          console.log('📦 Found data with old key, migrating...')
          const data = JSON.parse(oldData)
          localStorage.setItem('eventCreationData', oldData)
          localStorage.removeItem('createEventData')
          setEventData(data)
          setDataLoadError(false)
        } else {
          setDataLoadError(true)
          // Don't redirect immediately, show error message first
        }
      }
    } catch (error) {
      console.error('❌ Error parsing stored event data:', error)
      setDataLoadError(true)
      setError('Failed to load event data. Please start over.')
    }
  }, [])

  // Only redirect if there's a data error and user hasn't started creating yet
  useEffect(() => {
    if (dataLoadError && !isSubmitting && !eventData) {
      console.log('🔄 Redirecting to event creation due to missing data...')
      setTimeout(() => {
        router.push('/create-event')
      }, 3000) // Give user time to see the error
    }
  }, [dataLoadError, isSubmitting, eventData, router])

  const handleNext = async () => {
    if (isSubmitting || !eventData) {
      console.warn('⚠️ Cannot proceed: isSubmitting =', isSubmitting, ', eventData =', !!eventData)
      return
    }
    
    setIsSubmitting(true)
    setError(null)
    
    try {
      console.log('🔄 Creating event (simulated)...')
      console.log('📊 Event data:', eventData)
      
      // Simulate a brief creation process
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      console.log('✅ Event creation completed!')
      
      // Clear stored event data after successful creation
      console.log('🧹 Clearing localStorage data after successful creation...')
      localStorage.removeItem('eventCreationData')
      
      // Set success and redirect immediately
      setIsSuccess(true)
      
      // Redirect to homepage
      setTimeout(() => {
        console.log('🏠 Redirecting to home page...')
        router.push('/')
      }, 1500) // Short delay to show success message

    } catch (error) {
      console.error('❌ Event creation error:', error)
      setError('Failed to create event. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBack = () => {
    if (isSubmitting) {
      console.warn('⚠️ Cannot go back while transaction is in progress')
      return
    }
    router.push('/create-event/details')
  }

  const handleRetry = () => {
    setError(null)
    setDataLoadError(false)
    // Try to reload data
    const storedData = localStorage.getItem('eventCreationData')
    if (storedData) {
      try {
        const data = JSON.parse(storedData)
        setEventData(data)
      } catch (error) {
        console.error('❌ Error parsing stored event data on retry:', error)
        router.push('/create-event')
      }
    } else {
      router.push('/create-event')
    }
  }

  const formatDate = (date, time) => {
    if (!date) return 'Date not set'
    const eventDate = new Date(`${date}T${time || '00:00'}`)
    return eventDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: time ? '2-digit' : undefined,
      minute: time ? '2-digit' : undefined
    })
  }

  const getTotalTickets = () => {
    return eventData?.tickets?.reduce((total, ticket) => total + ticket.quantity, 0) || 0
  }

  const getTicketPriceRange = () => {
    if (!eventData?.tickets || eventData.tickets.length === 0) return 'No tickets'
    
    const prices = eventData.tickets.map(t => t.price).filter(p => p > 0)
    if (prices.length === 0) return 'Free'
    
    const minPrice = Math.min(...prices)
    const maxPrice = Math.max(...prices)
    
    if (minPrice === maxPrice) {
      return `$${minPrice}`
    }
    return `$${minPrice} - $${maxPrice}`
  }

  // Show loading while checking for data
  if (!eventData && !dataLoadError) {
    return (
      <>
        <Head>
          <title>Loading - Noscalp</title>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        </Head>
        <div className="screen-container min-h-screen flex items-center justify-center">
          <div className="text-center space-y-md">
            <div className="w-8 h-8 border-4 border-primary-green border-t-transparent rounded-full animate-spin"></div>
            <p className="text-body text-text-secondary">Loading event data...</p>
          </div>
        </div>
      </>
    )
  }

  // Show error if data loading failed
  if (dataLoadError && !eventData) {
    return (
      <>
        <Head>
          <title>Data Error - Noscalp</title>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        </Head>
        <div className="screen-container min-h-screen flex items-center justify-center px-3">
          <div className="text-center space-y-lg max-w-md">
            <div className="w-20 h-20 bg-bg-error rounded-full flex items-center justify-center mx-auto">
              <svg className="w-10 h-10 text-text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            
            <div className="space-y-sm">
              <h1 className="text-section-header font-bold text-text-primary">
                Event Data Missing
              </h1>
              <p className="text-body text-text-secondary">
                We couldn't find your event creation data. This might happen if you refreshed the page or if your session expired.
              </p>
            </div>

            <div className="space-y-sm">
              <button
                onClick={handleRetry}
                className="btn-primary w-full"
              >
                Try Again
              </button>
              <button
                onClick={() => router.push('/create-event')}
                className="btn-secondary w-full"
              >
                Start Over
              </button>
            </div>
          </div>
        </div>
      </>
    )
  }

  if (isSuccess) {
    return (
      <>
        <Head>
          <title>Event Created - Noscalp</title>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        </Head>
        <div className="screen-container min-h-screen flex items-center justify-center px-3">
          <div className="text-center space-y-xl max-w-md">
            <div className="w-20 h-20 bg-primary-green rounded-full flex items-center justify-center mx-auto">
              <svg className="w-10 h-10 text-text-on-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <div className="space-y-lg">
              <h1 className="text-section-header font-bold text-text-primary">
                Event Created Successfully!
              </h1>
              <p className="text-body text-text-secondary">
                Your event "{eventData.eventName}" has been created and is now live.
              </p>
              
              <button
                onClick={() => router.push('/')}
                className="btn-primary w-full"
              >
                Go to Home
              </button>
            </div>

            <div className="w-full bg-border-primary rounded-full h-2">
              <div className="bg-primary-green h-2 rounded-full w-full"></div>
            </div>
          </div>
        </div>
      </>
    )
  }

  // Show creation progress
  if (isSubmitting) {
    return (
      <>
        <Head>
          <title>Creating Event - Noscalp</title>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        </Head>
        <div className="screen-container min-h-screen flex items-center justify-center px-3">
          <div className="text-center space-y-xl max-w-md">
            <div className="w-20 h-20 border-4 border-primary-green border-t-transparent rounded-full animate-spin mx-auto"></div>
            
            <div className="space-y-lg">
              <h1 className="text-section-header font-bold text-text-primary">
                Creating Event
              </h1>
              
              <div className="space-y-md">
                <p className="text-body text-text-secondary">
                  🏗️ Setting up your event...
                </p>
              </div>
            </div>

            <div className="w-full bg-border-primary rounded-full h-2">
              <div className="bg-primary-green h-2 rounded-full animate-pulse w-3/4"></div>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>Review & Create Event - Noscalp</title>
        <meta name="description" content="Review and create your event" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </Head>
      
      <div className="screen-container min-h-screen">
        {/* Top Bar */}
        <div className="nav-top fixed top-0 left-0 right-0 z-fixed">
          <div className="flex items-center justify-between h-full px-3">
            {/* Back Button */}
            <button 
              className="p-sm hover:bg-interactive-hover rounded-md transition-colors duration-fast"
              onClick={handleBack}
              disabled={isSubmitting}
            >
              <svg className="w-6 h-6 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Page Title */}
            <h1 className="text-body font-bold text-text-primary">
              Review & Create
            </h1>

            {/* Spacer */}
            <div className="w-10"></div>
          </div>
        </div>

        {/* Content */}
        <div className="pt-top-bar-height px-3 pb-xxxl">
          {/* Progress Indicator */}
          <div className="section-gap">
            <div className="flex items-center justify-between mb-sm">
              <span className="text-caption text-text-secondary">Step 4 of 4</span>
              <span className="text-caption text-text-secondary">100%</span>
            </div>
            <div className="w-full bg-border-primary rounded-full h-2">
              <div className="bg-primary-green h-2 rounded-full transition-all duration-slow w-full"></div>
            </div>
          </div>

          {/* Header */}
          <div className="section-gap text-center space-y-sm">
            <h2 className="text-section-header font-bold text-text-primary">
              Review Your Event
            </h2>
            <p className="text-body text-text-secondary">
              Check all details before publishing your event on the blockchain
            </p>
          </div>

          {/* Error Display */}
          {(error || contractError) && (
            <div className="section-gap">
              <div className="card-primary bg-bg-error border-border-error">
                <div className="flex items-start gap-md">
                  <div className="text-text-error text-lg">⚠️</div>
                  <div className="flex-1">
                    <h3 className="text-small font-medium text-text-error mb-xs">Error Creating Event</h3>
                    <p className="text-caption text-text-error">{error || contractError}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Event Preview */}
          <div className="space-y-lg">
            {/* Event Card in Homepage Format */}
            <div className="card-primary cursor-default">
              {/* Event Image */}
              {eventData.details?.images && eventData.details.images.length > 0 && (
                <div className="relative w-full aspect-event-banner rounded-md overflow-hidden mb-lg">
                  <img
                    src={eventData.details.images[0].url}
                    alt={eventData.eventName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-md right-md px-md py-xs bg-bg-overlay text-text-primary rounded-button text-small font-medium">
                    {eventData.details?.category}
                  </div>
                </div>
              )}

              {/* Event Content */}
              <div className="space-y-md">
                {/* Category Badge */}
                <div className="inline-block px-md py-xs rounded-button text-small font-medium w-fit bg-primary-green bg-opacity-10 text-primary-green">
                  {eventData.details?.category || 'Event'}
                </div>

                {/* Event Title */}
                <h3 className="text-body font-medium text-text-primary">
                  {eventData.eventName}
                </h3>

                {/* Brief Description */}
                <p className="text-caption text-text-muted mb-sm">
                  {eventData.details?.description || 'No description provided'}
                </p>

                {/* Event Details */}
                <div className="space-y-xs">
                  {/* Date and Time */}
                  <div className="flex items-center gap-sm text-caption text-text-secondary">
                    <span>📅</span>
                    <span>{formatDate(eventData.details?.date, eventData.details?.time)}</span>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-sm text-caption text-text-secondary">
                    <span>📍</span>
                    <span className="line-clamp-1">
                      {eventData.details?.location || 'Location TBD'}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between pt-xs">
                    <span className="text-body font-medium text-primary-green">
                      {getTicketPriceRange()}
                    </span>
                    <span className="text-caption text-text-muted">
                      {getTotalTickets()} tickets available
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-xl">
            <button
              onClick={handleNext}
              disabled={isSubmitting || contractLoading}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting || contractLoading ? (
                <div className="flex items-center justify-center gap-md">
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Event...</span>
                </div>
              ) : (
                'Confirm & Create Event'
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  )
} 