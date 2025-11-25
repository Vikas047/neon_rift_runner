# Neon Rift Runner

An electric, synth-fueled runner built with Phaser 3 and TypeScript.

## 🎮 How to Play
*   **Desktop**: Use Arrow Keys to move and jump.
*   **Mobile**: Use on-screen touch controls.
*   Collect coins to increase your score!
*   Avoid bombs or bounce on them carefully.
*   **Shop**: Spend your coins to unlock new skins and backgrounds!

## 🚀 Features
*   **Endless Jumping**: Infinite platforms and increasing difficulty.
*   **Shop System**: Buy and equip various character skins and game backgrounds.
*   **Mobile Support**: Fully responsive touch controls.
*   **Persistent Save**: Your coins and unlocked items are saved automatically.

## 🛠️ Development

### Prerequisites
*   Node.js installed

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

## 🚀 Deployment to Vercel

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

2. **Go to [vercel.com](https://vercel.com)** and sign in

3. **Click "Add New Project"**

4. **Import your GitHub repository**

5. **Configure the project**:
   - **Framework Preset**: Other
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

6. **Click "Deploy"**

Vercel will automatically:
- Build your project using `npm run build`
- Deploy the `dist` folder
- Set up automatic deployments on every push to your main branch

### Configuration

The project already includes a `vercel.json` file with:
- ✅ Build command: `npm run build`
- ✅ Output directory: `dist`
- ✅ SPA routing (all routes redirect to `index.html`)
- ✅ Cache headers for assets

### Environment Variables (if needed)

If you need to set environment variables:
1. Go to your project settings on Vercel
2. Navigate to "Environment Variables"
3. Add any required variables (e.g., `PUBLIC_PATH` if deploying to a subdirectory)

### Custom Domain

After deployment:
1. Go to your project settings on Vercel
2. Navigate to "Domains"
3. Add your custom domain

## 📄 License
MIT
