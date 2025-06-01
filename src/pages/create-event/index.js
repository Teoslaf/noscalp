import Head from 'next/head'
import { useState } from 'react'
import { useRouter } from 'next/router'
import BottomNav from '../../components/BottomNav'

export default function CreateEventStep1() {
  const router = useRouter()
  const [eventName, setEventName] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleNext = () => {
    if (!eventName.trim()) {
      alert('Please enter an event name')
      return
    }

    setIsLoading(true)
    
    // Store the event name in localStorage for the multi-step form
    const eventData = { eventName: eventName.trim() }
    localStorage.setItem('createEventData', JSON.stringify(eventData))
    
    // Navigate to next step
    router.push('/create-event/tickets')
  }

  return (
    <>
      <Head>
        <title>Create Event - Noscalp</title>
        <meta name="description" content="Create a new event on Noscalp" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </Head>
      
      <div className="screen-container min-h-screen">
        {/* Top Bar */}
        <div className="nav-top fixed top-0 left-0 right-0 z-fixed">
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

            {/* Page Title */}
            <h1 className="text-body font-bold text-text-primary">
              Create Event
            </h1>

            {/* Spacer */}
            <div className="w-10"></div>
          </div>
        </div>

        {/* Content */}
        <div className="pt-top-bar-height px-3 flex flex-col min-h-screen pb-bottom-nav-height">
          {/* Progress Indicator */}
          <div className="section-gap">
            <div className="flex items-center justify-between mb-sm">
              <span className="text-caption text-text-secondary">Step 1 of 4</span>
              <span className="text-caption text-text-secondary">25%</span>
            </div>
            <div className="w-full bg-border-primary rounded-full h-2">
              <div className="bg-primary-green h-2 rounded-full transition-all duration-slow w-1/4"></div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col justify-center py-lg">
            <div className="space-y-xl">
              {/* Header */}
              <div className="text-center space-y-lg">
                <div className="w-20 h-20 bg-primary-green rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-10 h-10 text-text-on-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                
                <div>
                  <h2 className="text-section-header font-bold text-text-primary mb-sm">
                    What's the name of your event?
                  </h2>
                  <p className="text-body text-text-secondary">
                    Choose a clear and engaging name that describes your event
                  </p>
                </div>
              </div>

              {/* Event Name Input */}
              <div className="space-y-lg">
                <div>
                  <label className="block text-body font-medium text-text-primary mb-sm">
                    Event Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Tech Conference 2024, Art Workshop, Music Festival"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    className="input-primary w-full"
                    maxLength={100}
                    autoFocus
                  />
                  <div className="flex justify-between items-center mt-xs">
                    <span className="text-small text-text-muted">
                      Make it memorable and descriptive
                    </span>
                    <span className="text-small text-text-muted">
                      {eventName.length}/100
                    </span>
                  </div>
                </div>

                {/* Example Names */}
                <div className="space-y-sm">
                  <p className="text-caption text-text-secondary">Popular examples:</p>
                  <div className="flex flex-wrap gap-sm">
                    {[
                      'Web3 Summit Prague',
                      'Startup Networking Night', 
                      'Digital Art Exhibition',
                      'Blockchain Hackathon'
                    ].map((example, index) => (
                      <button
                        key={index}
                        onClick={() => setEventName(example)}
                        className="px-md py-xs bg-bg-tertiary hover:bg-border-primary text-text-secondary text-caption rounded-button transition-colors duration-fast"
                      >
                        {example}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="py-lg px-lg -mx-lg">
            <button
              onClick={handleNext}
              disabled={!eventName.trim() || isLoading}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Processing...' : 'Continue to Tickets'}
            </button>
          </div>
        </div>

        {/* Bottom Navigation */}
        <BottomNav activeTab="create" />
      </div>
    </>
  )
} 