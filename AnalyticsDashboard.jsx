import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Star, Calendar, Target, Clock } from 'lucide-react';
import supabase from '../lib/supabaseClient';

export default function AnalyticsDashboard() {
  const [stats, setStats] = useState({
    totalGames: 0,
    totalReviews: 0,
    totalBookings: 0,
    averageRating: 0,
    topRatedGame: null,
    mostBookedGame: null,
    upcomingBookingsCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      // Get total games
      const { data: games } = await supabase
        .from('board_games')
        .select('count', { count: 'exact' });

      // Get review stats
      const { data: reviews } = await supabase
        .from('game_reviews')
        .select('*');

      // Get booking stats
      const { data: bookings } = await supabase
        .from('game_bookings')
        .select('*')
        .eq('status', 'confirmed');

      // Get top rated game
      const { data: topGames } = await supabase
        .from('game_reviews')
        .select('game_id, rating')
        .order('rating', { ascending: false })
        .limit(1);

      // Get most booked game
      const { data: mostBookedData } = await supabase
        .from('game_bookings')
        .select('game_id')
        .eq('status', 'confirmed');

      // Get upcoming bookings
      const today = new Date().toISOString().split('T')[0];
      const { data: upcomingBookings } = await supabase
        .from('game_bookings')
        .select('count', { count: 'exact' })
        .eq('status', 'pending');

      // Calculate stats
      const avgRating = reviews && reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(2)
        : 0;

      // Find most booked game
      let mostBooked = null;
      if (mostBookedData && mostBookedData.length > 0) {
        const gameBookingCounts = mostBookedData.reduce((acc, b) => {
          acc[b.game_id] = (acc[b.game_id] || 0) + 1;
          return acc;
        }, {});
        const mostBookedGameId = Object.keys(gameBookingCounts).sort(
          (a, b) => gameBookingCounts[b] - gameBookingCounts[a]
        )[0];
        
        if (mostBookedGameId) {
          const { data: gameData } = await supabase
            .from('board_games')
            .select('name')
            .eq('id', mostBookedGameId)
            .single();
          mostBooked = gameData;
        }
      }

      // Find top rated game
      let topRated = null;
      if (topGames && topGames.length > 0) {
        const { data: gameData } = await supabase
          .from('board_games')
          .select('name')
          .eq('id', topGames[0].game_id)
          .single();
        topRated = gameData;
      }

      setStats({
        totalGames: games?.[0]?.count || 0,
        totalReviews: reviews?.length || 0,
        totalBookings: bookings?.length || 0,
        averageRating: avgRating,
        topRatedGame: topRated?.name,
        mostBookedGame: mostBooked?.name,
        upcomingBookingsCount: upcomingBookings?.[0]?.count || 0,
      });

      // Fetch recent activity
      const { data: recentReviews } = await supabase
        .from('game_reviews')
        .select('id, customer_name, game_id, rating, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      const { data: recentBookings } = await supabase
        .from('game_bookings')
        .select('id, customer_name, game_id, booking_date, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      // Merge and sort activities
      const activities = [
        ...(recentReviews?.map(r => ({
          type: 'review',
          id: r.id,
          text: `${r.customer_name} reviewed a game ⭐ ${r.rating}`,
          timestamp: r.created_at,
        })) || []),
        ...(recentBookings?.map(b => ({
          type: 'booking',
          id: b.id,
          text: `${b.customer_name} made a booking for ${b.booking_date}`,
          timestamp: b.created_at,
        })) || []),
      ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 10);

      setRecentActivity(activities);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, label, value, trend, color }) => (
    <div className={`bg-white rounded-lg shadow-sm border border-slate-200 p-6 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-600 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{value}</p>
          {trend && (
            <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> {trend}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color === 'bg-blue-50' ? 'bg-blue-100' : color === 'bg-green-50' ? 'bg-green-100' : color === 'bg-purple-50' ? 'bg-purple-100' : 'bg-yellow-100'}`}>
          <Icon className={`w-6 h-6 ${
            color === 'bg-blue-50' ? 'text-blue-600' : 
            color === 'bg-green-50' ? 'text-green-600' : 
            color === 'bg-purple-50' ? 'text-purple-600' : 
            'text-yellow-600'
          }`} />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        <p className="text-slate-600 mt-4">Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Analytics Dashboard</h2>
        <p className="text-slate-600 mt-1">Overview of your board game café</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          icon={Target}
          label="Total Games"
          value={stats.totalGames}
          color="bg-blue-50"
        />
        <StatCard
          icon={Star}
          label="Total Reviews"
          value={stats.totalReviews}
          color="bg-purple-50"
        />
        <StatCard
          icon={Calendar}
          label="Total Bookings"
          value={stats.totalBookings}
          color="bg-green-50"
        />
        <StatCard
          icon={Star}
          label="Average Rating"
          value={stats.averageRating}
          color="bg-yellow-50"
        />
        <StatCard
          icon={Clock}
          label="Pending Bookings"
          value={stats.upcomingBookingsCount}
          color="bg-orange-50"
        />
        <StatCard
          icon={Users}
          label="Customer Engagement"
          value={`${((stats.totalReviews + stats.totalBookings) / Math.max(stats.totalGames, 1)).toFixed(1)}x`}
          color="bg-pink-50"
        />
      </div>

      {/* Key Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Top Performers</h3>
          <div className="space-y-4">
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <p className="text-sm font-medium text-slate-600">Most Rated Game</p>
              <p className="text-xl font-bold text-slate-900 mt-2">
                {stats.topRatedGame || 'No ratings yet'}
              </p>
              <div className="flex gap-1 mt-2">
                {[1, 2, 3, 4, 5].map(i => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </div>

            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm font-medium text-slate-600">Most Booked Game</p>
              <p className="text-xl font-bold text-slate-900 mt-2">
                {stats.mostBookedGame || 'No bookings yet'}
              </p>
              <p className="text-sm text-slate-600 mt-2">Most requested by customers</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.length === 0 ? (
              <p className="text-slate-600 text-center py-4">No recent activity</p>
            ) : (
              recentActivity.map(activity => (
                <div
                  key={activity.id}
                  className={`p-3 rounded-lg border ${
                    activity.type === 'review'
                      ? 'bg-purple-50 border-purple-200'
                      : 'bg-blue-50 border-blue-200'
                  }`}
                >
                  <p className="text-sm font-medium text-slate-900">{activity.text}</p>
                  <p className="text-xs text-slate-600 mt-1">
                    {new Date(activity.timestamp).toLocaleDateString()} {new Date(activity.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Quick Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-slate-600">Average Reviews per Game</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">
              {stats.totalGames > 0 ? (stats.totalReviews / stats.totalGames).toFixed(1) : 0}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Average Bookings per Game</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">
              {stats.totalGames > 0 ? (stats.totalBookings / stats.totalGames).toFixed(1) : 0}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Booking Conversion Rate</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">
              {stats.totalReviews > 0 ? ((stats.totalBookings / (stats.totalReviews + stats.totalBookings)) * 100).toFixed(1) : 0}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
