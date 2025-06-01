import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import EventCard from './EventCard';
import BottomNav from './BottomNav';
import eventsData from '../data/events_prototype_no_imgs.json';

/**
 * HomeScreen Component
 * 
 * Main discovery screen with top bar, filters, and event grid.
 * Uses events_prototype_no_imgs.json data with design system components.
 */
const HomeScreen = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedDate, setSelectedDate] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Get unique categories from events data
  const categories = useMemo(() => {
    const cats = [...new Set(eventsData.map(event => event.category))];
    return ['All', ...cats];
  }, []);

  // Get unique locations from events data
  const locations = useMemo(() => {
    const locs = [...new Set(eventsData.map(event => {
      return event.venue_or_online.startsWith('http') ? 'Online' : event.venue_or_online.split(',').pop().trim();
    }))];
    return ['All', ...locs];
  }, []);

  // Get unique dates for filter
  const dates = useMemo(() => {
    const dateOptions = ['All', 'Today', 'This Week', 'This Month', 'Next Month'];
    return dateOptions;
  }, []);

  // Filter events based on selected criteria
  const filteredEvents = useMemo(() => {
    return eventsData.filter(event => {
      const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
      
      const eventLocation = event.venue_or_online.startsWith('http') ? 'Online' : event.venue_or_online.split(',').pop().trim();
      const matchesLocation = selectedLocation === 'All' || eventLocation === selectedLocation;
      
      // Date filtering logic
      const eventDate = new Date(event.start_datetime);
      const now = new Date();
      let matchesDate = true;
      
      if (selectedDate !== 'All') {
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const eventDay = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
        
        switch (selectedDate) {
          case 'Today':
            matchesDate = eventDay.getTime() === today.getTime();
            break;
          case 'This Week':
            const weekStart = new Date(today);
            weekStart.setDate(today.getDate() - today.getDay());
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 6);
            matchesDate = eventDay >= weekStart && eventDay <= weekEnd;
            break;
          case 'This Month':
            matchesDate = eventDate.getMonth() === now.getMonth() && eventDate.getFullYear() === now.getFullYear();
            break;
          case 'Next Month':
            const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
            matchesDate = eventDate.getMonth() === nextMonth.getMonth() && eventDate.getFullYear() === nextMonth.getFullYear();
            break;
        }
      }
      
      const matchesSearch = searchQuery === '' || 
        event.event_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.organizer.name.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesLocation && matchesDate && matchesSearch;
    });
  }, [selectedCategory, selectedLocation, selectedDate, searchQuery]);

  const handleEventClick = (event) => {
    router.push(`/event/${encodeURIComponent(event.event_name)}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    router.push('/auth');
  };

  return (
    <div className="screen-container min-h-screen">
      {/* Top Bar - App Name (left) and Settings (right) */}
      <div className="nav-top fixed top-0 left-0 right-0 z-fixed">
        <div className="flex items-center justify-between h-full px-3">
          {/* App Name (Left) */}
          <h1 className="text-app-title font-bold text-text-primary">
            noScalp
          </h1>

          {/* Settings Button (Right) */}
          <button 
            className="p-sm hover:bg-interactive-hover rounded-md transition-colors duration-fast"
            onClick={() => router.push('/settings')}
          >
            <svg className="w-6 h-6 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content with top padding to account for fixed top bar */}
      <div className="pt-top-bar-height">
        {/* Filters Bar - Location, Date, Category */}
        <div className="filter-bar fixed top-top-bar-height left-0 right-0 z-sticky bg-bg-secondary border-b border-border-primary">
          <div className="flex items-center gap-md h-full overflow-x-auto scrollbar-hide px-3">
            {/* Location Filter */}
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="input-primary text-small h-8 px-md py-0 min-w-max bg-bg-tertiary"
            >
              <option value="All">All Locations</option>
              {locations.slice(1).map(location => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>

            {/* Date Filter */}
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="input-primary text-small h-8 px-md py-0 min-w-max bg-bg-tertiary"
            >
              {dates.map(date => (
                <option key={date} value={date}>
                  {date === 'All' ? 'Any Date' : date}
                </option>
              ))}
            </select>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-primary text-small h-8 px-md py-0 min-w-max bg-bg-tertiary"
            >
              <option value="All">All Categories</option>
              {categories.slice(1).map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            {/* Clear Filters */}
            {(selectedCategory !== 'All' || selectedLocation !== 'All' || selectedDate !== 'All') && (
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedLocation('All');
                  setSelectedDate('All');
                }}
                className="btn-small h-8 px-md py-0 text-small whitespace-nowrap"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Content with top padding for filters */}
        <div className="pt-filter-bar-height px-3">
          {/* Section Header */}
          <div className="section-gap">
            <div className="flex items-center justify-between">
              <h2 className="text-section-header font-medium text-text-primary">
                {selectedCategory === 'All' ? 'Discover Events' : `${selectedCategory} Events`}
              </h2>
              <span className="text-caption text-text-muted">
                {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {/* Events Gallery - Rectangular blocks */}
          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 gap-section-gap pb-bottom-nav-height">
              {filteredEvents.map((event, index) => (
                <EventCard
                  key={`${event.event_name}-${index}`}
                  event={event}
                  onClick={handleEventClick}
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-xxxl text-center">
              <svg className="w-16 h-16 text-text-muted mb-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h3 className="text-body font-medium text-text-secondary mb-sm">
                No events found
              </h3>
              <p className="text-caption text-text-muted max-w-xs">
                Try adjusting your filters to find more events.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <BottomNav activeTab="home" />
    </div>
  );
};

export default HomeScreen; 