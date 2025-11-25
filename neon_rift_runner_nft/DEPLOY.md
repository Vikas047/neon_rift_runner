# Deploy Neon Rift Runner NFT Contracts

## Prerequisites

1. Install One Chain CLI: https://onelabs.cc
2. Make sure you have testnet OCT for gas fees
3. Connect your wallet to One Chain testnet

## Deployment Steps

1. **Navigate to the contract directory:**
   ```bash
   cd neon_rift_runner_nft
   ```

2. **Build the contracts:**
   ```bash
   one move build
   ```

3. **Deploy the contracts:**
   ```bash
   ./deploy.sh
   ```
   
   Or manually:
   ```bash
   one client publish --json > deploy_output.json
   ```

4. **Save the Package ID:**
   After deployment, you'll get a Package ID. Save it:
   - Copy the Package ID from the deployment output
   - In the game, open browser console and run:
     ```javascript
     NFTService.setPackageId('YOUR_PACKAGE_ID_HERE')
     ```
   - Or update `src/utils/NFTService.ts` and set the PACKAGE_ID constant

## Package ID Format

The Package ID will look like:
```
0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
```

## After Deployment

1. The contracts will be deployed to One Chain testnet
2. Users can now mint NFTs when unlocking mystery items
3. NFTs will be stored on-chain in their wallet
4. The shop will fetch owned NFTs directly from the blockchain

## Testing

After deployment, test minting:
1. Connect your wallet in the game
2. Go to Shop
3. Click "UNLOCK" on a mystery card
4. Approve the transaction in your wallet
5. The NFT will be minted and revealed
