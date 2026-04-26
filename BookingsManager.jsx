import React, { useState, useEffect } from 'react';
import { Calendar, User, Mail, Phone, CheckCircle, Clock, Trash2, Check, X } from 'lucide-react';
import supabase from '../lib/supabaseClient';

export default function BookingsManager() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, confirmed, cancelled
  const [sortBy, setSortBy] = useState('date');

  useEffect(() => {
    fetchBookings();
  }, [filter]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('game_bookings')
        .select('*');

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query.order('booking_date', { ascending: true });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      const { error } = await supabase
        .from('game_bookings')
        .update({ status: newStatus })
        .eq('id', bookingId);

      if (error) throw error;
      fetchBookings();
    } catch (error) {
      console.error('Error updating booking:', error);
    }
  };

  const deleteBooking = async (bookingId) => {
    if (!window.confirm('Delete this booking?')) return;

    try {
      const { error } = await supabase
        .from('game_bookings')
        .delete()
        .eq('id', bookingId);

      if (error) throw error;
      fetchBookings();
    } catch (error) {
      console.error('Error deleting booking:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  const sortedBookings = [...bookings].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(a.booking_date) - new Date(b.booking_date);
      case 'customer':
        return a.customer_name.localeCompare(b.customer_name);
      case 'status':
        return a.status.localeCompare(b.status);
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Bookings Manager</h2>
        <p className="text-slate-600 mt-1">Manage customer game reservations</p>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
        >
          <option value="all">All Bookings</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
        >
          <option value="date">Sort by Date</option>
          <option value="customer">Sort by Customer</option>
          <option value="status">Sort by Status</option>
        </select>

        <div className="px-4 py-2 bg-slate-100 rounded-lg flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-600" />
          <span className="text-sm text-slate-700 font-medium">{sortedBookings.length} bookings</span>
        </div>
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          <p className="text-slate-600 mt-4">Loading bookings...</p>
        </div>
      ) : sortedBookings.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600 text-lg">No bookings found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedBookings.map(booking => (
            <div
              key={booking.id}
              className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition"
            >
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Customer Info */}
                <div>
                  <p className="text-xs text-slate-600 font-semibold uppercase">Customer</p>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-slate-600 flex-shrink-0" />
                      <p className="font-medium text-slate-900">{booking.customer_name}</p>
                    </div>
                    {booking.customer_email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-slate-600 flex-shrink-0" />
                        <p className="text-sm text-slate-600">{booking.customer_email}</p>
                      </div>
                    )}
                    {booking.customer_phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-slate-600 flex-shrink-0" />
                        <p className="text-sm text-slate-600">{booking.customer_phone}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Booking Details */}
                <div>
                  <p className="text-xs text-slate-600 font-semibold uppercase">Booking</p>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-600 flex-shrink-0" />
                      <p className="font-medium text-slate-900">
                        {new Date(booking.booking_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-600 flex-shrink-0" />
                      <p className="text-sm text-slate-600">
                        {booking.booking_time} - {booking.duration_hours}h
                      </p>
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div>
                  <p className="text-xs text-slate-600 font-semibold uppercase">Status</p>
                  <div className="mt-2">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(booking.status)}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>
                  {booking.notes && (
                    <p className="text-xs text-slate-600 mt-3 line-clamp-2">{booking.notes}</p>
                  )}
                </div>

                {/* Actions */}
                <div>
                  <p className="text-xs text-slate-600 font-semibold uppercase">Actions</p>
                  <div className="mt-2 flex flex-col gap-2">
                    {booking.status !== 'confirmed' && (
                      <button
                        onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                        className="px-3 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition flex items-center justify-center gap-2"
                        title="Confirm booking"
                      >
                        <Check className="w-4 h-4" /> Confirm
                      </button>
                    )}
                    {booking.status !== 'cancelled' && (
                      <button
                        onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                        className="px-3 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition flex items-center justify-center gap-2"
                        title="Cancel booking"
                      >
                        <X className="w-4 h-4" /> Cancel
                      </button>
                    )}
                    <button
                      onClick={() => deleteBooking(booking.id)}
                      className="px-3 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition flex items-center justify-center gap-2"
                      title="Delete booking"
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
