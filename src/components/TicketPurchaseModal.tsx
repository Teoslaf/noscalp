import React, { useState, useEffect } from 'react';
import { MiniKit, VerificationLevel, MiniAppVerifyActionPayload, ResponseEvent } from '@worldcoin/minikit-js';
import { useTicketPurchase, useVerificationStatus, useTransactionMonitor } from '@/hooks/useContract';
import { useContractContext } from '@/context/ContractContext';
import { getTransactionUrl, DEFAULT_ACTION } from '@/lib/worldchain';
import { parseEther, formatEther } from 'viem';

interface TicketPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: {
    id: number;
    name: string;
    ticketTypes: Array<{
      id: number;
      name: string;
      price: number;
      maxSupply: number;
      currentSupply: number;
    }>;
  };
  selectedTicketType?: number;
}

interface WorldIDProof {
  merkle_root: string;
  nullifier_hash: string;
  proof: string;
  verification_level: VerificationLevel;
}

export default function TicketPurchaseModal({
  isOpen,
  onClose,
  event,
  selectedTicketType = 0
}: TicketPurchaseModalProps) {
  const [currentStep, setCurrentStep] = useState<'select' | 'verify' | 'purchase' | 'success'>('select');
  const [selectedType, setSelectedType] = useState(selectedTicketType);
  const [quantity, setQuantity] = useState(1);
  const [worldIdProof, setWorldIdProof] = useState<WorldIDProof | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);

  // Contract hooks
  const { purchaseTicket, gasEstimate, isLoading: purchaseLoading, error: purchaseError } = useTicketPurchase();
  const { checkVerificationStatus } = useVerificationStatus();
  const { monitorTransaction, status: txStatus } = useTransactionMonitor();
  const { addTransaction, addUserTicket, state: contractState } = useContractContext();

  const selectedTicket = event.ticketTypes[selectedType];
  const totalPrice = selectedTicket ? selectedTicket.price * quantity : 0;
  const isWorldApp = MiniKit.isInstalled();

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentStep('select');
      setSelectedType(selectedTicketType);
      setQuantity(1);
      setWorldIdProof(null);
      setError(null);
      setTransactionHash(null);
    }
  }, [isOpen, selectedTicketType]);

  // Handle World ID verification
  const handleWorldIdVerification = async () => {
    if (!isWorldApp) {
      setError('World ID verification requires the World App');
      return;
    }

    setIsVerifying(true);
    setError(null);

    try {
      console.log('🔄 Starting World ID verification...');

      const payload: MiniAppVerifyActionPayload = {
        action: DEFAULT_ACTION,
        signal: `purchase_${event.id}_${selectedType}_${Date.now()}`, // Unique signal for this purchase
        verification_level: VerificationLevel.Orb // Use Orb level for anti-sybil
      };

      const { commandPayload, finalPayload } = await MiniKit.commandsAsync.verifyAction(payload);

      if (commandPayload.status === 'error') {
        throw new Error('World ID verification failed');
      }

      console.log('✅ World ID verification successful');
      
      // Store the proof
      const proof: WorldIDProof = {
        merkle_root: finalPayload.merkle_root,
        nullifier_hash: finalPayload.nullifier_hash,
        proof: finalPayload.proof,
        verification_level: finalPayload.verification_level
      };

      setWorldIdProof(proof);

      // Check if this nullifier hash has already been used for this event
      const alreadyVerified = await checkVerificationStatus(
        event.id,
        finalPayload.nullifier_hash
      );

      if (alreadyVerified) {
        throw new Error('You have already purchased a ticket for this event');
      }

      setCurrentStep('purchase');

    } catch (error) {
      console.error('❌ World ID verification error:', error);
      setError(error instanceof Error ? error.message : 'Verification failed');
    } finally {
      setIsVerifying(false);
    }
  };

  // Handle ticket purchase
  const handlePurchase = async () => {
    if (!worldIdProof || !selectedTicket) {
      setError('Missing verification or ticket selection');
      return;
    }

    try {
      console.log('🎫 Starting ticket purchase...');

      // Parse the proof string into array of BigInts
      const proofArray = JSON.parse(worldIdProof.proof);
      
      const purchaseParams = {
        eventId: event.id,
        ticketTypeIndex: selectedType,
        signal: `purchase_${event.id}_${selectedType}_${Date.now()}`,
        root: BigInt(worldIdProof.merkle_root),
        nullifierHash: BigInt(worldIdProof.nullifier_hash),
        proof: proofArray.map((p: string) => BigInt(p))
      };

      const priceInEth = totalPrice.toString();
      const result = await purchaseTicket(purchaseParams, priceInEth);

      if (!result || !result.success) {
        throw new Error(result?.error || 'Failed to purchase ticket');
      }

      console.log('✅ Ticket purchase transaction submitted:', result.hash);
      setTransactionHash(result.hash);

      // Add transaction to context
      addTransaction({
        hash: result.hash,
        type: 'purchase_ticket',
        status: 'pending',
        eventId: event.id,
        ticketTypeId: selectedTicket.id
      });

      // Monitor the transaction
      const confirmed = await monitorTransaction(result.hash);

      if (confirmed) {
        console.log('🎉 Ticket purchase successful!');
        
        // Add ticket to user's collection
        addUserTicket({
          ticketTypeId: selectedTicket.id,
          eventId: event.id,
          balance: quantity,
          ticketType: {
            id: selectedTicket.id,
            eventId: event.id,
            name: selectedTicket.name,
            price: parseEther(priceInEth),
            maxSupply: selectedTicket.maxSupply,
            currentSupply: selectedTicket.currentSupply + quantity,
            ipfsHash: 'placeholder'
          },
          event: {
            id: event.id,
            organizer: 'placeholder',
            name: event.name,
            ticketTypes: event.ticketTypes.map(t => t.id),
            active: true
          },
          purchaseHash: result.hash,
          purchaseDate: new Date()
        });

        setCurrentStep('success');
      } else {
        throw new Error('Transaction failed or was reverted');
      }

    } catch (error) {
      console.error('❌ Ticket purchase error:', error);
      setError(error instanceof Error ? error.message : 'Purchase failed');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-bg-primary rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border-primary">
          <h2 className="text-lg font-semibold text-text-primary">
            {currentStep === 'select' && 'Select Tickets'}
            {currentStep === 'verify' && 'Verify Identity'}
            {currentStep === 'purchase' && 'Complete Purchase'}
            {currentStep === 'success' && 'Purchase Successful!'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-bg-secondary rounded-md transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Error Display */}
          {(error || purchaseError) && (
            <div className="bg-bg-error border border-border-error rounded-lg p-3">
              <div className="flex items-start gap-2">
                <span className="text-text-error">⚠️</span>
                <div>
                  <p className="text-sm font-medium text-text-error">Error</p>
                  <p className="text-sm text-text-error">{error || purchaseError}</p>
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Select Tickets */}
          {currentStep === 'select' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-text-primary mb-2">Event</h3>
                <p className="text-sm text-text-secondary">{event.name}</p>
              </div>

              <div>
                <h3 className="font-medium text-text-primary mb-2">Ticket Type</h3>
                <div className="space-y-2">
                  {event.ticketTypes.map((ticket, index) => (
                    <label
                      key={ticket.id}
                      className={`block p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedType === index
                          ? 'border-primary-green bg-primary-green bg-opacity-10'
                          : 'border-border-primary hover:border-border-secondary'
                      }`}
                    >
                      <input
                        type="radio"
                        name="ticketType"
                        value={index}
                        checked={selectedType === index}
                        onChange={(e) => setSelectedType(parseInt(e.target.value))}
                        className="sr-only"
                      />
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-text-primary">{ticket.name}</p>
                          <p className="text-sm text-text-secondary">
                            {ticket.currentSupply}/{ticket.maxSupply} sold
                          </p>
                        </div>
                        <p className="font-medium text-primary-green">
                          {ticket.price === 0 ? 'Free' : `$${ticket.price}`}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium text-text-primary mb-2">Quantity</h3>
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="w-full p-2 border border-border-primary rounded-md bg-bg-primary text-text-primary"
                >
                  {[1, 2, 3, 4, 5].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>

              <div className="border-t border-border-primary pt-4">
                <div className="flex justify-between items-center text-lg font-medium">
                  <span>Total:</span>
                  <span className="text-primary-green">
                    {totalPrice === 0 ? 'Free' : `$${totalPrice}`}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setCurrentStep('verify')}
                disabled={!selectedTicket || selectedTicket.currentSupply >= selectedTicket.maxSupply}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {selectedTicket?.currentSupply >= selectedTicket?.maxSupply ? 'Sold Out' : 'Continue'}
              </button>
            </div>
          )}

          {/* Step 2: World ID Verification */}
          {currentStep === 'verify' && (
            <div className="space-y-4 text-center">
              <div className="w-16 h-16 bg-primary-green bg-opacity-10 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-primary-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>

              <div>
                <h3 className="text-lg font-medium text-text-primary mb-2">Verify Your Identity</h3>
                <p className="text-sm text-text-secondary">
                  Verify with World ID to prevent scalping and ensure fair access to tickets.
                </p>
              </div>

              {!isWorldApp && (
                <div className="bg-bg-tertiary border border-border-secondary rounded-lg p-3">
                  <p className="text-sm text-text-muted">
                    ⚠️ World ID verification requires the World App. Please open this link in the World App.
                  </p>
                </div>
              )}

              <button
                onClick={handleWorldIdVerification}
                disabled={isVerifying || !isWorldApp}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isVerifying ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    Verifying...
                  </div>
                ) : (
                  'Verify with World ID'
                )}
              </button>

              <button
                onClick={() => setCurrentStep('select')}
                className="w-full btn-secondary"
              >
                Back
              </button>
            </div>
          )}

          {/* Step 3: Purchase Confirmation */}
          {currentStep === 'purchase' && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-green bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-text-primary mb-2">Identity Verified!</h3>
                <p className="text-sm text-text-secondary">
                  Ready to complete your ticket purchase.
                </p>
              </div>

              {/* Purchase Summary */}
              <div className="bg-bg-secondary rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Event:</span>
                  <span className="text-text-primary">{event.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Ticket:</span>
                  <span className="text-text-primary">{selectedTicket?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Quantity:</span>
                  <span className="text-text-primary">{quantity}</span>
                </div>
                <div className="flex justify-between border-t border-border-primary pt-2 font-medium">
                  <span>Total:</span>
                  <span className="text-primary-green">
                    {totalPrice === 0 ? 'Free' : `$${totalPrice}`}
                  </span>
                </div>
              </div>

              {/* Gas Estimate */}
              {gasEstimate && (
                <div className="bg-bg-tertiary rounded-lg p-3">
                  <p className="text-sm text-text-secondary">
                    Estimated network fee: {gasEstimate.estimatedCost} ETH
                  </p>
                </div>
              )}

              <button
                onClick={handlePurchase}
                disabled={purchaseLoading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {purchaseLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </div>
                ) : (
                  'Complete Purchase'
                )}
              </button>

              <button
                onClick={() => setCurrentStep('verify')}
                className="w-full btn-secondary"
              >
                Back
              </button>
            </div>
          )}

          {/* Step 4: Success */}
          {currentStep === 'success' && (
            <div className="space-y-4 text-center">
              <div className="w-16 h-16 bg-primary-green rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-text-on-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <div>
                <h3 className="text-lg font-medium text-text-primary mb-2">Purchase Successful!</h3>
                <p className="text-sm text-text-secondary">
                  Your ticket has been purchased and added to your collection.
                </p>
              </div>

              {transactionHash && (
                <div className="bg-bg-secondary rounded-lg p-3">
                  <p className="text-sm text-text-secondary mb-1">Transaction Hash:</p>
                  <a
                    href={getTransactionUrl(transactionHash)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary-green hover:text-primary-green-hover font-mono break-all"
                  >
                    {transactionHash}
                  </a>
                </div>
              )}

              <button
                onClick={onClose}
                className="w-full btn-primary"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 