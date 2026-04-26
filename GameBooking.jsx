import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Phone, Mail, User, CheckCircle, AlertCircle } from 'lucide-react';
import supabase from '../lib/supabaseClient';

export default function GameBooking({ gameId, gameName, gamePrice = 0 }) {
  const [bookings, setBookings] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    booking_date: '',
    booking_time: '18:00',
    duration_hours: 2,
    notes: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchBookings();
  }, [gameId]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('game_bookings')
        .select('*')
        .eq('game_id', gameId)
        .eq('status', 'confirmed')
        .order('booking_date', { ascending: true });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Get minimum date (today + 1 day)
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  // Get maximum date (30 days from now)
  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    return maxDate.toISOString().split('T')[0];
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.customer_name.trim()) newErrors.customer_name = 'Name is required';
    if (!formData.customer_email.trim()) newErrors.customer_email = 'Email is required';
    if (!formData.customer_phone.trim()) newErrors.customer_phone = 'Phone is required';
    if (!formData.booking_date) newErrors.booking_date = 'Date is required';
    if (formData.duration_hours < 1 || formData.duration_hours > 6) {
      newErrors.duration_hours = 'Duration must be 1-6 hours';
    }

    // Check if date is in valid range
    if (formData.booking_date < getMinDate()) {
      newErrors.booking_date = 'Cannot book for past dates';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const { error } = await supabase
        .from('game_bookings')
        .insert([{
          game_id: gameId,
          ...formData,
          status: 'pending',
        }]);

      if (error) throw error;

      // Show success message
      setSuccessMessage('Booking request submitted! We will confirm shortly.');
      
      // Reset form
      setFormData({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        booking_date: '',
        booking_time: '18:00',
        duration_hours: 2,
        notes: '',
      });
      
      setTimeout(() => {
        setShowForm(false);
        setSuccessMessage('');
      }, 3000);

      // Refetch confirmed bookings
      fetchBookings();
    } catch (error) {
      console.error('Error submitting booking:', error);
      setErrors({ submit: 'Failed to submit booking. Try again.' });
    }
  };

  // Check if a time slot is available
  const isTimeSlotBooked = (date, time) => {
    return bookings.some(booking => {
      if (booking.booking_date !== date) return false;
      
      const bookedStart = new Date(`${date}T${booking.booking_time}`);
      const bookedEnd = new Date(bookedStart.getTime() + booking.duration_hours * 60 * 60 * 1000);
      const requestedStart = new Date(`${date}T${time}`);
      const requestedEnd = new Date(requestedStart.getTime() + formData.duration_hours * 60 * 60 * 1000);

      return requestedStart < bookedEnd && requestedEnd > bookedStart;
    });
  };

  const calculateTotal = () => {
    return (gamePrice * formData.duration_hours).toFixed(2);
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-slate-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Book {gameName}
        </h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          {showForm ? 'Cancel' : 'Make a Booking'}
        </button>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          <p className="text-green-700">{successMessage}</p>
        </div>
      )}

      {/* Booking Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  <User className="w-4 h-4 inline mr-1" /> Your Name *
                </label>
                <input
                  type="text"
                  value={formData.customer_name}
                  onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.customer_name ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:ring-blue-200'
                  }`}
                  placeholder="John Doe"
                />
                {errors.customer_name && <p className="text-red-500 text-sm mt-1">{errors.customer_name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  <Mail className="w-4 h-4 inline mr-1" /> Email *
                </label>
                <input
                  type="email"
                  value={formData.customer_email}
                  onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.customer_email ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:ring-blue-200'
                  }`}
                  placeholder="john@example.com"
                />
                {errors.customer_email && <p className="text-red-500 text-sm mt-1">{errors.customer_email}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                <Phone className="w-4 h-4 inline mr-1" /> Phone *
              </label>
              <input
                type="tel"
                value={formData.customer_phone}
                onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.customer_phone ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:ring-blue-200'
                  }`}
                placeholder="+91 98765 43210"
              />
              {errors.customer_phone && <p className="text-red-500 text-sm mt-1">{errors.customer_phone}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  <Calendar className="w-4 h-4 inline mr-1" /> Booking Date *
                </label>
                <input
                  type="date"
                  value={formData.booking_date}
                  onChange={(e) => setFormData({ ...formData, booking_date: e.target.value })}
                  min={getMinDate()}
                  max={getMaxDate()}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.booking_date ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:ring-blue-200'
                  }`}
                />
                {errors.booking_date && <p className="text-red-500 text-sm mt-1">{errors.booking_date}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  <Clock className="w-4 h-4 inline mr-1" /> Time
                </label>
                <input
                  type="time"
                  value={formData.booking_time}
                  onChange={(e) => setFormData({ ...formData, booking_time: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Duration (Hours)
                </label>
                <select
                  value={formData.duration_hours}
                  onChange={(e) => setFormData({ ...formData, duration_hours: parseInt(e.target.value) })}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.duration_hours ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:ring-blue-200'
                  }`}
                >
                  {[1, 2, 3, 4, 5, 6].map(hour => (
                    <option key={hour} value={hour}>{hour} hour{hour > 1 ? 's' : ''}</option>
                  ))}
                </select>
                {errors.duration_hours && <p className="text-red-500 text-sm mt-1">{errors.duration_hours}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Additional Notes (Optional)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows="3"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="Any special requests or notes?"
              ></textarea>
            </div>

            {/* Price Calculation */}
            {gamePrice > 0 && (
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex justify-between items-center">
                  <span className="text-slate-700">
                    ₹{gamePrice} × {formData.duration_hours} hour{formData.duration_hours > 1 ? 's' : ''}
                  </span>
                  <span className="text-xl font-bold text-blue-600">
                    ₹{calculateTotal()}
                  </span>
                </div>
              </div>
            )}

            {errors.submit && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <p className="text-red-700 text-sm">{errors.submit}</p>
              </div>
            )}

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
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Upcoming Bookings */}
      <div className="mt-6">
        <h4 className="font-semibold text-slate-900 mb-4">Upcoming Bookings</h4>
        {loading ? (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          </div>
        ) : bookings.length === 0 ? (
          <p className="text-slate-600 text-center py-4">No bookings yet</p>
        ) : (
          <div className="space-y-2">
            {bookings.slice(0, 5).map(booking => (
              <div key={booking.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-slate-900">{booking.customer_name}</p>
                    <p className="text-sm text-slate-600">
                      {new Date(booking.booking_date).toLocaleDateString()} at {booking.booking_time}
                    </p>
                  </div>
                  <span className="text-xs font-semibold px-2 py-1 bg-green-100 text-green-800 rounded">
                    {booking.duration_hours}h
                  </span>
                </div>
              </div>
            ))}
            {bookings.length > 5 && (
              <p className="text-sm text-slate-600 text-center pt-2">
                +{bookings.length - 5} more bookings
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
