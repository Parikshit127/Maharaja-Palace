import { useState, useEffect } from "react";
import {
  authAPI,
  bookingAPI,
  banquetAPI,
  restaurantAPI,
  roomAPI,
} from "../api/api";
import {
  Loader,
  Users,
  Calendar,
  TrendingUp,
  Percent,
  ArrowRight,
} from "lucide-react";
import { showToast } from "../utils/toast";

/* ---------------------------------------------
   MONTHS ARRAY FOR SELECTION
---------------------------------------------- */
const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

export const AdminDashboard = ({
  setActiveTab,
  selectedMonth,
  setSelectedMonth,
}) => {
  /* ---------------------------------------------
      EXISTING STATES
  ---------------------------------------------- */
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeBookings: 0,
    todayRevenue: 0,
    occupancyRate: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ---------------------------------------------
      NEW: booking arrays for month filtering
  ---------------------------------------------- */
  const [allRoomBookings, setAllRoomBookings] = useState([]);
  const [allBanquetBookings, setAllBanquetBookings] = useState([]);
  const [allRestaurantBookings, setAllRestaurantBookings] = useState([]);

  const [monthlyData, setMonthlyData] = useState({
    revenue: 0,
    bookings: [],
  });

  const [isMonthMode, setIsMonthMode] = useState(false);

  /* ---------------------------------------------
      MONTH FILTER HELPERS
  ---------------------------------------------- */
  const getMonthIndex = (date) => {
    const d = new Date(date);
    return d.getMonth();
  };

  const handleMonthClick = (monthIndex) => {
    setSelectedMonth(monthIndex);
    setIsMonthMode(true);

    const room = allRoomBookings.filter(
      (b) => getMonthIndex(b.createdAt) === monthIndex
    );
    const banquet = allBanquetBookings.filter(
      (b) => getMonthIndex(b.createdAt) === monthIndex
    );
    const restaurant = allRestaurantBookings.filter(
      (b) => getMonthIndex(b.createdAt) === monthIndex
    );

    const merged = [...room, ...banquet, ...restaurant];
    const revenue = merged.reduce((sum, b) => sum + (b.totalPrice || 0), 0);

    setMonthlyData({
      revenue,
      bookings: merged,
    });
  };

  /* ---------------------------------------------
      LOAD DASHBOARD STATS
  ---------------------------------------------- */
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

      setAllRoomBookings(roomBookings);
      setAllBanquetBookings(banquetBookings);
      setAllRestaurantBookings(restaurantBookings);

      const activeBookings =
        roomBookings.filter((b) => !["cancelled", "checked-out"].includes(b.status)).length +
        banquetBookings.filter((b) => !["cancelled", "completed"].includes(b.status)).length +
        restaurantBookings.filter((b) => !["cancelled", "completed"].includes(b.status)).length;

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
      setError("Failed to load dashboard statistics");
      showToast("Failed to load dashboard statistics", "error");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------------------------------------
      CALCULATIONS
  ---------------------------------------------- */
  const calculateTodayRevenue = (
    roomBookings,
    banquetBookings,
    restaurantBookings
  ) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let revenue = 0;

    const checkRevenue = (booking) => {
      const d = new Date(booking.createdAt);
      d.setHours(0, 0, 0, 0);
      if (d.getTime() === today.getTime() && booking.paymentStatus === "completed") {
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
    const occupied = rooms.filter((r) => r.status === "occupied").length;
    return Math.round((occupied / rooms.length) * 100);
  };

  /* ---------------------------------------------
      LOADING / ERROR UI
  ---------------------------------------------- */
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-[#B8860B] mx-auto mb-4" />
          <p className="text-[#6a6a6a] font-semibold">
            Loading dashboard data...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-600 text-lg font-semibold">
          {error}
        </p>
      </div>
    );
  }

  /* ---------------------------------------------
      DYNAMIC STAT CARDS (UPDATED FOR MONTH MODE)
  ---------------------------------------------- */
  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-50 to-blue-100",
      iconBg: "bg-blue-500",
    },
    {
      title: isMonthMode ? "Active Bookings (Month)" : "Active Bookings",
      value: isMonthMode ? monthlyData.bookings.length : stats.activeBookings,
      icon: Calendar,
      gradient: "from-green-500 to-green-600",
      bgGradient: "from-green-50 to-green-100",
      iconBg: "bg-green-500",
    },
    {
      title: isMonthMode ? "Revenue (Month)" : "Revenue (Today)",
      value: isMonthMode
        ? `₹${monthlyData.revenue.toLocaleString()}`
        : `₹${stats.todayRevenue.toLocaleString()}`,
      icon: TrendingUp,
      gradient: "from-[#B8860B] to-[#D4AF37]",
      bgGradient: "from-[#B8860B]/10 to-[#D4AF37]/10",
      iconBg: "bg-gradient-to-r from-[#B8860B] to-[#D4AF37]",
    },
    {
      title: "Occupancy Rate",
      value: `${stats.occupancyRate}%`,
      icon: Percent,
      gradient: "from-purple-500 to-purple-600",
      bgGradient: "from-purple-50 to-purple-100",
      iconBg: "bg-purple-500",
    },
  ];

  const quickActions = [
    { label: "Add New Room", tab: "rooms", icon: "🛏️" },
    { label: "View Bookings", tab: "bookings", icon: "📅" },
    { label: "Manage Users", tab: "users", icon: "👤" },
    { label: "Restaurant Tables", tab: "restaurant", icon: "🍽️" },
  ];

  /* ---------------------------------------------
      HEADER + MONTH SELECTOR (AT TOP)
  ---------------------------------------------- */
  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-[#B8860B] to-[#D4AF37]">
            Dashboard Overview
          </h2>
          <p className="text-[#6a6a6a]">Monitor your hotel's performance at a glance</p>
        </div>

        {/* MONTH SELECTOR DROPDOWN */}
        <div className="flex items-center gap-3">
          <label className="text-sm font-semibold text-[#2a2a2a]">Filter by Month:</label>
          <select
            value={selectedMonth === null ? "" : selectedMonth}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "") {
                setSelectedMonth(null);
                setIsMonthMode(false);
              } else {
                handleMonthClick(parseInt(val));
              }
            }}
            className="px-4 py-2 border-2 border-[#B8860B]/30 rounded-xl bg-white font-semibold text-[#2a2a2a] focus:outline-none focus:border-[#B8860B] transition"
          >
            <option value="">All Time</option>
            {months.map((m, i) => (
              <option key={i} value={i}>
                {m}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className={`bg-gradient-to-br ${card.bgGradient} rounded-2xl p-6 border hover:shadow-xl transition`}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-12 h-12 ${card.iconBg} rounded-xl flex items-center justify-center shadow-lg`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-1 uppercase tracking-wide">
                {card.title}
              </p>

              <h3 className="text-3xl font-bold text-gray-800">
                {card.value}
              </h3>
            </div>
          );
        })}
      </div>

      {/* QUICK ACTIONS */}
      <div className="bg-gradient-to-br from-[#B8860B]/5 to-[#D4AF37]/5 rounded-2xl p-6 border border-[#B8860B]/20">
        <h3 className="text-xl font-serif mb-6">
          Quick Actions
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {quickActions.map((action) => (
            <button
              key={action.tab}
              onClick={() => setActiveTab(action.tab)}
              className="group flex items-center gap-3 p-4 bg-white rounded-xl border hover:bg-gradient-to-r hover:from-[#B8860B] hover:to-[#D4AF37] hover:text-white transition shadow-sm"
            >
              <span className="text-2xl">{action.icon}</span>
              <span className="font-semibold">{action.label}</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition ml-auto" />
            </button>
          ))}
        </div>
      </div>

      {/* ---------------------------------------------
          NOTE:
          - Month grid REMOVED - replaced with dropdown
          - System Status section REMOVED COMPLETELY
          - Booking list REMOVED from overview
          - This keeps the dashboard clean & premium
      ---------------------------------------------- */}

    </div>
  );
};
