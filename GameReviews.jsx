import React, { useState, useEffect } from 'react';
import { Star, MessageCircle, Send, Trash2 } from 'lucide-react';
import supabase from '../lib/supabaseClient';

export default function GameReviews({ gameId, isAdmin = false }) {
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    rating: 5,
    comment: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchReviews();
  }, [gameId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('game_reviews')
        .select('*')
        .eq('game_id', gameId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);

      // Calculate average rating
      if (data && data.length > 0) {
        const avg = data.reduce((sum, r) => sum + r.rating, 0) / data.length;
        setAverageRating(Math.round(avg * 10) / 10);
        setTotalReviews(data.length);
      } else {
        setAverageRating(0);
        setTotalReviews(0);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.customer_name.trim()) newErrors.customer_name = 'Name is required';
    if (formData.rating < 1 || formData.rating > 5) newErrors.rating = 'Rating must be 1-5';
    if (!formData.comment.trim()) newErrors.comment = 'Comment is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const { error } = await supabase
        .from('game_reviews')
        .insert([{
          game_id: gameId,
          ...formData,
        }]);

      if (error) throw error;
      
      // Reset form and refetch
      setFormData({
        customer_name: '',
        customer_email: '',
        rating: 5,
        comment: '',
      });
      setShowForm(false);
      fetchReviews();
    } catch (error) {
      console.error('Error submitting review:', error);
      setErrors({ submit: 'Failed to submit review. Try again.' });
    }
  };

  const handleDelete = async (reviewId) => {
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

  const RatingStars = ({ rating, interactive = false, onChange }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            type={interactive ? 'button' : 'div'}
            onClick={() => interactive && onChange(star)}
            className={`${
              interactive ? 'cursor-pointer hover:scale-110' : ''
            } transition transform`}
          >
            <Star
              className={`w-5 h-5 ${
                star <= rating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-slate-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-slate-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Customer Reviews
          </h3>
          <p className="text-slate-600 text-sm mt-1">
            {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition"
        >
          Leave Review
        </button>
      </div>

      {/* Rating Summary */}
      {totalReviews > 0 && (
        <div className="mb-6 p-4 bg-slate-50 rounded-lg">
          <div className="flex items-center gap-4">
            <div>
              <p className="text-3xl font-bold text-slate-900">{averageRating}</p>
              <RatingStars rating={Math.round(averageRating)} />
            </div>
            <div className="flex-1">
              <p className="text-slate-600">Based on {totalReviews} reviews</p>
              <div className="mt-2 space-y-1">
                {[5, 4, 3, 2, 1].map(star => {
                  const count = reviews.filter(r => r.rating === star).length;
                  const percentage = (count / totalReviews) * 100;
                  return (
                    <div key={star} className="flex items-center gap-2">
                      <span className="text-sm text-slate-600 w-8">{star}★</span>
                      <div className="flex-1 h-2 bg-slate-200 rounded">
                        <div
                          className="h-2 bg-yellow-400 rounded transition-all"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-slate-600 w-8">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Review Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  value={formData.customer_name}
                  onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.customer_name ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:ring-purple-200'
                  }`}
                  placeholder="John Doe"
                />
                {errors.customer_name && <p className="text-red-500 text-sm mt-1">{errors.customer_name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  value={formData.customer_email}
                  onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Rating *
              </label>
              <RatingStars
                rating={formData.rating}
                interactive={true}
                onChange={(rating) => setFormData({ ...formData, rating })}
              />
              {errors.rating && <p className="text-red-500 text-sm mt-1">{errors.rating}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Your Review *
              </label>
              <textarea
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                rows="4"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.comment ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:ring-purple-200'
                  }`}
                placeholder="What did you think about this game?"
              ></textarea>
              {errors.comment && <p className="text-red-500 text-sm mt-1">{errors.comment}</p>}
            </div>

            {errors.submit && <p className="text-red-500 text-sm">{errors.submit}</p>}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" /> Submit Review
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Reviews List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-8 text-slate-600">
          <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>No reviews yet. Be the first to review this game!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map(review => (
            <div key={review.id} className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold text-slate-900">{review.customer_name}</p>
                  <RatingStars rating={review.rating} />
                </div>
                {isAdmin && (
                  <button
                    onClick={() => handleDelete(review.id)}
                    className="p-2 hover:bg-red-100 rounded-lg transition"
                    title="Delete review"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                )}
              </div>
              <p className="text-slate-700 mb-2">{review.comment}</p>
              <p className="text-xs text-slate-500">
                {new Date(review.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
