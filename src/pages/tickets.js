import Head from 'next/head'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import BottomNav from '../components/BottomNav'

export default function TicketsPage() {
  const router = useRouter()
  const [userTickets, setUserTickets] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('upcoming') // 'upcoming' or 'past'
  const [expandedTicket, setExpandedTicket] = useState(null) // Track which ticket is expanded

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
      nftImage: 'https://images.unsplash.com/photo-1673022177475-5f15ec15ff11?q=80&w=2942&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      qrCode: 'QR123456789',
      category: 'Technology',
      description: 'Join industry leaders and blockchain enthusiasts for the premier Web3 conference in Prague. Network with innovators, learn about cutting-edge technologies, and discover the future of decentralized web.',
      organizer: 'Web3 Foundation',
      benefits: ['VIP Lounge Access', 'Priority Seating', 'Networking Dinner', 'Conference Swag']
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
      category: 'Business',
      description: 'Connect with entrepreneurs, investors, and startup enthusiasts in an intimate networking environment. Share ideas, find co-founders, and build meaningful business relationships.',
      organizer: 'Startup Prague',
      benefits: ['Welcome Drink', 'Business Card Exchange', 'Pitch Competition Entry']
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
      nftImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=400&fit=crop',
      qrCode: 'QR456789123',
      category: 'Arts & Culture',
      description: 'Explore the intersection of technology and creativity in this groundbreaking digital art exhibition featuring NFT artists and interactive installations.',
      organizer: 'Digital Arts Collective',
      benefits: ['Artist Meet & Greet', 'Exhibition Catalog', 'Limited Edition Print']
    },
    {
      id: 4,
      eventId: 12,
      eventName: 'Blockchain Hackathon',
      eventImage: 'https://images.unsplash.com/photo-1673022177475-5f15ec15ff11?q=80&w=2942&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
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
      category: 'Technology',
      description: '48-hour intensive hackathon focused on building innovative blockchain solutions. Work with talented developers and compete for prizes.',
      organizer: 'Blockchain Developers Prague',
      benefits: ['Free Meals', 'Mentorship Sessions', 'Prize Pool Access', 'Developer Swag']
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
    // Toggle expansion instead of navigating
    if (expandedTicket === ticket.id) {
      setExpandedTicket(null)
    } else {
      setExpandedTicket(ticket.id)
    }
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
              My Tickets
            </h1>

            {/* NFTs Link */}
            <button 
              className="p-sm hover:bg-interactive-hover rounded-md transition-colors duration-fast"
              onClick={() => router.push('/nfts')}
            >
              <svg className="w-6 h-6 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="pt-top-bar-height px-3 pb-bottom-nav-height">
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
                Upcoming ({upcomingTickets.length})
              </button>
              <button
                onClick={() => setActiveTab('past')}
                className={`flex-1 py-sm px-md rounded-button text-caption font-medium transition-colors duration-fast ${
                  activeTab === 'past'
                    ? 'bg-primary-green text-text-on-primary'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Past ({pastTickets.length})
              </button>
            </div>
          </div>

          {/* Tickets List */}
          <div className="space-y-lg">
            {getFilteredTickets().length > 0 ? (
              getFilteredTickets().map((ticket) => (
                <div
                  key={ticket.id}
                  className={`card-primary cursor-pointer transition-all duration-normal ease-out hover:transform hover:translate-y-[-2px] hover:shadow-lg ${
                    expandedTicket === ticket.id ? 'ring-2 ring-primary-green' : ''
                  }`}
                  onClick={() => handleTicketClick(ticket)}
                >
                  {/* Basic Ticket Info */}
                  <div className="space-y-md">
                    {/* NFT Image */}
                    <div className="w-full aspect-square rounded-lg overflow-hidden">
                      <img
                        src={ticket.nftImage}
                        alt={`${ticket.eventName} NFT`}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Ticket Details */}
                    <div className="space-y-xs">
                      <div className="flex items-start justify-between">
                        <h3 className="text-body font-medium text-text-primary line-clamp-2 flex-1">
                          {ticket.eventName}
                        </h3>
                        <div className={`w-3 h-3 rounded-full ${getCategoryColor(ticket.category)} ml-sm mt-xs flex-shrink-0`}></div>
                      </div>
                      
                      <div className="flex items-center gap-sm text-caption text-text-secondary">
                        <span>📅</span>
                        <span>{formatDate(ticket.date, ticket.time)}</span>
                        <span>•</span>
                        <span>{ticket.ticketType}</span>
                      </div>
                      
                      <div className="flex items-center gap-sm text-caption text-text-secondary">
                        <span>📍</span>
                        <span className="line-clamp-1">{ticket.location}</span>
                      </div>

                      <div className="flex items-center justify-between pt-xs">
                        <span className="text-body font-medium text-primary-green">
                          ${ticket.originalPrice}
                        </span>
                        <span className="text-caption text-text-muted">
                          Qty: {ticket.quantity}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {expandedTicket === ticket.id && (
                    <div className="mt-lg pt-lg border-t border-border-muted space-y-lg">
                      {/* Event Image */}
                      <div className="rounded-lg overflow-hidden">
                        <img
                          src={ticket.eventImage}
                          alt={ticket.eventName}
                          className="w-full h-48 object-cover"
                        />
                      </div>

                      {/* Event Description */}
                      <div>
                        <h4 className="text-body font-medium text-text-primary mb-sm">About this Event</h4>
                        <p className="text-caption text-text-secondary leading-relaxed">
                          {ticket.description}
                        </p>
                      </div>

                      {/* Benefits */}
                      {ticket.benefits && ticket.benefits.length > 0 && (
                        <div>
                          <h4 className="text-body font-medium text-text-primary mb-sm">Ticket Benefits</h4>
                          <div className="grid grid-cols-1 gap-xs">
                            {ticket.benefits.map((benefit, index) => (
                              <div key={index} className="flex items-center gap-xs text-caption text-text-secondary">
                                <span className="text-primary-green">✓</span>
                                <span>{benefit}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            ) : (
              /* Empty State */
              <div className="flex flex-col items-center justify-center py-xxxl text-center">
                <svg className="w-16 h-16 text-text-muted mb-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
                <h3 className="text-body font-medium text-text-secondary mb-sm">
                  No {activeTab} tickets
                </h3>
                <p className="text-caption text-text-muted max-w-xs">
                  {activeTab === 'upcoming' 
                    ? "You don't have any upcoming events. Discover and book exciting events!"
                    : "No past events to show. Start attending events to build your collection!"
                  }
                </p>
                {activeTab === 'upcoming' && (
                  <button
                    onClick={() => router.push('/')}
                    className="btn-secondary mt-lg"
                  >
                    Discover Events
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Navigation */}
        <BottomNav activeTab="tickets" />
      </div>
    </>
  )
} 