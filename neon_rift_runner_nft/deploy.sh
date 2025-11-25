#!/bin/bash

# Deploy Neon Rift Runner NFT Contracts to One Chain Testnet
# Make sure you have One Chain CLI installed and wallet connected

echo "Building contracts..."
one move build

if [ $? -ne 0 ]; then
    echo "Build failed! Please fix errors before deploying."
    exit 1
fi

echo ""
echo "Deploying contracts to One Chain testnet..."
echo "Make sure your wallet is connected to testnet!"
echo ""

# Publish the package
one client publish --json > deploy_output.json

if [ $? -ne 0 ]; then
    echo "Deployment failed!"
    exit 1
fi

# Extract package ID from output
PACKAGE_ID=$(cat deploy_output.json | grep -o '"packageId":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -z "$PACKAGE_ID" ]; then
    echo "Could not extract package ID from deployment output."
    echo "Please check deploy_output.json and set the package ID manually."
    exit 1
fi

echo ""
echo "=========================================="
echo "✅ Deployment Successful!"
echo "=========================================="
echo "Package ID: $PACKAGE_ID"
echo ""
echo "To use this in the game:"
echo "1. Open browser console in the game"
echo "2. Run: NFTService.setPackageId('$PACKAGE_ID')"
echo "3. Or update src/utils/NFTService.ts and set PACKAGE_ID constant"
echo ""
echo "Package ID saved to: deploy_output.json"
echo "=========================================="
