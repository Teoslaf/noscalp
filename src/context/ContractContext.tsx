import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { EventData, TicketTypeData } from '@/lib/contracts/eventContractABI';
import { TransactionResult } from '@/services/contractService';

// ===== TYPES =====

export interface UserTicket {
  ticketTypeId: number;
  eventId: number;
  balance: number;
  ticketType: TicketTypeData;
  event: EventData;
  purchaseHash?: string;
  purchaseDate?: Date;
}

export interface CreatedEvent {
  eventId: number;
  event: EventData;
  ticketTypes: TicketTypeData[];
  creationHash: string;
  creationDate: Date;
}

export interface Transaction {
  hash: string;
  type: 'create_event' | 'create_ticket_type' | 'purchase_ticket' | 'toggle_event';
  status: 'pending' | 'success' | 'reverted' | 'not_found';
  timestamp: Date;
  eventId?: number;
  ticketTypeId?: number;
  error?: string;
}

export interface ContractState {
  // User data
  userTickets: UserTicket[];
  createdEvents: CreatedEvent[];
  
  // World ID verification
  worldIdVerified: boolean;
  worldIdNullifierHash?: string;
  
  // Transactions
  transactions: Transaction[];
  
  // Account info
  account: string | null;
  isConnected: boolean;
  
  // Platform info
  platformFee: number;
}

export type ContractAction =
  | { type: 'SET_ACCOUNT'; payload: { account: string | null; isConnected: boolean } }
  | { type: 'SET_WORLD_ID_VERIFIED'; payload: { verified: boolean; nullifierHash?: string } }
  | { type: 'SET_PLATFORM_FEE'; payload: number }
  | { type: 'ADD_USER_TICKET'; payload: UserTicket }
  | { type: 'UPDATE_USER_TICKETS'; payload: UserTicket[] }
  | { type: 'ADD_CREATED_EVENT'; payload: CreatedEvent }
  | { type: 'UPDATE_CREATED_EVENTS'; payload: CreatedEvent[] }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'UPDATE_TRANSACTION'; payload: { hash: string; updates: Partial<Transaction> } }
  | { type: 'CLEAR_TRANSACTIONS' }
  | { type: 'RESET_STATE' };

// ===== INITIAL STATE =====

const initialState: ContractState = {
  userTickets: [],
  createdEvents: [],
  worldIdVerified: false,
  transactions: [],
  account: null,
  isConnected: false,
  platformFee: 1000 // 10% default
};

// ===== REDUCER =====

function contractReducer(state: ContractState, action: ContractAction): ContractState {
  switch (action.type) {
    case 'SET_ACCOUNT':
      return {
        ...state,
        account: action.payload.account,
        isConnected: action.payload.isConnected
      };

    case 'SET_WORLD_ID_VERIFIED':
      return {
        ...state,
        worldIdVerified: action.payload.verified,
        worldIdNullifierHash: action.payload.nullifierHash
      };

    case 'SET_PLATFORM_FEE':
      return {
        ...state,
        platformFee: action.payload
      };

    case 'ADD_USER_TICKET':
      return {
        ...state,
        userTickets: [...state.userTickets, action.payload]
      };

    case 'UPDATE_USER_TICKETS':
      return {
        ...state,
        userTickets: action.payload
      };

    case 'ADD_CREATED_EVENT':
      return {
        ...state,
        createdEvents: [...state.createdEvents, action.payload]
      };

    case 'UPDATE_CREATED_EVENTS':
      return {
        ...state,
        createdEvents: action.payload
      };

    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [action.payload, ...state.transactions]
      };

    case 'UPDATE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map(tx =>
          tx.hash === action.payload.hash
            ? { ...tx, ...action.payload.updates }
            : tx
        )
      };

    case 'CLEAR_TRANSACTIONS':
      return {
        ...state,
        transactions: []
      };

    case 'RESET_STATE':
      return initialState;

    default:
      return state;
  }
}

// ===== CONTEXT =====

interface ContractContextType {
  state: ContractState;
  dispatch: React.Dispatch<ContractAction>;
  
  // Helper functions
  addTransaction: (transaction: Omit<Transaction, 'timestamp'>) => void;
  updateTransactionStatus: (hash: string, status: Transaction['status'], error?: string) => void;
  getTransactionByHash: (hash: string) => Transaction | undefined;
  getPendingTransactions: () => Transaction[];
  
