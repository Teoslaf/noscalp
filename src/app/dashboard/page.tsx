'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Dashboard() {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-background-light shadow-lg shadow-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold text-text-primary">Event Platform</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-text-secondary">Welcome, {user.username}</span>
              <button
                onClick={logout}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full text-text-primary bg-primary hover:bg-primary-hover transition-colors duration-200 shadow-lg shadow-primary/20"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-2 border-dashed border-text-secondary/20 rounded-2xl h-96 flex items-center justify-center bg-background-light shadow-lg shadow-primary/5">
            <div className="text-center px-4">
              <h3 className="text-xl font-medium text-text-primary mb-2">Welcome to Your Dashboard</h3>
              <p className="text-text-secondary mb-8">
                Start creating and managing your events
              </p>
              <button
                type="button"
                className="inline-flex items-center px-6 py-3 border border-transparent text-lg font-medium rounded-xl text-text-primary bg-primary hover:bg-primary-hover transition-colors duration-200 shadow-lg shadow-primary/20"
              >
                Create New Event
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 