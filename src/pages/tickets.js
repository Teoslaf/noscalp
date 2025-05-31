import Head from 'next/head'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import BottomNav from '../components/BottomNav'

export default function TicketsPage() {
  const router = useRouter()
  const [userTickets, setUserTickets] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('upcoming') // 'upcoming' or 'past'

  // Mock user tickets data (in real app, this would come from API)
  const mockTickets = [
    {
      id: 1,
      eventId: 15,
      eventName: 'Web3 Summit Prague 2024',
      eventImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
      date: '2024-06-15',
      time: '10:00',
      location: 'Prague Convention Center',
      ticketType: 'VIP Pass',
      quantity: 1,
      originalPrice: 150,
      currency: 'USD',
      purchaseDate: '2024-05-01',
      status: 'upcoming',
      nftImage: 'https://images.unsplash.com/photo-1541532713592-79a0317b6b84?w=400&h=400&fit=crop',
      qrCode: 'QR123456789',
      category: 'Technology'
    },
    {
      id: 2,
      eventId: 8,
      eventName: 'Startup Networking Night',
      eventImage: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=600&fit=crop',
      date: '2024-07-20',
      time: '18:00',
      location: 'Innovation Hub',
      ticketType: 'General Admission',
      quantity: 2,
      originalPrice: 25,
      currency: 'USD',
      purchaseDate: '2024-06-01',
      status: 'upcoming',
      nftImage: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=400&h=400&fit=crop',
      qrCode: 'QR987654321',
      category: 'Business'
    },
    {
      id: 3,
      eventId: 3,
      eventName: 'Digital Art Exhibition',
      eventImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      date: '2024-04-10',
      time: '14:00',
      location: 'Modern Art Gallery',
      ticketType: 'Early Bird',
      quantity: 1,
      originalPrice: 40,
      currency: 'USD',
      purchaseDate: '2024-03-15',
      status: 'past',
      nftImage: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop',
      qrCode: 'QR456789123',
      category: 'Arts & Culture'
    },
    {
      id: 4,
      eventId: 12,
      eventName: 'Blockchain Hackathon',
      eventImage: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop',
      date: '2024-03-05',
      time: '09:00',
      location: 'Tech Campus',
      ticketType: 'Participant',
      quantity: 1,
      originalPrice: 0,
      currency: 'USD',
      purchaseDate: '2024-02-20',
      status: 'past',
      nftImage: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=400&fit=crop',
      qrCode: 'QR789123456',
      category: 'Technology'
    }
  ]

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem('isAuthenticated')
    if (!isAuthenticated) {
      router.push('/auth')
      return
    }

    // Load user tickets
    setTimeout(() => {
      setUserTickets(mockTickets)
      setIsLoading(false)
    }, 1000)
  }, [router])

  const getFilteredTickets = () => {
    const today = new Date().toISOString().split('T')[0]
    return userTickets.filter(ticket => {
      if (activeTab === 'upcoming') {
        return ticket.date >= today
      } else {
        return ticket.date < today
      }
    })
  }

  const formatDate = (date, time) => {
    const eventDate = new Date(`${date}T${time}`)
    return eventDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getCategoryColor = (category) => {
    const colors = {
      'Technology': 'bg-blue-500',
      'Business': 'bg-green-500',
      'Arts & Culture': 'bg-purple-500',
      'Music': 'bg-pink-500',
      'Sports & Fitness': 'bg-orange-500',
      'Food & Drink': 'bg-yellow-500'
    }
    return colors[category] || 'bg-gray-500'
  }

  const handleTicketClick = (ticket) => {
    // Navigate to ticket detail view
    router.push(`/ticket/${ticket.id}`)
  }

  if (isLoading) {
    return (
      <div className="screen-container min-h-screen flex items-center justify-center">
        <div className="text-center space-y-lg">
          <div className="w-12 h-12 border-4 border-primary-green border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-body text-text-secondary">Loading your tickets...</p>
        </div>
      </div>
    )
  }

  const upcomingTickets = getFilteredTickets().filter(t => activeTab === 'upcoming')
  const pastTickets = getFilteredTickets().filter(t => activeTab === 'past')

  return (
    <>
      <Head>
        <title>My Tickets - Noscalp</title>
        <meta name="description" content="View your event tickets as NFTs" />
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
              My Tickets
            </h1>

            {/* Filter/Sort Button */}
            <button className="p-sm hover:bg-interactive-hover rounded-md transition-colors duration-fast">
              <svg className="w-6 h-6 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="pt-top-bar-height pb-bottom-nav-height">
          {/* Tab Navigation */}
          <div className="section-gap">
            <div className="flex bg-bg-secondary rounded-button p-xs">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`flex-1 py-sm px-md rounded-button text-caption font-medium transition-colors duration-fast ${
                  activeTab === 'upcoming'
                    ? 'bg-primary-green text-text-on-primary'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Future Events ({upcomingTickets.length})
              </button>
              <button
                onClick={() => setActiveTab('past')}
                className={`flex-1 py-sm px-md rounded-button text-caption font-medium transition-colors duration-fast ${
                  activeTab === 'past'
                    ? 'bg-primary-green text-text-on-primary'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Past Events ({pastTickets.length})
              </button>
            </div>
          </div>

          {/* Tickets Grid */}
          <div>
            {getFilteredTickets().length === 0 ? (
              <div className="text-center py-xxxl space-y-lg">
                <div className="w-20 h-20 bg-bg-tertiary rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-10 h-10 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-section-header font-bold text-text-primary mb-sm">
                    {activeTab === 'upcoming' ? 'No Upcoming Events' : 'No Past Events'}
                  </h3>
                  <p className="text-body text-text-secondary max-w-sm mx-auto">
                    {activeTab === 'upcoming' 
                      ? 'You haven\'t purchased tickets for any upcoming events yet. Discover events to get started!'
                      : 'You haven\'t attended any events yet. Your past event NFTs will appear here.'
                    }
                  </p>
                </div>
                {activeTab === 'upcoming' && (
                  <button
                    onClick={() => router.push('/')}
                    className="btn-primary"
                  >
                    Discover Events
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-lg pb-xl">
                {getFilteredTickets().map((ticket) => (
                  <div
                    key={ticket.id}
                    onClick={() => handleTicketClick(ticket)}
                    className="card-primary cursor-pointer hover:scale-105 transition-transform duration-fast"
                  >
                    <div className="flex gap-lg">
                      {/* NFT Image */}
                      <div className="relative flex-shrink-0">
                        <div className="w-24 h-24 rounded-md overflow-hidden bg-bg-tertiary">
                          <img
                            src={ticket.nftImage}
                            alt={`${ticket.eventName} NFT`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        {/* Category Badge */}
                        <div className={`absolute top-xs right-xs ${getCategoryColor(ticket.category)} text-white px-xs py-0.5 rounded text-small`}>
                          NFT
                        </div>

                        {/* Quantity Badge */}
                        {ticket.quantity > 1 && (
                          <div className="absolute top-xs left-xs bg-text-primary text-bg-primary px-xs py-0.5 rounded-full text-small font-bold">
                            {ticket.quantity}x
                          </div>
                        )}
                      </div>

                      {/* Ticket Info */}
                      <div className="flex-1 min-w-0 space-y-sm">
                        <div>
                          <h3 className="text-body font-bold text-text-primary mb-xs line-clamp-1">
                            {ticket.eventName}
                          </h3>
                          <p className="text-caption text-text-secondary">
                            {ticket.ticketType}
                          </p>
                        </div>

                        <div className="space-y-xs">
                          <div className="flex items-center gap-xs">
                            <svg className="w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-small text-text-secondary">
                              {formatDate(ticket.date, ticket.time)}
                            </span>
                          </div>

                          <div className="flex items-center gap-xs">
                            <svg className="w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="text-small text-text-secondary line-clamp-1">
                              {ticket.location}
                            </span>
                          </div>
                        </div>

                        {/* Price and Status */}
                        <div className="flex items-center justify-between pt-xs border-t border-border-secondary">
                          <span className="text-caption font-medium text-primary-green">
                            {ticket.originalPrice === 0 ? 'Free' : `$${ticket.originalPrice}`}
                          </span>
                          <div className={`px-sm py-xs rounded-full text-small ${
                            activeTab === 'upcoming' 
                              ? 'bg-primary-green bg-opacity-10 text-primary-green'
                              : 'bg-text-muted bg-opacity-10 text-text-muted'
                          }`}>
                            {activeTab === 'upcoming' ? 'Active' : 'Used'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Stats Section */}
          {userTickets.length > 0 && (
            <div className="pb-xl">
              <div className="card-primary space-y-lg">
                <h3 className="text-body font-medium text-text-primary">Collection Stats</h3>
                <div className="grid grid-cols-3 gap-lg text-center">
                  <div>
                    <p className="text-section-header font-bold text-primary-green">
                      {userTickets.length}
                    </p>
                    <p className="text-caption text-text-secondary">Total NFTs</p>
                  </div>
                  <div>
                    <p className="text-section-header font-bold text-primary-green">
                      {upcomingTickets.length}
                    </p>
                    <p className="text-caption text-text-secondary">Upcoming</p>
                  </div>
                  <div>
                    <p className="text-section-header font-bold text-primary-green">
                      {userTickets.reduce((sum, ticket) => sum + ticket.quantity, 0)}
                    </p>
                    <p className="text-caption text-text-secondary">Total Tickets</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Navigation */}
        <BottomNav activeTab="tickets" />
      </div>
    </>
  )
} 