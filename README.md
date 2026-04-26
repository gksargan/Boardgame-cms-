# 🎲 BoardGame Café - Complete Inventory System

A **full-featured board game café management platform** built with React, Supabase, and Tailwind CSS. Manage your inventory, track bookings, handle reviews, and share your catalog with customers.

## ✨ Features

### 📊 **Admin Dashboard**
- **Analytics Dashboard** - Real-time metrics, charts, and insights
- **Game Library Management** - Full CRUD operations for games
- **Booking Manager** - Track and confirm customer reservations
- **Review Manager** - Moderate customer reviews and ratings
- **Inventory Control** - Mark games available/unavailable

### 🎮 **Game Management**
- Complete game details (name, description, players, time, difficulty, theme)
- Rental pricing and condition tracking
- Multiple images per game
- Search and advanced filtering
- Sort by name, player count, or playtime

### 📅 **Booking System**
- Customers can book games with dates and times
- Duration selection (1-6 hours)
- Real-time availability checking
- Automatic pricing calculation
- Admin confirmation workflow
- Booking history and statistics

### ⭐ **Review System**
- 5-star rating system
- Customer reviews with comments
- Rating distribution charts
- Most-rated game tracking
- Review moderation tools

### 🔗 **Public Sharing**
- Shareable read-only catalog link
- Customer-friendly interface
- All filtering and search capabilities
- View ratings and reviews
- Make bookings directly
- No admin login required

### 📈 **Analytics & Insights**
- Total games, reviews, bookings
- Average ratings and trends
- Most booked games
- Customer engagement metrics
- Recent activity feed
- Review distribution graphs

## 🚀 Quick Start (5 minutes)

### 1. Create Supabase Project
```bash
# Go to supabase.com, create account, create new project
```

### 2. Set Up Database
Copy the SQL from `EXTENDED_SCHEMA.sql` and run it in Supabase SQL Editor.

### 3. Get API Keys
In Supabase **Settings → API**, copy:
- Project URL
- Anon Public Key

### 4. Clone & Install
```bash
git clone <your-repo>
cd boardgame-cafe-app
npm install
```

### 5. Configure
```bash
# Create .env.local
echo "VITE_SUPABASE_URL=https://your-project.supabase.co" > .env.local
echo "VITE_SUPABASE_ANON_KEY=your-key" >> .env.local
```

### 6. Run
```bash
npm run dev
# Visit http://localhost:5173
# Admin Code: ADMIN123
```

## 📁 Project Structure

```
src/
├── BoardGameApp.jsx              # Main app & routing
├── components/
│   ├── AdminPanel.jsx            # Tabbed admin dashboard
│   ├── AnalyticsDashboard.jsx   # Analytics & metrics
│   ├── BookingsManager.jsx       # Booking management
│   ├── ReviewsManager.jsx        # Review moderation
│   ├── GameForm.jsx              # Add/edit game form
│   ├── GameCard.jsx              # Game display card
│   ├── GameImageGallery.jsx      # Image uploads
│   ├── GameReviews.jsx           # Review submission & display
│   ├── GameBooking.jsx           # Booking interface
│   └── PublicView.jsx            # Public catalog
└── lib/
    └── supabaseClient.js         # Supabase config

Configuration Files:
├── vite.config.js               # Build config
├── tailwind.config.js           # Styling
├── postcss.config.js            # CSS processing
├── package.json                 # Dependencies
├── .env.example                 # Env template
└── EXTENDED_SCHEMA.sql          # Database setup
```

## 📊 Database Schema

### Tables Created:
- **board_games** - Game inventory
- **game_images** - Multiple images per game
- **game_reviews** - Customer ratings & comments
- **game_bookings** - Game reservations
- **game_stats** - Pre-computed statistics

## 🔐 Security

### Current Implementation (Development)
- Simple admin code (change "ADMIN123")
- Public read access to games
- Anyone can leave reviews and make bookings

### Production Best Practices
1. **Use Supabase Auth**
```javascript
const { data, error } = await supabase.auth.signInWithPassword({
  email: admin@example.com,
  password: 'secure-password'
});
```

2. **Enable Row-Level Security (RLS)**
```sql
CREATE POLICY "Only authenticated admins can edit"
  ON board_games FOR UPDATE
  USING (auth.role() = 'admin');
```

3. **Verify Email Addresses**
```javascript
// Add email verification before booking confirmation
```

4. **Rate Limiting**
```javascript
// Limit reviews/bookings per IP to prevent spam
```

## 🎨 Customization

### Change Admin Code
**BoardGameApp.jsx:**
```javascript
const ADMIN_CODE = 'YOUR_SECRET_CODE';
```

### Add Game Categories
**GameForm.jsx:**
```javascript
const GAME_THEMES = [
  'Fantasy', 'Sci-Fi', 'Mystery', 'Your Theme'
];
```

### Modify Price Currency
**GameBooking.jsx & GameCard.jsx:**
```javascript
// Change ₹ to $ or other currency
<span>₹{price}</span>
```

