import { useState, useEffect } from 'react';
import { bookingAPI, banquetAPI, restaurantAPI } from '../api/api';
import { Download, Loader, X, Eye, TrendingUp, DollarSign } from 'lucide-react';
import { showToast } from '../utils/toast';

export const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    loadAllBookings();
  }, []);

  const loadAllBookings = async () => {
    setLoading(true);
    try {
      const [roomRes, banquetRes, restaurantRes] = await Promise.all([
        bookingAPI.getAllBookings().catch(() => ({ data: { bookings: [] } })),
        banquetAPI.getAllBookings().catch(() => ({ data: { bookings: [] } })),
        restaurantAPI.getAllBookings().catch(() => ({ data: { bookings: [] } })),
      ]);

      const allBookings = [
        ...(roomRes.data.bookings || []).map(b => ({ ...b, type: 'room' })),
        ...(banquetRes.data.bookings || []).map(b => ({ ...b, type: 'banquet' })),
        ...(restaurantRes.data.bookings || []).map(b => ({ ...b, type: 'restaurant' })),
      ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setBookings(allBookings);
    } catch (error) {
      console.error('Error loading bookings:', error);
      showToast('Failed to load bookings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = filter === 'all' 
    ? bookings 
    : bookings.filter(b => b.type === filter);

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      confirmed: 'bg-green-100 text-green-800 border-green-300',
      'checked-in': 'bg-blue-100 text-blue-800 border-blue-300',
      'checked-out': 'bg-gray-100 text-gray-800 border-gray-300',
      completed: 'bg-green-100 text-green-800 border-green-300',
      cancelled: 'bg-red-100 text-red-800 border-red-300',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const calculateStats = () => {
    const total = filteredBookings.length;
    const confirmed = filteredBookings.filter(b => b.status === 'confirmed').length;
    const pending = filteredBookings.filter(b => b.status === 'pending').length;
    const revenue = filteredBookings
      .filter(b => b.paymentStatus === 'completed')
      .reduce((sum, b) => sum + (b.totalPrice || 0), 0);
    
    return { total, confirmed, pending, revenue };
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setShowDetails(true);
  };

  const exportBookings = () => {
    try {
      const headers = ['Booking #', 'Type', 'Guest Name', 'Email', 'Phone', 'Date', 'Amount', 'Status', 'Payment'];
      const rows = filteredBookings.map(b => [
        b.bookingNumber,
        b.type,
        `${b.guest?.firstName || ''} ${b.guest?.lastName || ''}`,
        b.guest?.email || '',
        b.guest?.phone || '',
        b.checkInDate ? new Date(b.checkInDate).toLocaleDateString() :
        b.eventDate ? new Date(b.eventDate).toLocaleDateString() :
        b.bookingDate ? new Date(b.bookingDate).toLocaleDateString() : '',
        b.totalPrice || 0,
        b.status,
        b.paymentStatus || 'pending'
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bookings-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      showToast('Bookings exported successfully', 'success');
    } catch (error) {
      console.error('Error exporting bookings:', error);
      showToast('Failed to export bookings', 'error');
    }
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-[#B8860B] mx-auto mb-4" />
          <p className="text-[#6a6a6a] font-semibold">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-[#B8860B] to-[#D4AF37] mb-2">
            All Bookings
          </h2>
          <p className="text-[#6a6a6a]">Manage and track all reservations</p>
        </div>
        <button 
          onClick={exportBookings}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:shadow-lg hover:shadow-green-500/30 transition-all duration-300 font-semibold"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-blue-600 font-semibold uppercase tracking-wide">Total Bookings</p>
            <TrendingUp className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-blue-900">{stats.total}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-green-600 font-semibold uppercase tracking-wide">Confirmed</p>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-green-900">{stats.confirmed}</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-6 border border-yellow-200">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-yellow-600 font-semibold uppercase tracking-wide">Pending</p>
            <TrendingUp className="w-5 h-5 text-yellow-500" />
          </div>
          <p className="text-3xl font-bold text-yellow-900">{stats.pending}</p>
        </div>
        <div className="bg-gradient-to-br from-[#B8860B]/10 to-[#D4AF37]/10 rounded-2xl p-6 border border-[#B8860B]/20">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-[#B8860B] font-semibold uppercase tracking-wide">Revenue</p>
            <DollarSign className="w-5 h-5 text-[#B8860B]" />
          </div>
          <p className="text-3xl font-bold text-[#8B6914]">₹{stats.revenue.toLocaleString()}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-8">
        {['all', 'room', 'banquet', 'restaurant'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-6 py-3 rounded-xl capitalize font-semibold transition-all duration-300 ${
              filter === f
                ? 'bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-white shadow-lg shadow-[#B8860B]/30'
                : 'bg-white text-[#2a2a2a] hover:bg-[#B8860B]/10 border-2 border-[#B8860B]/20'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(184,134,11,0.1)] overflow-hidden border border-[#B8860B]/20">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-[#B8860B]/10 to-[#D4AF37]/10">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#2a2a2a] uppercase tracking-wider">Booking #</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#2a2a2a] uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#2a2a2a] uppercase tracking-wider">Guest</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#2a2a2a] uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#2a2a2a] uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#2a2a2a] uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#2a2a2a] uppercase tracking-wider">Payment</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#2a2a2a] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#B8860B]/10">
              {filteredBookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-[#B8860B]/5 transition-colors">
                  <td className="px-6 py-4 font-mono text-sm font-semibold text-[#2a2a2a]">{booking.bookingNumber}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1.5 bg-[#B8860B]/10 text-[#B8860B] rounded-full text-xs uppercase font-bold">
                      {booking.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <p className="font-semibold text-[#2a2a2a]">{booking.guest?.firstName} {booking.guest?.lastName}</p>
                      <p className="text-[#6a6a6a] text-xs">{booking.guest?.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#2a2a2a]">
                    {booking.checkInDate && new Date(booking.checkInDate).toLocaleDateString()}
                    {booking.eventDate && new Date(booking.eventDate).toLocaleDateString()}
                    {booking.bookingDate && new Date(booking.bookingDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 font-bold text-[#B8860B]">
                    {booking.totalPrice ? `₹${booking.totalPrice.toLocaleString()}` : '-'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold border-2 ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-bold uppercase ${
                      booking.paymentStatus === 'completed' ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {booking.paymentStatus || 'pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleViewDetails(booking)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View details"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Details Modal */}
      {showDetails && selectedBooking && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-[#B8860B] to-[#D4AF37] px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-serif text-white">Booking Details</h3>
              <button 
                onClick={() => setShowDetails(false)} 
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Booking Info */}
              <div className="bg-[#B8860B]/5 rounded-xl p-4">
                <h4 className="text-sm font-bold text-[#2a2a2a] mb-3 uppercase tracking-wide">Booking Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-[#6a6a6a] mb-1">Booking Number</p>
                    <p className="font-mono font-bold text-[#2a2a2a]">{selectedBooking.bookingNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#6a6a6a] mb-1">Type</p>
                    <p className="font-bold capitalize text-[#2a2a2a]">{selectedBooking.type}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#6a6a6a] mb-1">Status</p>
                    <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-bold border-2 ${getStatusColor(selectedBooking.status)}`}>
                      {selectedBooking.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-[#6a6a6a] mb-1">Payment Status</p>
                    <p className={`font-bold ${
                      selectedBooking.paymentStatus === 'completed' ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {selectedBooking.paymentStatus || 'pending'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Guest Info */}
              <div>
                <h4 className="text-sm font-bold text-[#2a2a2a] mb-3 uppercase tracking-wide">Guest Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-[#6a6a6a] mb-1">Name</p>
                    <p className="font-bold text-[#2a2a2a]">
                      {selectedBooking.guest?.firstName} {selectedBooking.guest?.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#6a6a6a] mb-1">Email</p>
                    <p className="font-bold text-[#2a2a2a]">{selectedBooking.guest?.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#6a6a6a] mb-1">Phone</p>
                    <p className="font-bold text-[#2a2a2a]">{selectedBooking.guest?.phone || 'N/A'}</p>
                  </div>
                  {selectedBooking.numberOfGuests && (
                    <div>
                      <p className="text-xs text-[#6a6a6a] mb-1">Number of Guests</p>
                      <p className="font-bold text-[#2a2a2a]">{selectedBooking.numberOfGuests}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Date Info */}
              <div>
                <h4 className="text-sm font-bold text-[#2a2a2a] mb-3 uppercase tracking-wide">Date Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  {selectedBooking.checkInDate && (
                    <>
                      <div>
                        <p className="text-xs text-[#6a6a6a] mb-1">Check-in</p>
                        <p className="font-bold text-[#2a2a2a]">{new Date(selectedBooking.checkInDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#6a6a6a] mb-1">Check-out</p>
                        <p className="font-bold text-[#2a2a2a]">{new Date(selectedBooking.checkOutDate).toLocaleDateString()}</p>
                      </div>
                    </>
                  )}
                  {selectedBooking.eventDate && (
                    <div>
                      <p className="text-xs text-[#6a6a6a] mb-1">Event Date</p>
                      <p className="font-bold text-[#2a2a2a]">{new Date(selectedBooking.eventDate).toLocaleDateString()}</p>
                    </div>
                  )}
                  {selectedBooking.bookingDate && (
                    <div>
                      <p className="text-xs text-[#6a6a6a] mb-1">Booking Date</p>
                      <p className="font-bold text-[#2a2a2a]">{new Date(selectedBooking.bookingDate).toLocaleDateString()}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-[#6a6a6a] mb-1">Created At</p>
                    <p className="font-bold text-[#2a2a2a]">{new Date(selectedBooking.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Price Info */}
              <div className="bg-gradient-to-br from-[#B8860B]/10 to-[#D4AF37]/10 rounded-xl p-4">
                <h4 className="text-sm font-bold text-[#2a2a2a] mb-3 uppercase tracking-wide">Price Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-[#6a6a6a] mb-1">Total Price</p>
                    <p className="text-2xl font-bold text-[#B8860B]">
                      ₹{selectedBooking.totalPrice?.toLocaleString() || 0}
                    </p>
                  </div>
                  {selectedBooking.numberOfNights && (
                    <div>
                      <p className="text-xs text-[#6a6a6a] mb-1">Number of Nights</p>
                      <p className="font-bold text-[#2a2a2a]">{selectedBooking.numberOfNights}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Special Requests */}
              {selectedBooking.specialRequests && (
                <div>
                  <h4 className="text-sm font-bold text-[#2a2a2a] mb-3 uppercase tracking-wide">Special Requests</h4>
                  <p className="text-sm text-[#2a2a2a] bg-[#B8860B]/5 p-4 rounded-xl">{selectedBooking.specialRequests}</p>
                </div>
              )}
            </div>

            <div className="border-t border-[#B8860B]/20 px-6 py-4">
              <button
                onClick={() => setShowDetails(false)}
                className="w-full px-4 py-3 bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-white rounded-xl hover:shadow-lg hover:shadow-[#B8860B]/30 transition-all duration-300 font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};