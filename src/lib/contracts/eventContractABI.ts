// Event Contract ABI for 0x9042DeCea10fa8E11d192A806F72c4c6a54eEF43
// Generated from contract bytecode analysis

export const EVENT_CONTRACT_ABI = [
  // Event creation and management
  {
    "inputs": [
      {"internalType": "string", "name": "eventName", "type": "string"}
    ],
    "name": "createEvent",
    "outputs": [
      {"internalType": "uint256", "name": "eventId", "type": "uint256"}
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "eventId", "type": "uint256"},
      {"internalType": "uint256", "name": "price", "type": "uint256"},
      {"internalType": "uint256", "name": "supply", "type": "uint256"},
      {"internalType": "string", "name": "ticketType", "type": "string"},
      {"internalType": "string", "name": "ipfsHash", "type": "string"}
    ],
    "name": "createTicketType",
    "outputs": [
      {"internalType": "uint256", "name": "ticketTypeId", "type": "uint256"}
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  
  // Ticket purchasing
  {
    "inputs": [
      {"internalType": "uint256", "name": "eventId", "type": "uint256"},
      {"internalType": "uint256", "name": "ticketTypeIndex", "type": "uint256"},
      {"internalType": "address", "name": "signal", "type": "address"},
      {"internalType": "uint256", "name": "root", "type": "uint256"},
      {"internalType": "uint256", "name": "nullifierHash", "type": "uint256"},
      {"internalType": "uint256[8]", "name": "proof", "type": "uint256[8]"}
    ],
    "name": "purchaseTicket",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  
  // Event and ticket queries
  {
    "inputs": [
      {"internalType": "uint256", "name": "eventId", "type": "uint256"}
    ],
    "name": "getEvent",
    "outputs": [
      {
        "components": [
          {"internalType": "uint256", "name": "id", "type": "uint256"},
          {"internalType": "address", "name": "organizer", "type": "address"},
          {"internalType": "string", "name": "name", "type": "string"},
          {"internalType": "uint256[]", "name": "ticketTypes", "type": "uint256[]"},
          {"internalType": "bool", "name": "active", "type": "bool"}
        ],
        "internalType": "struct EventContract.Event",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "ticketTypeId", "type": "uint256"}
    ],
    "name": "getTicketType",
    "outputs": [
      {
        "components": [
          {"internalType": "uint256", "name": "id", "type": "uint256"},
          {"internalType": "uint256", "name": "eventId", "type": "uint256"},
          {"internalType": "string", "name": "name", "type": "string"},
          {"internalType": "uint256", "name": "price", "type": "uint256"},
          {"internalType": "uint256", "name": "maxSupply", "type": "uint256"},
          {"internalType": "uint256", "name": "currentSupply", "type": "uint256"},
          {"internalType": "string", "name": "ipfsHash", "type": "string"}
        ],
        "internalType": "struct EventContract.TicketType",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "eventId", "type": "uint256"},
      {"internalType": "uint256", "name": "ticketTypeIndex", "type": "uint256"}
    ],
    "name": "getEventTicketType",
    "outputs": [
      {"internalType": "string", "name": "ticketTypeURI", "type": "string"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  
  // Event management
  {
    "inputs": [
      {"internalType": "uint256", "name": "eventId", "type": "uint256"}
    ],
    "name": "toggleEventStatus",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  
  // Fee management
  {
    "inputs": [
      {"internalType": "address", "name": "newFeeCollector", "type": "address"}
    ],
    "name": "updateFeeCollector",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "feeCollector",
    "outputs": [
      {"internalType": "address", "name": "", "type": "address"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "PLATFORM_FEE",
    "outputs": [
      {"internalType": "uint256", "name": "", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  
  // Verification tracking
  {
    "inputs": [
      {"internalType": "uint256", "name": "eventId", "type": "uint256"},
      {"internalType": "uint256", "name": "nullifierHash", "type": "uint256"}
    ],
    "name": "isVerified",
    "outputs": [
      {"internalType": "bool", "name": "", "type": "bool"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  
  // ERC1155 standard functions
  {
    "inputs": [
      {"internalType": "address", "name": "account", "type": "address"},
      {"internalType": "uint256", "name": "id", "type": "uint256"}
    ],
    "name": "balanceOf",
    "outputs": [
      {"internalType": "uint256", "name": "", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address[]", "name": "accounts", "type": "address[]"},
      {"internalType": "uint256[]", "name": "ids", "type": "uint256[]"}
    ],
    "name": "balanceOfBatch",
    "outputs": [
      {"internalType": "uint256[]", "name": "", "type": "uint256[]"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "id", "type": "uint256"}
    ],
    "name": "uri",
    "outputs": [
      {"internalType": "string", "name": "", "type": "string"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  
  // Events
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "organizer", "type": "address"},
      {"indexed": true, "internalType": "uint256", "name": "eventId", "type": "uint256"},
      {"indexed": false, "internalType": "string", "name": "eventName", "type": "string"}
    ],
    "name": "EventCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "ticketTypeId", "type": "uint256"},
      {"indexed": false, "internalType": "string", "name": "ticketType", "type": "string"},
      {"indexed": false, "internalType": "uint256", "name": "price", "type": "uint256"},
      {"indexed": false, "internalType": "uint256", "name": "supply", "type": "uint256"}
    ],
    "name": "TicketTypeCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "buyer", "type": "address"},
      {"indexed": true, "internalType": "uint256", "name": "eventId", "type": "uint256"},
      {"indexed": false, "internalType": "uint256", "name": "ticketTypeId", "type": "uint256"},
      {"indexed": false, "internalType": "uint256", "name": "quantity", "type": "uint256"}
    ],
    "name": "TicketPurchased",
    "type": "event"
  }
] as const;

// Type definitions for contract interactions
export interface EventData {
  id: number;
  organizer: string;
  name: string;
  ticketTypes: number[];
  active: boolean;
}

export interface TicketTypeData {
  id: number;
  eventId: number;
  name: string;
  price: bigint;
  maxSupply: number;
  currentSupply: number;
  ipfsHash: string;
}

export interface CreateEventParams {
  eventName: string;
}

export interface CreateTicketTypeParams {
  eventId: number;
  price: bigint;
  supply: number;
  ticketType: string;
  ipfsHash: string;
}

export interface PurchaseTicketParams {
  eventId: number;
  ticketTypeIndex: number;
  signal: string;
  root: bigint;
  nullifierHash: bigint;
  proof: bigint[];
} 