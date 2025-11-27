## NEON RIFT RUNNER

*A neon-drenched rooftop runner where every jump, every coin, and every cosmetic lives on-chain.*

Dash across a cyberpunk skyline, dodge bombs, collect encrypted coins, and unlock on-chain skins and backgrounds that live in your **OneChain** wallet — not in a database.

---

## Links

- **Live Demo**: [neon-rift-runner.vercel.app](https://neon-rift-runner.vercel.app)
- **Demo Video**: `[Add YouTube link here]`
- **Wallet**: [OneWallet](https://chromewebstore.google.com/detail/onewallet/cipoflgemgdgkgifhbpjcpjdloagkbgm)
- **Skin / Background NFT Package**:  
  `0x9da588e412e32337eeadd07d62e40e0256adfaf5dadbbc13ea37e67fe3e9d608`
  - Module: `skin_nft`
  - Module: `background_nft`
- **Network**: OneChain Testnet

---

## What Is Neon Rift Runner?

Neon Rift Runner is an **endless rooftop runner** built on **OneChain**.

You sprint across a futuristic city, jumping between platforms, collecting coins, and dodging bombs.  
Your **skins** and **backgrounds** are **real NFTs** on OneChain, minted and owned directly in your wallet.  
Your **coins** are stored locally but **encrypted** in IndexedDB, making it much harder to cheat or tamper with.

**Your skill. Your style. Your chain.**

![Neon Rift Runner Screenshot](./screenshot.png)

---

## Core Features

### Wallet-Gated Gameplay

- **OneChain wallet required** (OneWallet via Sui wallet standard).
- If the wallet is **not connected**, you:
  - Cannot start the game.
  - Cannot open the shop.
  - See a clean modal asking you to connect your wallet.
- Automatic **chain validation** (accepts any testnet variant like `testnet`, `one-testnet`, etc.).

### On-Chain Skins & Backgrounds (NFTs)

- Skins and backgrounds are **Move-based NFTs** deployed on **OneChain Testnet**.
- When you unlock a mystery item in the shop:
  - A real **mint transaction** is sent using `@onelabs/sui`.
  - The NFT is minted to your connected wallet.
  - The item is instantly revealed and becomes available in your inventory.
- **Default items** (`red` skin, `desert` background) are always available and equipped by default (not NFTs), so new players can play immediately.

### Integrated OneChain Wallet UX

- Top-right **wallet widget** on the **Main Menu** and **Shop**:
  - Shows connection status and address.
  - Detects if a compatible wallet is installed.
  - If not installed, the button turns into an **“Install Wallet”** call-to-action.
- **Wallet Info Modal**:
  - Displays address in a readable, wrapped format.
  - Shows current network with a clear “switch to testnet” hint if incorrect.
  - Clean layout sized for desktop players.

### Smart Shop & Mystery Crate

- In-game shop with:
  - **Skins** and **backgrounds** backed by NFTs.
  - A **mystery crate** that mints a random NFT when unlocked.
- The shop:
  - Fetches owned NFTs **directly from the wallet** (not from local storage).
  - Reacts to wallet **connect / disconnect / account change** events and refetches data.
  - Shows **inline “Please connect your wallet”** messaging if no wallet is connected.
- Long NFT IDs are automatically **shortened** (`0x1234...abcd`) and wrapped nicely in:
  - Item cards.
  - Transfer modal.

### Secure Coin Storage (Anti-Cheat Friendly)

- Coins are **not** stored in `localStorage`.
- Instead, they are stored in **IndexedDB** using:
  - **AES-GCM (256-bit)** encryption.
  - **PBKDF2** key derivation via the Web Crypto API.
- Includes:
  - Async APIs to read/write coins.
  - A cached `getCoinsSync()` path for instant UI updates.
  - Initialization in the boot scene so the game always has a consistent starting state.

### In-Game NFT Transfers

- From the shop, players can:
  - Open a **Transfer NFT** modal on any owned NFT.
  - Enter a recipient address using a **native HTML `<input>`** overlaid on the Phaser canvas.
  - Paste addresses, see the cursor, and edit text naturally.
- Transfers use a **real on-chain programmable transaction** via `@onelabs/sui/transactions`:
  - No dummy alerts.
  - Proper success and error feedback in the UI.

### Polished Game Feel

- **Endless runner** gameplay with:
  - Increasing difficulty.
  - Coins, bombs, and platform variety.
- Mobile-friendly controls:
  - Keyboard on desktop.
  - On-screen touch controls on mobile.
- Smooth UX details:
  - No unnecessary modal spam when connecting the wallet.
  - Loading indicators that disappear correctly when data is ready.
  - Mystery cards and NFT cards appear **instantly and together**, even with cached data.

---

## Roadmap

**Live Now**

- Endless runner core gameplay.
- OneWallet integration via Sui wallet standard.
- On-chain minting of **skin** and **background** NFTs.
- NFT-gated cosmetics in the shop.
- Encrypted coin storage in IndexedDB.
- In-game NFT transfer flow.

**Coming Soon**

- More skin and background themes.
- Leaderboards and shareable high scores.
- Power-up NFTs (temporary boosts, effects).
- Expanded mobile optimizations.

---

## Tech Stack

| Layer       | Technology                                |
|------------|--------------------------------------------|
| Game       | Phaser 3 + TypeScript                      |
| Build      | Webpack 5                                  |
| Blockchain | OneChain (Move)                            |
| Wallet     | OneWallet (Sui wallet standard) + `@onelabs/sui` |
| Storage    | IndexedDB + Web Crypto (AES-GCM, PBKDF2)   |

---

## Run Locally

### Prerequisites

- Node.js (LTS recommended)

### Setup

```bash
npm install
```

### Run Dev Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

---

## Deployment to Vercel

### Option 1: Deploy via Vercel CLI (Recommended)

1. **Install Vercel CLI** (if not already installed):

```bash
npm i -g vercel
```

2. **Login to Vercel**:

```bash
vercel login
```

3. **Deploy**:

```bash
vercel
```

4. **For production deployment**:

```bash
vercel --prod
```

### Option 2: Deploy via GitHub Integration

1. **Push your code to GitHub**:

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **Go to `vercel.com`** and sign in  
3. **Click "Add New Project"**  
4. **Import your GitHub repository**  
5. **Configure the project**:
   - **Framework Preset**: Other
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

6. **Click "Deploy"**

Vercel will automatically:

- Build your project using `npm run build`
- Deploy the `dist` folder
- Set up automatic deployments on every push to your main branch

### Configuration

The project includes a `vercel.json` file with:

- **Build command**: `npm run build`
- **Output directory**: `dist`
- **SPA routing** (all routes redirect to `index.html`)
- **Cache headers** for static assets

---

## Smart Contracts

Move package (OneChain Testnet):

```text
neon_rift_runner_nft/
├── sources/
│   ├── background_nft.move   — Background NFT module
│   └── skin_nft.move         — Skin NFT module
└── Move.toml                 — Package + dependencies
```

- Deployed package ID:  
  `0x9da588e412e32337eeadd07d62e40e0256adfaf5dadbbc13ea37e67fe3e9d608`

---

## License

MIT

