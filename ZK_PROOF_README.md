# ZK Proof Generator for World Chain

This implementation creates Zero-Knowledge proofs using World ID and submits them to World Chain smart contracts. The system now supports both **client-side** and **server-side** verification using the official World ID API.

## 🔄 Updated Architecture

### Dual Verification System

The implementation now supports two verification methods:

1. **Client-side Verification** (default): Uses `verifyCloudProof` from `@worldcoin/minikit-js`
2. **Server-side Verification** (optional): Uses the official World ID API endpoint `/api/v2/verify/{app_id}`

### Key Components

1. **API Route**: `/src/app/api/create-zk-proof/route.ts`
   - Handles both client-side and server-side World ID verification
   - Implements official World ID API specification
   - Converts proofs to smart contract format
   - Generates contract call data

2. **React Component**: `/src/components/ZKProofGenerator/index.tsx`
   - User interface with verification options toggle
   - Enhanced error handling with official API error codes
   - Real-time display of verification results
   - Comprehensive debugging information

3. **World Chain Integration**: `/src/lib/worldchain.ts`
   - Network configuration for World Chain (Chain ID: 480)
   - Smart contract addresses and ABI definitions

## 📖 Official World ID API Integration

Based on the [World ID API Documentation](https://docs.world.org/world-id/reference/api#verify-proof), the implementation includes:

### Server-side Verification Endpoint

```typescript
POST https://developer.worldcoin.org/api/v2/verify/{app_id}

Request Body:
{
  "nullifier_hash": "0x...",    // Required: Unique user identifier
  "proof": "0x...",             // Required: Zero-knowledge proof
  "merkle_root": "0x...",       // Required: Merkle root for membership proof
  "verification_level": "orb",   // Required: Verification level
  "action": "verify_human",      // Required: Action identifier
  "signal_hash": "0x..."         // Optional: Hash of signal (defaults to empty string)
}
```

### Enhanced Error Handling

The implementation now handles all documented World ID API error responses:

- `invalid_proof`: Invalid proof provided
- `invalid_merkle_root`: Invalid merkle root in proof
- `user_already_verified`: User has already verified for this action
- `max_verifications_reached`: User exceeded maximum verifications
- `inclusion_proof_failed`: Verification failed (often due to app configuration)

## 🚀 Setup Instructions

### 1. Environment Variables

Create `.env.local` with your World ID app configuration:

```bash
NEXT_PUBLIC_APP_ID=app_your_app_id_here
```

### 2. World ID Developer Portal Configuration

Ensure your app in the [World ID Developer Portal](https://developer.worldcoin.org) is configured correctly:

- **Status**: Must be "Published" (not "Draft")
- **Environment**: Should be "Production" for mainnet
- **Type**: Configure as needed ("Cloud" for API verification)
- **Actions**: Must have active actions defined

### 3. Install Dependencies

```bash
npm install @worldcoin/minikit-js ethers viem
```

### 4. Smart Contract

Target contract: `0x9042DeCea10fa8E11d192A806F72c4c6a54eEF43` on World Chain

Expected function signature:
```solidity
function verifyProof(
    uint256 root,
    uint256 groupId,
    uint256 signalHash,
    uint256 nullifierHash,
    uint256 externalNullifierHash,
    uint256[8] calldata proof
) external
```

## 🎯 Usage

### Basic Usage (Client-side verification only)

1. Navigate to `/zk-proof`
2. Click "Verify with World ID (Minikit)"
3. Complete World ID verification in World App
4. Review generated proof data
5. Submit transaction to World Chain

### Advanced Usage (Client + Server verification)

1. Navigate to `/zk-proof`
2. Enable "Server-side verification using World ID API" toggle
3. Click "Verify with World ID (Minikit)"
4. Complete World ID verification
5. System will perform both client and server verification
6. Review detailed verification results
7. Submit transaction to World Chain

## 🔧 Technical Details

### Verification Flow

1. **Minikit Verification**: User completes World ID verification in World App
2. **Client Verification**: `verifyCloudProof()` validates the proof locally
3. **Server Verification** (optional): Official World ID API validates the proof
4. **Proof Processing**: Convert proof to smart contract format
5. **Contract Submission**: Submit transaction to World Chain

### Signal Hash Calculation

Following World ID specifications:
```typescript
function hashToField(data: string): string {
  const hash = ethers.keccak256(ethers.toUtf8Bytes(data));
  // Shift right by 8 bits to ensure field compatibility
  const fieldElement = BigInt(hash) >> BigInt(8);
  return '0x' + fieldElement.toString(16);
}
```

### Error Code Mapping

| World ID Error | User-Friendly Message |
|---|---|
| `invalid_proof` | "The proof provided is invalid. Please try generating a new proof." |
| `user_already_verified` | "You have already verified for this action. Each user can only verify once per action." |
| `max_verifications_reached` | "Maximum number of verifications reached for this action." |
| `inclusion_proof_failed` | "Verification failed: Your World ID verification could not be confirmed. Please check that your app is published in the Developer Portal." |

## 🐛 Troubleshooting

### Common Issues

1. **"inclusion_proof_failed" Error**
   - Check that your app is "Published" in Developer Portal
   - Verify you're using the correct environment (Production vs Staging)
   - Ensure actions are properly configured and active
   - Wait 5-10 minutes after making changes for propagation

2. **"App not found" Error**
   - Verify `NEXT_PUBLIC_APP_ID` is correctly set
   - Ensure the app ID starts with `app_`
   - Check that the app exists in Developer Portal

3. **Network Issues**
   - Ensure you're connected to World Chain (Chain ID: 480)
   - Check wallet has sufficient gas for transactions
   - Verify contract address is correct

### Debug Mode

In development mode, the component provides:
- Real-time verification status
- Detailed error information
- Configuration validation
- Minikit integration testing
- Link to official API documentation

## 🌐 API Reference

### Request Format

```typescript
POST /api/create-zk-proof

{
  "proof": ISuccessResult,           // From Minikit verification
  "signal": string,                  // User wallet address or identifier
  "action": string,                  // Action identifier
  "contractAddress": string,         // Target smart contract
  "useServerVerification": boolean   // Optional: enable server verification
}
```

### Response Format

```typescript
{
  "success": true,
  "clientVerificationResult": any,
  "serverVerificationResult": ServerVerificationResponse | null,
  "zkProofData": ZKProofData,
  "contractCallData": ContractCallData,
  "contractAddress": string,
  "verificationMethod": "client only" | "client + server",
  "message": string
}
```

## 📚 References

- [World ID API Documentation](https://docs.world.org/world-id/reference/api#verify-proof)
- [World ID Developer Portal](https://developer.worldcoin.org)
- [Minikit Documentation](https://docs.world.org/world-id/minikit)
- [World Chain Documentation](https://worldchain.org/docs)

## 🔒 Security Considerations

- Both client and server verification provide defense in depth
- Server verification adds an additional layer of validation
- All sensitive operations are performed server-side
- Proof data is validated before smart contract submission
- Error handling prevents information leakage

## 🚀 Next Steps

1. Test with server verification enabled for maximum security
2. Monitor verification success rates
3. Implement additional actions based on use case
4. Consider implementing proof caching for repeat verifications
5. Add monitoring and analytics for verification patterns 