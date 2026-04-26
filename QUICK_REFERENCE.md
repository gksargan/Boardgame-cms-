# BoardGame Café - Quick Reference

## 🚀 Setup Checklist

### Prerequisites (Before You Start)
- [ ] Node.js 16+ installed (`node --version`)
- [ ] npm or yarn installed (`npm --version`)
- [ ] GitHub account (for version control)
- [ ] Supabase account (free at supabase.com)

### Phase 1: Database (5 minutes)
- [ ] Create Supabase project
- [ ] Go to SQL Editor in Supabase
- [ ] Copy-paste entire `EXTENDED_SCHEMA.sql`
- [ ] Click "Execute" or Ctrl+Enter
- [ ] Wait for "Success" message

### Phase 2: API Keys (3 minutes)
- [ ] In Supabase, go to Settings → API
- [ ] Copy "Project URL"
- [ ] Copy "anon public" key
- [ ] Keep somewhere safe (password manager)

### Phase 3: Project Setup (5 minutes)
```bash
# 1. Clone repo (or create locally)
git clone <your-repo>
cd boardgame-cafe-app

# 2. Install dependencies
npm install

# 3. Create .env.local file
# Create a new file called ".env.local" in root directory
# Add these lines:
VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR-ANON-KEY

# 4. Start dev server
npm run dev

# 5. Open browser to http://localhost:5173
# Login with code: ADMIN123
```

### Phase 4: First Game (5 minutes)
- [ ] Click "Add Game" in admin panel
- [ ] Fill in test game details
- [ ] Click "Add Game"
- [ ] Game appears in library
- [ ] Test public link works

---

## 📖 File Reference

### Must Read (In Order)
1. **README.md** - Main documentation
2. **SETUP_GUIDE.md** - Detailed setup
3. **FEATURE_GUIDE.md** - How to use features
4. **PROJECT_SUMMARY.md** - What's included

### For Developers
- **vite.config.js** - Build configuration
- **tailwind.config.js** - Styling system
- **package.json** - Dependencies

### For Database
- **EXTENDED_SCHEMA.sql** - Database schema

---

## 💻 Common Commands

### Development
```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Deploy to Vercel
npm run deploy
```

### Git/GitHub
```bash
# Initial setup
git config user.name "Your Name"
git config user.email "your@email.com"

# Add all files
git add .

# Commit changes
git commit -m "Add feature or fix"

# Push to GitHub
git push origin main
```

### Troubleshooting
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install

# Clear npm cache
npm cache clean --force

# Update all dependencies
npm update
```

---

## 🔧 Customization Quick Guide

### Change Admin Code
**File: `src/BoardGameApp.jsx` (Line 15)**
```javascript
const ADMIN_CODE = 'YOUR_NEW_CODE';
```

### Change Styles (Colors, Fonts)
**File: `src/App.css` and components**
- Use Tailwind classes (bg-purple-500, text-blue-700, etc.)
- Edit colors in `tailwind.config.js`

### Change Currency
**Search for: `₹`**
Replace with your currency symbol ($, €, £, etc.)

### Add Game Themes
**File: `src/components/GameForm.jsx` (Line 4)**
```javascript
const GAME_THEMES = ['Fantasy', 'Sci-Fi', 'Your Theme'];
```

### Adjust Prices
**File: `src/components/GameBooking.jsx`**
Modify `gamePrice` prop being passed

---

## 📊 Admin Workflows

### Daily Routine (5 minutes)
1. Open admin panel
2. Check "Bookings" tab for pending confirmations
3. Confirm any new bookings
4. Send confirmation emails to customers
5. Check "Reviews" tab for feedback

### Adding Games (2 minutes per game)
1. Games Library tab → Add Game
2. Fill all details
3. Add images (3-5 recommended)
4. Save
5. Test by viewing in public link

### Managing Bookings (1 minute per booking)
1. Bookings tab
2. See pending bookings
3. Call/email customer to verify
4. Click "Confirm" when ready
5. Customer gets confirmation automatically

### Responding to Reviews (2 minutes)
1. Reviews tab
2. See all reviews
3. Good reviews: Thank customer
4. Bad reviews: Contact customer, fix issue
5. Delete only spam/inappropriate reviews

---

## 🌐 Deployment Steps

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow prompts, select your project
# Add environment variables when prompted:
# VITE_SUPABASE_URL=...
# VITE_SUPABASE_ANON_KEY=...
```

