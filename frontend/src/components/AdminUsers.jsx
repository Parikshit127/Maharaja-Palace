import { useState, useEffect } from 'react';
import { authAPI, bookingAPI, banquetAPI, restaurantAPI } from '../api/api';
import { Mail, Phone, Calendar, Loader, X, Eye } from 'lucide-react';
import { showToast } from '../utils/toast';

const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

export const AdminUsers = ({ selectedMonth, setSelectedMonth }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [userBookings, setUserBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await authAPI.getAllUsers();
      setUsers(response.data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      showToast('Failed to load users', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleViewUser = async (user) => {
    setSelectedUser(user);
    setShowDetails(true);
    await loadUserBookings(user._id);
  };

  const loadUserBookings = async (userId) => {
    setLoadingBookings(true);
    try {
      // Fetch bookings from all sources
      const [roomBookingsRes, banquetBookingsRes, restaurantBookingsRes] = await Promise.all([
        bookingAPI.getUserBookings(userId).catch(() => ({ data: { bookings: [] } })),
        banquetAPI.getAllBookings().catch(() => ({ data: { bookings: [] } })),
        restaurantAPI.getAllBookings().catch(() => ({ data: { bookings: [] } })),
      ]);

      const roomBookings = (roomBookingsRes.data.bookings || []).map(b => ({ ...b, type: 'room' }));
      
      // Filter banquet and restaurant bookings for this user
      const banquetBookings = (banquetBookingsRes.data.bookings || [])
        .filter(b => b.guest?._id === userId)
        .map(b => ({ ...b, type: 'banquet' }));
      
      const restaurantBookings = (restaurantBookingsRes.data.bookings || [])
        .filter(b => b.guest?._id === userId)
        .map(b => ({ ...b, type: 'restaurant' }));

      const allBookings = [...roomBookings, ...banquetBookings, ...restaurantBookings]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setUserBookings(allBookings);
    } catch (error) {
      console.error('Error loading user bookings:', error);
      showToast('Failed to load user bookings', 'error');
    } finally {
      setLoadingBookings(false);
    }
  };

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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader className="w-8 h-8 animate-spin text-[#B8860B]" />
      </div>
    );
  }

  // Helper to get month index from date
  const getMonthIndex = (date) => {
    const d = new Date(date);
    return d.getMonth();
  };

  // Filter users by month if selected
  const filteredUsers = selectedMonth !== null && selectedMonth !== undefined
    ? users.filter((u) => getMonthIndex(u.createdAt) === selectedMonth)
    : users;

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-[#B8860B] to-[#D4AF37] mb-2">User Management</h2>
          <p className="text-[#6a6a6a]">{filteredUsers.length} total users</p>
        </div>
        {/* Month Filter */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-semibold text-[#2a2a2a]">Month:</label>
          <select
            value={selectedMonth === null ? "" : selectedMonth}
            onChange={(e) => {
              const val = e.target.value;
              setSelectedMonth(val === "" ? null : parseInt(val));
            }}
            className="px-4 py-2 border-2 border-[#B8860B]/30 rounded-xl bg-white font-semibold text-[#2a2a2a] focus:outline-none focus:border-[#B8860B] transition"
          >
            <option value="">All Months</option>
            {months.map((m, i) => (
              <option key={i} value={i}>
                {m}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.map((user) => (
          <div
            key={user._id}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-[#B8860B] text-white rounded-full flex items-center justify-center text-xl font-bold mr-4">
                {user.firstName?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-[#2a2a2a]">
                  {user.firstName} {user.lastName}
                </h3>
                <span
                  className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                    user.role === 'admin'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {user.role}
                </span>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="w-4 h-4 mr-2" />
                <span className="truncate">{user.email}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="w-4 h-4 mr-2" />
                <span>{user.phone || 'N/A'}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <button
              onClick={() => handleViewUser(user)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#B8860B] text-white rounded-lg hover:bg-[#8B6914] transition-colors"
            >
              <Eye className="w-4 h-4" />
              View Details
            </button>
          </div>
        ))}
      </div>

      {/* User Details Modal */}
      {showDetails && selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-serif text-[#2a2a2a]">User Details</h3>
              <button
                onClick={() => setShowDetails(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* User Info */}
              <div>
                <h4 className="text-sm font-semibold text-gray-500 mb-3">User Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Name</p>
                    <p className="font-semibold">
                      {selectedUser.firstName} {selectedUser.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="font-semibold">{selectedUser.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="font-semibold">{selectedUser.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Role</p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        selectedUser.role === 'admin'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {selectedUser.role}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Joined</p>
                    <p className="font-semibold">
                      {new Date(selectedUser.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Booking History */}
              <div>
                <h4 className="text-sm font-semibold text-gray-500 mb-3">Booking History</h4>
                {loadingBookings ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader className="w-6 h-6 animate-spin text-[#B8860B]" />
                  </div>
                ) : userBookings.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No bookings found</p>
                ) : (
                  <div className="space-y-3">
                    {userBookings.map((booking) => (
                      <div
                        key={booking._id}
                        className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-mono text-sm font-semibold">
                              {booking.bookingNumber}
                            </p>
                            <span className="inline-block px-2 py-1 bg-[#B8860B]/10 text-[#B8860B] rounded text-xs uppercase mt-1">
                              {booking.type}
                            </span>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                              booking.status
                            )}`}
                          >
                            {booking.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <p className="text-gray-500">Date</p>
                            <p className="font-semibold">
                              {booking.checkInDate &&
                                new Date(booking.checkInDate).toLocaleDateString()}
                              {booking.eventDate &&
                                new Date(booking.eventDate).toLocaleDateString()}
                              {booking.bookingDate &&
                                new Date(booking.bookingDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Amount</p>
                            <p className="font-semibold text-[#B8860B]">
                              ₹{booking.totalPrice?.toLocaleString() || 0}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
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
