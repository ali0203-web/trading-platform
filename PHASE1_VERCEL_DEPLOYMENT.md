# PHASE 1: VERCEL DEPLOYMENT GUIDE

**Status:** Ready to deploy once you create accounts  
**Time to deploy:** 5 minutes

---

## 📋 PREREQUISITE FILES NEEDED

Before deploying, your project must have:

```
your-project/
├── src/
│   ├── components/
│   │   └── TradingChart.jsx
│   ├── services/
│   │   └── marketData.js
│   ├── App.jsx
│   └── main.jsx
├── .env.local
├── package.json
├── vite.config.js
└── vercel.json
```

---

## 🔧 VERCEL CONFIGURATION

Create file: `vercel.json`

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "outputDirectory": "dist",
  "env": {
    "VITE_SUPABASE_URL": "@supabase_url",
    "VITE_SUPABASE_ANON_KEY": "@supabase_key",
    "VITE_ALPHA_VANTAGE_API_KEY": "@alpha_vantage_key"
  }
}
```

---

## 📦 PACKAGE.JSON SCRIPTS

Ensure your `package.json` has:

```json
{
  "name": "trading-platform",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "deploy": "vercel"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@supabase/supabase-js": "^2.38.0",
    "lightweight-charts": "^4.0.0",
    "axios": "^1.6.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.0",
    "vite": "^5.0.0"
  }
}
```

---

## 🚀 DEPLOYMENT STEPS

### **Step 1: Create GitHub Repository**
```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit - Phase 1 setup"

# Create GitHub repo at https://github.com/new
# Name it: trading-platform

# Push to GitHub
git remote add origin https://github.com/YOUR_USERNAME/trading-platform.git
git push -u origin main
```

### **Step 2: Connect to Vercel**

1. Go to https://vercel.com/dashboard
2. Click "New Project"
3. Select "Import Git Repository"
4. Choose your `trading-platform` repository
5. Click "Import"

### **Step 3: Add Environment Variables**

In Vercel project settings:

1. Go to **Settings → Environment Variables**
2. Add three variables:
   - Name: `VITE_SUPABASE_URL`
     Value: (from your Supabase project)
   - Name: `VITE_SUPABASE_ANON_KEY`
     Value: (from your Supabase project)
   - Name: `VITE_ALPHA_VANTAGE_API_KEY`
     Value: (from Alpha Vantage)

3. Click "Save"

### **Step 4: Deploy**

1. Click "Deploy"
2. Wait 2-3 minutes for build
3. Vercel gives you a live URL! 🎉

---

## ✅ VERIFICATION

After deployment:

- [ ] Go to the Vercel URL
- [ ] You should see the trading platform
- [ ] Chart loads (may take a few seconds for API call)
- [ ] Watchlist appears
- [ ] No console errors

---

## 📝 IMPORTANT NOTES

### **Build Command**
```bash
npm run build
```
This creates the `dist/` folder that Vercel deploys.

### **Environment Variables**
- Variables starting with `VITE_` are available in browser
- Vercel automatically injects them during build

### **API Rate Limits**
- Alpha Vantage free tier: 5 requests/minute
- Vercel may cache responses to reduce API calls
- We'll add Supabase caching in Phase 2

### **Deployment Workflow**
Every time you push to GitHub:
```bash
git add .
git commit -m "Your message"
git push origin main
```

Vercel automatically deploys! No manual action needed.

---

## 🔗 AFTER PHASE 1 DEPLOYMENT

Once live, you'll have:
- ✅ Professional trading UI
- ✅ Working charts (TradingView)
- ✅ Real market data (Alpha Vantage)
- ✅ User authentication (Supabase)
- ✅ Database ready (Supabase PostgreSQL)
- ✅ Live on internet

**Then Phase 2 starts:** Backend + Order System

---

## 🆘 TROUBLESHOOTING

### Build fails with "VITE_X not found"
→ Check environment variables are added in Vercel settings

### Chart not loading
→ Check Alpha Vantage API key is correct

### Database not connecting
→ Check Supabase URL and key are correct

### Vercel build times out
→ Usually temporary, just redeploy

---

**Ready to deploy? Reply: "✅ Vercel ready to deploy"**

Then I'll do final checks and we deploy together!
