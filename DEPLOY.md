# Deploying to Vercel

## Quick Deploy

### Option 1: Deploy via Vercel CLI

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
   
   Follow the prompts:
   - Set up and deploy? **Yes**
   - Which scope? (Select your account)
   - Link to existing project? **No** (for first deployment)
   - Project name? (Press Enter for default or enter custom name)
   - Directory? **./** (current directory)
   - Override settings? **No**

4. **For production deployment**:
   ```bash
   vercel --prod
   ```

### Option 2: Deploy via GitHub Integration

1. **Push your code to GitHub** (if not already):
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Go to Vercel Dashboard**:
   - Visit [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository

3. **Configure Project**:
   - Framework Preset: **Other**
   - Root Directory: **./** (leave as default)
   - Build Command: `npm run build` (already set in vercel.json)
   - Output Directory: `dist` (already set in vercel.json)
   - Install Command: `npm install` (already set in vercel.json)

4. **Deploy**:
   - Click "Deploy"
   - Vercel will automatically build and deploy your game

## Configuration

The project includes a `vercel.json` file with the following settings:

- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Rewrites**: All routes redirect to `index.html` for SPA routing
- **Headers**: Cache control for static assets

## Environment Variables

If you need to set environment variables:

1. **Via Vercel Dashboard**:
   - Go to your project settings
   - Navigate to "Environment Variables"
   - Add your variables

2. **Via CLI**:
   ```bash
   vercel env add VARIABLE_NAME
   ```

## Custom Domain

To add a custom domain:

1. Go to your project settings in Vercel Dashboard
2. Navigate to "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

## Troubleshooting

### Build Fails

- Check that all dependencies are in `package.json`
- Ensure Node.js version is compatible (Vercel uses Node 18.x by default)
- Check build logs in Vercel dashboard

### Assets Not Loading

- Verify `publicPath` in `webpack/config.prod.js` is set to `/` for Vercel
- Check that assets are copied to `dist/assets` during build
- Verify file paths in your code use relative paths

### IndexedDB Issues

- IndexedDB works in production on HTTPS
- Vercel provides HTTPS by default
- No additional configuration needed

## Notes

- The game uses IndexedDB for secure coin storage (requires HTTPS)
- Wallet connection requires HTTPS (provided by Vercel)
- All static assets are cached for optimal performance

