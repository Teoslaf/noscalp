'use client';

import { useState, useCallback, useEffect } from 'react';
import { 
  MiniKit, 
  VerificationLevel, 
  ISuccessResult,
  VerifyCommandInput
} from '@worldcoin/minikit-js';
import { createWalletClient, custom } from 'viem';
import { worldchain, WORLD_CHAIN_CONTRACTS, DEFAULT_ACTION, TEST_ACTION } from '@/lib/worldchain';

interface ZKProofData {
  root: string;
  nullifierHash: string;
  proof: string;
  externalNullifierHash: string;
  signalHash: string;
}

interface ContractCallData {
  to: string;
  data: string;
  value: string;
  gasLimit: string;
}

interface ServerVerificationResult {
  success: boolean;
  action: string;
  nullifier_hash: string;
  created_at: string;
}

interface APIResponse {
  success: boolean;
  clientVerificationResult: any;
  serverVerificationResult?: ServerVerificationResult | null;
  zkProofData: ZKProofData;
  contractCallData: ContractCallData;
  contractAddress: string;
  verificationMethod: string;
  message: string;
}

/**
 * ZK Proof Generator Component
 * Generates World ID ZK proofs using Minikit and submits them to World Chain smart contracts
 * Now supports both client-side and server-side verification using official World ID API
 */
