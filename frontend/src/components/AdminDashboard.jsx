import { useState, useEffect } from 'react';
import { authAPI, bookingAPI, banquetAPI, restaurantAPI, roomAPI } from '../api/api';
import { Loader } from 'lucide-react';
import { showToast } from '../utils/toast';

export const AdminDashboard = ({ setActiveTab }) => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeBookings: 0,
    todayRevenue: 0,
    occupancyRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch all required data in parallel
      const [usersRes, roomBookingsRes, banquetBookingsRes, restaurantBookingsRes, roomsRes] = await Promise.all([
        authAPI.getAllUsers(),
        bookingAPI.getAllBookings(),
        banquetAPI.getAllBookings(),
        restaurantAPI.getAllBookings(),
        roomAPI.getAllRooms(),
      ]);

      // Calculate total users
      const totalUsers = usersRes.data.users?.length || 0;

      // Calculate active bookings (all bookings that are not cancelled or completed)
      const roomBookings = roomBookingsRes.data.bookings || [];
      const banquetBookings = banquetBookingsRes.data.bookings || [];
      const restaurantBookings = restaurantBookingsRes.data.bookings || [];

      const activeRoomBookings = roomBookings.filter(
        (b) => !['cancelled', 'checked-out'].includes(b.status)
      ).length;
      const activeBanquetBookings = banquetBookings.filter(
        (b) => !['cancelled', 'completed'].includes(b.status)
      ).length;
      const activeRestaurantBookings = restaurantBookings.filter(
        (b) => !['cancelled', 'completed'].includes(b.status)
      ).length;

      const activeBookings = activeRoomBookings + activeBanquetBookings + activeRestaurantBookings;

      // Calculate today's revenue
      const todayRevenue = calculateTodayRevenue(roomBookings, banquetBookings, restaurantBookings);

      // Calculate occupancy rate
      const rooms = roomsRes.data.rooms || [];
      const occupancyRate = calculateOccupancyRate(rooms);

      setStats({
        totalUsers,
        activeBookings,
        todayRevenue,
        occupancyRate,
      });
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
      setError('Failed to load dashboard statistics');
      showToast('Failed to load dashboard statistics', 'error');
    } finally {
      setLoading(false);
    }
  };

  const calculateTodayRevenue = (roomBookings, banquetBookings, restaurantBookings) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let revenue = 0;

    // Room bookings revenue
    roomBookings.forEach((booking) => {
      const bookingDate = new Date(booking.createdAt);
      bookingDate.setHours(0, 0, 0, 0);
      if (bookingDate.getTime() === today.getTime() && booking.paymentStatus === 'completed') {
        revenue += booking.totalPrice || 0;
      }
    });

    // Banquet bookings revenue
    banquetBookings.forEach((booking) => {
      const bookingDate = new Date(booking.createdAt);
      bookingDate.setHours(0, 0, 0, 0);
      if (bookingDate.getTime() === today.getTime() && booking.paymentStatus === 'completed') {
        revenue += booking.totalPrice || 0;
      }
    });

    // Restaurant bookings revenue
    restaurantBookings.forEach((booking) => {
      const bookingDate = new Date(booking.createdAt);
      bookingDate.setHours(0, 0, 0, 0);
      if (bookingDate.getTime() === today.getTime() && booking.paymentStatus === 'completed') {
        revenue += booking.totalPrice || 0;
      }
    });

    return revenue;
  };

  const calculateOccupancyRate = (rooms) => {
    if (rooms.length === 0) return 0;
    const occupiedRooms = rooms.filter((room) => room.status === 'occupied').length;
    return Math.round((occupiedRooms / rooms.length) * 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader className="w-8 h-8 animate-spin text-[#B8860B]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={loadDashboardStats}
          className="px-4 py-2 bg-[#B8860B] text-white rounded-lg hover:bg-[#8B6914] transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-playfair text-gold mb-6">Overview</h2>
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              👥
            </div>
          </div>
          <p className="text-gray-500 text-sm mb-1">Total Users</p>
          <h3 className="text-2xl font-bold text-gray-800">{stats.totalUsers}</h3>
        </div>

        <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              📅
            </div>
          </div>
          <p className="text-gray-500 text-sm mb-1">Active Bookings</p>
          <h3 className="text-2xl font-bold text-gray-800">{stats.activeBookings}</h3>
        </div>

        <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              💰
            </div>
          </div>
          <p className="text-gray-500 text-sm mb-1">Revenue (Today)</p>
          <h3 className="text-2xl font-bold text-gray-800">₹{stats.todayRevenue.toLocaleString()}</h3>
        </div>

        <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              📊
            </div>
          </div>
          <p className="text-gray-500 text-sm mb-1">Occupancy Rate</p>
          <h3 className="text-2xl font-bold text-gray-800">{stats.occupancyRate}%</h3>
        </div>
      </div>

      {/* Quick Actions and System Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-cream/30 p-6 rounded-lg border border-gold/10">
          <h3 className="text-xl font-playfair text-gold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button
              onClick={() => setActiveTab('rooms')}
              className="w-full text-left p-3 bg-white rounded shadow-sm hover:shadow-md transition-shadow flex items-center"
            >
              <span className="mr-3">➕</span> Add New Room
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className="w-full text-left p-3 bg-white rounded shadow-sm hover:shadow-md transition-shadow flex items-center"
            >
              <span className="mr-3">👁️</span> View Recent Bookings
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className="w-full text-left p-3 bg-white rounded shadow-sm hover:shadow-md transition-shadow flex items-center"
            >
              <span className="mr-3">👤</span> Manage Users
            </button>
          </div>
        </div>

        <div className="bg-cream/30 p-6 rounded-lg border border-gold/10">
          <h3 className="text-xl font-playfair text-gold mb-4">System Status</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Server Status</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-bold">
                ONLINE
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Database</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-bold">
                CONNECTED
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Last Backup</span>
              <span className="text-sm text-gray-500">Today, 04:00 AM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
