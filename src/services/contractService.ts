import { createWalletClient, createPublicClient, custom, http, parseEther, formatEther } from 'viem';
import { MiniKit } from '@worldcoin/minikit-js';
import { worldchain, WORLD_CHAIN_CONTRACTS } from '@/lib/worldchain';
import { 
  EVENT_CONTRACT_ABI, 
  EventData, 
  TicketTypeData, 
  CreateEventParams, 
  CreateTicketTypeParams, 
  PurchaseTicketParams 
} from '@/lib/contracts/eventContractABI';

export interface TransactionResult {
  hash: string;
  success: boolean;
  error?: string;
}

export class ContractService {
  private publicClient;
  private walletClient: any = null;
  private contractAddress: string;

  constructor() {
    this.contractAddress = WORLD_CHAIN_CONTRACTS.TARGET_CONTRACT;
    this.publicClient = createPublicClient({
      chain: worldchain,
      transport: http()
    });
  }

  /**
   * Initialize wallet client based on environment (World App vs external wallet)
   */
  async initializeWallet(): Promise<boolean> {
    try {
      if (MiniKit.isInstalled()) {
        // For World App - wallet client will be handled by MiniKit
        console.log('📱 Running in World App - MiniKit wallet detected');
        return true;
      }

      // For external wallets
      if (typeof window !== 'undefined' && window.ethereum) {
        this.walletClient = createWalletClient({
          chain: worldchain,
          transport: custom(window.ethereum)
        });
        console.log('🦊 External wallet initialized');
        return true;
      }

      console.warn('❌ No wallet detected');
      return false;
    } catch (error) {
      console.error('❌ Wallet initialization error:', error);
      return false;
    }
  }

  /**
   * Get the current connected account
   */
  async getAccount(): Promise<string | null> {
    try {
      if (!this.walletClient) {
        const initialized = await this.initializeWallet();
        if (!initialized) return null;
      }

      if (MiniKit.isInstalled()) {
        // For World App, we'll get the account during transactions
        return 'world_app_account';
      }

      const accounts = await this.walletClient.getAddresses();
      return accounts[0] || null;
    } catch (error) {
      console.error('❌ Error getting account:', error);
      return null;
    }
  }

  // ===== EVENT CREATION =====

