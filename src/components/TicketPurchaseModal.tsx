import React, { useState, useEffect } from 'react';
import { MiniKit, VerificationLevel } from '@worldcoin/minikit-js';
import { useVerificationStatus, useTransactionMonitor } from '@/hooks/useContract';
import { useContractContext } from '@/context/ContractContext';
import { getTransactionUrl, DEFAULT_ACTION, WORLD_CHAIN_CONTRACTS } from '@/lib/worldchain';
import { parseEther, formatEther, encodeFunctionData } from 'viem';
import { EVENT_CONTRACT_ABI } from '@/lib/contracts/eventContractABI';

interface TicketPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: {
    id: number;
    name: string;
    currency?: string;
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
  const [isMinting, setIsMinting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);

  // Contract hooks
  const { checkVerificationStatus } = useVerificationStatus();
  const { addTransaction, addUserTicket, state: contractState } = useContractContext();

  const selectedTicket = event.ticketTypes[selectedType];
  const totalPrice = selectedTicket ? selectedTicket.price * quantity : 0;
  const isWorldApp = MiniKit.isInstalled();

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      console.log('🎫 Modal opened - debugging event object:');
      console.log('- event:', event);
      console.log('- event.ticketTypes:', event.ticketTypes);
      console.log('- event.ticketTypes is array:', Array.isArray(event.ticketTypes));
      