### Netlify
1. Push code to GitHub
2. Go to netlify.com
3. Click "New site from Git"
4. Select your GitHub repo
5. Add env variables in Site settings
6. Deploy

### Manual (Self-Hosted)
```bash
# Build
npm run build

# Upload 'dist' folder to your server
# Set up environment variables on server
# Restart server
```

---

## 🐛 Troubleshooting Quick Fixes

### "Cannot find module" error
```bash
npm install
```

### Database connection fails
- Check VITE_SUPABASE_URL
- Check VITE_SUPABASE_ANON_KEY
- Verify Supabase project is running
- Check internet connection

### Port 5173 already in use
```bash
# Kill process on that port, or use different port:
npm run dev -- --port 5174
```

### Images not showing
- Check image URLs
- Verify image files exist
- Check browser console for 404 errors
- Enable CORS if using external images

### Styles not loading
- Clear cache: Ctrl+Shift+Delete
- Rebuild: npm run build
- Check tailwind.config.js

### Git push fails
```bash
# Might need authentication
git config --global credential.helper store
git push  # Will ask for credentials once, then remember
```

---

## 📋 Launch Checklist

### Before Going Live
- [ ] Change admin code from "ADMIN123"
- [ ] Add 10+ games to test
- [ ] Test all features (add, edit, delete games)
- [ ] Test booking flow as customer
- [ ] Test review submission
- [ ] Test on mobile (responsive design)
- [ ] Generate share link and test
- [ ] Check all images load correctly
- [ ] Verify prices show correctly
- [ ] Test email/SMS (if configured)

### Before Sharing with Customers
- [ ] Verify database backup is working
- [ ] Test on different browsers
- [ ] Set up customer service process
- [ ] Create FAQ for customers
- [ ] Have backup admin account/code
- [ ] Monitor first week closely
- [ ] Gather feedback and improve

### Post-Launch (Week 1)
- [ ] Check daily for bookings
- [ ] Respond to all reviews
- [ ] Monitor analytics
- [ ] Fix any bugs reported
- [ ] Update game descriptions based on feedback

---

## 🎯 Admin Tips & Tricks

### Boost Visibility
- Add high-quality game photos (3-5 per game)
- Write detailed descriptions
- Keep condition updated
- Respond quickly to bookings
- Feature popular games

### Increase Ratings
- Keep games in excellent condition
- Provide replacement parts if missing
- Create comfortable game space
- Ask satisfied customers to review
- Address negative feedback promptly

### Track What Works
- Check Analytics daily
- Note which games get booked most
- Watch review ratings
- See customer feedback
- Use data to make decisions

---

## 📞 Getting Help

### Resources
- **Supabase Docs**: https://supabase.com/docs
- **React Docs**: https://react.dev
- **Tailwind Docs**: https://tailwindcss.com
- **Vite Docs**: https://vitejs.dev

### In the Project
- **README.md** - Main guide
- **SETUP_GUIDE.md** - Detailed setup
- **FEATURE_GUIDE.md** - How-to for features
- **Code comments** - Inline documentation

---

## ✅ Success Indicators

You'll know it's working when:
- ✅ Admin login works with code
- ✅ Can add/edit/delete games
- ✅ Public link shows all games
- ✅ Can make bookings as customer
- ✅ Can leave reviews
- ✅ Analytics show data
- ✅ Everything works on mobile
- ✅ Images display correctly
- ✅ Prices calculate automatically
- ✅ Responsive design adapts

---

## 🎓 Learning Path

1. **First 15 minutes**: Read README.md
2. **Next 15 minutes**: Follow SETUP_GUIDE.md
3. **Next 30 minutes**: Add 5 test games
4. **Next 15 minutes**: Test public features
5. **Next 15 minutes**: Explore admin features
6. **Next 30 minutes**: Read FEATURE_GUIDE.md
7. **Ready to launch!**

---

## 🚀 From Now On

- **Daily**: Check bookings, confirm, respond to reviews
- **Weekly**: Review analytics, update content
- **Monthly**: Plan promotions, improve based on feedback
- **Quarterly**: Add new features, scale up

---

**You've got this! 🎲** Start with SETUP_GUIDE.md →