  // World ID helpers
  setWorldIdVerified: (verified: boolean, nullifierHash?: string) => void;
  
  // Ticket helpers
  addUserTicket: (ticket: UserTicket) => void;
  getUserTicketsForEvent: (eventId: number) => UserTicket[];
  
  // Event helpers
  addCreatedEvent: (event: CreatedEvent) => void;
  getCreatedEvent: (eventId: number) => CreatedEvent | undefined;
}

const ContractContext = createContext<ContractContextType | undefined>(undefined);

// ===== PROVIDER =====

interface ContractProviderProps {
  children: ReactNode;
}

export function ContractProvider({ children }: ContractProviderProps) {
  const [state, dispatch] = useReducer(contractReducer, initialState);

  // Helper functions
  const addTransaction = (transaction: Omit<Transaction, 'timestamp'>) => {
    dispatch({
      type: 'ADD_TRANSACTION',
      payload: { ...transaction, timestamp: new Date() }
    });
  };

  const updateTransactionStatus = (hash: string, status: Transaction['status'], error?: string) => {
    dispatch({
      type: 'UPDATE_TRANSACTION',
      payload: { hash, updates: { status, error } }
    });
  };

  const getTransactionByHash = (hash: string) => {
    return state.transactions.find(tx => tx.hash === hash);
  };

  const getPendingTransactions = () => {
    return state.transactions.filter(tx => tx.status === 'pending');
  };

  const setWorldIdVerified = (verified: boolean, nullifierHash?: string) => {
    dispatch({
      type: 'SET_WORLD_ID_VERIFIED',
      payload: { verified, nullifierHash }
    });
  };

  const addUserTicket = (ticket: UserTicket) => {
    dispatch({ type: 'ADD_USER_TICKET', payload: ticket });
  };

  const getUserTicketsForEvent = (eventId: number) => {
    return state.userTickets.filter(ticket => ticket.eventId === eventId);
  };

  const addCreatedEvent = (event: CreatedEvent) => {
    dispatch({ type: 'ADD_CREATED_EVENT', payload: event });
  };

  const getCreatedEvent = (eventId: number) => {
    return state.createdEvents.find(event => event.eventId === eventId);
  };

  // Load persistent data from localStorage on mount
  useEffect(() => {
    try {
      const savedState = localStorage.getItem('noscalp_contract_state');
      if (savedState) {
        const parsed = JSON.parse(savedState);
        
        // Restore relevant state (excluding sensitive data)
        if (parsed.worldIdVerified) {
          dispatch({
            type: 'SET_WORLD_ID_VERIFIED',
            payload: {
              verified: parsed.worldIdVerified,
              nullifierHash: parsed.worldIdNullifierHash
            }
          });
        }
        
        if (parsed.userTickets) {
          dispatch({ type: 'UPDATE_USER_TICKETS', payload: parsed.userTickets });
        }
        
        if (parsed.createdEvents) {
          dispatch({ type: 'UPDATE_CREATED_EVENTS', payload: parsed.createdEvents });
        }
      }
    } catch (error) {
      console.error('Error loading contract state from localStorage:', error);
    }
  }, []);

  // Save state to localStorage when it changes
  useEffect(() => {
    try {
      const stateToSave = {
        worldIdVerified: state.worldIdVerified,
        worldIdNullifierHash: state.worldIdNullifierHash,
        userTickets: state.userTickets,
        createdEvents: state.createdEvents,
        // Don't save sensitive account info or transactions
      };
      
      localStorage.setItem('noscalp_contract_state', JSON.stringify(stateToSave));
    } catch (error) {
      console.error('Error saving contract state to localStorage:', error);
    }
  }, [state.worldIdVerified, state.worldIdNullifierHash, state.userTickets, state.createdEvents]);

  const contextValue: ContractContextType = {
    state,
    dispatch,
    addTransaction,
    updateTransactionStatus,
    getTransactionByHash,
    getPendingTransactions,
    setWorldIdVerified,
    addUserTicket,
    getUserTicketsForEvent,
    addCreatedEvent,
    getCreatedEvent
  };

  return (
    <ContractContext.Provider value={contextValue}>
      {children}
    </ContractContext.Provider>
  );
}

// ===== HOOK =====

export function useContractContext() {
  const context = useContext(ContractContext);
  if (context === undefined) {
    throw new Error('useContractContext must be used within a ContractProvider');
  }
  return context;
} 