      setCurrentStep('select');
      setSelectedType(selectedTicketType);
      setQuantity(1);
      setWorldIdProof(null);
      setError(null);
      setTransactionId(null);
      setTransactionHash(null);
    }
  }, [isOpen, selectedTicketType, event]);

  // Handle World ID verification
  const handleWorldIdVerification = async () => {
    console.log('🚀 VERIFY BUTTON CLICKED - Function started');
    console.log('🔧 Initial state check:');
    console.log('- isWorldApp:', isWorldApp);
    console.log('- MiniKit.isInstalled():', MiniKit.isInstalled());
    console.log('- isVerifying:', isVerifying);
    
    if (!isWorldApp) {
      setError('World ID verification requires the World App');
      return;
    }

    setIsVerifying(true);
    setError(null);
    
    console.log('✅ State updated - isVerifying set to true');

    try {
      console.log('🔄 Starting World ID verification...');
      
      // Check environment variables
      console.log('🔧 Environment check:');
      console.log('- NEXT_PUBLIC_APP_ID:', process.env.NEXT_PUBLIC_APP_ID);
      console.log('- DEFAULT_ACTION:', DEFAULT_ACTION);
      console.log('- MiniKit installed:', MiniKit.isInstalled());

      // Create a verification payload
      const signalString = `purchase_${event.id}_${selectedType}`;
      const verifyPayload = {
        action: DEFAULT_ACTION,
        signal: signalString, // Use string signal for World ID verification
        verification_level: VerificationLevel.Orb
      };

      console.log('📋 Verify payload:', verifyPayload);

      let result;
      try {
        console.log('🔄 Calling MiniKit.commandsAsync.verify...');
        result = await MiniKit.commandsAsync.verify(verifyPayload);
        console.log('📥 Full result:', result);
      } catch (miniKitError) {
        console.error('❌ MiniKit verify error:', miniKitError);
        
        // Check if this is a JSON parsing error
        if (miniKitError.message && miniKitError.message.includes('JSON')) {
          throw new Error(`MiniKit JSON parsing error: ${miniKitError.message}`);
        }
        
        throw new Error(`MiniKit verification failed: ${miniKitError.message || 'Unknown MiniKit error'}`);
      }

      const { finalPayload } = result;
      console.log('📥 Final payload:', finalPayload);

      if (finalPayload.status === 'error') {
        console.error('❌ World ID verification failed:', finalPayload);
        throw new Error(`World ID verification failed: ${finalPayload.error_code || finalPayload.message || 'Unknown error'}`);
      }

      console.log('✅ World ID verification successful');
      
      // Store the proof
      const proof: WorldIDProof = {
        merkle_root: finalPayload.merkle_root,
        nullifier_hash: finalPayload.nullifier_hash,
        proof: finalPayload.proof,
        verification_level: finalPayload.verification_level
      };

      console.log('📋 Setting proof:', proof);
      setWorldIdProof(proof);
      
      console.log('🎯 Moving to purchase step');
      setCurrentStep('purchase');
      
      console.log('🏁 Verification function completed successfully');

    } catch (error) {
      console.error('❌ World ID verification error:', error);
      
      // More detailed error logging
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        
        // Provide more specific error messages for JSON parsing
        if (error.message.includes('JSON')) {
          setError(`Data parsing error: ${error.message}. Please try again.`);
        } else {
          setError(`Verification failed: ${error.message}`);
        }
      } else {
        console.error('Unknown error type:', error);
        setError('Verification failed: Unknown error');
      }
    } finally {
      console.log('🔄 Setting isVerifying back to false');
      setIsVerifying(false);
    }
  };

  // Handle ticket transaction
  const handlePurchaseTicket = async () => {
    console.log('🚨 TRANSACTION BUTTON CLICKED - handlePurchaseTicket function started');
    console.log('🚨 Function parameters check:');
    console.log('- worldIdProof exists:', !!worldIdProof);
    console.log('- selectedTicket exists:', !!selectedTicket);
    console.log('- isWorldApp:', isWorldApp);
    
    if (!worldIdProof || !selectedTicket || !isWorldApp) {
      console.log('❌ Early return due to missing requirements');
      setError('Missing verification, ticket selection, or World App not available');
      return;
    }

    console.log('✅ All requirements met, proceeding...');
    setIsMinting(true);
    setError(null);
    console.log('✅ State updated - isMinting set to true');

    try {
      console.log('🎫 Starting ticket transaction...');
      console.log('🔍 Debug info:');
      console.log('- worldIdProof:', worldIdProof);
      console.log('- selectedTicket:', selectedTicket);
      console.log('- isWorldApp:', isWorldApp);
      console.log('- worldIdProof.proof type:', typeof worldIdProof.proof);
      console.log('- worldIdProof.proof value:', worldIdProof.proof);
      console.log('- worldIdProof.proof length:', worldIdProof.proof?.length);
      
      // Show each character of the proof to debug the JSON issue
      if (worldIdProof.proof && typeof worldIdProof.proof === 'string') {
        console.log('🔍 Character-by-character analysis:');
        for (let i = 0; i < Math.min(10, worldIdProof.proof.length); i++) {
          console.log(`  [${i}]: "${worldIdProof.proof[i]}" (char code: ${worldIdProof.proof.charCodeAt(i)})`);
        }
      }

      // Parse the proof string into array of BigInts - THIS IS WHERE THE JSON ERROR OCCURS
      let proofArray;
      try {
        console.log('🔄 Attempting to parse proof...');
        
        // Check if proof is already an array (not a string)
        if (Array.isArray(worldIdProof.proof)) {
          console.log('✅ Proof is already an array:', worldIdProof.proof);
          proofArray = worldIdProof.proof;
        } else if (typeof worldIdProof.proof === 'string') {
          // Check if it's a hex string (World ID's actual format)
          if (worldIdProof.proof.startsWith('0x')) {
            console.log('🔧 Proof is a hex string (World ID format):', worldIdProof.proof.substring(0, 50) + '...');
            console.log('🔧 Proof length:', worldIdProof.proof.length);
            
            // For World ID proofs, the proof is typically a single hex string
            // We need to either use it as-is or split it into 8 32-byte chunks
            // Let's try splitting it into 8 components (8 * 64 hex chars = 512 chars + 0x prefix)
            
            const hexWithoutPrefix = worldIdProof.proof.slice(2); // Remove '0x'
            const chunkSize = 64; // 32 bytes = 64 hex characters
            const expectedLength = 8 * chunkSize; // 512 hex characters
            
            if (hexWithoutPrefix.length >= expectedLength) {
              console.log('🔧 Splitting hex proof into 8 components...');
              proofArray = [];
              for (let i = 0; i < 8; i++) {
                const chunk = '0x' + hexWithoutPrefix.slice(i * chunkSize, (i + 1) * chunkSize);
                proofArray.push(chunk);
              }
              console.log('✅ Hex proof split successfully:', proofArray);
            } else {
              console.log('🔧 Using proof as single hex string');
              proofArray = [worldIdProof.proof]; // Use as single element
            }
          } else {
            // Try JSON parsing for other formats
            console.log('🔄 Proof is a string, attempting JSON.parse...');
            
            let proofString = worldIdProof.proof;
            
            // Handle double-encoded JSON (common issue with World ID)
            if (proofString.startsWith('"') && proofString.endsWith('"')) {
              console.log('🔧 Detected double-encoded JSON, removing outer quotes...');
              proofString = proofString.slice(1, -1);
              proofString = proofString.replace(/\\"/g, '"');
              console.log('🔧 Cleaned proof string:', proofString);
            }
            
            proofArray = JSON.parse(proofString);
            console.log('✅ Proof JSON parsed successfully:', proofArray);
          }
        } else {
          throw new Error(`Unexpected proof type: ${typeof worldIdProof.proof}`);
        }
        
      } catch (jsonError) {
        console.error('❌ Proof parsing error:', jsonError);
        console.error('❌ Failed to parse proof:', worldIdProof.proof);
        console.error('❌ Proof type:', typeof worldIdProof.proof);
        
        // Try to show more context about the parsing error
        if (typeof worldIdProof.proof === 'string') {
          console.error('❌ First 50 characters:', worldIdProof.proof.substring(0, 50));
          console.error('❌ Last 50 characters:', worldIdProof.proof.substring(Math.max(0, worldIdProof.proof.length - 50)));
          
          // Try one more fallback for JSON arrays
          if (!worldIdProof.proof.startsWith('0x')) {
            try {
              console.log('🔧 Attempting fallback JSON parsing...');
              const arrayMatch = worldIdProof.proof.match(/\[.*\]/);
              if (arrayMatch) {
                console.log('🔧 Found array pattern, attempting to parse:', arrayMatch[0]);
                proofArray = JSON.parse(arrayMatch[0]);
                console.log('✅ Fallback parsing successful:', proofArray);
              } else {
                throw new Error('No array pattern found in proof string');
              }
            } catch (fallbackError) {
              console.error('❌ Fallback parsing also failed:', fallbackError);
              throw new Error(`Failed to parse World ID proof: ${jsonError.message}. Original proof: ${worldIdProof.proof}`);
            }
          } else {
            throw new Error(`Failed to parse hex proof: ${jsonError.message}`);
          }
        } else {
          throw new Error(`Failed to parse World ID proof: ${jsonError.message}`);
        }
      }
      
      console.log('✅ Proof parsing completed successfully');
      console.log('📋 Parsed proof array:', proofArray);
      
      // Safety check for proofArray
      if (!proofArray || !Array.isArray(proofArray)) {
        console.error('❌ Proof array validation failed:');
        console.error('- proofArray exists:', !!proofArray);
        console.error('- proofArray is array:', Array.isArray(proofArray));
        console.error('- proofArray value:', proofArray);
        throw new Error('Proof array is invalid or undefined');
      }
      
      console.log('✅ Proof array validation passed:');
      console.log('- Array length:', proofArray.length);
      console.log('- Array contents:', proofArray);
      
      // For World ID, signal can be a string that identifies this verification context
      console.log('👤 Full MiniKit object:', MiniKit);
      console.log('👤 MiniKit.user:', MiniKit.user);
      console.log('👤 Available MiniKit properties:', Object.keys(MiniKit));
      
      // Use a simple string signal for World ID verification, but convert to address format for contract
      const signalString = `purchase_${event.id}_${selectedType}`;
      console.log('🔄 Using string signal for World ID:', signalString);
      
      // Convert string to address by hashing and taking first 20 bytes
      const hexString = Array.from(new TextEncoder().encode(signalString))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
      
      // Pad or truncate to exactly 40 hex characters (20 bytes)
      const paddedHex = hexString.padEnd(40, '0').slice(0, 40);
      const signalHash = '0x' + paddedHex;
      
      console.log('🔄 Original hex string:', hexString);
      console.log('🔄 Padded to 20 bytes:', paddedHex);
      console.log('🔄 Final signal address:', signalHash);
      
      // Convert proof array to BigInt with error handling
      let proofBigInts;
      try {
        console.log('🔄 Converting proof array to BigInt...');
        console.log('- proofArray before conversion:', proofArray);
        proofBigInts = proofArray.map((p: string) => {
          console.log('Converting proof element:', p, 'type:', typeof p);
          return BigInt(p);
        });
        console.log('✅ Proof conversion successful:', proofBigInts);
      } catch (mapError) {
        console.error('❌ Error converting proof array:', mapError);
        console.error('- proofArray at error time:', proofArray);
        console.error('- proofArray type:', typeof proofArray);
        console.error('- proofArray is array:', Array.isArray(proofArray));
        throw new Error(`Failed to convert proof array: ${mapError.message}`);
      }

      const purchaseArgs = [
        event.id, // eventId
        selectedType, // ticketTypeIndex
        signalHash, // signal (converted to address format)
        BigInt(worldIdProof.merkle_root), // root
        BigInt(worldIdProof.nullifier_hash), // nullifierHash
        proofBigInts // proof array (converted to BigInt)
      ];

      console.log('📋 Final purchase args:', purchaseArgs);

      // Convert price to wei (hex string)
      const priceInWei = parseEther(totalPrice.toString());
      const valueHex = `0x${priceInWei.toString(16)}`;

      console.log('📋 Transaction details:');
      console.log('- Contract:', WORLD_CHAIN_CONTRACTS.TARGET_CONTRACT);
      console.log('- Function:', 'purchaseTicket');
      console.log('- Value:', `${totalPrice} ETH (${valueHex})`);

      // Send actual transaction using World App
      console.log('🔄 Sending transaction to World Chain...');
      
      if (!MiniKit.isInstalled()) {
        throw new Error('World App is required to complete this transaction');
      }

      // Prepare transaction for World App
      const transactionData = {
        to: WORLD_CHAIN_CONTRACTS.TARGET_CONTRACT as `0x${string}`,
        value: valueHex, // 0 WLD = 0 ETH value for gas-less transaction
        data: encodeFunctionData({
          abi: EVENT_CONTRACT_ABI,
          functionName: 'purchaseTicket',
          args: purchaseArgs
        }),
      };

      console.log('📡 Sending transaction via World App:', transactionData);

      try {
        // Send transaction through World App
        const result = await MiniKit.commandsAsync.sendTransaction(transactionData);
        console.log('📥 Transaction result:', result);

        if (result.finalPayload?.status === 'error') {
          throw new Error(`Transaction failed: ${result.finalPayload.error_code || result.finalPayload.message || 'Unknown error'}`);
        }

        const transactionId = result.finalPayload?.transaction_id;
        if (!transactionId) {
          throw new Error('No transaction ID received from World App');
        }

        console.log('✅ Transaction submitted successfully:', transactionId);
        setTransactionId(transactionId);
        
        // Add transaction to context
        addTransaction({
          hash: transactionId,
          type: 'purchase_ticket',
          status: 'pending',
          eventId: event.id,
          ticketTypeId: selectedTicket.id
        });

        // Start monitoring transaction confirmation
        await monitorTransactionConfirmation(transactionId);

      } catch (error) {
        console.error('❌ Ticket transaction error caught in try/catch:', error);
        
        // More detailed error logging
        if (error instanceof Error) {
          console.error('Error message:', error.message);
          console.error('Error stack:', error.stack);
          
          // Provide more specific error messages for JSON parsing
          if (error.message.includes('JSON')) {
            setError(`JSON parsing error in transaction: ${error.message}`);
          } else {
            setError(`Transaction failed: ${error.message}`);
          }
        } else {
          console.error('Unknown error type:', error);
          setError('Transaction failed: Unknown error');
        }
      }

    } finally {
      console.log('🔄 Setting isMinting back to false');
      setIsMinting(false);
    }
  };

  // Monitor transaction confirmation using World App API
  const monitorTransactionConfirmation = async (txId: string) => {
    try {
      console.log('⏳ Monitoring transaction confirmation...');
      
      // Poll for transaction status
      let attempts = 0;
      const maxAttempts = 30; // 30 attempts with 2 second intervals = 1 minute
      
      while (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
        
        try {
          // Query transaction status from World App API
          console.log(`🔍 Checking transaction status (attempt ${attempts + 1}/${maxAttempts})`);
          
          const response = await fetch(`/api/transaction-status?id=${txId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          });
          
          console.log('📡 Response status:', response.status);
          console.log('📡 Response headers:', response.headers);
          
          if (!response.ok) {
            console.warn(`⚠️ API response not ok: ${response.status} ${response.statusText}`);
            continue; // Try again
          }
          
          // Get the response text first to debug JSON parsing issues
          const responseText = await response.text();
          console.log('📄 Raw response text:', responseText);
          
          // Try to parse JSON with better error handling
          let txData;
          try {
            txData = JSON.parse(responseText);
            console.log('📊 Parsed transaction data:', txData);
          } catch (jsonError) {
            console.error('❌ JSON parsing error:', jsonError);
            console.error('❌ Response text that failed to parse:', responseText);
            throw new Error(`Failed to parse API response as JSON: ${jsonError.message}`);
          }
          
          if (txData.transactionStatus === 'success') {
            console.log('🎉 Transaction confirmed!');
            setTransactionHash(txData.transactionHash);
            
            // Add ticket to user's collection
            addUserTicket({
              ticketTypeId: selectedTicket.id,
              eventId: event.id,
              balance: quantity,
              ticketType: {
                id: selectedTicket.id,
                eventId: event.id,
                name: selectedTicket.name,
                price: parseEther(totalPrice.toString()),
                maxSupply: selectedTicket.maxSupply,
                currentSupply: selectedTicket.currentSupply + quantity,
                ipfsHash: 'placeholder'
              },
              event: {
                id: event.id,
                organizer: 'placeholder',
                name: event.name,
                ticketTypes: event.ticketTypes ? event.ticketTypes.map(t => t.id) : [],
                active: true
              },
              purchaseHash: txData.transactionHash,
              purchaseDate: new Date()
            });

            setCurrentStep('success');
            return;
          } else if (txData.transactionStatus === 'failed') {
            throw new Error('Transaction failed on blockchain');
          }
          // Continue polling if still pending
          
        } catch (pollError) {
          console.warn('⚠️ Error polling transaction status:', pollError);
          
          // If it's a JSON parsing error, we want to surface it immediately
          if (pollError.message.includes('JSON') || pollError.message.includes('parse')) {
            throw pollError;
          }
          
          // For other errors, continue polling
        }
        
        attempts++;
      }
      
      // Timeout reached
      console.warn('⏰ Transaction monitoring timeout reached');
      setError('Transaction monitoring timeout. Please check your wallet or transaction explorer.');
      
    } catch (error) {
      console.error('❌ Transaction monitoring error:', error);
      setError(`Failed to monitor transaction: ${error.message}`);
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
            {currentStep === 'purchase' && 'Complete Transaction'}
            {currentStep === 'success' && 'Transaction Recorded!'}
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
          {error && (
            <div className="bg-bg-error border border-border-error rounded-lg p-3">
              <div className="flex items-start gap-2">
                <span className="text-text-error">⚠️</span>
                <div>
                  <p className="text-sm font-medium text-text-error">Error</p>
                  <p className="text-sm text-text-error">{error}</p>
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
                  {event.ticketTypes && event.ticketTypes.length > 0 ? event.ticketTypes.map((ticket, index) => (
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
                          {ticket.price === 0 
                            ? (event.currency === 'WLD' ? '0 WLD' : 'Free')
                            : (event.currency === 'WLD' ? `${ticket.price} WLD` : `$${ticket.price}`)
                          }
                        </p>
                      </div>
                    </label>
                  )) : (
                    <p className="text-sm text-text-secondary">No ticket types available</p>
                  )}
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
                    {totalPrice === 0 
                      ? (event.currency === 'WLD' ? '0 WLD' : 'Free')
                      : (event.currency === 'WLD' ? `${totalPrice} WLD` : `$${totalPrice}`)
                    }
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

          {/* Step 3: Purchase Transaction */}
          {currentStep === 'purchase' && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-green bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-text-primary mb-2">Ready to Record!</h3>
                <p className="text-sm text-text-secondary">
                  Record your ticket reservation on the smart contract with World Chain.
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
                    {totalPrice === 0 
                      ? (event.currency === 'WLD' ? '0 WLD' : 'Free')
                      : (event.currency === 'WLD' ? `${totalPrice} WLD` : `$${totalPrice}`)
                    }
                  </span>
                </div>
              </div>

              {/* World Chain Benefits */}
              <div className="bg-bg-tertiary rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-4 h-4 text-primary-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="text-sm font-medium text-text-primary">World Chain Benefits</span>
                </div>
                <ul className="text-xs text-text-secondary space-y-1">
                  <li>• No gas fees - completely free transactions</li>
                  <li>• Instant confirmation</li>
                  <li>• Permanent record on blockchain</li>
                  <li>• Anti-scalping protection with World ID</li>
                </ul>
              </div>

              <button
                onClick={handlePurchaseTicket}
                disabled={isMinting || !isWorldApp}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isMinting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    Processing Transaction...
                  </div>
                ) : (
                  `Record Transaction - ${totalPrice === 0 ? '0 WLD' : `${totalPrice} WLD`}`
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
                <h3 className="text-lg font-medium text-text-primary mb-2">Transaction Recorded!</h3>
                <p className="text-sm text-text-secondary">
                  Your ticket transaction has been successfully recorded on the smart contract.
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

              {transactionId && (
                <div className="bg-bg-tertiary rounded-lg p-3">
                  <p className="text-sm text-text-secondary mb-1">World App Transaction ID:</p>
                  <p className="text-sm text-text-primary font-mono break-all">
                    {transactionId}
                  </p>
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