import Head from 'next/head'
import { useState, useMemo } from 'react'
import { useRouter } from 'next/router'
import BottomNav from '../components/BottomNav'
import eventsData from '../data/events_prototype_no_imgs.json'
import { getCategoryConfig, formatPrice } from '../styles/design-tokens'

export default function SearchPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchType, setSearchType] = useState('events') // 'events' or 'organizers'

  // Search results based on query and type
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return []

    const query = searchQuery.toLowerCase().trim()

    if (searchType === 'events') {
      return eventsData.filter(event => 
        event.event_name.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.category.toLowerCase().includes(query) ||
        event.venue_or_online.toLowerCase().includes(query) ||
        (event.advanced_options.tags && event.advanced_options.tags.some(tag => 
          tag.toLowerCase().includes(query)
        ))
      )
    } else {
      // Get unique organizers that match the search
      const organizerMatches = eventsData.filter(event =>
        event.organizer.name.toLowerCase().includes(query) ||
        event.organizer.email.toLowerCase().includes(query)
      )
      
      // Remove duplicates based on organizer name
      const uniqueOrganizers = organizerMatches.reduce((acc, event) => {
        const existing = acc.find(item => item.organizer.name === event.organizer.name)
        if (!existing) {
          acc.push({
            ...event,
            eventCount: organizerMatches.filter(e => e.organizer.name === event.organizer.name).length
          })
        }
        return acc
      }, [])
      
      return uniqueOrganizers
    }
  }, [searchQuery, searchType])

  const handleEventClick = (event) => {
    router.push(`/event/${encodeURIComponent(event.event_name)}`)
  }

  const handleOrganizerClick = (organizer) => {
    router.push(`/organizer/${encodeURIComponent(organizer.organizer.name)}`)
  }

  const renderEventResult = (event) => {
    const categoryConfig = getCategoryConfig(event.category)
    const eventDate = new Date(event.start_datetime)
    const isOnline = event.venue_or_online.startsWith('http')
    const minPrice = Math.min(...event.ticket_types.map(t => t.price))

    return (
      <div
        key={event.event_name}
        className="card-primary cursor-pointer hover:border-border-focus transition-all duration-fast"
        onClick={() => handleEventClick(event)}
      >
        <div className="flex gap-lg">
          {/* Event Image Placeholder */}
          <div className="w-20 h-20 bg-bg-tertiary rounded-md flex-shrink-0 flex items-center justify-center">
            <svg className="w-8 h-8 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>

          {/* Event Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-sm">
              <h3 className="text-body font-medium text-text-primary line-clamp-1">
                {event.event_name}
              </h3>
              <span 
                className="px-sm py-xs rounded text-small font-medium ml-sm flex-shrink-0"
                style={{
                  backgroundColor: categoryConfig.bgColor,
                  color: categoryConfig.color,
                }}
              >
                {event.category}
              </span>
            </div>

            <p className="text-caption text-text-secondary line-clamp-2 mb-sm">
              {event.description}
            </p>

            <div className="flex items-center justify-between text-small text-text-muted">
              <div className="flex items-center gap-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>
                  {eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
              
              <div className="flex items-center gap-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                <span className="line-clamp-1">
                  {isOnline ? 'Online' : event.venue_or_online.split(',').pop().trim()}
                </span>
              </div>
              
              <span className="text-primary-green font-medium">
                {formatPrice(minPrice, event.currency)}+
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderOrganizerResult = (organizer) => {
    return (
      <div
        key={organizer.organizer.name}
        className="card-primary cursor-pointer hover:border-border-focus transition-all duration-fast"
        onClick={() => handleOrganizerClick(organizer)}
      >
        <div className="flex items-center gap-lg">
          {/* Organizer Avatar */}
          <div className="w-16 h-16 bg-primary-green rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-text-on-primary font-bold text-body">
              {organizer.organizer.name.charAt(0).toUpperCase()}
            </span>
          </div>

          {/* Organizer Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-body font-medium text-text-primary mb-xs">
              {organizer.organizer.name}
            </h3>
            <p className="text-caption text-text-secondary mb-xs">
              {organizer.organizer.email}
            </p>
            <div className="flex items-center gap-lg text-small text-text-muted">
              <span>{organizer.eventCount} event{organizer.eventCount !== 1 ? 's' : ''}</span>
              {organizer.organizer.phone && (
                <span>{organizer.organizer.phone}</span>
              )}
            </div>
          </div>

          {/* Arrow Icon */}
          <svg className="w-5 h-5 text-text-muted flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Search - Noscalp</title>
        <meta name="description" content="Search for events and organizers" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </Head>
      
      <div className="screen-container min-h-screen">
        {/* Top Bar */}
        <div className="nav-top fixed top-0 left-0 right-0 z-fixed">
          <div className="flex items-center justify-between h-full">
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
            <h1 className="text-app-title font-bold text-text-primary">
              Search
            </h1>

            {/* Spacer */}
            <div className="w-10"></div>
          </div>
        </div>

        {/* Content */}
        <div className="pt-top-bar-height px-screen-padding pb-bottom-nav-height">
          {/* Search Bar */}
          <div className="section-gap">
            <div className="relative">
              <input
                type="text"
                placeholder={`Search ${searchType}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-primary w-full pl-button-height"
                autoFocus
              />
              <svg 
                className="absolute left-lg top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Search Type Toggle */}
          <div className="section-gap">
            <div className="flex bg-bg-secondary rounded-button p-xs">
              <button
                onClick={() => setSearchType('events')}
                className={`flex-1 py-sm px-lg text-caption font-medium rounded-sm transition-all duration-fast ${
                  searchType === 'events'
                    ? 'bg-primary-green text-text-on-primary'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Events
              </button>
              <button
                onClick={() => setSearchType('organizers')}
                className={`flex-1 py-sm px-lg text-caption font-medium rounded-sm transition-all duration-fast ${
                  searchType === 'organizers'
                    ? 'bg-primary-green text-text-on-primary'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Organizers
              </button>
            </div>
          </div>

          {/* Search Results */}
          <div className="pb-xxxl">
            {searchQuery.trim() ? (
              <>
                {/* Results Header */}
                <div className="section-gap">
                  <h2 className="text-section-header font-medium text-text-primary">
                    {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "{searchQuery}"
                  </h2>
                </div>

                {/* Results List */}
                {searchResults.length > 0 ? (
                  <div className="space-y-md">
                    {searchResults.map(result => 
                      searchType === 'events' 
                        ? renderEventResult(result)
                        : renderOrganizerResult(result)
                    )}
                  </div>
                ) : (
                  /* No Results */
                  <div className="flex flex-col items-center justify-center py-xxxl text-center">
                    <svg className="w-16 h-16 text-text-muted mb-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <h3 className="text-body font-medium text-text-secondary mb-sm">
                      No {searchType} found
                    </h3>
                    <p className="text-caption text-text-muted max-w-xs">
                      Try searching with different keywords or check your spelling.
                    </p>
                  </div>
                )}
              </>
            ) : (
              /* Search Prompt */
              <div className="flex flex-col items-center justify-center py-xxxl text-center">
                <svg className="w-16 h-16 text-text-muted mb-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 className="text-body font-medium text-text-secondary mb-sm">
                  Search {searchType}
                </h3>
                <p className="text-caption text-text-muted max-w-xs">
                  {searchType === 'events' 
                    ? 'Find events by name, category, location, or description'
                    : 'Find organizers by name or email address'
                  }
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Bottom Navigation */}
        <BottomNav activeTab="search" />
      </div>
    </>
  )
} 