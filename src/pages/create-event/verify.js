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
            <h1 className="text-app-title font-bold text-text-primary">
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
            {/* Main Event Card */}
            <div className="card-primary space-y-lg">
              {/* Event Image */}
              {eventData.details.images && eventData.details.images.length > 0 && (
                <div className="relative">
                  <img
                    src={eventData.details.images[0].url}
                    alt={eventData.eventName}
                    className="w-full h-48 object-cover rounded-md"
                  />
                  <div className="absolute top-sm right-sm bg-primary-green text-text-on-primary px-sm py-xs rounded text-small">
                    {eventData.details.category}
                  </div>
                </div>
              )}

              {/* Event Info */}
              <div className="space-y-lg">
                <div>
                  <h3 className="text-section-header font-bold text-text-primary mb-sm">
                    {eventData.eventName}
                  </h3>
                  <p className="text-body text-text-secondary">
                    {eventData.details.description}
                  </p>
                </div>

                {/* Event Details Grid */}
                <div className="grid grid-cols-2 gap-lg">
                  <div className="space-y-sm">
                    <div className="flex items-center gap-sm">
                      <svg className="w-5 h-5 text-primary-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <div>
                        <p className="text-caption text-text-muted">Date & Time</p>
                        <p className="text-body text-text-primary font-medium">
                          {formatDate(eventData.details.date, eventData.details.time)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-sm">
                    <div className="flex items-center gap-sm">
                      <svg className="w-5 h-5 text-primary-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <div>
                        <p className="text-caption text-text-muted">Location</p>
                        <p className="text-body text-text-primary font-medium">
                          {eventData.details.location}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-sm">
                    <div className="flex items-center gap-sm">
                      <svg className="w-5 h-5 text-primary-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                      </svg>
                      <div>
                        <p className="text-caption text-text-muted">Tickets</p>
                        <p className="text-body text-text-primary font-medium">
                          {getTotalTickets()} available
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-sm">
                    <div className="flex items-center gap-sm">
                      <svg className="w-5 h-5 text-primary-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                      <div>
                        <p className="text-caption text-text-muted">Price Range</p>
                        <p className="text-body text-text-primary font-medium">
                          {getTicketPriceRange()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Ticket Types Summary */}
            <div className="card-primary space-y-lg">
              <h4 className="text-body font-medium text-text-primary">Ticket Types</h4>
              <div className="space-y-sm">
                {eventData.tickets.map((ticket, index) => (
                  <div key={index} className="flex items-center justify-between p-md bg-bg-tertiary rounded-md">
                    <div>
                      <p className="text-body font-medium text-text-primary">{ticket.name}</p>
                      <p className="text-caption text-text-muted">{ticket.quantity} available</p>
                    </div>
                    <div className="text-body font-bold text-primary-green">
                      {ticket.price === 0 ? 'Free' : `${ticket.price} ${ticket.currency}`}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Images */}
            {eventData.details.images && eventData.details.images.length > 1 && (
              <div className="card-primary space-y-lg">
                <h4 className="text-body font-medium text-text-primary">
                  Additional Images ({eventData.details.images.length - 1})
                </h4>
                <div className="grid grid-cols-3 gap-sm">
                  {eventData.details.images.slice(1).map((image, index) => (
                    <img
                      key={index}
                      src={image.url}
                      alt={`Event image ${index + 2}`}
                      className="w-full h-20 object-cover rounded-md border border-border-secondary"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Terms and Create Button */}
          <div className="space-y-lg pt-xl">
            <div className="card-primary">
              <div className="flex items-start gap-sm">
                <input
                  type="checkbox"
                  id="terms"
                  className="mt-1 w-4 h-4 text-primary-green bg-bg-primary border-border-primary rounded focus:ring-primary-green"
                  defaultChecked
                />
                <label htmlFor="terms" className="text-caption text-text-secondary">
                  I agree to the Terms of Service and confirm that all information provided is accurate. 
                  I understand that false information may result in event removal.
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-lg">
              <button
                onClick={handleBack}
                disabled={isSubmitting}
                className="btn-secondary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Back to Edit
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-sm">
                    <div className="w-4 h-4 border-2 border-text-on-primary border-t-transparent rounded-full animate-spin"></div>
                    Creating Event...
                  </div>
                ) : (
                  'Create Event'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
} 