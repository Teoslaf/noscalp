import Head from 'next/head'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

export default function CreateEventStep2() {
  const router = useRouter()
  const [eventData, setEventData] = useState(null)
  const [tickets, setTickets] = useState([
    { id: 1, name: 'General Admission', quantity: 100, price: 50, currency: 'USD' }
  ])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Load event data from previous step
    const savedData = localStorage.getItem('createEventData')
    if (savedData) {
      setEventData(JSON.parse(savedData))
    } else {
      // Redirect back to step 1 if no data
      router.push('/create-event')
    }
  }, [router])

  const addTicketType = () => {
    const newTicket = {
      id: Date.now(),
      name: '',
      quantity: 0,
      price: 0,
      currency: 'USD'
    }
    setTickets([...tickets, newTicket])
  }

  const updateTicket = (id, field, value) => {
    setTickets(tickets.map(ticket => 
      ticket.id === id ? { ...ticket, [field]: value } : ticket
    ))
  }

  const removeTicket = (id) => {
    if (tickets.length > 1) {
      setTickets(tickets.filter(ticket => ticket.id !== id))
    }
  }

  const handleNext = () => {
    // Validate tickets
    const validTickets = tickets.filter(ticket => 
      ticket.name.trim() && ticket.quantity > 0 && ticket.price >= 0
    )

    if (validTickets.length === 0) {
      alert('Please add at least one valid ticket type')
      return
    }

    setIsLoading(true)

    // Update event data with tickets
    const updatedEventData = {
      ...eventData,
      tickets: validTickets
    }
    localStorage.setItem('createEventData', JSON.stringify(updatedEventData))

    // Navigate to next step
    router.push('/create-event/details')
  }

  const handleBack = () => {
    router.push('/create-event')
  }

  if (!eventData) {
    return (
      <div className="screen-container min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-green border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Create Tickets - Noscalp</title>
        <meta name="description" content="Set up tickets for your event" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </Head>
      
      <div className="screen-container min-h-screen">
        {/* Top Bar */}
        <div className="nav-top fixed top-0 left-0 right-0 z-fixed">
          <div className="flex items-center justify-between h-full">
            {/* Back Button */}
            <button 
              className="p-sm hover:bg-interactive-hover rounded-md transition-colors duration-fast"
              onClick={handleBack}
            >
              <svg className="w-6 h-6 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Page Title */}
            <h1 className="text-app-title font-bold text-text-primary">
              Create Tickets
            </h1>

            {/* Spacer */}
            <div className="w-10"></div>
          </div>
        </div>

        {/* Content */}
        <div className="pt-top-bar-height px-screen-padding pb-xxxl">
          {/* Progress Indicator */}
          <div className="section-gap">
            <div className="flex items-center justify-between mb-sm">
              <span className="text-caption text-text-secondary">Step 2 of 4</span>
              <span className="text-caption text-text-secondary">50%</span>
            </div>
            <div className="w-full bg-border-primary rounded-full h-2">
              <div className="bg-primary-green h-2 rounded-full transition-all duration-slow w-2/4"></div>
            </div>
          </div>

          {/* Event Name Reference */}
          <div className="section-gap">
            <div className="card-primary">
              <h3 className="text-body font-medium text-text-primary mb-xs">Creating tickets for:</h3>
              <p className="text-section-header font-bold text-primary-green">{eventData.eventName}</p>
            </div>
          </div>

          {/* Header */}
          <div className="section-gap text-center space-y-sm">
            <h2 className="text-section-header font-bold text-text-primary">
              Set up your tickets
            </h2>
            <p className="text-body text-text-secondary">
              Define different ticket types, quantities, and prices
            </p>
          </div>

          {/* Ticket Types */}
          <div className="space-y-lg">
            {tickets.map((ticket, index) => (
              <div key={ticket.id} className="card-primary space-y-lg">
                <div className="flex items-center justify-between">
                  <h3 className="text-body font-medium text-text-primary">
                    Ticket Type {index + 1}
                  </h3>
                  {tickets.length > 1 && (
                    <button
                      onClick={() => removeTicket(ticket.id)}
                      className="p-xs hover:bg-status-error hover:bg-opacity-20 rounded-md transition-colors duration-fast"
                    >
                      <svg className="w-5 h-5 text-status-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Ticket Name */}
                <div>
                  <label className="block text-caption font-medium text-text-primary mb-xs">
                    Ticket Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., General Admission, VIP, Early Bird"
                    value={ticket.name}
                    onChange={(e) => updateTicket(ticket.id, 'name', e.target.value)}
                    className="input-primary w-full"
                  />
                </div>

                {/* Quantity and Price */}
                <div className="grid grid-cols-2 gap-lg">
                  {/* Quantity */}
                  <div>
                    <label className="block text-caption font-medium text-text-primary mb-xs">
                      Quantity
                    </label>
                    <input
                      type="number"
                      placeholder="100"
                      value={ticket.quantity}
                      onChange={(e) => updateTicket(ticket.id, 'quantity', parseInt(e.target.value) || 0)}
                      className="input-primary w-full"
                      min="0"
                    />
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-caption font-medium text-text-primary mb-xs">
                      Price
                    </label>
                    <div className="flex gap-sm">
                      <input
                        type="number"
                        placeholder="50"
                        value={ticket.price}
                        onChange={(e) => updateTicket(ticket.id, 'price', parseFloat(e.target.value) || 0)}
                        className="input-primary flex-1"
                        min="0"
                        step="0.01"
                      />
                      <select
                        value={ticket.currency}
                        onChange={(e) => updateTicket(ticket.id, 'currency', e.target.value)}
                        className="input-primary text-small px-md py-0 w-20"
                      >
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                        <option value="CZK">CZK</option>
                        <option value="ETH">ETH</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Ticket Preview */}
                {ticket.name && ticket.quantity > 0 && (
                  <div className="bg-bg-tertiary rounded-md p-lg border border-border-secondary">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-caption font-medium text-text-primary">{ticket.name}</h4>
                        <p className="text-small text-text-muted">{ticket.quantity} available</p>
                      </div>
                      <div className="text-body font-bold text-primary-green">
                        {ticket.price === 0 ? 'Free' : `${ticket.price} ${ticket.currency}`}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Add Ticket Type Button */}
            <button
              onClick={addTicketType}
              className="btn-secondary w-full"
            >
              <svg className="w-5 h-5 mr-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Another Ticket Type
            </button>
          </div>

          {/* Common Ticket Examples */}
          <div className="section-gap">
            <p className="text-caption text-text-secondary mb-sm">Quick templates:</p>
            <div className="flex flex-wrap gap-sm">
              {[
                { name: 'Early Bird', price: 25 },
                { name: 'Regular', price: 50 },
                { name: 'VIP', price: 100 },
                { name: 'Student', price: 20 },
                { name: 'Free', price: 0 }
              ].map((template, index) => (
                <button
                  key={index}
                  onClick={() => {
                    const newTicket = {
                      id: Date.now(),
                      name: template.name,
                      quantity: 50,
                      price: template.price,
                      currency: 'USD'
                    }
                    setTickets([...tickets, newTicket])
                  }}
                  className="px-md py-xs bg-bg-tertiary hover:bg-border-primary text-text-secondary text-caption rounded-button transition-colors duration-fast"
                >
                  + {template.name} ({template.price === 0 ? 'Free' : `$${template.price}`})
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex gap-lg pt-xl">
            <button
              onClick={handleBack}
              className="btn-secondary flex-1"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={isLoading}
              className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Processing...' : 'Continue to Details'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
} 