# BoardGame Café Inventory App - Complete Setup Guide

A full-stack board game café inventory management system with public sharing capabilities.

## Features

✅ **Admin Panel**
- Full CRUD operations (Create, Read, Update, Delete)
- Search & filter games
- Sort by name, players, or playing time
- Admin login with code protection

✅ **Public View**
- Read-only game catalog
- Shareable public link
- Search and filter capabilities
- Game statistics (total games, avg players, avg playtime)

✅ **Full Game Details**
- Game name, description
- Player count (min/max)
- Playing time
- Difficulty level (Easy/Medium/Hard)
- Theme/Category
- Rental price
- Condition status

✅ **Real-time Database**
- Supabase PostgreSQL backend
- Instant updates across views
- Row-level security for data protection

---

## 🚀 Quick Start

### 1. **Set Up Supabase Project**

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Go to **SQL Editor** and run this SQL to create the table:

```sql
-- Create board_games table
CREATE TABLE board_games (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  min_players INTEGER NOT NULL DEFAULT 2,
  max_players INTEGER NOT NULL DEFAULT 4,
  playing_time INTEGER NOT NULL DEFAULT 30,
  difficulty VARCHAR(50) NOT NULL DEFAULT 'Medium',
  theme VARCHAR(100),
  price DECIMAL(10, 2) DEFAULT 0,
  condition VARCHAR(50) DEFAULT 'Good',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE board_games ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Public can read all games"
  ON board_games FOR SELECT
  USING (true);

-- Create policy for admin (you can make this more secure)
CREATE POLICY "Allow admin inserts/updates/deletes"
  ON board_games FOR ALL
  USING (true);
```

### 2. **Get Your Supabase Keys**

1. Go to **Settings** → **API** in your Supabase dashboard
2. Copy:
   - `Project URL` (VITE_SUPABASE_URL)
   - `anon public` key (VITE_SUPABASE_ANON_KEY)

### 3. **Clone & Setup Project**

```bash
# Clone the repo
git clone <your-repo>
cd boardgame-cafe-app

# Install dependencies
npm install

# Create .env.local file with your Supabase credentials
echo "VITE_SUPABASE_URL=https://your-project.supabase.co" > .env.local
echo "VITE_SUPABASE_ANON_KEY=your-anon-key" >> .env.local
```

### 4. **Run Locally**

```bash
npm run dev
```

Visit `http://localhost:5173`

**Admin Login:**
- Code: `ADMIN123` (change this in `BoardGameApp.jsx`)

---

## 📁 Project Structure

```
src/
├── BoardGameApp.jsx          # Main app with routing & auth
├── components/
│   ├── AdminPanel.jsx        # Admin dashboard & game list
│   ├── GameForm.jsx          # Create/edit game form
│   ├── GameCard.jsx          # Reusable game display card
│   └── PublicView.jsx        # Public catalog view
├── lib/
│   └── supabaseClient.js     # Supabase config
└── App.css                   # Tailwind styles

.env.local                    # Your secrets (git ignored)
vite.config.js               # Vite configuration
```

---

## 🔐 Security Notes

### Current Setup (Development)
- Simple admin code in frontend (change "ADMIN123" to your own)
- Public read access to all games
- Admin can modify all games

### Recommended for Production
1. **Better Admin Auth:**
   ```javascript
   // Use Supabase Auth instead of simple code
   const { data, error } = await supabase.auth.signInWithPassword({
     email: adminEmail,
     password: adminPassword,
   });
   ```

2. **Row-Level Security Policy:**
   ```sql
   CREATE POLICY "Only admins can insert/update/delete"
     ON board_games FOR ALL
     USING (auth.role() = 'authenticated')
     WITH CHECK (auth.role() = 'authenticated');
   ```

3. **Environment Variables:**
   - Never commit `.env.local`
   - Use `.env.local.example` for template
   - Use proper secrets on production

---

## 🌐 Deployment Options

### **Option 1: Vercel (Recommended)**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Then add these environment variables in Vercel dashboard:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### **Option 2: Netlify**

1. Push code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Connect your GitHub repo
4. Add environment variables in Site settings
5. Deploy (automatic on each push)

### **Option 3: GitHub Pages (Static)**

```bash
# Modify vite.config.js
export default {
  base: '/boardgame-cafe-app/', // Your repo name
  // ... rest of config
}

# Build and deploy
npm run build
npm run deploy
```

