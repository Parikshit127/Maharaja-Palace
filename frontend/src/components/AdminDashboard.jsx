import { useState, useEffect } from "react";
import {
  authAPI,
  bookingAPI,
  banquetAPI,
  restaurantAPI,
  roomAPI,
} from "../api/api";
import { Loader, Users, Calendar, TrendingUp, Percent, ArrowRight, Activity } from "lucide-react";
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

      const totalUsers = usersRes.data.users?.length || 0;

      const roomBookings = roomBookingsRes.data.bookings || [];
      const banquetBookings = banquetBookingsRes.data.bookings || [];
      const restaurantBookings = restaurantBookingsRes.data.bookings || [];

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

      const todayRevenue = calculateTodayRevenue(
        roomBookings,
        banquetBookings,
        restaurantBookings
      );

      const occupancyRate = calculateOccupancyRate(roomsRes.data.rooms || []);

      setStats({
        totalUsers,
        activeBookings,
        todayRevenue,
        occupancyRate,
      });
    } catch (err) {
      console.error("Error loading dashboard stats:", err);
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
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-[#B8860B] mx-auto mb-4" />
          <p className="text-[#6a6a6a] font-semibold">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Activity className="w-8 h-8 text-red-600" />
        </div>
        <p className="text-red-600 mb-4 text-lg font-semibold">{error}</p>
        <button
          onClick={loadDashboardStats}
          className="px-6 py-3 bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-white rounded-xl hover:shadow-lg hover:shadow-[#B8860B]/30 transition-all duration-300 font-semibold"
        >
          Retry
        </button>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100',
      iconBg: 'bg-blue-500',
    },
    {
      title: 'Active Bookings',
      value: stats.activeBookings,
      icon: Calendar,
      gradient: 'from-green-500 to-green-600',
      bgGradient: 'from-green-50 to-green-100',
      iconBg: 'bg-green-500',
    },
    {
      title: 'Revenue (Today)',
      value: `₹${stats.todayRevenue.toLocaleString()}`,
      icon: TrendingUp,
      gradient: 'from-[#B8860B] to-[#D4AF37]',
      bgGradient: 'from-[#B8860B]/10 to-[#D4AF37]/10',
      iconBg: 'bg-gradient-to-r from-[#B8860B] to-[#D4AF37]',
    },
    {
      title: 'Occupancy Rate',
      value: `${stats.occupancyRate}%`,
      icon: Percent,
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-50 to-purple-100',
      iconBg: 'bg-purple-500',
    },
  ];

  const quickActions = [
    { label: 'Add New Room', tab: 'rooms', icon: '🛏️' },
    { label: 'View Bookings', tab: 'bookings', icon: '📅' },
    { label: 'Manage Users', tab: 'users', icon: '👤' },
    { label: 'Restaurant Tables', tab: 'restaurant', icon: '🍽️' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h2 className="text-3xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-[#B8860B] to-[#D4AF37] mb-2">
          Dashboard Overview
        </h2>
        <p className="text-[#6a6a6a]">Monitor your hotel's performance at a glance</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className={`bg-gradient-to-br ${card.bgGradient} rounded-2xl p-6 border border-${card.gradient.split('-')[1]}-200 hover:shadow-xl hover:scale-105 transition-all duration-300`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 ${card.iconBg} rounded-xl flex items-center justify-center shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-sm text-gray-600 mb-1 font-medium uppercase tracking-wide">{card.title}</p>
              <h3 className="text-3xl font-bold text-gray-800">{card.value}</h3>
            </div>
          );
        })}
      </div>

      {/* Quick Actions & System Status Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-gradient-to-br from-[#B8860B]/5 to-[#D4AF37]/5 rounded-2xl p-6 border border-[#B8860B]/20">
          <h3 className="text-xl font-serif text-[#2a2a2a] mb-6 flex items-center gap-2">
            <span className="w-2 h-2 bg-[#B8860B] rounded-full animate-pulse"></span>
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {quickActions.map((action) => (
              <button
                key={action.tab}
                onClick={() => setActiveTab(action.tab)}
                className="group flex items-center gap-3 p-4 bg-white rounded-xl hover:bg-gradient-to-r hover:from-[#B8860B] hover:to-[#D4AF37] hover:text-white transition-all duration-300 shadow-sm hover:shadow-lg border border-[#B8860B]/10"
              >
                <span className="text-2xl">{action.icon}</span>
                <span className="flex-1 text-left font-semibold text-sm">{action.label}</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </button>
            ))}
          </div>
        </div>

        {/* System Status */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
          <h3 className="text-xl font-serif text-[#2a2a2a] mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-600" />
            System Status
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-green-100">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-semibold text-gray-700">Server Status</span>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold uppercase">
                Online
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-green-100">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-semibold text-gray-700">Database</span>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold uppercase">
                Connected
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                <span className="font-semibold text-gray-700">Last Backup</span>
              </div>
              <span className="text-sm text-gray-600">Today, 04:00 AM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};