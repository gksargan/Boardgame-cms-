# 🚀 Deployment Guide - BoardGame Café App

Complete step-by-step guide to deploy your app to production.

---

## Table of Contents
1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Vercel Deployment](#vercel-deployment)
3. [Netlify Deployment](#netlify-deployment)
4. [GitHub Pages Deployment](#github-pages-deployment)
5. [Environment Setup](#environment-setup)
6. [Post-Deployment Testing](#post-deployment-testing)
7. [Monitoring & Maintenance](#monitoring--maintenance)

---

## Pre-Deployment Checklist

### ✅ Security
- [ ] Change admin code from `ADMIN123` to something secure
- [ ] Review Supabase RLS policies
- [ ] Enable HTTPS (automatic with Vercel/Netlify)
- [ ] Remove any console.log debugging
- [ ] Check .gitignore includes .env.local
- [ ] Review for hardcoded secrets

### ✅ Code Quality
- [ ] Test all features locally
- [ ] Test on mobile and desktop
- [ ] Test CRUD operations
- [ ] Test search and filtering
- [ ] Test bulk import
- [ ] Test public shareable link
- [ ] Test on slow 3G connection

### ✅ Database
- [ ] All tables created in Supabase
- [ ] RLS policies enabled
- [ ] Sample data added
- [ ] Backups configured
- [ ] Row-level security tested
- [ ] Public access verified

### ✅ Configuration
- [ ] .env.example updated
- [ ] README updated with correct info
- [ ] No hardcoded URLs
- [ ] API keys in environment variables
- [ ] Vercel/Netlify app created

---

## Vercel Deployment

### Best For
- Next.js, React, Vue, Svelte apps
- Automatic deployments from Git
- Free tier with generous limits
- CDN and serverless functions

### Step 1: Prepare Code

```bash
# Make sure code is committed
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up"
3. Choose "Continue with GitHub"
4. Authorize Vercel to access your repos

### Step 3: Import Project

1. Click "Add New..." → "Project"
2. Search for your repo
3. Click "Import"
4. Configure project:
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

### Step 4: Environment Variables

1. Go to "Settings" → "Environment Variables"
2. Add each variable:
   - `VITE_SUPABASE_URL` = Your Supabase URL
   - `VITE_SUPABASE_ANON_KEY` = Your Supabase anon key

```bash
# OR use CLI
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
```

### Step 5: Deploy

```bash
# Deploy current branch
vercel

# Deploy to production
vercel --prod
```

Your app is now live! You'll get a URL like:
- Preview: `https://boardgame-cafe-xxxxx.vercel.app`
- Production: `https://your-domain.com` (if custom domain)

### Add Custom Domain

1. Go to "Settings" → "Domains"
2. Click "Add"
3. Enter your domain (e.g., `boardgame-cafe.com`)
4. Follow DNS setup instructions
5. Done! SSL certificate auto-generated

---

## Netlify Deployment

### Best For
- Static sites
- Git-connected deployments
- Built-in form handling
- Simple CI/CD

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Ready for Netlify"
git push origin main
```

### Step 2: Connect to Netlify

1. Go to [netlify.com](https://netlify.com)
2. Click "Sign up with GitHub"
3. Authorize Netlify
4. Click "New site from Git"
5. Select your repository

### Step 3: Configure Build

Set these values:
- **Build Command:** `npm run build`
- **Publish Directory:** `dist`

Netlify auto-detects these from vite.config.js, so they should be pre-filled.

### Step 4: Set Environment Variables

1. Go to "Site Settings" → "Build & Deploy" → "Environment"
2. Click "Edit variables"
3. Add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

### Step 5: Deploy

Click "Deploy Site". Netlify automatically builds and deploys your app.

Your site will be available at:
- `https://your-site-name.netlify.app`

### Add Custom Domain

1. Go to "Domain Settings"
2. Click "Custom Domain"
3. Add your domain
4. Update DNS records at your domain provider
5. Done!

---

## GitHub Pages Deployment

### Best For
- Free hosting
- Static sites
- GitHub integration
- Portfolio projects

### Step 1: Update vite.config.js

```javascript
export default {
  base: '/boardgame-cafe-app/', // Your repo name
  // ... rest of config
}
```

### Step 2: Build Locally

```bash
npm run build
```

### Step 3: Deploy Script

Create `deploy.sh`:

```bash
#!/bin/bash
set -e

npm run build

cd dist

git init
git add -A
git commit -m "Deploy $(date)"
git push -f https://github.com/YOUR_USERNAME/boardgame-cafe-app.git main:gh-pages

cd -
```

Make executable and run:

```bash
chmod +x deploy.sh
./deploy.sh
```

### Step 4: Enable GitHub Pages

1. Go to repo Settings
2. Scroll to "Pages"
3. Select "Deploy from branch"
4. Branch: `gh-pages`
5. Save

Your site is live at: `https://YOUR_USERNAME.github.io/boardgame-cafe-app/`

---

## Environment Setup

### Production Env Variables

```bash
# Required
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Optional (for future features)
VITE_STRIPE_KEY=pk_live_xxxxx
VITE_ANALYTICS_KEY=UA-xxxxx-x
```

### Verify in Deployment

```bash
# Vercel
vercel env pull .env.local

# Netlify
netlify env:list
```

---

## Post-Deployment Testing

### 1. Test Core Features

- [ ] Admin login works
- [ ] Can add a game
- [ ] Can edit a game
- [ ] Can delete a game
- [ ] Search functionality works
- [ ] Filters work
- [ ] Sorting works
- [ ] Bulk import works
- [ ] Export CSV works

### 2. Test Public Access

- [ ] Share link works
- [ ] Public view accessible
- [ ] Games display correctly
- [ ] Search/filter works without login
- [ ] Mobile responsive

### 3. Database Connectivity

- [ ] Data persists after refresh
- [ ] Changes reflect in Supabase
- [ ] Real-time updates work
- [ ] Bulk operations work

### 4. Performance Testing

Use Lighthouse (Chrome DevTools):
- [ ] Performance > 80
- [ ] Accessibility > 90
- [ ] Best Practices > 90
- [ ] SEO > 90

### 5. Mobile Testing

- [ ] Layout responsive
- [ ] Touch interactions work
- [ ] Forms accessible
- [ ] Images load properly

### 6. Cross-Browser Testing

Test in:
- Chrome/Chromium
- Firefox
- Safari
- Edge

---

## Monitoring & Maintenance

### Vercel Monitoring

1. Go to Dashboard
2. Click "Analytics"
3. Monitor:
   - Response times
   - Error rates
   - Traffic

### Netlify Monitoring

1. Go to Site Overview
2. Check "Production Deploys"
3. View analytics under "Analytics"

### Supabase Monitoring

1. Go to Supabase Dashboard
2. View "Database" metrics
3. Monitor:
   - Query performance
   - Row count
   - Database size

### Set Up Alerts

**Vercel:**
Settings → Monitoring → Enable Performance Alerts

**Netlify:**
Site Settings → Build & Deploy → Deploy Notifications

**Supabase:**
Dashboard → Integrations → Enable monitoring

---

## Troubleshooting Deployment

### Build Fails

```bash
# Clear cache and rebuild
vercel --prod --force

# Or Netlify
netlify build --context production
```

### Environment Variables Not Loading

1. Verify variable names (case-sensitive)
2. Restart deployment
3. Check in browser console: `import.meta.env.VITE_*`

### Database Connection Fails

1. Check Supabase status: https://status.supabase.com
2. Verify RLS policies allow public access
3. Check Supabase logs for errors

### Slow Performance

- Enable compression
- Optimize images
- Cache static assets
- Consider upgrading Supabase plan

### CORS Issues

Add to Supabase dashboard (Settings → API → CORS):

```
https://your-domain.com
```

---

## Rollback

### Vercel
```bash
vercel rollback
```

### Netlify
Deployments → Right-click → Restore

### GitHub Pages
Push a previous commit to trigger rebuild

---

## CI/CD Pipeline

### Automatic Deployments

**Vercel & Netlify** automatically deploy on:
- Push to main branch
- Pull requests (preview)

### Setup Manual Approval

1. Vercel: Settings → Git → Automatic deployments (toggle off)
2. Then manually approve in dashboard

---

## Cost Estimation

| Platform | Free Tier | Pro Tier | Use Case |
|----------|-----------|----------|----------|
| **Vercel** | ✅ 100GB bandwidth | $20/mo | Recommended |
| **Netlify** | ✅ 300 mins/month | $19/mo | Good alternative |
| **GitHub Pages** | ✅ Unlimited | - | For portfolios |
| **Supabase** | ✅ 500MB DB | Varies | Database |

---

## Post-Deployment Checklist

- [ ] Domain is live and HTTPS working
- [ ] Admin can log in
- [ ] All CRUD operations work
- [ ] Public share link works
- [ ] Database connected and syncing
- [ ] Analytics accessible
- [ ] Monitoring alerts enabled
- [ ] Backups configured
- [ ] Team has access if needed
- [ ] Documentation updated

---

## Support

**Having Issues?**

1. Check deployment logs
   - Vercel: Deployments → Details → Logs
   - Netlify: Deployments → Deploy log
   
2. Review environment variables
   
3. Check Supabase status

4. Try rebuilding:
   ```bash
   vercel --prod --force
   ```

5. Contact support:
   - Vercel: https://vercel.com/support
   - Netlify: https://support.netlify.com
   - Supabase: https://github.com/supabase/supabase/discussions

---

**Congratulations! Your app is now live! 🎉**
