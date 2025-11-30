import { useState, useEffect } from 'react';
import { bookingAPI, banquetAPI, restaurantAPI } from '../api/api';
import { Download, Loader, X, Eye } from 'lucide-react';
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
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      'checked-in': 'bg-blue-100 text-blue-800',
      'checked-out': 'bg-gray-100 text-gray-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
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
      // Create CSV content
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

      // Create download link
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
        <Loader className="w-8 h-8 animate-spin text-[#B8860B]" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-serif text-[#2a2a2a]">All Bookings</h2>
        <button 
          onClick={exportBookings}
          className="flex items-center gap-2 px-4 py-2 bg-[#B8860B] text-white rounded-lg hover:bg-[#8B6914] transition-colors"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <p className="text-sm text-blue-600 mb-1">Total Bookings</p>
          <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <p className="text-sm text-green-600 mb-1">Confirmed</p>
          <p className="text-2xl font-bold text-green-900">{stats.confirmed}</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
          <p className="text-sm text-yellow-600 mb-1">Pending</p>
          <p className="text-2xl font-bold text-yellow-900">{stats.pending}</p>
        </div>
        <div className="bg-gradient-to-br from-[#B8860B]/10 to-[#D4AF37]/10 rounded-lg p-4 border border-[#B8860B]/20">
          <p className="text-sm text-[#B8860B] mb-1">Revenue</p>
          <p className="text-2xl font-bold text-[#8B6914]">₹{stats.revenue.toLocaleString()}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {['all', 'room', 'banquet', 'restaurant'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg capitalize transition-colors ${
              filter === f
                ? 'bg-[#B8860B] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Bookings Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b-2 border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Booking #</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Guest</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Payment</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredBookings.map((booking) => (
              <tr key={booking._id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-sm">{booking.bookingNumber}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 bg-[#B8860B]/10 text-[#B8860B] rounded text-xs uppercase">
                    {booking.type}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm">
                    <p className="font-semibold">{booking.guest?.firstName} {booking.guest?.lastName}</p>
                    <p className="text-gray-500 text-xs">{booking.guest?.email}</p>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm">
                  {booking.checkInDate && new Date(booking.checkInDate).toLocaleDateString()}
                  {booking.eventDate && new Date(booking.eventDate).toLocaleDateString()}
                  {booking.bookingDate && new Date(booking.bookingDate).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 font-semibold text-[#B8860B]">
                  {booking.totalPrice ? `₹${booking.totalPrice.toLocaleString()}` : '-'}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-semibold ${
                    booking.paymentStatus === 'completed' ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {booking.paymentStatus || 'pending'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleViewDetails(booking)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    title="View details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Booking Details Modal */}
      {showDetails && selectedBooking && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-serif text-[#2a2a2a]">Booking Details</h3>
              <button 
                onClick={() => setShowDetails(false)} 
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Booking Info */}
              <div>
                <h4 className="text-sm font-semibold text-gray-500 mb-3">Booking Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Booking Number</p>
                    <p className="font-mono font-semibold">{selectedBooking.bookingNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Type</p>
                    <p className="font-semibold capitalize">{selectedBooking.type}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Status</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedBooking.status)}`}>
                      {selectedBooking.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Payment Status</p>
                    <p className={`font-semibold ${
                      selectedBooking.paymentStatus === 'completed' ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {selectedBooking.paymentStatus || 'pending'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Guest Info */}
              <div>
                <h4 className="text-sm font-semibold text-gray-500 mb-3">Guest Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Name</p>
                    <p className="font-semibold">
                      {selectedBooking.guest?.firstName} {selectedBooking.guest?.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="font-semibold">{selectedBooking.guest?.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="font-semibold">{selectedBooking.guest?.phone || 'N/A'}</p>
                  </div>
                  {selectedBooking.numberOfGuests && (
                    <div>
                      <p className="text-xs text-gray-500">Number of Guests</p>
                      <p className="font-semibold">{selectedBooking.numberOfGuests}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Date Info */}
              <div>
                <h4 className="text-sm font-semibold text-gray-500 mb-3">Date Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  {selectedBooking.checkInDate && (
                    <>
                      <div>
                        <p className="text-xs text-gray-500">Check-in</p>
                        <p className="font-semibold">{new Date(selectedBooking.checkInDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Check-out</p>
                        <p className="font-semibold">{new Date(selectedBooking.checkOutDate).toLocaleDateString()}</p>
                      </div>
                    </>
                  )}
                  {selectedBooking.eventDate && (
                    <div>
                      <p className="text-xs text-gray-500">Event Date</p>
                      <p className="font-semibold">{new Date(selectedBooking.eventDate).toLocaleDateString()}</p>
                    </div>
                  )}
                  {selectedBooking.bookingDate && (
                    <div>
                      <p className="text-xs text-gray-500">Booking Date</p>
                      <p className="font-semibold">{new Date(selectedBooking.bookingDate).toLocaleDateString()}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-gray-500">Created At</p>
                    <p className="font-semibold">{new Date(selectedBooking.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Price Info */}
              <div>
                <h4 className="text-sm font-semibold text-gray-500 mb-3">Price Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Total Price</p>
                    <p className="text-2xl font-bold text-[#B8860B]">
                      ₹{selectedBooking.totalPrice?.toLocaleString() || 0}
                    </p>
                  </div>
                  {selectedBooking.numberOfNights && (
                    <div>
                      <p className="text-xs text-gray-500">Number of Nights</p>
                      <p className="font-semibold">{selectedBooking.numberOfNights}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Special Requests */}
              {selectedBooking.specialRequests && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 mb-3">Special Requests</h4>
                  <p className="text-sm text-gray-700">{selectedBooking.specialRequests}</p>
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 px-6 py-4">
              <button
                onClick={() => setShowDetails(false)}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
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
