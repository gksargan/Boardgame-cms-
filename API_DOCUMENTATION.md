# BoardGame Café API Documentation

## Overview

This document describes how to interact with the BoardGame Café application programmatically.

---

## Authentication

### Admin Access
- Protected by admin code (default: `ADMIN123`)
- Stored in localStorage as `boardGameAdminCode`
- No API tokens - frontend handles all auth

### Public Access
- No authentication required
- Read-only access to board_games table
- Accessible via Supabase public policy

---

## Database Structure

### Games Table: `board_games`

```typescript
interface Game {
  id: string;                  // UUID primary key
  name: string;                // Game title (required)
  description: string;         // Game description (required)
  min_players: number;         // Minimum player count (default: 2)
  max_players: number;         // Maximum player count (default: 4)
  playing_time: number;        // Duration in minutes (default: 30)
  difficulty: 'Easy' | 'Medium' | 'Hard';  // Difficulty level
  theme: string | null;        // Game theme/category
  price: number;               // Rental price in ₹ (default: 0)
  condition: 'Like New' | 'Good' | 'Fair' | 'Needs Repair';  // Condition
  created_at: string;          // ISO 8601 timestamp
  updated_at: string;          // ISO 8601 timestamp
}
```

---

## Supabase Client Usage

### Initialize Client

```javascript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://your-project.supabase.co',
  'your-anon-key'
);
```

### Query Operations

#### Get All Games
```javascript
const { data, error } = await supabase
  .from('board_games')
  .select('*')
  .order('name', { ascending: true });
```

#### Get Single Game
```javascript
const { data, error } = await supabase
  .from('board_games')
  .select('*')
  .eq('id', gameId)
  .single();
```

#### Search Games
```javascript
const { data, error } = await supabase
  .from('board_games')
  .select('*')
  .ilike('name', `%${searchTerm}%`)
  .or(`description.ilike.%${searchTerm}%`);
```

#### Filter by Difficulty
```javascript
const { data, error } = await supabase
  .from('board_games')
  .select('*')
  .eq('difficulty', 'Medium');
```

#### Get by Theme
```javascript
const { data, error } = await supabase
  .from('board_games')
  .select('*')
  .eq('theme', 'Fantasy')
  .order('name');
```

#### Filter by Player Count
```javascript
const { data, error } = await supabase
  .from('board_games')
  .select('*')
  .gte('max_players', playerCount)
  .lte('min_players', playerCount);
```

---

## Mutation Operations

### Create Game
```javascript
const { data, error } = await supabase
  .from('board_games')
  .insert([{
    name: 'Catan',
    description: 'Build settlements...',
    min_players: 2,
    max_players: 4,
    playing_time: 60,
    difficulty: 'Medium',
    theme: 'Strategy',
    price: 500,
    condition: 'Good'
  }])
  .select();
```

### Update Game
```javascript
const { data, error } = await supabase
  .from('board_games')
  .update({
    name: 'Updated Name',
    price: 600,
    updated_at: new Date().toISOString()
  })
  .eq('id', gameId)
  .select();
```

### Delete Game
```javascript
const { error } = await supabase
  .from('board_games')
  .delete()
  .eq('id', gameId);
```

### Bulk Insert
```javascript
const games = [
  { name: 'Game 1', ... },
  { name: 'Game 2', ... },
  { name: 'Game 3', ... }
];

const { data, error } = await supabase
  .from('board_games')
  .insert(games)
  .select();
```

### Bulk Delete
```javascript
const { error } = await supabase
  .from('board_games')
  .delete()
  .in('id', [id1, id2, id3]);
```

---

## Aggregation Queries

### Count Total Games
```javascript
const { count, error } = await supabase
  .from('board_games')
  .select('*', { count: 'exact', head: true });
```

### Get Statistics
```javascript
const { data, error } = await supabase
  .from('board_games')
  .select('difficulty, COUNT(*) as count')
  .group('difficulty');
```

