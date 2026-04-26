# BoardGame Café - Feature Guide

Complete guide to using every feature of the app.

## 🎮 Admin Panel

### Games Library Tab
**Manage your board game inventory**

#### Adding a Game
1. Click "Add Game" button
2. Fill in all details:
   - **Game Name** - Unique identifier (e.g., "Catan")
   - **Description** - What makes it special (gameplay, theme, etc.)
   - **Min/Max Players** - Range of player counts
   - **Playing Time** - Average duration in minutes
   - **Difficulty** - Easy/Medium/Hard
   - **Theme** - Category (Fantasy, Sci-Fi, etc.)
   - **Rental Price** - Cost per hour in ₹
   - **Condition** - Like New/Good/Fair/Needs Repair
3. Click "Add Game"

#### Editing a Game
1. Click the blue edit icon on any game card
2. Modify any fields
3. Click "Update Game"

#### Deleting a Game
1. Click the red trash icon on game card
2. Confirm deletion
3. Game is removed from all bookings and reviews

#### Searching Games
- Type in search box to filter by:
  - Game name
  - Description content
  - Theme

#### Filtering Games
- **By Difficulty** - Show only Easy/Medium/Hard games
- **By Sort** - Alphabetical, player count, or duration

#### Adding Images
1. Games come with placeholder images by default
2. Click on a game to edit
3. Scroll to "Game Images" section
4. Click upload area to add photos
5. Mark one as "Primary" (shows on card)
6. Delete unused images

---

### Analytics Tab
**Understand your business metrics**

#### Key Metrics Displayed:
- **Total Games** - How many games in inventory
- **Total Reviews** - How many customer ratings
- **Total Bookings** - How many confirmed reservations
- **Average Rating** - Overall customer satisfaction (1-5)
- **Pending Bookings** - Awaiting your confirmation
- **Customer Engagement** - Activity ratio

#### Top Performers
- **Most Rated Game** - Game with highest ratings
- **Most Booked Game** - Most popular/in-demand game

#### Recent Activity
- Real-time feed of customer actions
- Reviews and bookings as they happen

#### Quick Insights
- Average reviews per game
- Average bookings per game
- Booking conversion rate (how many lead to bookings)

**Use for:**
- Identifying popular games to order more copies
- Finding underperforming games to improve
- Understanding customer preferences
- Planning promotions

---

### Bookings Tab
**Manage customer game reservations**

#### Filtering Bookings
- **All** - Show all bookings
- **Pending** - Not yet confirmed (action needed)
- **Confirmed** - Ready for customer
- **Cancelled** - Cancelled bookings

#### For Each Booking You See:
- Customer name, email, phone
- Booking date
- Time and duration
- Current status
- Customer notes

#### Actions
- **Confirm** - Approve pending booking (send confirmation)
- **Cancel** - Reject or cancel booking
- **Delete** - Remove from system

#### Best Practices:
1. Check daily for pending bookings
2. Confirm within 24 hours
3. Contact customer to finalize details
4. Send reminder 24 hours before

---

### Reviews Tab
**Monitor and manage customer feedback**

#### Statistics
- **Total Reviews** - Number of reviews received
- **Average Rating** - Overall customer satisfaction
- **Rating Distribution** - Chart of 1-5 star breakdown

#### Filtering & Search
- Search by customer name or comment content
- Filter by specific rating (5 stars, 4 stars, etc.)

#### Review Details Shown:
- Customer name and email
- Star rating
- Review comment
- Date submitted
- Quality rating (Good/Fair/Bad)

#### Actions
- **Delete** - Remove inappropriate reviews

#### Best Practices:
1. Respond to low ratings (ask how to improve)
2. Thank customers for positive reviews
3. Remove offensive or spam reviews
4. Use feedback to improve game condition

---

## 👥 Public Features

### Public Catalog View
**What customers see (no admin login required)**

#### Statistics Dashboard
- Total games available
- Average player count
- Average play time

#### Search & Filter
- **Search Box** - Find by game name or description
- **Difficulty Filter** - Easy/Medium/Hard games
- **Theme Filter** - By category (Fantasy, Sci-Fi, etc.)
- **Sort Options** - By name, players, or time

#### Game Cards Display:
- Game image
- Name and description
- Player count range
- Playing time
- Difficulty badge
- Price (if rental enabled)
- Condition status

#### Game Details (Click Card):
- Full description
- Complete game stats
- **Star Ratings** - Average customer rating
- **Recent Reviews** - Customer feedback
- **Leave Review** - Submit own review
- **Book Game** - Make reservation

---

## 📅 Booking System (Customer View)

### Making a Booking

#### 1. Find Game & Click "Make a Booking"

#### 2. Fill Booking Form:
- **Your Name** (required)
- **Email** (required)
- **Phone** (required)
- **Booking Date** (tomorrow to 30 days ahead)
- **Time** (default 6 PM)
- **Duration** (1-6 hours)
- **Notes** (optional)

#### 3. See Automatic Price Calculation:
```
₹50 × 2 hours = ₹100
```

#### 4. Click "Confirm Booking"

