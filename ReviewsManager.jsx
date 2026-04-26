import React, { useState, useEffect } from 'react';
import { Star, User, Trash2, MessageSquare, Filter } from 'lucide-react';
import supabase from '../lib/supabaseClient';

export default function ReviewsManager() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, 5, 4, 3, 2, 1
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchReviews();
  }, [filter]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('game_reviews')
        .select('*');

      if (filter !== 'all') {
        query = query.eq('rating', parseInt(filter));
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteReview = async (reviewId) => {
    if (!window.confirm('Delete this review?')) return;

    try {
      const { error } = await supabase
        .from('game_reviews')
        .delete()
        .eq('id', reviewId);

      if (error) throw error;
      fetchReviews();
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  const filteredReviews = reviews.filter(review =>
    review.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.comment.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const RatingStars = ({ rating }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= rating
              ? 'fill-yellow-400 text-yellow-400'
              : 'text-slate-300'
          }`}
        />
      ))}
    </div>
  );

  // Statistics
  const stats = {
    total: reviews.length,
    avgRating: reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : 0,
    distribution: {
      5: reviews.filter(r => r.rating === 5).length,
      4: reviews.filter(r => r.rating === 4).length,
      3: reviews.filter(r => r.rating === 3).length,
      2: reviews.filter(r => r.rating === 2).length,
      1: reviews.filter(r => r.rating === 1).length,
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Reviews Manager</h2>
        <p className="text-slate-600 mt-1">Moderate and manage customer reviews</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <p className="text-sm text-slate-600">Total Reviews</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <p className="text-sm text-slate-600">Average Rating</p>
          <div className="mt-2">
            <p className="text-3xl font-bold text-slate-900">{stats.avgRating}</p>
            <RatingStars rating={Math.round(stats.avgRating)} />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <p className="text-sm text-slate-600 mb-3">Rating Distribution</p>
          <div className="space-y-1">
            {[5, 4, 3, 2, 1].map(rating => (
              <div key={rating} className="flex items-center gap-2">
                <span className="text-xs text-slate-600 w-4">{rating}★</span>
                <div className="flex-1 h-2 bg-slate-200 rounded">
                  <div
                    className="h-2 bg-yellow-400 rounded transition-all"
                    style={{ width: `${stats.total > 0 ? (stats.distribution[rating] / stats.total) * 100 : 0}%` }}
                  ></div>
                </div>
                <span className="text-xs text-slate-600 w-6">{stats.distribution[rating]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name or comment..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
          />
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
        >
          <option value="all">All Ratings</option>
          <option value="5">5 Stars</option>
          <option value="4">4 Stars</option>
          <option value="3">3 Stars</option>
          <option value="2">2 Stars</option>
          <option value="1">1 Star</option>
        </select>
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          <p className="text-slate-600 mt-4">Loading reviews...</p>
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
          <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600 text-lg">No reviews found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map(review => (
            <div
              key={review.id}
              className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <User className="w-5 h-5 text-slate-600" />
                    <div>
                      <p className="font-semibold text-slate-900">{review.customer_name}</p>
                      <p className="text-xs text-slate-500">{review.customer_email}</p>
                    </div>
                  </div>
                  <RatingStars rating={review.rating} />
                </div>

                <button
                  onClick={() => deleteReview(review.id)}
                  className="p-2 hover:bg-red-100 rounded-lg transition text-red-500 hover:text-red-600"
                  title="Delete review"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <p className="text-slate-700 mb-3 leading-relaxed">{review.comment}</p>

              <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                <p className="text-xs text-slate-500">
                  {new Date(review.created_at).toLocaleDateString()} {new Date(review.created_at).toLocaleTimeString()}
                </p>
                <div className="flex items-center gap-1">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    review.rating >= 4
                      ? 'bg-green-100 text-green-800'
                      : review.rating === 3
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {review.rating} of 5
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
