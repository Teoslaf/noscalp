'use client';

import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { IDKitWidget, ISuccessResult, VerificationLevel } from '@worldcoin/idkit';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export function LoginModal() {
  const [isOpen, setIsOpen] = useState(false);
  const { onWorldIDSuccess, isLoading, user } = useAuth();
  const router = useRouter();

  const handleSuccess = async (result: ISuccessResult) => {
    await onWorldIDSuccess(result);
    
    // Check if user needs to complete profile
    if (user?.isProfileComplete) {
      router.push('/dashboard');
    } else {
      router.push('/profile-completion');
    }
    
    setIsOpen(false);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <button className="px-5 py-2.5 text-sm font-medium text-text-primary bg-primary hover:bg-primary-hover rounded-full shadow-lg shadow-primary/20">
          Login
        </button>
      </Dialog.Trigger>

      <AnimatePresence>
        {isOpen && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 bg-black/80 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            </Dialog.Overlay>

            <Dialog.Content asChild>
              <motion.div
                className="fixed inset-x-0 bottom-0 bg-background-light rounded-t-3xl p-6 pb-8 shadow-xl"
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              >
                <div className="w-12 h-1 bg-text-secondary/20 rounded-full mx-auto mb-6" />
                
                <Dialog.Title className="text-2xl font-bold mb-6 text-text-primary text-center">
                  Welcome Back
                </Dialog.Title>

                <div className="space-y-5">
                  <IDKitWidget
                    app_id={process.env.NEXT_PUBLIC_WORLDCOIN_APP_ID!}
                    action="login"
                    onSuccess={handleSuccess}
                    handleVerify={async (proof: ISuccessResult) => {
                      return true;
                    }}
                    verification_level={VerificationLevel.Device}
                    credential_types={['orb', 'phone']}
                  >
                    {({ open }: { open: () => void }) => (
                      <button
                        onClick={open}
                        disabled={isLoading}
                        className="w-full px-6 py-4 text-text-primary bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl shadow-lg shadow-primary/20 flex items-center justify-center space-x-3"
                      >
                        {isLoading ? (
                          <div className="w-6 h-6 border-3 border-text-primary border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <img
                              src="/worldcoin-logo.svg"
                              alt="World ID"
                              className="w-6 h-6"
                            />
                            <span className="text-lg font-medium">Continue with World ID</span>
                          </>
                        )}
                      </button>
                    )}
                  </IDKitWidget>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-text-secondary/20" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 text-text-secondary bg-background-light">
                        or continue with
                      </span>
                    </div>
                  </div>

                  <button
                    className="w-full px-6 py-4 text-text-primary bg-background border border-text-secondary/20 hover:border-primary/50 hover:bg-background-light rounded-2xl"
                    onClick={() => {
                      // TODO: Implement email/password login
                    }}
                  >
                    <span className="text-lg font-medium">Email & Password</span>
                  </button>
                </div>

                <Dialog.Close asChild>
                  <button
                    className="absolute top-6 right-6 text-text-secondary hover:text-text-primary"
                    aria-label="Close"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </Dialog.Close>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
} 