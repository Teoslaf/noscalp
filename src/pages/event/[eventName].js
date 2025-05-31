import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import eventsData from '../../data/events_prototype_no_imgs.json'
import { getCategoryConfig, formatPrice } from '../../styles/design-tokens'
import MarkdownRenderer from '../../components/MarkdownRenderer'

export default function EventDetailPage() {
  const router = useRouter()
  const { eventName } = router.query
  const [event, setEvent] = useState(null)
  const [selectedTicketType, setSelectedTicketType] = useState(null)
  const [isLiked, setIsLiked] = useState(false)

  useEffect(() => {
    if (eventName) {
      const foundEvent = eventsData.find(e => e.event_name === decodeURIComponent(eventName))
      setEvent(foundEvent)
      if (foundEvent && foundEvent.ticket_types.length > 0) {
        setSelectedTicketType(foundEvent.ticket_types[0])
      }
    }
  }, [eventName])

  if (!event) {
    return (
      <div className="screen-container min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-green border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  const categoryConfig = getCategoryConfig(event.category)
  const eventDate = new Date(event.start_datetime)
  const eventEndDate = new Date(event.end_datetime)
  const isOnline = event.venue_or_online.startsWith('http')
  
  const totalTickets = event.ticket_types.reduce((sum, ticket) => sum + ticket.quantity, 0)
  const soldTickets = Math.floor(totalTickets * 0.3) // Simulated sold tickets
  const availableTickets = totalTickets - soldTickets

  const handleBuyTicket = () => {
    // Handle ticket purchase
    alert(`Purchasing ${selectedTicketType.name} ticket for ${formatPrice(selectedTicketType.price, event.currency)}`)
  }

  const handleContactOrganizer = () => {
    router.push(`/organizer/${encodeURIComponent(event.organizer.name)}`)
  }

  return (
    <>
      <Head>
        <title>{event.event_name} - EventHub</title>
        <meta name="description" content={event.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </Head>
      
      <div className="screen-container min-h-screen">
        {/* Top Bar */}
        <div className="nav-top fixed top-0 left-0 right-0 z-fixed bg-bg-primary bg-opacity-95 backdrop-blur-sm">
          <div className="flex items-center justify-between h-full px-3">
            {/* Back Button */}
            <button 
              className="p-sm hover:bg-interactive-hover rounded-md transition-colors duration-fast"
              onClick={() => router.back()}
            >
              <svg className="w-6 h-6 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Event Title */}
            <h1 className="text-body font-medium text-text-primary text-center flex-1 mx-lg line-clamp-1">
              {event.event_name}
            </h1>

            {/* Like Button */}
            <button 
              className="p-sm hover:bg-interactive-hover rounded-md transition-colors duration-fast"
              onClick={() => setIsLiked(!isLiked)}
            >
              <svg 
                className={`w-6 h-6 ${isLiked ? 'text-status-error fill-current' : 'text-text-secondary'}`} 
                fill={isLiked ? 'currentColor' : 'none'} 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Event Content */}
        <div className="pt-top-bar-height px-3">
          {/* Event Image */}
          <div className="relative w-full aspect-event-banner">
            <Image
              src={event.banner || '/images/events/event-placeholder.jpg'}
              alt={event.event_name}
              fill
              className="object-cover"
              sizes="100vw"
            />
            
            {/* Online Badge */}
            {isOnline && (
              <div className="absolute top-lg right-lg px-lg py-sm bg-bg-overlay text-text-primary rounded-button text-body font-medium">
                Online Event
              </div>
            )}
          </div>

          {/* Event Details */}
          <div className="space-y-lg p-lg">
            {/* Category Badge */}
            <div 
              className="inline-block px-lg py-sm rounded-button text-body font-medium w-fit"
              style={{
                backgroundColor: categoryConfig.bgColor,
                color: categoryConfig.color,
              }}
            >
              {event.category}
            </div>

            {/* Event Title and Basic Info */}
            <div className="space-y-lg">
              <h1 className="text-app-title font-bold text-text-primary">
                {event.event_name}
              </h1>
              
              <MarkdownRenderer 
                content={event.description}
                className="prose-event-description"
              />
            </div>

            {/* Event Info */}
            <div className="space-y-lg">
              {/* Date and Time */}
              <div className="flex items-start gap-lg">
                <svg className="w-6 h-6 text-secondary-lime mt-xs flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div>
                  <h3 className="text-body font-medium text-text-primary mb-xs">Date & Time</h3>
                  <p className="text-caption text-text-secondary">
                    {eventDate.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                  <p className="text-caption text-text-secondary">
                    {eventDate.toLocaleTimeString('en-US', { 
                      hour: 'numeric', 
                      minute: '2-digit', 
                      hour12: true 
                    })} - {eventEndDate.toLocaleTimeString('en-US', { 
                      hour: 'numeric', 
                      minute: '2-digit', 
                      hour12: true 
                    })}
                  </p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-lg">
                <svg className="w-6 h-6 text-secondary-lime mt-xs flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <h3 className="text-body font-medium text-text-primary mb-xs">Location</h3>
                  <p className="text-caption text-text-secondary">
                    {isOnline ? (
                      <span>
                        Online Event <br />
                        <a href={event.venue_or_online} className="text-primary-green hover:text-primary-green-hover">
                          Join Event Link
                        </a>
                      </span>
                    ) : (
                      event.venue_or_online
                    )}
                  </p>
                </div>
              </div>

              {/* Organizer */}
              <div className="flex items-start gap-lg">
                <svg className="w-6 h-6 text-secondary-lime mt-xs flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <div className="flex-1">
                  <h3 className="text-body font-medium text-text-primary mb-xs">Organizer</h3>
                  <button
                    onClick={handleContactOrganizer}
                    className="text-caption text-primary-green hover:text-primary-green-hover"
                  >
                    {event.organizer.name}
                  </button>
                  <p className="text-small text-text-muted">
                    {event.organizer.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Tickets Section */}
            <div className="space-y-lg">
              <h2 className="text-section-header font-medium text-text-primary">
                Tickets
              </h2>

              {/* Availability Info */}
              <div className="card-primary">
                <div className="flex items-center justify-between mb-lg">
                  <span className="text-body text-text-primary">
                    {availableTickets} tickets available
                  </span>
                  <span className="text-caption text-text-muted">
                    of {totalTickets} total
                  </span>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-border-primary rounded-full h-2">
                  <div 
                    className="bg-primary-green h-2 rounded-full transition-all duration-slow"
                    style={{ width: `${(soldTickets / totalTickets) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Ticket Types */}
              <div className="space-y-md">
                {event.ticket_types.map((ticket, index) => (
                  <div 
                    key={index}
                    className={`card-primary cursor-pointer transition-all duration-fast ${
                      selectedTicketType?.name === ticket.name 
                        ? 'border-primary-green bg-interactive-hover' 
                        : 'hover:border-border-focus'
                    }`}
                    onClick={() => setSelectedTicketType(ticket)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-body font-medium text-text-primary mb-xs">
                          {ticket.name}
                        </h3>
                        <p className="text-small text-text-muted">
                          {ticket.quantity} available
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-body font-medium text-primary-green">
                          {formatPrice(ticket.price, event.currency)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            {event.advanced_options.tags && event.advanced_options.tags.length > 0 && (
              <div className="space-y-lg">
                <h3 className="text-body font-medium text-text-primary">Tags</h3>
                <div className="flex flex-wrap gap-sm">
                  {event.advanced_options.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-md py-xs bg-bg-tertiary text-text-muted text-caption rounded-button"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Buy Ticket Button */}
            <div className="sticky bottom-lg">
              <button
                onClick={handleBuyTicket}
                disabled={!selectedTicketType || availableTickets === 0}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {availableTickets === 0 
                  ? 'Sold Out' 
                  : selectedTicketType 
                    ? `Buy ${selectedTicketType.name} - ${formatPrice(selectedTicketType.price, event.currency)}`
                    : 'Select a ticket type'
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
} 