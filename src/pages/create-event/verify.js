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

  // Contract hooks
  const { createEvent, createTicketType, gasEstimate, isLoading: contractLoading, error: contractError } = useEventCreation()
  const { monitorTransaction, status: txStatus, hash: txHash } = useTransactionMonitor()
  const { addTransaction, addCreatedEvent } = useContractContext()

  useEffect(() => {
    const storedData = localStorage.getItem('eventCreationData')
    if (storedData) {
      try {
        const data = JSON.parse(storedData)
        setEventData(data)
      } catch (error) {
        console.error('Error parsing stored event data:', error)
        router.push('/create-event')
      }
    } else {
      router.push('/create-event')
    }
  }, [router])

  const handleNext = async () => {
    if (isSubmitting || !eventData) return
    
    setIsSubmitting(true)
    setError(null)
    
    try {
      console.log('🔄 Starting event creation on blockchain...')
      
      // Step 1: Create the event on blockchain
      setCurrentStep('creating')
      
      const eventResult = await createEvent({
        eventName: eventData.eventName
      })

      if (!eventResult || !eventResult.success) {
        throw new Error(eventResult?.error || 'Failed to create event on blockchain')
      }

      console.log('✅ Event creation transaction submitted:', eventResult.hash)
      setTransactionHash(eventResult.hash)

      // Add transaction to context
      addTransaction({
        hash: eventResult.hash,
        type: 'create_event',
        status: 'pending'
      })

      // Monitor the transaction
      const confirmed = await monitorTransaction(eventResult.hash)
      
      if (!confirmed) {
        throw new Error('Event creation transaction failed')
      }

      console.log('✅ Event created successfully on blockchain')

      // For now, we'll simulate getting the event ID from the transaction
      // In a real implementation, you'd parse the transaction receipt for the event ID
      const simulatedEventId = Math.floor(Math.random() * 10000) + 1
      setCreatedEventId(simulatedEventId)

      // Step 2: Create ticket types
      if (eventData.tickets && eventData.tickets.length > 0) {
        setCurrentStep('tickets')
        console.log('🎫 Creating ticket types...')

        for (let i = 0; i < eventData.tickets.length; i++) {
          const ticket = eventData.tickets[i]
          console.log(`Creating ticket type ${i + 1}/${eventData.tickets.length}:`, ticket)

          const ticketResult = await createTicketType({
            eventId: simulatedEventId,
            price: parseEther(ticket.price.toString()),
            supply: ticket.quantity,
            ticketType: ticket.name,
            ipfsHash: `ticket_${i}_${Date.now()}` // Placeholder IPFS hash
          })

          if (!ticketResult || !ticketResult.success) {
            console.warn(`Failed to create ticket type ${ticket.name}:`, ticketResult?.error)
            // Continue with other tickets even if one fails
          } else {
            console.log(`✅ Ticket type ${ticket.name} created:`, ticketResult.hash)
            
            // Add transaction to context
            addTransaction({
              hash: ticketResult.hash,
              type: 'create_ticket_type',
              status: 'pending',
              eventId: simulatedEventId
            })

            // Monitor ticket creation transaction
            await monitorTransaction(ticketResult.hash)
          }
        }
      }

      // Step 3: Success
      console.log('🎉 Event creation completed!')
      
      // Add created event to context
      addCreatedEvent({
        eventId: simulatedEventId,
        event: {
          id: simulatedEventId,
          organizer: 'current_user', // This would be the actual user address
          name: eventData.eventName,
          ticketTypes: [], // This would be populated with actual ticket type IDs
          active: true
        },
        ticketTypes: [], // This would be populated with actual ticket type data
        creationHash: eventResult.hash,
        creationDate: new Date()
      })

      setCurrentStep('success')
      setIsSuccess(true)

      // Clear stored event data
      localStorage.removeItem('eventCreationData')

      // Redirect after success
      setTimeout(() => {
        router.push('/')
      }, 3000)

    } catch (error) {
      console.error('❌ Event creation error:', error)
      setError(error instanceof Error ? error.message : 'Unknown error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBack = () => {
    router.push('/create-event/details')
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

  if (!eventData) {
    return (
      <div className="screen-container min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-green border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (isSuccess) {
    return (
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
              Your event "{eventData.eventName}" has been created on the blockchain and is now live.
            </p>
            
            {transactionHash && (
              <div className="space-y-sm">
                <p className="text-caption text-text-muted">Transaction Hash:</p>
                <a
                  href={getTransactionUrl(transactionHash)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-caption text-primary-green hover:text-primary-green-hover font-mono break-all"
                >
                  {transactionHash}
                </a>
              </div>
            )}
          </div>

          <div className="w-full bg-border-primary rounded-full h-2">
            <div className="bg-primary-green h-2 rounded-full animate-pulse w-full"></div>
          </div>
        </div>
      </div>
    )
  }

  // Show blockchain creation progress
  if (isSubmitting) {
    return (
      <div className="screen-container min-h-screen flex items-center justify-center px-3">
        <div className="text-center space-y-xl max-w-md">
          <div className="w-20 h-20 border-4 border-primary-green border-t-transparent rounded-full animate-spin mx-auto"></div>
          
          <div className="space-y-lg">
            <h1 className="text-section-header font-bold text-text-primary">
              Creating Event on Blockchain
            </h1>
            
            <div className="space-y-md">
              {currentStep === 'creating' && (
                <p className="text-body text-text-secondary">
                  🏗️ Creating event on World Chain...
                </p>
              )}
              {currentStep === 'tickets' && (
                <p className="text-body text-text-secondary">
                  🎫 Creating ticket types...
                </p>
              )}
              
              {transactionHash && (
                <div className="space-y-sm">
                  <p className="text-caption text-text-muted">Transaction Hash:</p>
                  <a
                    href={getTransactionUrl(transactionHash)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-caption text-primary-green hover:text-primary-green-hover font-mono break-all"
                  >
                    {transactionHash}
                  </a>
                </div>
              )}
              
              {gasEstimate && (
                <div className="space-y-xs text-caption text-text-muted">
                  <p>Estimated gas cost: {gasEstimate.estimatedCost} ETH</p>
                </div>
              )}
            </div>
          </div>

          <div className="w-full bg-border-primary rounded-full h-2">
            <div className="bg-primary-green h-2 rounded-full animate-pulse w-3/4"></div>
          </div>
        </div>
      </div>
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

          {/* Gas Estimate */}
          {gasEstimate && (
            <div className="section-gap">
              <div className="card-primary bg-bg-tertiary border-border-secondary">
                <div className="space-y-sm">
                  <h3 className="text-small font-medium text-text-primary">⛽ Gas Estimate</h3>
                  <div className="space-y-xs text-caption text-text-secondary">
                    <p>Estimated cost: {gasEstimate.estimatedCost} ETH</p>
                    <p className="text-text-muted">This will create your event on World Chain</p>
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
              {eventData.details.images && eventData.details.images.length > 0 && (
                <div className="relative w-full aspect-event-banner rounded-md overflow-hidden mb-lg">
                  <img
                    src={eventData.details.images[0].url}
                    alt={eventData.eventName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-md right-md px-md py-xs bg-bg-overlay text-text-primary rounded-button text-small font-medium">
                    {eventData.details.category}
                  </div>
                </div>
              )}

              {/* Event Content */}
              <div className="space-y-md">
                {/* Category Badge */}
                <div className="inline-block px-md py-xs rounded-button text-small font-medium w-fit bg-primary-green bg-opacity-10 text-primary-green">
                  {eventData.details.category}
                </div>

                {/* Event Title */}
                <h3 className="text-body font-medium text-text-primary">
                  {eventData.eventName}
                </h3>

                {/* Brief Description */}
                <p className="text-caption text-text-muted mb-sm">
                  {eventData.details.description}
                </p>

                {/* Event Details */}
                <div className="space-y-xs">
                  {/* Date and Time */}
                  <div className="flex items-center gap-sm text-caption text-text-secondary">
                    <span>📅</span>
                    <span>{formatDate(eventData.details.date, eventData.details.time)}</span>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-sm text-caption text-text-secondary">
                    <span>📍</span>
                    <span className="line-clamp-1">
                      {eventData.details.location}
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
                  <span>Creating on Blockchain...</span>
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