### Calculate Averages
```javascript
const { data, error } = await supabase
  .from('board_games')
  .select(`
    AVG(playing_time) as avg_time,
    AVG(price) as avg_price,
    COUNT(*) as total
  `);
```

---

## Real-time Subscriptions

### Listen for Changes
```javascript
const subscription = supabase
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'board_games'
    },
    (payload) => {
      console.log('Change received!', payload);
      // Handle: INSERT, UPDATE, DELETE
    }
  )
  .subscribe();

// Cleanup
subscription.unsubscribe();
```

---

## Error Handling

### Standard Error Pattern
```javascript
try {
  const { data, error } = await supabase
    .from('board_games')
    .select('*');
  
  if (error) {
    console.error('Supabase error:', error.message);
    // Handle error
  }
  
  console.log('Data:', data);
} catch (err) {
  console.error('Network error:', err);
}
```

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `No rows found` | Invalid ID | Check ID exists |
| `Permission denied` | RLS policy | Check Supabase policies |
| `Invalid column` | Typo in query | Verify column names |
| `Network error` | Connection issue | Check internet, Supabase status |

---

## CSV Export/Import

### Export to CSV
```javascript
function exportGames(games) {
  const headers = ['name', 'description', 'min_players', 'max_players', 'playing_time', 'difficulty', 'theme', 'price', 'condition'];
  
  const csv = [
    headers.join(','),
    ...games.map(g => 
      headers.map(h => `"${g[h] || ''}"`).join(',')
    )
  ].join('\n');
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `games_${Date.now()}.csv`;
  a.click();
}
```

### Import from CSV
```javascript
function parseCSV(csvText) {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',');
  
  return lines.slice(1).map(line => {
    const values = line.split(',');
    const obj = {};
    headers.forEach((h, i) => {
      obj[h.trim()] = values[i]?.trim().replace(/^"|"$/g, '');
    });
    return obj;
  });
}
```

---

## Rate Limiting

Supabase free tier limits:
- **Reads:** 50,000 per month
- **Writes:** 50,000 per month
- **Concurrent connections:** 10

For high-traffic sites, upgrade plan.

---

## Best Practices

1. **Always validate data** on both client and server
2. **Use parameterized queries** to prevent SQL injection
3. **Implement error handling** for all API calls
4. **Cache data** when possible to reduce API calls
5. **Use pagination** for large datasets
6. **Monitor Supabase usage** in dashboard
7. **Secure API keys** in environment variables
8. **Test with realistic data** before production

---

## Environment Variables

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Never commit `.env.local` to version control!

---

## Webhook Integration (Advanced)

### Supabase Database Webhooks

To send game changes to external systems:

1. Go to Supabase Dashboard
2. Database → Webhooks
3. Create webhook for `board_games` table
4. Set HTTP endpoint: `https://your-api.com/webhooks/games`
5. Select events: INSERT, UPDATE, DELETE

Example webhook payload:
```json
{
  "type": "INSERT",
  "table": "board_games",
  "record": {
    "id": "uuid",
    "name": "Game Name",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

---

## Troubleshooting

### Games Not Appearing
- Check RLS policy allows SELECT
- Verify data exists in Supabase dashboard
- Check browser console for errors

### Insert Fails
- Verify required fields (name, description)
- Check data types match schema
- Ensure min_players < max_players
- Verify playing_time > 0

### Real-time Updates Not Working
- Check WebSocket connection in DevTools
- Verify Realtime enabled in Supabase
- Check subscription syntax

---

## Additional Resources

- **Supabase JavaScript Client:** https://supabase.com/docs/reference/javascript
- **Supabase SQL:** https://supabase.com/docs/guides/database
- **Supabase Realtime:** https://supabase.com/docs/guides/realtime
- **REST API:** https://supabase.com/docs/guides/api

---

**Last Updated:** April 2024
