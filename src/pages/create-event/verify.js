import Head from 'next/head'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

export default function CreateEventStep4() {
  const router = useRouter()
  const [eventData, setEventData] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    // Load complete event data
    const savedData = localStorage.getItem('createEventData')
    if (savedData) {
      const data = JSON.parse(savedData)
      setEventData(data)
      
      // Validate all steps are complete
      if (!data.eventName || !data.tickets || !data.details) {
        // Redirect to appropriate step if incomplete
        if (!data.eventName) {
          router.push('/create-event')
        } else if (!data.tickets) {
          router.push('/create-event/tickets')
        } else if (!data.details) {
          router.push('/create-event/details')
        }
      }
    } else {
      router.push('/create-event')
    }
  }, [router])

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Create new event object
      const newEvent = {
        id: Date.now(),
        name: eventData.eventName,
        description: eventData.details.description,
        date: eventData.details.date,
        time: eventData.details.time,
        location: eventData.details.location,
        category: eventData.details.category,
        images: eventData.details.images,
        tickets: eventData.tickets,
        organizer: {
          name: 'Current User', // This would come from auth context
          id: 'user-123'
        },
        createdAt: new Date().toISOString(),
        status: 'upcoming',
        attendees: 0,
        isLiked: false
      }

      // Store in localStorage (in real app, this would be sent to API)
      const existingEvents = JSON.parse(localStorage.getItem('userEvents') || '[]')
      existingEvents.push(newEvent)
      localStorage.setItem('userEvents', JSON.stringify(existingEvents))

      // Clear creation data
      localStorage.removeItem('createEventData')

      setIsSuccess(true)

      // Redirect after success
      setTimeout(() => {
        router.push('/')
      }, 3000)

    } catch (error) {
      console.error('Error creating event:', error)
      alert('Failed to create event. Please try again.')
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
              Your event "{eventData.eventName}" has been created and is now live. 
              You'll be redirected to the home page shortly.
            </p>
          </div>

          <div className="w-full bg-border-primary rounded-full h-2">
            <div className="bg-primary-green h-2 rounded-full animate-pulse w-full"></div>
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
              Check all details before publishing your event
            </p>
          </div>

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
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-sm">
                  <div className="w-4 h-4 border-2 border-text-on-primary border-t-transparent rounded-full animate-spin"></div>
                  Creating Event...
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