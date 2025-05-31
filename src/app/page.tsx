'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <main>
        <div className="pt-12">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-text-primary">
              <span className="block mb-2">Create and Manage Events</span>
              <span className="block text-primary">Verified by World ID</span>
            </h1>
            <p className="mt-4 text-base text-text-secondary">
              Join our platform to create and manage events with the security of World ID verification.
              Ensure genuine participation and prevent fraud.
            </p>
          </div>

          <div className="mt-8 space-y-6">
            {/* Feature Cards */}
            <div className="bg-background-light rounded-2xl p-5 shadow-lg shadow-primary/5">
              <div className="flex items-start space-x-4">
                <span className="flex-shrink-0 p-2 bg-primary rounded-xl shadow-lg shadow-primary/20">
                  <svg className="h-5 w-5 text-text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                  </svg>
                </span>
                <div>
                  <h3 className="text-lg font-medium text-text-primary">Proof of Personhood</h3>
                  <p className="mt-2 text-sm text-text-secondary">
                    Verify unique human identity with World ID's advanced biometric technology.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-background-light rounded-2xl p-5 shadow-lg shadow-primary/5">
              <div className="flex items-start space-x-4">
                <span className="flex-shrink-0 p-2 bg-primary rounded-xl shadow-lg shadow-primary/20">
                  <svg className="h-5 w-5 text-text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <div>
                  <h3 className="text-lg font-medium text-text-primary">Secure Events</h3>
                  <p className="mt-2 text-sm text-text-secondary">
                    Create events with confidence knowing all participants are verified humans.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-background-light rounded-2xl p-5 shadow-lg shadow-primary/5">
              <div className="flex items-start space-x-4">
                <span className="flex-shrink-0 p-2 bg-primary rounded-xl shadow-lg shadow-primary/20">
                  <svg className="h-5 w-5 text-text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </span>
                <div>
                  <h3 className="text-lg font-medium text-text-primary">Community Trust</h3>
                  <p className="mt-2 text-sm text-text-secondary">
                    Build a trusted community of event organizers and participants.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pb-8">
            <button className="w-full px-6 py-4 text-lg font-medium text-text-primary bg-primary hover:bg-primary-hover rounded-2xl shadow-lg shadow-primary/20">
              Get Started with World ID
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
