import { useState, useEffect } from "react";
import {
  authAPI,
  bookingAPI,
  banquetAPI,
  restaurantAPI,
  roomAPI,
} from "../api/api";
import { Loader } from "lucide-react";
import { showToast } from "../utils/toast";

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
      // Load users, bookings, rooms
      const [
        usersRes,
        roomBookingsRes,
        banquetBookingsRes,
        restaurantBookingsRes,
        roomsRes,
      ] = await Promise.all([
        authAPI.getAllUsers(),
        bookingAPI.getBookings(),
        banquetAPI.getAllBookings(),
        restaurantAPI.getAllBookings(),
        roomAPI.getAllRooms(),
      ]);

      // ✅ FIXED: Backend returns { success: true, users: [...] }
      // Axios already wraps in .data, so we access directly
      const totalUsers = usersRes.data.users?.length || 0;

      // ✅ FIXED: Access bookings directly from response.data
      const roomBookings = roomBookingsRes.data.bookings || [];
      const banquetBookings = banquetBookingsRes.data.bookings || [];
      const restaurantBookings = restaurantBookingsRes.data.bookings || [];

      console.log("📊 Room Bookings:", roomBookings.length);
      console.log("🎉 Banquet Bookings:", banquetBookings.length);
      console.log("🍽️ Restaurant Bookings:", restaurantBookings.length);

      const activeRoomBookings = roomBookings.filter(
        (b) => !["cancelled", "checked-out"].includes(b.status)
      ).length;

      const activeBanquetBookings = banquetBookings.filter(
        (b) => !["cancelled", "completed"].includes(b.status)
      ).length;

      const activeRestaurantBookings = restaurantBookings.filter(
        (b) => !["cancelled", "completed"].includes(b.status)
      ).length;

      const activeBookings =
        activeRoomBookings + activeBanquetBookings + activeRestaurantBookings;

      // Calculate revenue
      const todayRevenue = calculateTodayRevenue(
        roomBookings,
        banquetBookings,
        restaurantBookings
      );

      const occupancyRate = calculateOccupancyRate(roomsRes.data.rooms || []);

      console.log("✅ Stats calculated:", {
        totalUsers,
        activeBookings,
        todayRevenue,
        occupancyRate,
      });

      setStats({
        totalUsers,
        activeBookings,
        todayRevenue,
        occupancyRate,
      });
    } catch (err) {
      console.error("❌ Error loading dashboard stats:", err);
      console.error("❌ Error response:", err.response?.data);
      setError("Failed to load dashboard statistics");
      showToast("Failed to load dashboard statistics", "error");
    } finally {
      setLoading(false);
    }
  };

  const calculateTodayRevenue = (
    roomBookings,
    banquetBookings,
    restaurantBookings
  ) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let revenue = 0;

    const checkRevenue = (booking) => {
      const bookingDate = new Date(booking.createdAt);
      bookingDate.setHours(0, 0, 0, 0);

      if (
        bookingDate.getTime() === today.getTime() &&
        booking.paymentStatus === "completed"
      ) {
        revenue += booking.totalPrice || 0;
      }
    };

    roomBookings.forEach(checkRevenue);
    banquetBookings.forEach(checkRevenue);
    restaurantBookings.forEach(checkRevenue);

    return revenue;
  };

  const calculateOccupancyRate = (rooms) => {
    if (!rooms.length) return 0;

    const occupiedRooms = rooms.filter(
      (room) => room.status === "occupied"
    ).length;

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
          <p className="text-gray-500 text-sm mb-1">Total Users</p>
          <h3 className="text-2xl font-bold text-gray-800">
            {stats.totalUsers}
          </h3>
        </div>

        <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
          <p className="text-gray-500 text-sm mb-1">Active Bookings</p>
          <h3 className="text-2xl font-bold text-gray-800">
            {stats.activeBookings}
          </h3>
        </div>

        <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
          <p className="text-gray-500 text-sm mb-1">Revenue (Today)</p>
          <h3 className="text-2xl font-bold text-gray-800">
            ₹{stats.todayRevenue.toLocaleString()}
          </h3>
        </div>

        <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
          <p className="text-gray-500 text-sm mb-1">Occupancy Rate</p>
          <h3 className="text-2xl font-bold text-gray-800">
            {stats.occupancyRate}%
          </h3>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-cream/30 p-6 rounded-lg border border-gold/10">
          <h3 className="text-xl font-playfair text-gold mb-4">
            Quick Actions
          </h3>

          <div className="space-y-3">
            <button
              onClick={() => setActiveTab("rooms")}
              className="w-full text-left p-3 bg-white rounded shadow-sm hover:shadow-md transition-shadow"
            >
              ➕ Add New Room
            </button>

            <button
              onClick={() => setActiveTab("bookings")}
              className="w-full text-left p-3 bg-white rounded shadow-sm hover:shadow-md transition-shadow"
            >
              👁️ View Recent Bookings
            </button>

            <button
              onClick={() => setActiveTab("users")}
              className="w-full text-left p-3 bg-white rounded shadow-sm hover:shadow-md transition-shadow"
            >
              👤 Manage Users
            </button>
          </div>
        </div>

        <div className="bg-cream/30 p-6 rounded-lg border border-gold/10">
          <h3 className="text-xl font-playfair text-gold mb-4">
            System Status
          </h3>

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
