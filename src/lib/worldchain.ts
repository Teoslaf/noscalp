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
  },
  blockExplorers: {
    default: {
      name: 'World Chain Explorer',
      url: 'https://worldchain-mainnet.explorer.alchemy.com',
    },
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
  id: 11155111,
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
  },
  blockExplorers: {
    default: {
      name: 'World Chain Sepolia Explorer',
      url: 'https://sepolia.worldscan.org',
    },
  },
  testnet: true,
});

// Smart contract addresses for World Chain
export const WORLD_CHAIN_CONTRACTS = {
  // Your specific smart contract
  TARGET_CONTRACT: '0x9042DeCea10fa8E11d192A806F72c4c6a54eEF43',
  
  // World ID Router (if deployed on World Chain)
  WORLD_ID_ROUTER: '0x163b09b4fE21177c455D850BD815B6D583732432', // Replace with actual address
} as const;

// Default World ID action for the smart contract
export const DEFAULT_ACTION = 'verify_human';

// Test action for troubleshooting
export const TEST_ACTION = 'test_verification';

// Helper function to get the correct chain based on environment
export function getWorldChain() {
  return process.env.NODE_ENV === 'production' ? worldchain : worldchainSepolia;
}

// Helper function to check if a chain ID is World Chain
export function isWorldChain(chainId: number): boolean {
  return chainId === worldchain.id || chainId === worldchainSepolia.id;
} 