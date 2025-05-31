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
        
        {/* Online Badge */}
        {isOnline && (
          <div className="absolute top-md right-md px-md py-xs bg-bg-overlay text-text-primary rounded-button text-small font-medium">
            Online
          </div>
        )}
      </div>

      {/* Event Content */}
      <div className="space-y-md">
        {/* Category Badge */}
        <div 
          className="inline-block px-md py-xs rounded-button text-small font-medium w-fit"
          style={{
            backgroundColor: categoryConfig.bgColor,
            color: categoryConfig.color,
          }}
        >
          {event.category}
        </div>

        {/* Event Title */}
        <h3 className="text-body font-medium text-text-primary line-clamp-2">
          {event.event_name}
        </h3>

        {/* Event Details */}
        <div className="space-y-xs">
          {/* Date and Time */}
          <div className="flex items-center gap-sm text-caption text-text-secondary">
            <span>📅</span>
            <span>{formattedDate}</span>
            <span>•</span>
            <span>{formattedTime}</span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-sm text-caption text-text-secondary">
            <span>{isOnline ? '🌐' : '📍'}</span>
            <span className="line-clamp-1">
              {isOnline ? 'Online Event' : event.venue_or_online}
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between pt-xs">
            <span className="text-body font-medium text-primary-green">
              {priceDisplay}
            </span>
            <span className="text-caption text-text-muted">
              {event.organizer.name}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard; 