  /**
   * Create a new event on the blockchain
   */
  async createEvent(params: CreateEventParams): Promise<TransactionResult> {
    try {
      console.log('🔄 Creating event:', params);

      const account = await this.getAccount();
      if (!account) throw new Error('No account connected');

      if (MiniKit.isInstalled()) {
        // For World App - use MiniKit transaction
        // Note: This is a placeholder - actual implementation may vary
        throw new Error('World App transaction not yet implemented for event creation');
      }

      // For external wallets - no gas needed on World Chain
      const hash = await this.walletClient.writeContract({
        address: this.contractAddress as `0x${string}`,
        abi: EVENT_CONTRACT_ABI,
        functionName: 'createEvent',
        args: [params.eventName]
      });

      console.log('✅ Event creation transaction submitted:', hash);
      return { hash, success: true };

    } catch (error) {
      console.error('❌ Event creation error:', error);
      return { 
        hash: '', 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Create a ticket type for an event
   */
  async createTicketType(params: CreateTicketTypeParams): Promise<TransactionResult> {
    try {
      console.log('🔄 Creating ticket type:', params);

      const account = await this.getAccount();
      if (!account) throw new Error('No account connected');

      const args = [
        params.eventId,
        params.price,
        params.supply,
        params.ticketType,
        params.ipfsHash
      ];

      if (MiniKit.isInstalled()) {
        throw new Error('World App transaction not yet implemented for ticket type creation');
      }

      const hash = await this.walletClient.writeContract({
        address: this.contractAddress as `0x${string}`,
        abi: EVENT_CONTRACT_ABI,
        functionName: 'createTicketType',
        args
      });

      console.log('✅ Ticket type creation transaction submitted:', hash);
      return { hash, success: true };

    } catch (error) {
      console.error('❌ Ticket type creation error:', error);
      return { 
        hash: '', 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // ===== TICKET PURCHASING =====

  /**
   * Purchase a ticket with World ID verification
   */
  async purchaseTicket(
    params: PurchaseTicketParams,
    ticketPrice: bigint
  ): Promise<TransactionResult> {
    try {
      console.log('🔄 Purchasing ticket:', params);

      const account = await this.getAccount();
      if (!account) throw new Error('No account connected');

      const args = [
        params.eventId,
        params.ticketTypeIndex,
        params.signal,
        params.root,
        params.nullifierHash,
        params.proof
      ];

      console.log('💰 Ticket price:', formatEther(ticketPrice), 'ETH');

      if (MiniKit.isInstalled()) {
        throw new Error('World App transaction not yet implemented for ticket purchase');
      }

      const hash = await this.walletClient.writeContract({
        address: this.contractAddress as `0x${string}`,
        abi: EVENT_CONTRACT_ABI,
        functionName: 'purchaseTicket',
        args,
        value: ticketPrice
      });

      console.log('✅ Ticket purchase transaction submitted:', hash);
      return { hash, success: true };

    } catch (error) {
      console.error('❌ Ticket purchase error:', error);
      return { 
        hash: '', 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // ===== QUERY FUNCTIONS =====

  /**
   * Get event data by ID
   */
  async getEvent(eventId: number): Promise<EventData | null> {
    try {
      const result = await this.publicClient.readContract({
        address: this.contractAddress as `0x${string}`,
        abi: EVENT_CONTRACT_ABI,
        functionName: 'getEvent',
        args: [eventId]
      }) as any;

      return {
        id: Number(result.id),
        organizer: result.organizer,
        name: result.name,
        ticketTypes: result.ticketTypes.map((id: bigint) => Number(id)),
        active: result.active
      };
    } catch (error) {
      console.error('❌ Error fetching event:', error);
      return null;
    }
  }

  /**
   * Get ticket type data by ID
   */
  async getTicketType(ticketTypeId: number): Promise<TicketTypeData | null> {
    try {
      const result = await this.publicClient.readContract({
        address: this.contractAddress as `0x${string}`,
        abi: EVENT_CONTRACT_ABI,
        functionName: 'getTicketType',
        args: [ticketTypeId]
      }) as any;

      return {
        id: Number(result.id),
        eventId: Number(result.eventId),
        name: result.name,
        price: result.price,
        maxSupply: Number(result.maxSupply),
        currentSupply: Number(result.currentSupply),
        ipfsHash: result.ipfsHash
      };
    } catch (error) {
      console.error('❌ Error fetching ticket type:', error);
      return null;
    }
  }

  /**
   * Get user's ticket balance for a specific ticket type
   */
  async getUserTicketBalance(userAddress: string, ticketTypeId: number): Promise<number> {
    try {
      const balance = await this.publicClient.readContract({
        address: this.contractAddress as `0x${string}`,
        abi: EVENT_CONTRACT_ABI,
        functionName: 'balanceOf',
        args: [userAddress, ticketTypeId]
      }) as bigint;

      return Number(balance);
    } catch (error) {
      console.error('❌ Error fetching ticket balance:', error);
      return 0;
    }
  }

  /**
   * Check if a user has already verified for an event
   */
  async isUserVerified(eventId: number, nullifierHash: bigint): Promise<boolean> {
    try {
      const result = await this.publicClient.readContract({
        address: this.contractAddress as `0x${string}`,
        abi: EVENT_CONTRACT_ABI,
        functionName: 'isVerified',
        args: [eventId, nullifierHash]
      }) as boolean;

      return result;
    } catch (error) {
      console.error('❌ Error checking verification status:', error);
      return false;
    }
  }

  /**
   * Get platform fee percentage
   */
  async getPlatformFee(): Promise<number> {
    try {
      const fee = await this.publicClient.readContract({
        address: this.contractAddress as `0x${string}`,
        abi: EVENT_CONTRACT_ABI,
        functionName: 'PLATFORM_FEE',
        args: []
      }) as bigint;

      return Number(fee);
    } catch (error) {
      console.error('❌ Error fetching platform fee:', error);
      return 1000; // Default 10% if error
    }
  }

  // ===== EVENT MANAGEMENT =====

  /**
   * Toggle event active status (for event organizers)
   */
  async toggleEventStatus(eventId: number): Promise<TransactionResult> {
    try {
      const account = await this.getAccount();
      if (!account) throw new Error('No account connected');

      if (MiniKit.isInstalled()) {
        throw new Error('World App transaction not yet implemented for event management');
      }

      const hash = await this.walletClient.writeContract({
        address: this.contractAddress as `0x${string}`,
        abi: EVENT_CONTRACT_ABI,
        functionName: 'toggleEventStatus',
        args: [eventId]
      });

      return { hash, success: true };
    } catch (error) {
      console.error('❌ Toggle event status error:', error);
      return { 
        hash: '', 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // ===== TRANSACTION MONITORING =====

  /**
   * Wait for transaction confirmation
   */
  async waitForTransaction(hash: string): Promise<boolean> {
    try {
      const receipt = await this.publicClient.waitForTransactionReceipt({
        hash: hash as `0x${string}`,
        timeout: 60000 // 60 seconds timeout
      });

      return receipt.status === 'success';
    } catch (error) {
      console.error('❌ Transaction confirmation error:', error);
      return false;
    }
  }

  /**
   * Get transaction status
   */
  async getTransactionStatus(hash: string): Promise<'pending' | 'success' | 'reverted' | 'not_found'> {
    try {
      const receipt = await this.publicClient.getTransactionReceipt({
        hash: hash as `0x${string}`
      });

      return receipt.status;
    } catch (error) {
      // Transaction might still be pending
      try {
        await this.publicClient.getTransaction({
          hash: hash as `0x${string}`
        });
        return 'pending';
      } catch {
        return 'not_found';
      }
    }
  }
}

// Singleton instance
export const contractService = new ContractService(); 