### Customize Colors
**tailwind.config.js:**
```javascript
colors: {
  primary: '#your-color',
  secondary: '#your-color'
}
```

## 📱 Responsive Design

- **Mobile** (< 768px) - Single column layout
- **Tablet** (768px - 1024px) - 2 column layout
- **Desktop** (> 1024px) - 3 column layout

## 🌐 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
# Add env vars in dashboard
```

### Netlify
1. Push to GitHub
2. Connect repo in Netlify
3. Add env vars
4. Deploy automatically

### Self-Hosted
```bash
npm run build
# Upload dist/ folder to your server
```

## 📚 API Features

### Games
```javascript
// Create
await supabase.from('board_games').insert([gameData]);

// Read
await supabase.from('board_games').select('*');

// Update
await supabase.from('board_games').update(gameData).eq('id', gameId);

// Delete
await supabase.from('board_games').delete().eq('id', gameId);
```

### Reviews
```javascript
// Submit review
await supabase.from('game_reviews').insert([{
  game_id, customer_name, rating, comment
}]);

// Get reviews with stats
const { data } = await supabase
  .from('game_reviews')
  .select('*')
  .eq('game_id', gameId);
```

### Bookings
```javascript
// Create booking
await supabase.from('game_bookings').insert([{
  game_id, customer_name, booking_date, 
  booking_time, duration_hours, status
}]);

// Get upcoming bookings
const { data } = await supabase
  .from('game_bookings')
  .select('*')
  .eq('status', 'confirmed')
  .gte('booking_date', today);
```

## 🛠️ Advanced Features

### Image Upload (Supabase Storage)
To enable real image uploads to Supabase:

```javascript
// In GameImageGallery.jsx
const { data } = await supabase.storage
  .from('game-images')
  .upload(`${gameId}/${file.name}`, file);
```

### Email Notifications
Integrate SendGrid or similar:
```javascript
// Send confirmation email when booking is confirmed
await sendEmail({
  to: booking.customer_email,
  subject: `Booking Confirmed: ${gameName}`,
  template: 'booking-confirmation'
});
```

### SMS Reminders
Integrate Twilio:
```javascript
// Send reminder 24 hours before booking
await twilioClient.messages.create({
  to: booking.customer_phone,
  from: '+1234567890',
  body: `Reminder: Your game booking is tomorrow at ${booking.booking_time}`
});
```

### Payment Integration
Add Stripe/Razorpay:
```javascript
// Calculate payment amount based on booking duration
const amount = gamePrice * booking.duration_hours;
await stripeClient.charges.create({
  amount: amount * 100,
  currency: 'inr',
  source: paymentToken
});
```

## 📊 Analytics Insights

The dashboard shows:
- **Total Games** - Total inventory count
- **Total Reviews** - Customer feedback count
- **Total Bookings** - Confirmed reservations
- **Average Rating** - Overall game quality score
- **Pending Bookings** - Awaiting confirmation
- **Customer Engagement** - Reviews + Bookings per game
- **Top Performers** - Most rated/booked games
- **Recent Activity** - Latest reviews and bookings

## 🐛 Troubleshooting

### Database connection fails
```
✗ Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
✗ Verify Supabase project is running
✗ Check browser console for detailed errors
```

### Images not uploading
```
✗ Enable RLS on game_images table
✗ Create storage bucket named 'game-images'
✗ Check browser file size limits (typically 5MB)
```

### Bookings not appearing
```
✗ Verify game_bookings table exists
✗ Check RLS policies allow INSERT
✗ Look for SQL errors in Supabase logs
```

## 🚢 Production Checklist

- [ ] Change admin code
- [ ] Enable production authentication
- [ ] Set up email notifications
- [ ] Configure backups in Supabase
- [ ] Add SSL certificate
- [ ] Test payment integration (if using)
- [ ] Set up monitoring/analytics
- [ ] Create admin documentation
- [ ] Test mobile responsiveness
- [ ] Set up error logging (Sentry)

## 📖 Documentation

- **Setup Guide**: See `SETUP_GUIDE.md`
- **Database Schema**: See `EXTENDED_SCHEMA.sql`
- **Supabase Docs**: https://supabase.com/docs
- **React Docs**: https://react.dev

## 💡 Future Enhancements

- [ ] Multiplayer game sessions
- [ ] Customer loyalty program
- [ ] Automatic email/SMS notifications
- [ ] Payment gateway integration
- [ ] Staff scheduling system
- [ ] Inventory tracking with QR codes
- [ ] Mobile app with React Native
- [ ] Tournament organization tools
- [ ] Social features (wishlists, friend matching)
- [ ] Analytics export (CSV/PDF)

## 📞 Support

- **Issues**: Create GitHub issue
- **Supabase Help**: https://supabase.com/docs
- **React Help**: https://react.dev/community

## 📄 License

MIT - Feel free to use and modify!

---

**Made with ❤️ for board game enthusiasts** 🎲