#### Booking Status:
- **Pending** - Awaiting admin confirmation
- **Confirmed** - Ready to go! (you'll get confirmation email)
- **Cancelled** - Booking rejected

#### Upcoming Bookings:
- Shows next 5 confirmed bookings for that game
- Helps customers see availability

---

## ⭐ Review System (Customer View)

### Leaving a Review

#### 1. Scroll to "Customer Reviews" Section

#### 2. Click "Leave Review" Button

#### 3. Fill Review Form:
- **Your Name** (required)
- **Email** (optional - for follow-up)
- **Rating** (1-5 stars, click to select)
- **Review Comment** (required, min 1 word)

#### 4. Submit Review

#### View All Reviews:
- See star rating
- Read customer comments
- View submission date
- See rating distribution chart

#### Rating Impact:
- Affects "Average Rating" on card
- Influences search ranking
- Shows in admin analytics
- Helps other customers decide

---

## 🔐 Admin Features

### Admin Login
1. Enter page - see login screen
2. Enter admin code (default: ADMIN123)
3. Click "Enter Admin Portal"
4. Access full admin panel

### Generate Share Link
1. Click "Generate Share Link" in header
2. Link appears in green box
3. Click copy button
4. Share with customers
5. Updates automatically when you add games

### Logout
1. Click "Logout" button
2. Returns to login screen
3. All admin session ends

---

## 🎯 Workflow Examples

### Daily Operations

**Morning:**
1. Open admin panel
2. Check Analytics - see previous day stats
3. Go to Bookings - confirm any pending bookings
4. Send confirmation emails to customers
5. Update game conditions if needed

**Before Operating Hours:**
1. Check upcoming bookings for today
2. Ensure games are in good condition
3. Verify customer details

**After Customer Visits:**
1. Update game condition if issues found
2. Check for new reviews (good way to thank customers)
3. Note popular games for ordering

### Adding New Games

**Process:**
1. Go to Games Library
2. Click "Add Game"
3. Fill all details from box/rules
4. Add 3-5 photos
5. Set realistic rental price
6. Save game
7. Done! Available for customers

### Managing Bookings

**Confirmation Workflow:**
1. Check Bookings tab
2. See all pending bookings
3. Call/email customer to confirm details
4. Click "Confirm" when ready
5. System sends confirmation email
6. Game reserved for that customer

### Handling Reviews

**Responding to Reviews:**
1. See new reviews in Reviews tab
2. For 5-star reviews: Add to "Thank you" email
3. For 1-2 star reviews: Contact customer, ask what went wrong, fix issue
4. Delete only spam/inappropriate reviews
5. Use feedback to improve

---

## 💡 Pro Tips

### Increase Bookings
- Add high-quality photos of all games
- Write detailed, appealing descriptions
- Keep condition status updated
- Respond quickly to bookings
- Offer themed game nights

### Build 5-Star Ratings
- Keep games in excellent condition
- Include game rules/manual in rental
- Offer quick replacement if parts missing
- Create cozy playing space
- Ask satisfied customers to review

### Popular Games
- Track "Most Booked" in Analytics
- Stock multiple copies of popular games
- Feature them prominently
- Bundle with complementary games
- Price competitively

### Less Popular Games
- Check reviews - fix quality issues
- Improve description with better photos
- Consider bundling with popular games
- Offer special discounts
- Host themed events to showcase them

### Customer Communication
- Respond to bookings within 1 hour
- Send reminder 24 hours before booking
- Follow up after with thank you + review request
- Address negative reviews promptly
- Personalize interactions

---

## 📊 Understanding Analytics

### Booking Conversion Rate
- Shows: (Bookings ÷ Total Activity) × 100
- Higher = customers prefer booking over just viewing
- Target: >30%

### Average Ratings
- Shows customer satisfaction
- <3 stars = quality issues
- 3-4 stars = good, room to improve
- >4 stars = excellent

### Review Count Per Game
- High = popular/visible
- Low = needs marketing
- No reviews = new game

### Most Booked Game
- Indicates customer preferences
- Stock more copies if possible
- Potential for premium pricing
- Great game to feature in marketing

---

## 🔧 Troubleshooting

### Booking Doesn't Appear
- Check status is "confirmed" (not pending)
- Verify booking date is in future
- Check if you cancelled it

### Review Not Showing
- Wait a few seconds for page refresh
- Check you submitted form correctly
- Admin may have deleted if inappropriate

### Image Upload Fails
- Check file size < 5MB
- Use common formats (JPG, PNG)
- Try different browser
- Check internet connection

### Price Not Calculating
- Ensure rental price is set (> 0)
- Check duration is selected
- Reload page if glitches

---

## 📈 Getting Started Checklist

- [ ] Create Supabase account & project
- [ ] Run SQL schema in Supabase
- [ ] Add your API keys to .env.local
- [ ] Add 5-10 games to inventory
- [ ] Add photos to all games
- [ ] Set realistic rental prices
- [ ] Generate and test share link
- [ ] Make a test booking as customer
- [ ] Leave a test review
- [ ] Check Analytics dashboard
- [ ] Share link with first customers!

---

Happy managing! 🎲
