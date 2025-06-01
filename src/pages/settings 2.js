import Head from 'next/head'
import { useState } from 'react'
import { useRouter } from 'next/router'

export default function SettingsPage() {
  const router = useRouter()
  const [darkMode, setDarkMode] = useState(true)
  const [notifications, setNotifications] = useState(true)
  const [eventReminders, setEventReminders] = useState(true)

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated')
    router.push('/auth')
  }

  const settingsSections = [
    {
      title: 'App Settings',
      items: [
        {
          name: 'Appearance',
          description: 'Dark mode (Currently enabled)',
          type: 'toggle',
          value: darkMode,
          onChange: setDarkMode
        }
      ]
    },
    {
      title: 'Notification Settings',
      items: [
        {
          name: 'Push Notifications',
          description: 'Receive notifications about new events',
          type: 'toggle',
          value: notifications,
          onChange: setNotifications
        },
        {
          name: 'Event Reminders',
          description: 'Get reminded about upcoming events',
          type: 'toggle',
          value: eventReminders,
          onChange: setEventReminders
        }
      ]
    },
    {
      title: 'Support',
      items: [
        {
          name: 'FAQ',
          description: 'Frequently asked questions',
          type: 'link',
          onClick: () => router.push('/support/faq')
        },
        {
          name: 'Contact Us',
          description: 'Get in touch with our support team',
          type: 'link',
          onClick: () => router.push('/support/contact')
        }
      ]
    },
    {
      title: 'Feedback',
      items: [
        {
          name: 'Rate App',
          description: 'Rate EventHub on the App Store',
          type: 'link',
          onClick: () => {
            // Open app store rating
            alert('This would open the app store rating page')
          }
        },
        {
          name: 'Send Feedback',
          description: 'Share your thoughts and suggestions',
          type: 'link',
          onClick: () => router.push('/support/feedback')
        }
      ]
    },
    {
      title: 'About',
      items: [
        {
          name: 'About EventHub',
          description: 'Learn more about our mission',
          type: 'link',
          onClick: () => router.push('/about')
        },
        {
          name: 'Privacy Policy',
          description: 'How we protect your data',
          type: 'link',
          onClick: () => window.open('#', '_blank')
        },
        {
          name: 'Terms of Service',
          description: 'Terms and conditions',
          type: 'link',
          onClick: () => window.open('#', '_blank')
        },
        {
          name: 'Version',
          description: 'v1.0.0',
          type: 'info'
        }
      ]
    }
  ]

  return (
    <>
      <Head>
        <title>Settings - EventHub</title>
        <meta name="description" content="Manage your EventHub settings and preferences" />
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
              Settings
            </h1>

            {/* Spacer */}
            <div className="w-10"></div>
          </div>
        </div>

        {/* Content */}
        <div className="pt-top-bar-height px-screen-padding">
          {/* Settings Sections */}
          <div className="space-y-xl pb-xxxl">
            {settingsSections.map((section, sectionIndex) => (
              <div key={section.title} className="space-y-lg">
                {/* Section Header */}
                <h2 className="text-section-header font-medium text-text-primary">
                  {section.title}
                </h2>

                {/* Section Items */}
                <div className="space-y-md">
                  {section.items.map((item, itemIndex) => (
                    <div 
                      key={item.name}
                      className="card-primary flex items-center justify-between py-lg"
                    >
                      <div className="flex-1">
                        <h3 className="text-body font-medium text-text-primary mb-xs">
                          {item.name}
                        </h3>
                        <p className="text-caption text-text-secondary">
                          {item.description}
                        </p>
                      </div>

                      {/* Item Action */}
                      <div className="ml-lg">
                        {item.type === 'toggle' && (
                          <button
                            onClick={() => item.onChange(!item.value)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              item.value ? 'bg-primary-green' : 'bg-border-primary'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                item.value ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        )}

                        {item.type === 'link' && (
                          <button
                            onClick={item.onClick}
                            className="p-sm hover:bg-interactive-hover rounded-md transition-colors duration-fast"
                          >
                            <svg className="w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        )}

                        {item.type === 'info' && (
                          <span className="text-caption text-text-muted">
                            {item.description}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Logout Button */}
            <div className="pt-xl border-t border-border-primary">
              <button
                onClick={handleLogout}
                className="btn-secondary w-full text-status-error border-status-error hover:bg-red-500 hover:bg-opacity-10"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
} 