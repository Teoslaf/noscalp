import { useRouter } from 'next/router'

export default function BottomNav({ activeTab = 'home' }) {
  const router = useRouter()

  return (
    <div className="nav-bottom fixed bottom-0 left-0 right-0 z-fixed">
      <div className="flex items-center justify-around h-full">
        {/* Home */}
        <button 
          className="flex flex-col items-center gap-xs p-sm group"
          onClick={() => router.push('/')}
        >
          <svg 
            className={`w-6 h-6 ${
              activeTab === 'home' 
                ? 'text-secondary-lime' 
                : 'text-text-muted group-hover:text-text-secondary'
            }`} 
            fill="currentColor" 
            viewBox="0 0 24 24"
          >
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
          </svg>
          <span 
            className={`text-small font-medium ${
              activeTab === 'home'
                ? 'text-secondary-lime'
                : 'text-text-muted group-hover:text-text-secondary'
            }`}
          >
            Home
          </span>
        </button>

        {/* Search */}
        <button 
          className="flex flex-col items-center gap-xs p-sm group"
          onClick={() => router.push('/search')}
        >
          <svg 
            className={`w-6 h-6 ${
              activeTab === 'search'
                ? 'text-secondary-lime'
                : 'text-text-muted group-hover:text-text-secondary'
            }`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span 
            className={`text-small ${
              activeTab === 'search'
                ? 'text-secondary-lime font-medium'
                : 'text-text-muted group-hover:text-text-secondary'
            }`}
          >
            Search
          </span>
        </button>

        {/* Create Event */}
        <button 
          className="flex flex-col items-center gap-xs p-sm group"
          onClick={() => router.push('/create-event')}
        >
          <svg 
            className={`w-6 h-6 ${
              activeTab === 'create'
                ? 'text-secondary-lime'
                : 'text-text-muted group-hover:text-text-secondary'
            }`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span 
            className={`text-small ${
              activeTab === 'create'
                ? 'text-secondary-lime font-medium'
                : 'text-text-muted group-hover:text-text-secondary'
            }`}
          >
            Create
          </span>
        </button>

        {/* Tickets */}
        <button 
          className="flex flex-col items-center gap-xs p-sm group"
          onClick={() => router.push('/tickets')}
        >
          <svg 
            className={`w-6 h-6 ${
              activeTab === 'tickets'
                ? 'text-secondary-lime'
                : 'text-text-muted group-hover:text-text-secondary'
            }`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
          </svg>
          <span 
            className={`text-small ${
              activeTab === 'tickets'
                ? 'text-secondary-lime font-medium'
                : 'text-text-muted group-hover:text-text-secondary'
            }`}
          >
            Tickets
          </span>
        </button>
      </div>
    </div>
  )
} 