---

## 📊 Database Schema

### `board_games` Table

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| name | VARCHAR(255) | Game name (required) |
| description | TEXT | Game description (required) |
| min_players | INTEGER | Minimum players (default: 2) |
| max_players | INTEGER | Maximum players (default: 4) |
| playing_time | INTEGER | Duration in minutes (default: 30) |
| difficulty | VARCHAR(50) | Easy/Medium/Hard |
| theme | VARCHAR(100) | Fantasy/Sci-Fi/etc |
| price | DECIMAL(10,2) | Rental price in ₹ |
| condition | VARCHAR(50) | Like New/Good/Fair/Needs Repair |
| created_at | TIMESTAMP | Auto-generated |
| updated_at | TIMESTAMP | Auto-generated |

---

## 🎮 How to Use

### Admin Operations

1. **Login:** Enter admin code (default: ADMIN123)
2. **Add Game:** Click "Add Game" button
3. **Edit:** Click edit icon on game card
4. **Delete:** Click delete icon (with confirmation)
5. **Search:** Use search bar (searches name, description, theme)
6. **Filter:** Filter by difficulty level
7. **Sort:** Sort by name, players, or playtime

### Share Public Link

1. Click "Generate Share Link" in admin header
2. Copy the link and share with customers
3. They can browse without admin access
4. Public link updates automatically when you add/edit games

### Public Browsing

1. Visit the shareable link
2. Search games by name/description
3. Filter by difficulty and theme
4. View game stats (total, avg players, avg time)
5. No admin access needed

---

## 🛠️ Customization

### Change Admin Code

Open `BoardGameApp.jsx` and change:
```javascript
const ADMIN_CODE = 'YOUR_NEW_CODE';
```

### Add More Game Themes

Edit `components/GameForm.jsx`:
```javascript
const GAME_THEMES = ['Fantasy', 'Sci-Fi', 'Mystery', 'Your Theme', ...];
```

### Modify Game Fields

1. Add column to Supabase table
2. Update GameForm.jsx (add input)
3. Update GameCard.jsx (display)

### Change Styling

All styling uses Tailwind CSS. Modify classes in component files or:
```javascript
// Add custom styles in index.css
@layer components {
  .custom-class {
    @apply px-4 py-2 rounded-lg;
  }
}
```

---

## 🐛 Troubleshooting

### Can't connect to Supabase?
- Check `.env.local` has correct URL and keys
- Verify Supabase project is running
- Check browser console for errors

### Changes not appearing?
- Clear browser cache (Ctrl+Shift+Delete)
- Check network tab in DevTools
- Verify data exists in Supabase dashboard

### Admin code not working?
- Make sure you're using the code you set in `BoardGameApp.jsx`
- Check browser console for errors

### Public link shows no games?
- Verify games are in database
- Check Row Level Security policies in Supabase
- Ensure public read policy is enabled

---

## 📱 Responsive Design

App is fully responsive:
- **Mobile:** Single column layout
- **Tablet:** 2-column grid
- **Desktop:** 3-column grid

---

## 🚢 Production Checklist

- [ ] Change admin code to something secure
- [ ] Set up proper authentication (not hardcoded code)
- [ ] Add SSL certificate (free with Vercel/Netlify)
- [ ] Enable CORS in Supabase if needed
- [ ] Test public sharing link thoroughly
- [ ] Set up analytics/monitoring
- [ ] Create admin/user documentation
- [ ] Plan backup strategy for Supabase data

---

## 📚 Dependencies

```json
{
  "react": "^18.2.0",
  "lucide-react": "^0.263.0",
  "@supabase/supabase-js": "^2.26.0"
}
```

All included in `package.json`

---

## 💡 Tips

1. **Bulk Import Games:** Write a script to insert multiple games at once
2. **Game Images:** Add image_url field to Supabase and display in GameCard
3. **Reviews:** Add review table for customer ratings
4. **Availability:** Track game availability (available/rented/under maintenance)
5. **Analytics:** Track which games are most popular searches
6. **Booking System:** Allow customers to book games in advance

---

## 📞 Support

For Supabase issues: [docs.supabase.com](https://docs.supabase.com)
For React issues: [react.dev](https://react.dev)

---

## 📄 License

MIT License - Feel free to use and modify for your café!
