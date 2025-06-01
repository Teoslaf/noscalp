import { useState, useCallback, useEffect } from 'react';
import { contractService, TransactionResult } from '@/services/contractService';
import { 
  EventData, 
  TicketTypeData, 
  CreateEventParams, 
  CreateTicketTypeParams, 
  PurchaseTicketParams 
} from '@/lib/contracts/eventContractABI';
import { parseEther } from 'viem';

// ===== BASE CONTRACT HOOK =====

export function useContract() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeWithLoading = useCallback(async <T>(
    operation: () => Promise<T>
  ): Promise<T | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await operation();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    executeWithLoading,
    clearError: () => setError(null)
  };
}

// ===== EVENT CREATION HOOKS =====

export function useEventCreation() {
  const { isLoading, error, executeWithLoading, clearError } = useContract();

  const createEvent = useCallback(async (params: CreateEventParams): Promise<TransactionResult | null> => {
    return executeWithLoading(() => contractService.createEvent(params));
  }, [executeWithLoading]);

  const createTicketType = useCallback(async (params: CreateTicketTypeParams): Promise<TransactionResult | null> => {
    return executeWithLoading(() => contractService.createTicketType(params));
  }, [executeWithLoading]);

  return {
    isLoading,
    error,
    createEvent,
    createTicketType,
    clearError
  };
}

// ===== TICKET PURCHASING HOOK =====

export function useTicketPurchase() {
  const { isLoading, error, executeWithLoading, clearError } = useContract();

  const purchaseTicket = useCallback(async (
    params: PurchaseTicketParams,
    ticketPrice: string
  ): Promise<TransactionResult | null> => {
    const priceInWei = parseEther(ticketPrice);
    return executeWithLoading(() => contractService.purchaseTicket(params, priceInWei));
  }, [executeWithLoading]);

  return {
    isLoading,
    error,
    purchaseTicket,
    clearError
  };
}

// ===== QUERY HOOKS =====

export function useEventQuery(eventId?: number) {
  const [event, setEvent] = useState<EventData | null>(null);
  const { isLoading, error, executeWithLoading } = useContract();

  const fetchEvent = useCallback(async (id?: number) => {
    if (!id) return null;
    
    const eventData = await executeWithLoading(() => contractService.getEvent(id));
    setEvent(eventData);
    return eventData;
  }, [executeWithLoading]);

  useEffect(() => {
    if (eventId) {
      fetchEvent(eventId);
    }
  }, [eventId, fetchEvent]);

  return {
    event,
    isLoading,
    error,
    refetch: () => fetchEvent(eventId)
  };
}

export function useTicketTypeQuery(ticketTypeId?: number) {
  const [ticketType, setTicketType] = useState<TicketTypeData | null>(null);
  const { isLoading, error, executeWithLoading } = useContract();

  const fetchTicketType = useCallback(async (id?: number) => {
    if (!id) return null;
    
    const ticketTypeData = await executeWithLoading(() => contractService.getTicketType(id));
    setTicketType(ticketTypeData);
    return ticketTypeData;
  }, [executeWithLoading]);

  useEffect(() => {
    if (ticketTypeId) {
      fetchTicketType(ticketTypeId);
    }
  }, [ticketTypeId, fetchTicketType]);

  return {
    ticketType,
    isLoading,
    error,
    refetch: () => fetchTicketType(ticketTypeId)
  };
}

export function useUserTickets(userAddress?: string) {
  const [tickets, setTickets] = useState<Array<{ticketTypeId: number, balance: number}>>([]);
  const { isLoading, error, executeWithLoading } = useContract();

  const fetchUserTickets = useCallback(async (address?: string) => {
    if (!address) return [];

    // This would need to be implemented with event filtering or indexed data
    // For now, return empty array as placeholder
    return [];
  }, [executeWithLoading]);

  useEffect(() => {
    if (userAddress) {
      fetchUserTickets(userAddress);
    }
  }, [userAddress, fetchUserTickets]);

  return {
    tickets,
    isLoading,
    error,
    refetch: () => fetchUserTickets(userAddress)
  };
}

// ===== VERIFICATION HOOK =====

export function useVerificationStatus() {
  const { isLoading, error, executeWithLoading } = useContract();

  const checkVerificationStatus = useCallback(async (
    eventId: number, 
    nullifierHash: string
  ): Promise<boolean> => {
    const result = await executeWithLoading(() => 
      contractService.isUserVerified(eventId, BigInt(nullifierHash))
    );
    return result || false;
  }, [executeWithLoading]);

  return {
    isLoading,
    error,
    checkVerificationStatus
  };
}

// ===== TRANSACTION MONITORING HOOK =====

export function useTransactionMonitor() {
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'reverted' | 'not_found'>('idle');
  const [hash, setHash] = useState<string>('');

  const monitorTransaction = useCallback(async (txHash: string) => {
    setHash(txHash);
    setStatus('pending');

    try {
      const confirmed = await contractService.waitForTransaction(txHash);
      setStatus(confirmed ? 'success' : 'reverted');
      return confirmed;
    } catch (error) {
      console.error('Transaction monitoring error:', error);
      setStatus('reverted');
      return false;
    }
  }, []);

  const checkTransactionStatus = useCallback(async (txHash: string) => {
    const status = await contractService.getTransactionStatus(txHash);
    setStatus(status);
    return status;
  }, []);

  const reset = useCallback(() => {
    setStatus('idle');
    setHash('');
  }, []);

  return {
    status,
    hash,
    monitorTransaction,
    checkTransactionStatus,
    reset
  };
}

// ===== PLATFORM INFO HOOK =====

export function usePlatformInfo() {
  const [platformFee, setPlatformFee] = useState<number>(0);
  const { isLoading, error, executeWithLoading } = useContract();

  const fetchPlatformInfo = useCallback(async () => {
    const fee = await executeWithLoading(() => contractService.getPlatformFee());
    if (fee) {
      setPlatformFee(fee);
    }
  }, [executeWithLoading]);

  useEffect(() => {
    fetchPlatformInfo();
  }, [fetchPlatformInfo]);

  return {
    platformFee,
    isLoading,
    error,
    refetch: fetchPlatformInfo
  };
}

// ===== ACCOUNT HOOK =====

export function useAccount() {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { isLoading, error, executeWithLoading } = useContract();

  const fetchAccount = useCallback(async () => {
    const accountAddress = await executeWithLoading(() => contractService.getAccount());
    setAccount(accountAddress);
    setIsConnected(!!accountAddress);
    return accountAddress;
  }, [executeWithLoading]);

  const initializeWallet = useCallback(async () => {
    const initialized = await executeWithLoading(() => contractService.initializeWallet());
    if (initialized) {
      await fetchAccount();
    }
    return initialized;
  }, [executeWithLoading, fetchAccount]);

  useEffect(() => {
    initializeWallet();
  }, [initializeWallet]);

  return {
    account,
    isConnected,
    isLoading,
    error,
    refetch: fetchAccount,
    initializeWallet
  };
} 