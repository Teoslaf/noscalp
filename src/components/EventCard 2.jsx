import React from 'react';
import Image from 'next/image';
import { designTokens, getCategoryConfig, formatPrice } from '../styles/design-tokens';

/**
 * EventCard Component
 * 
 * Displays event information in a card format using the design system.
 * Based on events_prototype_no_imgs.json data structure.
 * 
 * Props:
 * - event: Event object from events_prototype_no_imgs.json
 * - onClick: Callback function when card is clicked
 */
const EventCard = ({ event, onClick }) => {
  const categoryConfig = getCategoryConfig(event.category);
  
  // Format date and time
  const eventDate = new Date(event.start_datetime);
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
  const formattedTime = eventDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  // Get ticket price range
  const ticketPrices = event.ticket_types.map(ticket => ticket.price);
  const minPrice = Math.min(...ticketPrices);
  const maxPrice = Math.max(...ticketPrices);
  const priceDisplay = minPrice === maxPrice 
    ? formatPrice(minPrice, event.currency)
    : `${formatPrice(minPrice, event.currency)} - ${formatPrice(maxPrice, event.currency)}`;

  // Check if event is online
  const isOnline = event.venue_or_online.startsWith('http');

  return (
    <div 
      className="card-primary cursor-pointer transition-all duration-normal ease-out hover:transform hover:translate-y-[-2px] hover:shadow-lg"
      onClick={() => onClick?.(event)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick?.(event);
        }
      }}
    >
      {/* Event Image */}
      <div className="relative w-full aspect-event-banner rounded-md overflow-hidden mb-lg">
        <Image
          src={event.banner || '/images/events/event-placeholder.jpg'}
          alt={event.event_name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Category Badge */}
        <div 
          className="absolute top-md left-md px-md py-xs rounded-button text-small font-medium"
          style={{
            backgroundColor: categoryConfig.bgColor,
            color: categoryConfig.color,
          }}
        >
          {event.category}
        </div>

        {/* Online Badge */}
        {isOnline && (
          <div className="absolute top-md right-md px-md py-xs bg-bg-overlay text-text-primary rounded-button text-small font-medium">
            Online
          </div>
        )}
      </div>

      {/* Event Content */}
      <div className="space-y-sm">
        {/* Event Name */}
        <h3 className="text-body font-medium text-text-primary line-clamp-2">
          {event.event_name}
        </h3>

        {/* Date and Time */}
        <div className="flex items-center gap-sm text-caption text-text-secondary">
          <svg 
            className="w-4 h-4 text-secondary-lime" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
            />
          </svg>
          <span>{formattedDate} • {formattedTime}</span>
        </div>

        {/* Location */}
        <div className="flex items-center gap-sm text-caption text-text-secondary">
          <svg 
            className="w-4 h-4 text-secondary-lime flex-shrink-0" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
            />
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
            />
          </svg>
          <span className="line-clamp-1">
            {isOnline ? 'Online Event' : event.venue_or_online}
          </span>
        </div>

        {/* Organizer */}
        <div className="flex items-center gap-sm text-caption text-text-tertiary">
          <svg 
            className="w-4 h-4 text-text-muted" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
            />
          </svg>
          <span>by {event.organizer.name}</span>
        </div>

        {/* Price and Capacity Info */}
        <div className="flex items-center justify-between pt-sm border-t border-border-primary">
          <div className="text-body font-medium text-primary-green">
            {priceDisplay}
          </div>
          
          <div className="text-small text-text-muted">
            {event.advanced_options.capacity - 
             event.ticket_types.reduce((total, ticket) => total + ticket.quantity, 0)} 
            spots left
          </div>
        </div>

        {/* Tags */}
        {event.advanced_options.tags && event.advanced_options.tags.length > 0 && (
          <div className="flex flex-wrap gap-xs pt-xs">
            {event.advanced_options.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-sm py-xs bg-bg-tertiary text-text-muted text-small rounded-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCard; 