'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function ProfileCompletion() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    preferences: {
      notifications: true,
      newsletter: false,
    },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if not authenticated
  if (!isAuthenticated) {
    router.push('/');
    return null;
  }

  // Redirect if profile is already complete
  if (user?.isProfileComplete) {
    router.push('/dashboard');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/complete-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          worldId: user?.worldId,
        }),
      });

      if (response.ok) {
        router.push('/dashboard');
      } else {
        throw new Error('Failed to complete profile');
      }
    } catch (error) {
      console.error('Profile completion failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-text-primary">
          Complete Your Profile
        </h2>
        <p className="mt-2 text-center text-sm text-text-secondary">
          Just a few more details to get you started
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-background-light py-8 px-4 shadow-xl shadow-primary/5 sm:rounded-2xl sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-primary">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="appearance-none block w-full px-4 py-3 border border-text-secondary/20 rounded-xl text-text-primary bg-background placeholder-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-200"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-text-primary">
                Username
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="appearance-none block w-full px-4 py-3 border border-text-secondary/20 rounded-xl text-text-primary bg-background placeholder-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-200"
                  placeholder="Choose a username"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  id="notifications"
                  name="notifications"
                  type="checkbox"
                  checked={formData.preferences.notifications}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      preferences: { ...formData.preferences, notifications: e.target.checked },
                    })
                  }
                  className="h-5 w-5 text-primary border-text-secondary/20 rounded focus:ring-primary/50 focus:ring-offset-background-light transition-colors duration-200"
                />
                <label htmlFor="notifications" className="ml-3 block text-sm text-text-primary">
                  Receive notifications
                </label>
              </div>

              <div className="flex items-center">
                <input
                  id="newsletter"
                  name="newsletter"
                  type="checkbox"
                  checked={formData.preferences.newsletter}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      preferences: { ...formData.preferences, newsletter: e.target.checked },
                    })
                  }
                  className="h-5 w-5 text-primary border-text-secondary/20 rounded focus:ring-primary/50 focus:ring-offset-background-light transition-colors duration-200"
                />
                <label htmlFor="newsletter" className="ml-3 block text-sm text-text-primary">
                  Subscribe to newsletter
                </label>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-primary/20 text-lg font-medium text-text-primary bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isSubmitting ? (
                  <div className="w-6 h-6 border-3 border-text-primary border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Complete Profile'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 