export const ZKProofGenerator = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [zkProofData, setZkProofData] = useState<ZKProofData | null>(null);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [minikitReady, setMinikitReady] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [lastError, setLastError] = useState<any>(null);
  const [useServerVerification, setUseServerVerification] = useState(false);
  const [apiResponse, setApiResponse] = useState<APIResponse | null>(null);

  const APP_ID = process.env.NEXT_PUBLIC_APP_ID;

  useEffect(() => {
    // Debug environment variables
    console.log('🔍 ZKProofGenerator Debug Info:');
    console.log('APP_ID:', APP_ID);
    console.log('DEFAULT_ACTION:', DEFAULT_ACTION);
    console.log('CONTRACT_ADDRESS:', WORLD_CHAIN_CONTRACTS.TARGET_CONTRACT);
    console.log('Environment:', process.env.NODE_ENV);
    
    // Check if Minikit is available - proper way
    const isWorldApp = MiniKit.isInstalled();
    console.log('Is World App (MiniKit.isInstalled()):', isWorldApp);
    
    setDebugInfo({
      hasAppId: !!APP_ID,
      appId: APP_ID,
      action: DEFAULT_ACTION,
      contract: WORLD_CHAIN_CONTRACTS.TARGET_CONTRACT,
      env: process.env.NODE_ENV,
      isWorldApp: isWorldApp,
      worldIdApiDocs: 'https://docs.world.org/world-id/reference/api#verify-proof'
    });

    // Initialize Minikit
    if (APP_ID && typeof window !== 'undefined') {
      console.log('🚀 Initializing Minikit...');
      try {
        // For World App, no explicit installation needed
        if (isWorldApp) {
          console.log('✅ World App detected - Minikit ready');
          setMinikitReady(true);
          checkWalletConnection();
        } else {
          console.log('📱 Not in World App environment');
          setMinikitReady(true); // Still allow external wallet usage
        }
      } catch (error) {
        console.error('❌ Minikit initialization error:', error);
        setError(`Failed to initialize Minikit: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  }, [APP_ID]);

  /**
   * Check wallet connection (World App or external wallet)
   */
  const checkWalletConnection = useCallback(async () => {
    try {
      console.log('🔍 Checking wallet connection...');
      
      // If in World App, try to get the wallet address through Minikit
      if (MiniKit.isInstalled()) {
        console.log('📱 Running in World App - using Minikit wallet');
        // For Minikit, we'll get the address during verification
        // No need to connect explicitly
        return null;
      }
      
      // For external browsers, use traditional wallet connection
      if (typeof window !== 'undefined' && window.ethereum) {
        console.log('🦊 External wallet detected (MetaMask, etc.)');
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts && accounts.length > 0) {
          console.log('👛 External wallet connected:', accounts[0]);
          setWalletAddress(accounts[0]);
          return accounts[0];
        } else {
          console.log('👛 External wallet not connected');
          return null;
        }
      }
      
      console.log('❌ No wallet available');
      return null;
    } catch (error) {
      console.error('❌ Error checking wallet connection:', error);
      return null;
    }
  }, []);

  /**
   * Connect external wallet (for non-World App usage)
   */
  const connectExternalWallet = useCallback(async () => {
    try {
      if (typeof window === 'undefined' || !window.ethereum) {
        throw new Error('Please install MetaMask or use World App');
      }
      
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (accounts && accounts.length > 0) {
        setWalletAddress(accounts[0]);
        console.log('✅ External wallet connected:', accounts[0]);
        return accounts[0];
      }
      throw new Error('No accounts found');
    } catch (error) {
      console.error('❌ External wallet connection error:', error);
      throw error;
    }
  }, []);

  /**
   * Handle World ID verification success with enhanced API integration
   */
  const handleVerify = useCallback(async (proof: ISuccessResult) => {
    try {
      console.log('🔄 Starting handleVerify with proof:', proof);
      setIsLoading(true);
      setError(null);
      setSuccess(null);
      setApiResponse(null);

      // Get user's wallet address as signal
      let userAddress = walletAddress;
      
      if (!userAddress) {
        console.log('🔍 No cached wallet address, attempting to get one...');
        
        if (MiniKit.isInstalled()) {
          // In World App, use a placeholder or get from Minikit if available
          console.log('📱 Using World App - will use verification result');
          // For World App, we can use the nullifier as a unique identifier
          // or get the address from Minikit commands if available
          userAddress = 'world_app_user'; // Placeholder for signal
        } else {
          // For external wallets, try to connect
          try {
            userAddress = await connectExternalWallet();
          } catch (walletError) {
            console.error('❌ Wallet connection error:', walletError);
            throw new Error('Failed to connect wallet. Please ensure a Web3 wallet is available.');
          }
        }
      }

      if (!userAddress) {
        throw new Error('Unable to get wallet address for verification');
      }

      if (!APP_ID) {
        throw new Error('App ID not configured. Please check NEXT_PUBLIC_APP_ID environment variable.');
      }

      console.log('📤 Sending request to /api/create-zk-proof with:', {
        proof: { ...proof, proof: proof.proof?.substring(0, 20) + '...' }, // Truncate proof for logging
        signal: userAddress,
        action: DEFAULT_ACTION,
        contractAddress: WORLD_CHAIN_CONTRACTS.TARGET_CONTRACT,
        useServerVerification
      });

      // Create ZK proof for the smart contract with optional server verification
      const response = await fetch('/api/create-zk-proof', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          proof,
          signal: userAddress,
          action: DEFAULT_ACTION,
          contractAddress: WORLD_CHAIN_CONTRACTS.TARGET_CONTRACT,
          useServerVerification // Include the server verification flag
        }),
      });

      console.log('📥 API Response status:', response.status);
      console.log('📥 API Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ API Error Response:', errorData);
        
        // Enhanced error handling based on World ID API documentation
        let userFriendlyMessage = errorData.error || `HTTP ${response.status}: ${response.statusText}`;
        
        // Handle specific World ID API errors
        if (errorData.details) {
          if (errorData.details.includes('invalid_proof')) {
            userFriendlyMessage = 'The proof provided is invalid. Please try generating a new proof.';
          } else if (errorData.details.includes('user_already_verified')) {
            userFriendlyMessage = 'You have already verified for this action. Each user can only verify once per action.';
          } else if (errorData.details.includes('max_verifications_reached')) {
            userFriendlyMessage = 'Maximum number of verifications reached for this action.';
          } else if (errorData.details.includes('inclusion_proof_failed')) {
            userFriendlyMessage = 'Verification failed: Your World ID verification could not be confirmed. Please check that your app is published in the Developer Portal.';
          }
        }
        
        throw new Error(userFriendlyMessage);
      }

      const result: APIResponse = await response.json();
      console.log('✅ API Success Response:', result);
      
      setZkProofData(result.zkProofData);
      setApiResponse(result);

      return result;
    } catch (error) {
      console.error('❌ handleVerify error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [APP_ID, walletAddress, connectExternalWallet, useServerVerification]);

  /**
   * Submit proof to smart contract on World Chain
   */
  const submitProofToContract = useCallback(async (contractCallData: ContractCallData) => {
    try {
      console.log('🔄 Starting submitProofToContract with:', contractCallData);
      setIsLoading(true);
      setError(null);

      // Check if we're in World App
      if (MiniKit.isInstalled()) {
        console.log('📱 Submitting transaction via World App/Minikit');
        
        // For World App, we might need to use Minikit's transaction methods
        // This is a placeholder - you might need to use Minikit's transaction API
        setSuccess('ZK proof verified successfully! (Transaction submission from World App not yet implemented)');
        return 'world_app_tx_placeholder';
      }

      // For external wallets, use traditional method
      if (typeof window === 'undefined' || !window.ethereum) {
        throw new Error('Please use World App or install MetaMask');
      }

      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      // Create wallet client for World Chain
      const walletClient = createWalletClient({
        chain: worldchain,
        transport: custom(window.ethereum),
      });

      const [account] = await walletClient.getAddresses();
      console.log('👛 External wallet account for transaction:', account);

      // Submit transaction to World Chain
      const txHash = await walletClient.sendTransaction({
        account,
        to: contractCallData.to as `0x${string}`,
        data: contractCallData.data as `0x${string}`,
        value: BigInt(contractCallData.value),
        gas: BigInt(contractCallData.gasLimit),
      });

      console.log('✅ Transaction submitted:', txHash);
      setTransactionHash(txHash);
      setSuccess(`ZK proof submitted successfully! Transaction: ${txHash}`);

      return txHash;
    } catch (error) {
      console.error('❌ Contract submission error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit to contract';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Handle successful World ID verification and contract submission
   */
  const onSuccess = useCallback(async (result: ISuccessResult) => {
    try {
      console.log('🎉 Minikit onSuccess called with result:', result);
      setIsLoading(true);
      
      // First verify the proof and get contract call data
      const proofResult = await handleVerify(result);
      
      // Then submit to the smart contract
      await submitProofToContract(proofResult.contractCallData);
      
    } catch (error) {
      console.error('❌ Full flow error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [handleVerify, submitProofToContract]);

  /**
   * Initiate World ID verification using Minikit
   */
  const startWorldIDVerification = useCallback(async () => {
    try {
      console.log('🔘 Starting World ID verification with Minikit...');
      setIsLoading(true);
      setError(null);
      setLastError(null); // Clear previous error details

      if (!minikitReady) {
        throw new Error('Minikit not initialized. Please refresh the page.');
      }

      if (!APP_ID) {
        throw new Error('App ID not configured. Please check NEXT_PUBLIC_APP_ID environment variable.');
      }

      // Get user's wallet address for signal
      let userAddress = walletAddress;
      
      if (!userAddress && !MiniKit.isInstalled()) {
        // Only try to connect external wallet if not in World App
        try {
          userAddress = await connectExternalWallet();
        } catch (walletError) {
          console.error('❌ Wallet connection error:', walletError);
          throw new Error('Please connect your wallet first');
        }
      }

      // For World App, use a consistent signal
      const signal = userAddress || 'world_app_verification';
      console.log('📍 Using signal for verification:', signal);

      // Check if we're in World App
      if (MiniKit.isInstalled()) {
        console.log('📱 Using World App Minikit verification');
        
        // Prepare verification payload using correct Minikit API
        const verifyPayload: VerifyCommandInput = {
          action: DEFAULT_ACTION,
          signal: signal,
          verification_level: VerificationLevel.Orb
        };

        console.log('📱 Calling MiniKit.commandsAsync.verify with payload:', verifyPayload);

        try {
          // Trigger verification using the correct API
          const response = await MiniKit.commandsAsync.verify(verifyPayload);
          
          console.log('📱 Full Minikit verification response:', response);
          console.log('📱 Response type:', typeof response);
          console.log('📱 Response keys:', Object.keys(response || {}));

          const { finalPayload } = response;
          console.log('📱 Final payload:', finalPayload);
          console.log('📱 Final payload type:', typeof finalPayload);
          console.log('📱 Final payload keys:', Object.keys(finalPayload || {}));

          if (finalPayload) {
            if (finalPayload.status === 'success') {
              console.log('✅ Verification successful:', finalPayload);
              await onSuccess(finalPayload as ISuccessResult);
            } else if (finalPayload.status === 'error') {
              console.log('❌ Verification failed with error:', finalPayload);
              
              // Extract detailed error information
              const errorCode = finalPayload.code || 'unknown_error';
              const errorDetail = finalPayload.detail || 'Unknown error occurred during verification';
              
              console.error('❌ Error details:', {
                code: errorCode,
                detail: errorDetail,
                fullPayload: finalPayload
              });
              
              // Store detailed error for debugging
              setLastError({
                code: errorCode,
                detail: errorDetail,
                fullPayload: finalPayload,
                timestamp: new Date().toISOString()
              });
              
              // Provide user-friendly error messages based on error codes
              let userMessage = '';
              switch (errorCode) {
                case 'verification_rejected':
                  userMessage = 'Verification was cancelled. Please try again if this was a mistake.';
                  break;
                case 'max_verifications_reached':
                  userMessage = 'You have already verified for this action the maximum number of times allowed.';
                  break;
                case 'credential_unavailable':
                  userMessage = 'You do not have the required World ID credential. Please verify at an Orb or verify your device in World App.';
                  break;
                case 'malformed_request':
                  userMessage = 'Invalid request configuration. Please contact the app developer.';
                  break;
                case 'invalid_network':
                  userMessage = 'Network mismatch. Please ensure you are using the correct World App environment.';
                  break;
                case 'inclusion_proof_failed':
                  userMessage = 'Verification temporarily unavailable. Please try again in a few moments.';
                  break;
                case 'inclusion_proof_pending':
                  userMessage = 'Your credential is not yet available on-chain. Please try again in about an hour.';
                  break;
                default:
                  userMessage = `Verification failed: ${errorDetail}`;
              }
              
              throw new Error(userMessage);
            } else {
              console.log('⚠️ Unexpected verification status:', finalPayload.status);
              throw new Error(`Unexpected verification status: ${finalPayload.status}`);
            }
          } else {
            console.log('⏳ No final payload - verification may have been cancelled');
            setIsLoading(false);
            setError('Verification was cancelled or did not complete. Please try again.');
            return;
          }
        } catch (verificationError) {
          console.error('❌ Minikit verification API error:', verificationError);
          
          // If it's already our custom error, re-throw it
          if (verificationError instanceof Error && verificationError.message.includes('Verification failed:')) {
            throw verificationError;
          }
          
          // Handle API-level errors
          throw new Error(`Verification API error: ${verificationError instanceof Error ? verificationError.message : 'Unknown API error'}`);
        }
      } else {
        // For non-World App environments, show an informative message
        throw new Error('World ID verification requires World App. Please open this page in World App for the best experience.');
      }

    } catch (error) {
      console.error('❌ World ID verification error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to start verification';
      setError(errorMessage);
      setIsLoading(false);
    }
  }, [minikitReady, APP_ID, walletAddress, connectExternalWallet, onSuccess]);

  /**
   * Check if user is on World Chain
   */
  const switchToWorldChain = useCallback(async () => {
    try {
      if (MiniKit.isInstalled()) {
        console.log('📱 World App detected - chain switching handled by app');
        return;
      }
      
      if (typeof window !== 'undefined' && window.ethereum) {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${worldchain.id.toString(16)}` }],
        });
      }
    } catch (switchError: any) {
      // Chain not added to wallet
      if (switchError.code === 4902) {
        try {
          await window.ethereum?.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${worldchain.id.toString(16)}`,
                chainName: worldchain.name,
                nativeCurrency: worldchain.nativeCurrency,
                rpcUrls: [worldchain.rpcUrls.default.http[0]],
                blockExplorerUrls: [worldchain.blockExplorers?.default.url],
              },
            ],
          });
        } catch (addError) {
          throw new Error('Failed to add World Chain to wallet');
        }
      } else {
        throw switchError;
      }
    }
  }, []);

  // Manual test function for debugging
  const testMinikitWidget = useCallback(() => {
    console.log('🧪 Testing Minikit widget manually...');
    console.log('APP_ID:', APP_ID);
    console.log('Action:', DEFAULT_ACTION);
    console.log('Minikit ready:', minikitReady);
    console.log('Is World App:', MiniKit.isInstalled());
    console.log('Wallet Address:', walletAddress);
    
    if (!APP_ID) {
      console.error('❌ No APP_ID configured');
      setError('APP_ID not configured - please check your environment variables');
      return;
    }
    
    if (!minikitReady) {
      console.error('❌ Minikit not ready');
      setError('Minikit not initialized - please refresh the page');
      return;
    }
    
    console.log('✅ Minikit widget should be functional');
  }, [APP_ID, minikitReady, walletAddress]);

  // Configuration checker for troubleshooting
  const checkConfiguration = useCallback(() => {
    console.log('🔍 Checking configuration for common issues...');
    
    const checks = {
      appId: {
        configured: !!APP_ID,
        format: APP_ID?.startsWith('app_') || false,
        value: APP_ID
      },
      action: {
        configured: !!DEFAULT_ACTION,
        value: DEFAULT_ACTION
      },
      environment: {
        isDev: process.env.NODE_ENV === 'development',
        isWorldApp: MiniKit.isInstalled()
      }
    };
    
    console.log('📋 Configuration Check Results:', checks);
    
    let issues = [];
    if (!checks.appId.configured) issues.push('APP_ID not configured');
    if (!checks.appId.format) issues.push('APP_ID format invalid (should start with "app_")');
    if (!checks.action.configured) issues.push('Action not configured');
    
    if (issues.length > 0) {
      console.warn('⚠️ Configuration issues found:', issues);
      setError(`Configuration issues: ${issues.join(', ')}`);
    } else {
      console.log('✅ Configuration looks good');
      setError('Configuration appears correct. If you\'re getting inclusion_proof_failed, try again in 30-60 seconds.');
    }
    
    return checks;
  }, [APP_ID, minikitReady, walletAddress]);

  // Test with minimal payload to isolate issues
  const testMinimalVerification = useCallback(async () => {
    try {
      console.log('🧪 Testing minimal verification to isolate inclusion_proof_failed...');
      setIsLoading(true);
      setError(null);
      setLastError(null);

      if (!MiniKit.isInstalled()) {
        throw new Error('This test requires World App');
      }

      // Try with the simplest possible payload
      const minimalPayload: VerifyCommandInput = {
        action: TEST_ACTION, // Use simpler test action
        signal: '', // Empty signal
        verification_level: VerificationLevel.Orb
      };

      console.log('🧪 Testing with minimal payload:', minimalPayload);

      const response = await MiniKit.commandsAsync.verify(minimalPayload);
      console.log('🧪 Minimal test response:', response);

      const { finalPayload } = response;
      
      if (finalPayload?.status === 'success') {
        setSuccess('✅ Minimal test successful! The issue might be with the action configuration.');
        console.log('✅ Minimal verification worked - action or signal might be the issue');
      } else if (finalPayload?.status === 'error') {
        console.log('❌ Minimal test also failed:', finalPayload);
        setLastError({
          code: finalPayload.error_code || 'unknown',
          detail: 'Minimal test failed with same error',
          fullPayload: finalPayload,
          timestamp: new Date().toISOString()
        });
        
        if (finalPayload.error_code === 'inclusion_proof_failed') {
          setError('❌ Minimal test also failed with inclusion_proof_failed. This suggests a World ID app configuration or account issue.');
        } else {
          setError(`❌ Minimal test failed with: ${finalPayload.error_code}`);
        }
      } else {
        setError('Test cancelled or incomplete');
      }
    } catch (error) {
      console.error('❌ Minimal test error:', error);
      setError(`Minimal test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Comprehensive diagnostic for persistent inclusion_proof_failed
  const runFullDiagnostic = useCallback(async () => {
    try {
      console.log('🔧 Running comprehensive diagnostic for inclusion_proof_failed...');
      setIsLoading(true);
      setError(null);
      setLastError(null);

      if (!MiniKit.isInstalled()) {
        throw new Error('Diagnostic requires World App');
      }

      // Test 1: Check app configuration
      console.log('📋 Test 1: App Configuration Check');
      console.log('App ID:', APP_ID);
      console.log('Environment:', process.env.NODE_ENV);
      console.log('Is World App:', MiniKit.isInstalled());

      // Test 2: Try with different verification levels
      const testCases = [
        {
          name: 'Device Verification',
          payload: {
            action: 'test_action_device',
            signal: '',
            verification_level: VerificationLevel.Device
          }
        },
        {
          name: 'Orb Verification',
          payload: {
            action: 'test_action_orb',
            signal: '',
            verification_level: VerificationLevel.Orb
          }
        }
      ];

      for (const testCase of testCases) {
        try {
          console.log(`🧪 Testing: ${testCase.name}`);
          console.log('Payload:', testCase.payload);
          
          const response = await MiniKit.commandsAsync.verify(testCase.payload);
          console.log(`📱 ${testCase.name} response:`, response);
          
          const { finalPayload } = response;
          
          if (finalPayload?.status === 'success') {
            setSuccess(`✅ SUCCESS: ${testCase.name} worked! Your World ID is functional.`);
            console.log(`✅ ${testCase.name} successful!`);
            return; // Stop on first success
          } else if (finalPayload?.status === 'error') {
            console.log(`❌ ${testCase.name} failed:`, finalPayload);
            
            // Store the error details
            setLastError({
              code: finalPayload.error_code || 'unknown',
              detail: `${testCase.name} failed: ${finalPayload.error_code}`,
              fullPayload: finalPayload,
              timestamp: new Date().toISOString(),
              testCase: testCase.name
            });
            
            // If device verification also fails, it's likely a fundamental issue
            if (testCase.payload.verification_level === VerificationLevel.Device && 
                finalPayload.error_code === 'inclusion_proof_failed') {
              setError('❌ Even device verification failed with inclusion_proof_failed. This suggests your World ID app is not properly configured or published.');
              return;
            }
          }
          
          // Wait between tests
          await new Promise(resolve => setTimeout(resolve, 2000));
          
        } catch (testError) {
          console.error(`❌ ${testCase.name} test error:`, testError);
        }
      }
      
      // If we get here, all tests failed
      setError('❌ All diagnostic tests failed. Please check your World ID app configuration in the Developer Portal.');
      
    } catch (error) {
      console.error('❌ Diagnostic error:', error);
      setError(`Diagnostic failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  }, [APP_ID]);

  if (!APP_ID) {
    return (
      <div className="space-y-lg">
        <div className="bg-status-error/10 border border-status-error rounded-lg p-md">
          <p className="text-status-error font-medium mb-sm">
            ❌ World ID App ID not configured
          </p>
          <p className="text-small text-text-muted">
            Please check your environment variables. You need to set <code>NEXT_PUBLIC_APP_ID</code> in your .env.local file.
          </p>
          <div className="mt-sm">
            <p className="text-small text-text-secondary font-medium">Example .env.local:</p>
            <pre className="text-small bg-surface-primary p-sm rounded mt-xs font-mono">
              NEXT_PUBLIC_APP_ID=app_your_app_id_here
            </pre>
          </div>
        </div>
        
        {/* Debug Info */}
        <div className="bg-surface-secondary border border-border-muted rounded-lg p-md">
          <h3 className="text-body font-medium text-text-primary mb-sm">Debug Information</h3>
          <div className="text-small text-text-muted font-mono space-y-xs">
            <div>Environment: {process.env.NODE_ENV}</div>
            <div>Has APP_ID: {!!APP_ID ? '✅' : '❌'}</div>
            <div>Default Action: {DEFAULT_ACTION}</div>
            <div>Contract: {WORLD_CHAIN_CONTRACTS.TARGET_CONTRACT}</div>
          </div>
        </div>
      </div>
    );
  }

  const isWorldApp = MiniKit.isInstalled();

  return (
    <div className="space-y-lg">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-section-header font-bold text-text-primary mb-sm">
          Generate ZK Proof for World Chain
        </h2>
        <p className="text-body text-text-secondary">
          Verify your World ID using Minikit and submit a zero-knowledge proof to the smart contract
        </p>
        <p className="text-caption text-text-muted mt-xs">
          Contract: <code className="font-mono">{WORLD_CHAIN_CONTRACTS.TARGET_CONTRACT}</code>
        </p>
      </div>

      {/* Verification Options */}
      <div className="bg-surface-secondary border border-border-muted rounded-lg p-md">
        <h3 className="text-body font-medium text-text-primary mb-sm">🔧 Verification Options</h3>
        <div className="space-y-sm">
          <label className="flex items-center space-x-sm cursor-pointer">
            <input
              type="checkbox"
              checked={useServerVerification}
              onChange={(e) => setUseServerVerification(e.target.checked)}
              className="w-4 h-4 text-primary-green bg-surface-primary border-border-muted rounded focus:ring-primary-green focus:ring-2"
            />
            <span className="text-text-primary">
              Enable server-side verification using World ID API
            </span>
          </label>
          <div className="text-small text-text-muted ml-6">
            {useServerVerification ? 
              '✅ Will use both client-side (verifyCloudProof) and server-side (/api/v2/verify) verification' :
              '🔄 Using client-side verification only (verifyCloudProof)'
            }
          </div>
          <div className="text-small text-text-muted ml-6">
            <a 
              href="https://docs.world.org/world-id/reference/api#verify-proof" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary-green hover:text-primary-green-hover underline"
            >
              📖 View World ID API Documentation →
            </a>
          </div>
        </div>
      </div>

      {/* Debug Information in Development */}
      {process.env.NODE_ENV === 'development' && debugInfo && (
        <div className="bg-surface-secondary border border-border-muted rounded-lg p-md">
          <h3 className="text-body font-medium text-text-primary mb-sm">🔍 Debug Information</h3>
          <div className="text-small text-text-muted font-mono space-y-xs">
            <div>App ID: {debugInfo.hasAppId ? '✅ Configured' : '❌ Missing'} ({debugInfo.appId})</div>
            <div>Action: {debugInfo.action}</div>
            <div>Contract: {debugInfo.contract}</div>
            <div>Environment: {debugInfo.env}</div>
            <div>Minikit Ready: {minikitReady ? '✅' : '⏳'}</div>
            <div>Is World App: {debugInfo.isWorldApp ? '✅' : '❌'}</div>
            <div>Wallet Address: {walletAddress || 'Not connected'}</div>
            <div>Server Verification: {useServerVerification ? '✅ Enabled' : '❌ Disabled'}</div>
            <div>
              API Docs: <a href={debugInfo.worldIdApiDocs} target="_blank" rel="noopener noreferrer" className="text-primary-green underline">
                View Official Docs
              </a>
            </div>
          </div>
          
          {/* Last Error Details */}
          {lastError && (
            <div className="mt-sm pt-sm border-t border-border-muted">
              <h4 className="text-small font-medium text-text-primary mb-xs">🐛 Last Error Details:</h4>
              <div className="text-small text-text-muted font-mono space-y-xs bg-status-error/5 p-sm rounded">
                <div><span className="text-status-error">Code:</span> {lastError.code}</div>
                <div><span className="text-status-error">Detail:</span> {lastError.detail}</div>
                <div><span className="text-status-error">Time:</span> {lastError.timestamp}</div>
                <details className="mt-xs">
                  <summary className="cursor-pointer text-status-error">Full Payload</summary>
                  <pre className="text-xs mt-xs overflow-auto max-h-32 bg-surface-primary p-xs rounded">
                    {JSON.stringify(lastError.fullPayload, null, 2)}
                  </pre>
                </details>
              </div>
            </div>
          )}
          
          <button 
            onClick={testMinikitWidget}
            className="btn-small mt-sm"
          >
            Test Minikit Widget
          </button>
          <button 
            onClick={checkConfiguration}
            className="btn-small mt-sm ml-sm"
          >
            Check Configuration
          </button>
          <button 
            onClick={testMinimalVerification}
            className="btn-small mt-sm ml-sm"
          >
            Test Minimal Verification
          </button>
          <button 
            onClick={runFullDiagnostic}
            className="btn-small mt-sm ml-sm"
          >
            Run Full Diagnostic
          </button>
        </div>
      )}

      {/* API Response Display */}
      {apiResponse && (
        <div className="bg-surface-secondary border border-border-muted rounded-lg p-md">
          <h3 className="text-body font-medium text-text-primary mb-sm">
            📊 Verification Results
          </h3>
          <div className="space-y-sm">
            <div className="flex items-center gap-sm">
              <span className="text-text-secondary">Verification Method:</span>
              <span className="text-text-primary font-medium">{apiResponse.verificationMethod}</span>
            </div>
            
            {/* Client Verification Result */}
            <div className="bg-primary-green/10 border border-primary-green rounded p-sm">
              <h4 className="text-small font-medium text-primary-green mb-xs">✅ Client-side Verification</h4>
              <div className="text-small text-text-muted">
                Status: {apiResponse.clientVerificationResult?.success ? '✅ Success' : '❌ Failed'}
              </div>
            </div>
            
            {/* Server Verification Result */}
            {apiResponse.serverVerificationResult && (
              <div className="bg-primary-blue/10 border border-primary-blue rounded p-sm">
                <h4 className="text-small font-medium text-primary-blue mb-xs">🌐 Server-side Verification</h4>
                <div className="text-small text-text-muted space-y-xs font-mono">
                  <div>Status: {apiResponse.serverVerificationResult.success ? '✅ Success' : '❌ Failed'}</div>
                  <div>Action: {apiResponse.serverVerificationResult.action}</div>
                  <div>Nullifier: {apiResponse.serverVerificationResult.nullifier_hash.substring(0, 20)}...</div>
                  <div>Created: {new Date(apiResponse.serverVerificationResult.created_at).toLocaleString()}</div>
                </div>
              </div>
            )}
            
            <div className="text-small text-text-muted">
              {apiResponse.message}
            </div>
          </div>
        </div>
      )}

      {/* World App Status */}
      {isWorldApp ? (
        <div className="bg-primary-green/10 border border-primary-green rounded-lg p-md">
          <p className="text-primary-green font-medium">
            ✅ Running in World App - Minikit integration active
          </p>
        </div>
      ) : (
        <div className="bg-surface-secondary border border-border-muted rounded-lg p-md">
          <p className="text-text-secondary">
            📱 For best experience, open this in World App
          </p>
          <div className="mt-sm">
            <button
              onClick={switchToWorldChain}
              className="btn-secondary"
            >
              Switch to World Chain (External Wallet)
            </button>
          </div>
        </div>
      )}

      {/* World ID Verification Button using Minikit */}
      <div className="space-y-md">
        <div className="flex justify-center">
          <button
            onClick={startWorldIDVerification}
            disabled={isLoading || !minikitReady}
            className="btn-primary w-full"
            type="button"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-sm">
                <div className="w-5 h-5 border-2 border-text-on-primary border-t-transparent rounded-full animate-spin"></div>
                Processing...
              </div>
            ) : !minikitReady ? (
              <div className="flex items-center justify-center gap-sm">
                <div className="w-5 h-5 border-2 border-text-on-primary border-t-transparent rounded-full animate-spin"></div>
                Initializing Minikit...
              </div>
            ) : (
              <div className="flex items-center justify-center gap-sm">
                <div className="w-6 h-6 bg-text-on-primary rounded-md flex items-center justify-center">
                  <svg className="w-4 h-4 text-primary-green" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                Verify with World ID (Minikit)
              </div>
            )}
          </button>
        </div>
        
        {/* Alternative button for testing */}
        {process.env.NODE_ENV === 'development' && (
          <div className="text-center">
            <p className="text-small text-text-muted mb-sm">
              {isWorldApp ? 
                'Running in World App with Minikit' : 
                'Using external browser - World App recommended'
              }
            </p>
            <button
              onClick={() => {
                console.log('🔧 Debug button clicked');
                console.log('MiniKit.isInstalled():', MiniKit.isInstalled());
                console.log('Is World App:', isWorldApp);
                console.log('MiniKit commands:', typeof MiniKit.commandsAsync);
                setError('Minikit debug test - check console logs');
              }}
              className="btn-secondary"
            >
              Debug Minikit
            </button>
          </div>
        )}
      </div>

      {/* Status Messages */}
      {error && (
        <div className="bg-status-error/10 border border-status-error rounded-lg p-md">
          <p className="text-status-error font-medium mb-sm">❌ Error occurred:</p>
          <p className="text-status-error">{error}</p>
          <details className="mt-sm">
            <summary className="text-small text-text-muted cursor-pointer">Debug Details</summary>
            <div className="text-small text-text-muted font-mono mt-xs space-y-xs">
              <div>• Check browser console for detailed logs</div>
              <div>• Ensure World App is installed and updated</div>
              <div>• Verify World ID is properly set up</div>
              <div>• Check APP_ID is correctly configured</div>
              <div>• Try refreshing the page</div>
            </div>
          </details>
        </div>
      )}

      {success && (
        <div className="bg-status-success/10 border border-status-success rounded-lg p-md">
          <p className="text-status-success">{success}</p>
        </div>
      )}

      {/* ZK Proof Data Display */}
      {zkProofData && (
        <div className="bg-surface-secondary border border-border-muted rounded-lg p-md">
          <h3 className="text-body font-medium text-text-primary mb-sm">
            Generated ZK Proof Data
          </h3>
          <div className="space-y-xs text-small text-text-muted font-mono">
            <div className="break-all">
              <span className="text-text-secondary">Root:</span> {zkProofData.root}
            </div>
            <div className="break-all">
              <span className="text-text-secondary">Nullifier Hash:</span> {zkProofData.nullifierHash}
            </div>
            <div className="break-all">
              <span className="text-text-secondary">External Nullifier Hash:</span> {zkProofData.externalNullifierHash}
            </div>
            <div className="break-all">
              <span className="text-text-secondary">Signal Hash:</span> {zkProofData.signalHash}
            </div>
          </div>
        </div>
      )}

      {/* Transaction Hash */}
      {transactionHash && (
        <div className="bg-primary-green/10 border border-primary-green rounded-lg p-md">
          <h3 className="text-body font-medium text-text-primary mb-sm">
            Transaction Submitted
          </h3>
          <p className="text-small text-text-muted break-all font-mono">
            {transactionHash}
          </p>
          <a
            href={`${worldchain.blockExplorers?.default.url}/tx/${transactionHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-green hover:text-primary-green-hover text-small underline mt-xs inline-block"
          >
            View on Block Explorer →
          </a>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-surface-secondary border border-border-muted rounded-lg p-md">
        <h3 className="text-body font-medium text-text-primary mb-sm">
          How it works with Minikit
        </h3>
        <ol className="text-small text-text-muted space-y-xs list-decimal list-inside">
          <li>Open this page in World App for best experience</li>
          <li>Click "Verify with World ID (Minikit)" to start verification</li>
          <li>Minikit will handle the World ID verification flow within the app</li>
          <li>The proof will be automatically generated and submitted to the smart contract</li>
          <li>Monitor the transaction on the World Chain block explorer</li>
        </ol>
        
        {/* Troubleshooting */}
        <div className="mt-md pt-md border-t border-border-muted">
          <h4 className="text-small font-medium text-text-primary mb-xs">Troubleshooting Minikit:</h4>
          <ul className="text-small text-text-muted space-y-xs list-disc list-inside">
            <li>Ensure NEXT_PUBLIC_APP_ID is set in .env.local</li>
            <li>Use World App for optimal Minikit integration</li>
            <li>Verify your World ID is verified (orb verification required)</li>
            <li>Minikit handles wallet connections automatically in World App</li>
            <li>Check browser console for specific error messages</li>
          </ul>
          
          {/* Specific guidance for inclusion_proof_failed */}
          <div className="mt-sm pt-sm border-t border-border-muted/50">
            <h5 className="text-small font-medium text-status-error mb-xs">🔧 For "inclusion_proof_failed" errors:</h5>
            <ul className="text-small text-text-muted space-y-xs list-disc list-inside">
              <li><strong>Wait 30-60 seconds</strong> and try verification again</li>
              <li>Check your internet connection (try WiFi vs mobile data)</li>
              <li>Close and reopen World App if the issue persists</li>
              <li>This is usually a temporary network issue with World ID infrastructure</li>
              <li>If it continues, try again in a few minutes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}; 