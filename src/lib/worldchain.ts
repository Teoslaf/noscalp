import { defineChain } from 'viem';

// World Chain configuration
export const worldchain = defineChain({
  id: 480,
  name: 'World Chain',
  network: 'worldchain',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://worldchain-mainnet.g.alchemy.com/public'],
    },
    public: {
      http: ['https://worldchain-mainnet.g.alchemy.com/public'],
    },
    alchemy: {
      http: ['https://worldchain-mainnet.g.alchemy.com/public'],
    }
  },
  blockExplorers: {
    default: {
      name: 'World Chain Explorer',
      url: 'https://worldscan.org',
    },
    alchemy: {
      name: 'Alchemy World Chain Explorer',
      url: 'https://worldchain-mainnet.explorer.alchemy.com',
    }
  },
  contracts: {
    // World ID Router contract address (if available on World Chain)
    worldIdRouter: {
      address: '0x163b09b4fE21177c455D850BD815B6D583732432', // Example address - replace with actual
    },
  },
});

// World Chain Sepolia testnet configuration
export const worldchainSepolia = defineChain({
  id: 4801,
  name: 'World Chain Sepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'Sepolia Ether',
    symbol: 'SEP ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://worldchain-sepolia.g.alchemy.com/public'],
    },
    public: {
      http: ['https://worldchain-sepolia.g.alchemy.com/public'],
    }
  },
  blockExplorers: {
    default: {
      name: 'World Chain Sepolia Explorer',
      url: 'https://worldchain-sepolia.explorer.alchemy.com',
    },
  },
  testnet: true,
});

// Smart contract addresses for World Chain
export const WORLD_CHAIN_CONTRACTS = {
  // Your specific smart contract
  TARGET_CONTRACT: '0x2cFc85d8E48F8EAB294be644d9E25C3030863003',
  
  // World ID Router (if deployed on World Chain)
  WORLD_ID_ROUTER: '0x163b09b4fE21177c455D850BD815B6D583732432', // Replace with actual address
} as const;

// Contract configuration
export const CONTRACT_CONFIG = {
  // Timeouts
  TRANSACTION_TIMEOUT: 60000, // 60 seconds
  CONFIRMATION_BLOCKS: 1, // Number of confirmations to wait for
  
  // Platform settings
  PLATFORM_FEE_DIVISOR: 10000, // For percentage calculations (e.g., 1000 = 10%)
  
  // IPFS settings
  IPFS_GATEWAY: 'https://ipfs.io/ipfs/',
  IPFS_API_ENDPOINT: 'https://api.pinata.cloud/pinning/pinJSONToIPFS', // Placeholder
  
  // Event settings
  MAX_TICKET_TYPES_PER_EVENT: 10,
  MAX_TICKETS_PER_PURCHASE: 10,
} as const;

// Default World ID action for the smart contract
export const DEFAULT_ACTION = 'verify';

// Test action for troubleshooting
export const TEST_ACTION = 'test-verification';

// Helper function to get the correct chain based on environment
export function getWorldChain() {
  const isProduction = process.env.NODE_ENV === 'production';
  const forceMainnet = process.env.NEXT_PUBLIC_FORCE_MAINNET === 'true';
  
  return (isProduction || forceMainnet) ? worldchain : worldchainSepolia;
}

// Helper function to check if a chain ID is World Chain
export function isWorldChain(chainId: number): boolean {
  return chainId === worldchain.id || chainId === worldchainSepolia.id;
}

// Helper function to get the correct contract address based on environment
export function getContractAddress(): string {
  // For now, we're using the same contract address for both networks
  // In a real deployment, you might have different addresses
  return WORLD_CHAIN_CONTRACTS.TARGET_CONTRACT;
}

// Helper function to get block explorer URL for a transaction
export function getTransactionUrl(txHash: string, testnet: boolean = false): string {
  const chain = testnet ? worldchainSepolia : worldchain;
  return `${chain.blockExplorers.default.url}/tx/${txHash}`;
}

// Helper function to get block explorer URL for an address
export function getAddressUrl(address: string, testnet: boolean = false): string {
  const chain = testnet ? worldchainSepolia : worldchain;
  return `${chain.blockExplorers.default.url}/address/${address}`;
}

// Helper function to check if we're in development mode
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

// RPC endpoint configuration with fallbacks
export function getRPCEndpoint(): string {
  const chain = getWorldChain();
  const endpoints = chain.rpcUrls.default.http;
  
  // Return the first available endpoint
  // In production, you might want to implement endpoint health checking
  return endpoints[0];
} 