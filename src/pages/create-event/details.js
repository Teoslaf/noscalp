import Head from 'next/head'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

export default function CreateEventStep3() {
  const router = useRouter()
  const [eventData, setEventData] = useState(null)
  const [formData, setFormData] = useState({
    description: '',
    images: [],
    date: '',
    time: '',
    location: '',
    category: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  const categories = [
    'Technology', 'Business', 'Arts & Culture', 'Sports & Fitness',
    'Music', 'Food & Drink', 'Education', 'Health & Wellness',
    'Fashion', 'Travel', 'Gaming', 'Blockchain & Web3'
  ]

  useEffect(() => {
    console.log('📝 Loading event data for details page...')
    
    // Load event data from previous steps
    const savedData = localStorage.getItem('eventCreationData')
    if (savedData) {
      const data = JSON.parse(savedData)
      console.log('✅ Event data loaded:', data)
      console.log('📊 Data structure check:')
      console.log('  - eventName:', data.eventName || 'MISSING')
      console.log('  - tickets:', data.tickets ? `${data.tickets.length} tickets` : 'MISSING')
      console.log('  - existing details:', data.details ? 'Present' : 'None')
      
      setEventData(data)
      // Load any existing details
      if (data.details) {
        console.log('📋 Loading existing details:', data.details)
        setFormData(data.details)
      }
    } else {
      console.warn('⚠️ No event creation data found, redirecting to start')
      // Redirect back to step 1 if no data
      router.push('/create-event')
    }
  }, [router])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files)
    if (files.length + formData.images.length > 5) {
      alert('Maximum 5 images allowed')
      return
    }

    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, {
            id: Date.now() + Math.random(),
            url: e.target.result,
            name: file.name
          }]
        }))
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (imageId) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(img => img.id !== imageId)
    }))
  }

  const handleNext = () => {
    console.log('➡️ Details handleNext called');
    console.log('📊 Form data:', formData);
    console.log('📊 Event data:', eventData);
    
    // Basic validation
    if (!formData.description || !formData.description.trim()) {
      alert('Please add an event description')
      return
    }
    
    if (!formData.date) {
      alert('Please select an event date')
      return
    }
    
    if (!formData.location || !formData.location.trim()) {
      alert('Please add an event location')
      return
    }
    
    setIsLoading(true)

    // Update event data with details
    const updatedEventData = {
      ...eventData,
      details: formData
    }
    
    console.log('💾 Saving complete event data:', updatedEventData)
    localStorage.setItem('eventCreationData', JSON.stringify(updatedEventData))

    // Navigate to verification step after a short delay
    setTimeout(() => {
      console.log('🔍 Navigating to verify page...');
      setIsLoading(false)
      router.push('/create-event/verify')
    }, 500)
  }

  const handleBack = () => {
    // Save current progress
    if (eventData) {
      const updatedEventData = {
        ...eventData,
        details: formData
      }
      localStorage.setItem('eventCreationData', JSON.stringify(updatedEventData))
    }
    router.push('/create-event/tickets')
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
        <title>Event Details - Noscalp</title>
        <meta name="description" content="Add details to your event" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </Head>
      
      <div className="screen-container min-h-screen">
        {/* Top Bar */}
        <div className="nav-top fixed top-0 left-0 right-0 z-fixed">
          <div className="flex items-center justify-between h-full px-3">
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
            <h1 className="text-body font-bold text-text-primary">
              Event Details
            </h1>

            {/* Spacer */}
            <div className="w-10"></div>
          </div>
        </div>

        {/* Content */}
        <div className="pt-top-bar-height px-3">
          {/* Progress Indicator */}
          <div className="section-gap">
            <div className="flex items-center justify-between mb-sm">
              <span className="text-caption text-text-secondary">Step 3 of 4</span>
              <span className="text-caption text-text-secondary">75%</span>
            </div>
            <div className="w-full bg-border-primary rounded-full h-2">
              <div className="bg-primary-green h-2 rounded-full transition-all duration-slow w-3/4"></div>
            </div>
          </div>

          {/* Event Name Reference */}
          <div className="section-gap">
            <div className="card-primary">
              <h3 className="text-body font-medium text-text-primary mb-xs">Adding details for:</h3>
              <p className="text-section-header font-bold text-primary-green">{eventData.eventName}</p>
              <p className="text-caption text-text-secondary mt-xs">
                {eventData.tickets?.length || 0} ticket type(s) configured
              </p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-xl">
            {/* Description */}
            <div className="card-primary space-y-lg">
              <h3 className="text-body font-medium text-text-primary">Description</h3>
              <div>
                <textarea
                  placeholder="Describe your event. What makes it special? What can attendees expect?"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="input-primary w-full h-32 resize-none pt-lg"
                  maxLength={1000}
                />
                <div className="flex justify-between items-center mt-xs">
                  <span className="text-small text-text-muted">
                    Supports Markdown formatting (**bold**, *italic*, - lists)
                  </span>
                  <span className="text-small text-text-muted">
                    {formData.description.length}/1000
                  </span>
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="card-primary space-y-lg">
              <h3 className="text-body font-medium text-text-primary">Event Images</h3>
              
              {/* Image Upload */}
              <div>
                <input
                  type="file"
                  id="image-upload"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <label
                  htmlFor="image-upload"
                  className="btn-secondary w-full cursor-pointer inline-flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Add Images ({formData.images.length}/5)
                </label>
                <p className="text-small text-text-muted mt-xs">
                  Upload up to 5 images. First image will be the main event photo.
                </p>
              </div>

              {/* Image Preview */}
              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 gap-sm">
                  {formData.images.map((image, index) => (
                    <div key={image.id} className="relative group">
                      <img
                        src={image.url}
                        alt={`Event image ${index + 1}`}
                        className="w-full h-24 object-cover rounded-md border border-border-secondary"
                      />
                      {index === 0 && (
                        <div className="absolute top-xs left-xs bg-primary-green text-text-on-primary text-small px-xs py-0.5 rounded">
                          Main
                        </div>
                      )}
                      <button
                        onClick={() => removeImage(image.id)}
                        className="absolute top-xs right-xs bg-status-error text-text-on-primary w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-fast"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Date and Time */}
            <div className="card-primary space-y-lg">
              <h3 className="text-body font-medium text-text-primary">Date & Time</h3>
              <div className="space-y-lg">
                <div>
                  <label className="block text-caption font-medium text-text-primary mb-xs">
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    className="input-primary object-cover rounded-md border border-border-secondary "
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <label className="block text-caption font-medium text-text-primary mb-xs">
                    Time
                  </label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => handleInputChange('time', e.target.value)}
                    className="input-primary w-56"
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="card-primary space-y-lg">
              <h3 className="text-body font-medium text-text-primary">Location</h3>
              <div>
                <input
                  type="text"
                  placeholder="e.g., Prague Convention Center, Online, Central Park"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="input-primary w-full"
                />
                <p className="text-small text-text-muted mt-xs">
                  Enter the venue name or "Online" for virtual events
                </p>
              </div>
            </div>

            {/* Category */}
            <div className="card-primary space-y-lg">
              <h3 className="text-body font-medium text-text-primary">Category</h3>
              <div className="grid grid-cols-2 gap-sm">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleInputChange('category', category)}
                    className={`p-md text-caption rounded-button border-2 transition-colors duration-fast ${
                      formData.category === category
                        ? 'border-primary-green bg-primary-green bg-opacity-10 text-primary-green'
                        : 'border-border-primary bg-bg-secondary text-text-secondary hover:border-border-hover'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex gap-lg pt-xl">
            <button
              onClick={handleNext}
              disabled={isLoading}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Processing...' : 'Review & Create'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
} 