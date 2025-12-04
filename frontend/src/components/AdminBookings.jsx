import { useState, useEffect } from "react";
import { bookingAPI, banquetAPI, restaurantAPI } from "../api/api";
import {
  Download,
  Loader,
  X,
  Eye,
  TrendingUp,
  DollarSign,
  CheckCircle,
  XCircle,
  Search,
} from "lucide-react";
import { showToast } from "../utils/toast";

const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

export const AdminBookings = ({ selectedMonth, setSelectedMonth, initialFilter = "all" }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(initialFilter);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundAction, setRefundAction] = useState("approve");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [refundStatusFilter, setRefundStatusFilter] = useState("all");

  useEffect(() => {
    loadAllBookings();
  }, []);

  const loadAllBookings = async () => {
    setLoading(true);
    try {
      const [roomRes, banquetRes, restaurantRes] = await Promise.all([
        bookingAPI.getAllBookings().catch(() => ({ data: { bookings: [] } })),
        banquetAPI.getAllBookings().catch(() => ({ data: { bookings: [] } })),
        restaurantAPI
          .getAllBookings()
          .catch(() => ({ data: { bookings: [] } })),
      ]);

      const allBookings = [
        ...(roomRes.data.bookings || []).map((b) => ({ ...b, type: "room" })),
        ...(banquetRes.data.bookings || []).map((b) => ({
          ...b,
          type: "banquet",
        })),
        ...(restaurantRes.data.bookings || []).map((b) => ({
          ...b,
          type: "restaurant",
        })),
      ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setBookings(allBookings);
    } catch (error) {
      console.error("Error loading bookings:", error);
      showToast("Failed to load bookings", "error");
    } finally {
      setLoading(false);
    }
  };

  // Helper to get month index from date
  const getMonthIndex = (date) => {
    const d = new Date(date);
    return d.getMonth();
  };

  // Filter by type and month
  let filteredBookings;
  if (filter === "all") {
    filteredBookings = bookings;
  } else if (filter === "refunds") {
    filteredBookings = bookings.filter((b) => b.refundStatus && b.refundStatus !== "none");
  } else {
    filteredBookings = bookings.filter((b) => b.type === filter);
  }
  
  // Apply month filter if selected
  if (selectedMonth !== null && selectedMonth !== undefined) {
    filteredBookings = filteredBookings.filter((b) => 
      getMonthIndex(b.createdAt) === selectedMonth
    );
  }

  // Apply booking status filter
  if (statusFilter !== "all") {
    filteredBookings = filteredBookings.filter((b) => b.status === statusFilter);
  }

  // Apply refund status filter (for refunds page)
  if (refundStatusFilter !== "all") {
    filteredBookings = filteredBookings.filter((b) => b.refundStatus === refundStatusFilter);
  }

  // Apply search query
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filteredBookings = filteredBookings.filter((b) => {
      const guestName = `${b.guest?.firstName || ""} ${b.guest?.lastName || ""}`.toLowerCase();
      const email = (b.guest?.email || "").toLowerCase();
      const bookingNumber = (b.bookingNumber || "").toLowerCase();
      const checkInDate = b.checkInDate ? new Date(b.checkInDate).toLocaleDateString().toLowerCase() : "";
      const eventDate = b.eventDate ? new Date(b.eventDate).toLocaleDateString().toLowerCase() : "";
      const bookingDate = b.bookingDate ? new Date(b.bookingDate).toLocaleDateString().toLowerCase() : "";
      
      return (
        guestName.includes(query) ||
        email.includes(query) ||
        bookingNumber.includes(query) ||
        checkInDate.includes(query) ||
        eventDate.includes(query) ||
        bookingDate.includes(query)
      );
    });
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
      confirmed: "bg-green-100 text-green-800 border-green-300",
      "checked-in": "bg-blue-100 text-blue-800 border-blue-300",
      "checked-out": "bg-gray-100 text-gray-800 border-gray-300",
      completed: "bg-green-100 text-green-800 border-green-300",
      cancelled: "bg-red-100 text-red-800 border-red-300",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-300";
  };

  const calculateStats = () => {
    const total = filteredBookings.length;
    const confirmed = filteredBookings.filter(
      (b) => b.status === "confirmed"
    ).length;
    const pending = filteredBookings.filter(
      (b) => b.status === "pending"
    ).length;
    const revenue = filteredBookings
      .filter((b) => b.paymentStatus === "completed")
      .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

    return { total, confirmed, pending, revenue };
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setShowDetails(true);
  };

  const exportBookings = () => {
    try {
      const headers = [
        "Booking #",
        "Type",
        "Guest Name",
        "Email",
        "Phone",
        "Date",
        "Amount",
        "Status",
        "Payment",
      ];
      const rows = filteredBookings.map((b) => [
        b.bookingNumber,
        b.type,
        `${b.guest?.firstName || ""} ${b.guest?.lastName || ""}`,
        b.guest?.email || "",
        b.guest?.phone || "",
        b.checkInDate
          ? new Date(b.checkInDate).toLocaleDateString()
          : b.eventDate
          ? new Date(b.eventDate).toLocaleDateString()
          : b.bookingDate
          ? new Date(b.bookingDate).toLocaleDateString()
          : "",
        b.totalPrice || 0,
        b.status,
        b.paymentStatus || "pending",
      ]);

      const csvContent = [
        headers.join(","),
        ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `bookings-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      showToast("Bookings exported successfully", "success");
    } catch (error) {
      console.error("Error exporting bookings:", error);
      showToast("Failed to export bookings", "error");
    }
  };

  const handleProcessRefund = async () => {
    try {
      let api;
      switch (selectedBooking.type) {
        case "banquet":
          api = banquetAPI;
          break;
        case "restaurant":
          api = restaurantAPI;
          break;
        default:
          api = bookingAPI;
      }

      await api.updateRefundStatus(selectedBooking._id, {
        action: refundAction,
        reason: refundAction === "reject" ? "Rejected by admin" : undefined,
      });

      showToast(
        refundAction === "approve"
          ? "Refund processed successfully"
          : "Refund request rejected",
        "success"
      );

      // Reload bookings
      await loadAllBookings();
      setShowDetails(false);
      setShowRefundModal(false);
      setRefundAction("approve");
    } catch (error) {
      console.error("Error processing refund:", error);
      showToast("Failed to process refund", "error");
    }
  };

  const getRefundStatusColor = (status) => {
    const colors = {
      none: "text-gray-600",
      requested: "text-yellow-600",
      approved: "text-blue-600",
      rejected: "text-red-600",
      processed: "text-green-600",
    };
    return colors[status] || "text-gray-600";
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
      <div className="flex flex-col gap-4 mb-8">
        {/* Title Section */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-[#B8860B] to-[#D4AF37] mb-2">
            All Bookings
          </h2>
          <p className="text-[#6a6a6a]">Manage and track all reservations</p>
        </div>

        {/* Filters Row */}
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
          {/* Month Filter */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-semibold text-[#2a2a2a] whitespace-nowrap">Month:</label>
            <select
              value={selectedMonth === null ? "" : selectedMonth}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedMonth(val === "" ? null : parseInt(val));
              }}
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2 border-2 border-[#B8860B]/30 rounded-xl bg-white font-semibold text-[#2a2a2a] text-sm focus:outline-none focus:border-[#B8860B] transition"
            >
              <option value="">All Months</option>
              {months.map((m, i) => (
                <option key={i} value={i}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          
          {/* Booking Status Filter - Show on Bookings page */}
          {initialFilter === "all" && (
            <div className="flex items-center gap-2">
              <label className="text-sm font-semibold text-[#2a2a2a] whitespace-nowrap">Status:</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="flex-1 sm:flex-none px-3 sm:px-4 py-2 border-2 border-[#B8860B]/30 rounded-xl bg-white font-semibold text-[#2a2a2a] text-sm focus:outline-none focus:border-[#B8860B] transition"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="checked-in">Checked In</option>
                <option value="checked-out">Checked Out</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          )}

          {/* Refund Status Filter - Show on Refunds page */}
          {initialFilter === "refunds" && (
            <div className="flex items-center gap-2">
              <label className="text-sm font-semibold text-[#2a2a2a] whitespace-nowrap">Refund Status:</label>
              <select
                value={refundStatusFilter}
                onChange={(e) => setRefundStatusFilter(e.target.value)}
                className="flex-1 sm:flex-none px-3 sm:px-4 py-2 border-2 border-[#B8860B]/30 rounded-xl bg-white font-semibold text-[#2a2a2a] text-sm focus:outline-none focus:border-[#B8860B] transition"
              >
                <option value="all">All Refunds</option>
                <option value="requested">Requested</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="processed">Processed</option>
              </select>
            </div>
          )}

          {/* Export Button */}
          <button
            onClick={exportBookings}
            className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:shadow-lg hover:shadow-green-500/30 transition-all duration-300 font-semibold text-sm sm:ml-auto"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export CSV</span>
            <span className="sm:hidden">Export</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#6a6a6a]" />
          <input
            type="text"
            placeholder="Search by name, email, booking number, or date..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border-2 border-[#B8860B]/30 rounded-xl bg-white font-semibold text-[#2a2a2a] placeholder:text-[#6a6a6a] placeholder:font-normal focus:outline-none focus:border-[#B8860B] transition"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-blue-600 font-semibold uppercase tracking-wide">
              Total Bookings
            </p>
            <TrendingUp className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-blue-900">{stats.total}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-green-600 font-semibold uppercase tracking-wide">
              Confirmed
            </p>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-green-900">{stats.confirmed}</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-6 border border-yellow-200">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-yellow-600 font-semibold uppercase tracking-wide">
              Pending
            </p>
            <TrendingUp className="w-5 h-5 text-yellow-500" />
          </div>
          <p className="text-3xl font-bold text-yellow-900">{stats.pending}</p>
        </div>
        <div className="bg-gradient-to-br from-[#B8860B]/10 to-[#D4AF37]/10 rounded-2xl p-6 border border-[#B8860B]/20">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-[#B8860B] font-semibold uppercase tracking-wide">
              Revenue
            </p>
            <DollarSign className="w-5 h-5 text-[#B8860B]" />
          </div>
          <p className="text-3xl font-bold text-[#8B6914]">
            ₹{stats.revenue.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Filters - Hide when initialFilter is set */}
      {initialFilter === "all" && (
        <div className="flex flex-wrap gap-3 mb-8">
          {["all", "room", "banquet", "restaurant", "refunds"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-3 rounded-xl capitalize font-semibold transition-all duration-300 ${
                filter === f
                  ? "bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-white shadow-lg shadow-[#B8860B]/30"
                  : "bg-white text-[#2a2a2a] hover:bg-[#B8860B]/10 border-2 border-[#B8860B]/20"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      )}

      {/* Bookings Table */}
      <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(184,134,11,0.1)] overflow-hidden border border-[#B8860B]/20">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-[#B8860B]/10 to-[#D4AF37]/10">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#2a2a2a] uppercase tracking-wider">
                  Booking #
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#2a2a2a] uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#2a2a2a] uppercase tracking-wider">
                  Guest
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#2a2a2a] uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#2a2a2a] uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#2a2a2a] uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#2a2a2a] uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#2a2a2a] uppercase tracking-wider">
                  Refund Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#2a2a2a] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#B8860B]/10">
              {filteredBookings.map((booking) => (
                <tr
                  key={booking._id}
                  className="hover:bg-[#B8860B]/5 transition-colors"
                >
                  <td className="px-6 py-4 font-mono text-sm font-semibold text-[#2a2a2a]">
                    {booking.bookingNumber}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1.5 bg-[#B8860B]/10 text-[#B8860B] rounded-full text-xs uppercase font-bold">
                      {booking.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <p className="font-semibold text-[#2a2a2a]">
                        {booking.guest?.firstName} {booking.guest?.lastName}
                      </p>
                      <p className="text-[#6a6a6a] text-xs">
                        {booking.guest?.email}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#2a2a2a]">
                    {booking.checkInDate &&
                      new Date(booking.checkInDate).toLocaleDateString()}
                    {booking.eventDate &&
                      new Date(booking.eventDate).toLocaleDateString()}
                    {booking.bookingDate &&
                      new Date(booking.bookingDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 font-bold text-[#B8860B]">
                    {booking.totalPrice
                      ? `₹${booking.totalPrice.toLocaleString()}`
                      : "-"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-bold border-2 ${getStatusColor(
                        booking.status
                      )}`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs font-bold uppercase ${
                        booking.paymentStatus === "completed"
                          ? "text-green-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {booking.paymentStatus || "pending"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {booking.refundStatus && booking.refundStatus !== "none" ? (
                      <div className="flex flex-col">
                        <span
                          className={`text-xs font-bold uppercase ${getRefundStatusColor(
                            booking.refundStatus
                          )}`}
                        >
                          {booking.refundStatus}
                        </span>
                        {booking.refundAmount > 0 && (
                          <span className="text-xs text-gray-500">
                            ₹{booking.refundAmount.toLocaleString()}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">-</span>
                    )}
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
                <h4 className="text-sm font-bold text-[#2a2a2a] mb-3 uppercase tracking-wide">
                  Booking Information
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-[#6a6a6a] mb-1">
                      Booking Number
                    </p>
                    <p className="font-mono font-bold text-[#2a2a2a]">
                      {selectedBooking.bookingNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#6a6a6a] mb-1">Type</p>
                    <p className="font-bold capitalize text-[#2a2a2a]">
                      {selectedBooking.type}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#6a6a6a] mb-1">Status</p>
                    <span
                      className={`inline-block px-3 py-1.5 rounded-full text-xs font-bold border-2 ${getStatusColor(
                        selectedBooking.status
                      )}`}
                    >
                      {selectedBooking.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-[#6a6a6a] mb-1">
                      Payment Status
                    </p>
                    <p
                      className={`font-bold ${
                        selectedBooking.paymentStatus === "completed"
                          ? "text-green-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {selectedBooking.paymentStatus || "pending"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Guest Info */}
              <div>
                <h4 className="text-sm font-bold text-[#2a2a2a] mb-3 uppercase tracking-wide">
                  Guest Information
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-[#6a6a6a] mb-1">Name</p>
                    <p className="font-bold text-[#2a2a2a]">
                      {selectedBooking.guest?.firstName}{" "}
                      {selectedBooking.guest?.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#6a6a6a] mb-1">Email</p>
                    <p className="font-bold text-[#2a2a2a]">
                      {selectedBooking.guest?.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#6a6a6a] mb-1">Phone</p>
                    <p className="font-bold text-[#2a2a2a]">
                      {selectedBooking.guest?.phone || "N/A"}
                    </p>
                  </div>
                  {selectedBooking.numberOfGuests && (
                    <div>
                      <p className="text-xs text-[#6a6a6a] mb-1">
                        Number of Guests
                      </p>
                      <p className="font-bold text-[#2a2a2a]">
                        {selectedBooking.numberOfGuests}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Date Info */}
              <div>
                <h4 className="text-sm font-bold text-[#2a2a2a] mb-3 uppercase tracking-wide">
                  Date Information
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  {selectedBooking.checkInDate && (
                    <>
                      <div>
                        <p className="text-xs text-[#6a6a6a] mb-1">Check-in</p>
                        <p className="font-bold text-[#2a2a2a]">
                          {new Date(
                            selectedBooking.checkInDate
                          ).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-[#6a6a6a] mb-1">Check-out</p>
                        <p className="font-bold text-[#2a2a2a]">
                          {new Date(
                            selectedBooking.checkOutDate
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </>
                  )}
                  {selectedBooking.eventDate && (
                    <div>
                      <p className="text-xs text-[#6a6a6a] mb-1">Event Date</p>
                      <p className="font-bold text-[#2a2a2a]">
                        {new Date(
                          selectedBooking.eventDate
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  {selectedBooking.bookingDate && (
                    <div>
                      <p className="text-xs text-[#6a6a6a] mb-1">
                        Booking Date
                      </p>
                      <p className="font-bold text-[#2a2a2a]">
                        {new Date(
                          selectedBooking.bookingDate
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-[#6a6a6a] mb-1">Created At</p>
                    <p className="font-bold text-[#2a2a2a]">
                      {new Date(selectedBooking.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Price Info */}
              <div className="bg-gradient-to-br from-[#B8860B]/10 to-[#D4AF37]/10 rounded-xl p-4">
                <h4 className="text-sm font-bold text-[#2a2a2a] mb-3 uppercase tracking-wide">
                  Price Information
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-[#6a6a6a] mb-1">Total Price</p>
                    <p className="text-2xl font-bold text-[#B8860B]">
                      ₹{selectedBooking.totalPrice?.toLocaleString() || 0}
                    </p>
                  </div>
                  {selectedBooking.numberOfNights && (
                    <div>
                      <p className="text-xs text-[#6a6a6a] mb-1">
                        Number of Nights
                      </p>
                      <p className="font-bold text-[#2a2a2a]">
                        {selectedBooking.numberOfNights}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Special Requests */}
              {selectedBooking.specialRequests && (
                <div>
                  <h4 className="text-sm font-bold text-[#2a2a2a] mb-3 uppercase tracking-wide">
                    Special Requests
                  </h4>
                  <p className="text-sm text-[#2a2a2a] bg-[#B8860B]/5 p-4 rounded-xl">
                    {selectedBooking.specialRequests}
                  </p>
                </div>
              )}

              {/* Refund Section */}
              {selectedBooking.refundStatus &&
                selectedBooking.refundStatus !== "none" && (
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                    <h4 className="text-sm font-bold text-[#2a2a2a] mb-3 uppercase tracking-wide">
                      Refund Request
                    </h4>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-[#6a6a6a]">Status</span>
                        <span
                          className={`text-sm font-bold ${getRefundStatusColor(
                            selectedBooking.refundStatus
                          )}`}
                        >
                          {selectedBooking.refundStatus}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-[#6a6a6a]">Amount</span>
                        <span className="text-sm font-bold text-[#2a2a2a]">
                          ₹{selectedBooking.refundAmount?.toLocaleString() || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-[#6a6a6a]">Reason</span>
                        <span className="text-sm font-bold text-[#2a2a2a]">
                          {selectedBooking.refundReason || "N/A"}
                        </span>
                      </div>
                      {selectedBooking.refundRequestedAt && (
                        <div className="flex justify-between">
                          <span className="text-sm text-[#6a6a6a]">
                            Requested
                          </span>
                          <span className="text-sm font-bold text-[#2a2a2a]">
                            {new Date(
                              selectedBooking.refundRequestedAt
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>

                    {selectedBooking.refundStatus === "requested" && (
                      <button
                        onClick={() => setShowRefundModal(true)}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm"
                      >
                        Process Refund
                      </button>
                    )}

                    {selectedBooking.refundStatus === "processed" && (
                      <div className="flex items-center gap-2 text-green-600 text-sm font-semibold">
                        <CheckCircle className="w-5 h-5" />
                        Refund ID: {selectedBooking.refundId}
                      </div>
                    )}
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

      {/* Refund Processing Modal */}
      {showRefundModal && selectedBooking && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-serif text-[#2a2a2a]">
                Process Refund
              </h3>
              <button
                onClick={() => {
                  setShowRefundModal(false);
                  setRefundAction("approve");
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-[#6a6a6a] mb-1">Booking</p>
              <p className="font-bold text-[#2a2a2a]">
                {selectedBooking.bookingNumber}
              </p>
              <p className="text-sm text-[#6a6a6a] mt-2 mb-1">Refund Amount</p>
              <p className="text-xl font-bold text-green-600">
                ₹{selectedBooking.refundAmount?.toLocaleString()}
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold text-[#2a2a2a] mb-3">
                Action
              </label>
              <div className="flex gap-4">
                <label
                  className="flex items-center gap-2 p-3 border-2 rounded-lg cursor-pointer"
                  style={{
                    borderColor:
                      refundAction === "approve" ? "#B8860B" : "#ddd",
                    backgroundColor:
                      refundAction === "approve" ? "#B8860B/10" : "transparent",
                  }}
                >
                  <input
                    type="radio"
                    name="refund_action"
                    value="approve"
                    checked={refundAction === "approve"}
                    onChange={(e) => setRefundAction(e.target.value)}
                  />
                  <div>
                    <p className="font-semibold text-[#2a2a2a]">Approve</p>
                    <p className="text-xs text-[#6a6a6a]">Process refund</p>
                  </div>
                </label>

                <label
                  className="flex items-center gap-2 p-3 border-2 rounded-lg cursor-pointer"
                  style={{
                    borderColor: refundAction === "reject" ? "#B8860B" : "#ddd",
                    backgroundColor:
                      refundAction === "reject" ? "#B8860B/10" : "transparent",
                  }}
                >
                  <input
                    type="radio"
                    name="refund_action"
                    value="reject"
                    checked={refundAction === "reject"}
                    onChange={(e) => setRefundAction(e.target.value)}
                  />
                  <div>
                    <p className="font-semibold text-[#2a2a2a]">Reject</p>
                    <p className="text-xs text-[#6a6a6a]">Deny refund</p>
                  </div>
                </label>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRefundModal(false);
                  setRefundAction("approve");
                }}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleProcessRefund}
                className={`flex-1 px-4 py-3 text-white rounded-lg transition-colors font-semibold ${
                  refundAction === "approve"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {refundAction === "approve" ? "Process Refund" : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
