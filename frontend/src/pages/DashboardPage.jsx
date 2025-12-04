import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { bookingAPI, restaurantAPI, banquetAPI } from "../api/api";
import {
  Calendar,
  CreditCard,
  Users,
  MapPin,
  Clock,
  Phone,
  Mail,
  ChevronRight,
  TrendingUp,
} from "lucide-react";

export const DashboardPage = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [banquetBookings, setBanquetBookings] = useState([]);
  const [restaurantBookings, setRestaurantBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  // 🔹 NEW: Modal state for "View Details"
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [refundReason, setRefundReason] = useState("");
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundLoading, setRefundLoading] = useState(false);
  // Debug toggle to force-show refund buttons during testing
  const [debugShowRefunds, setDebugShowRefunds] = useState(false);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const [roomRes, banquetRes, restaurantRes] = await Promise.all([
        bookingAPI.getMyBookings().catch(() => ({ data: { bookings: [] } })),
        banquetAPI.getMyBookings().catch(() => ({ data: { bookings: [] } })),
        restaurantAPI.getMyBookings().catch(() => ({ data: { bookings: [] } })),
      ]);

      setBookings(roomRes.data.bookings || []);
      setBanquetBookings(banquetRes.data.bookings || []);
      setRestaurantBookings(restaurantRes.data.bookings || []);
    } catch (error) {
      console.error("Error loading bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalSpent = () => {
    // Exclude refunded bookings from total spent
    const roomTotal = bookings
      .filter((b) => b.refundStatus !== "processed")
      .reduce((sum, b) => sum + (b.totalPrice || 0), 0);
    const banquetTotal = banquetBookings
      .filter((b) => b.refundStatus !== "processed")
      .reduce((sum, b) => sum + (b.totalPrice || 0), 0);
    const restaurantTotal = restaurantBookings
      .filter((b) => b.refundStatus !== "processed")
      .reduce((sum, b) => sum + (b.totalPrice || 0), 0);
    return roomTotal + banquetTotal + restaurantTotal;
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
      confirmed: "bg-green-100 text-green-800 border-green-300",
      "checked-in": "bg-blue-100 text-blue-800 border-blue-300",
      "checked-out": "bg-gray-100 text-gray-800 border-gray-300",
      completed: "bg-green-100 text-green-800 border-green-300",
      cancelled: "bg-red-100 text-red-800 border-red-300",
      "no-show": "bg-red-100 text-red-800 border-red-300",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-300";
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      pending: "text-yellow-600",
      completed: "text-green-600",
      failed: "text-red-600",
      refunded: "text-blue-600",
    };
    return colors[status] || "text-gray-600";
  };

  // 🔹 NEW: Open / close details modal
  const openDetails = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const closeDetails = () => {
    setShowModal(false);
    setSelectedBooking(null);
  };

  // 🔹 NEW: Load Razorpay Script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // 🔹 NEW: Handle Request Refund
  const handleRequestRefund = async () => {
    if (!refundReason.trim()) {
      alert("Please enter a reason for refund");
      return;
    }

    setRefundLoading(true);
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

      const response = await api.requestRefund(selectedBooking._id, {
        reason: refundReason,
      });

      console.log("Refund request submitted:", response);

      // Update selected booking with new refund status
      const updatedBooking = { ...selectedBooking, ...response.data.booking };
      setSelectedBooking(updatedBooking);

      // Reload bookings to show updated status
      await loadBookings();

      setShowRefundModal(false);
      setRefundReason("");
      alert(
        "Refund request submitted successfully! Admin will review and process it shortly."
      );
    } catch (error) {
      console.error("Failed to request refund:", error);
      alert("Failed to request refund. Please try again.");
    } finally {
      setRefundLoading(false);
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
  const handlePayRemaining = async (booking) => {
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert("Razorpay SDK failed to load");
        return;
      }

      const remainingAmount = booking.totalPrice - (booking.paidAmount || 0);

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_RmTd6UtrZwwmTT",
        amount: remainingAmount * 100,
        currency: "INR",
        name: "Maharaja Palace",
        description: `Remaining Payment for ${booking.bookingNumber}`,
        image:
          "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=200",
        handler: async function (response) {
          console.log("Payment successful:", response);

          try {
            // Update payment in backend
            if (booking.type === "room") {
              await bookingAPI.updatePayment(booking._id, {
                amount: remainingAmount,
                paymentId: response.razorpay_payment_id,
              });
            } else if (booking.type === "banquet") {
              await banquetAPI.updatePayment(booking._id, {
                amount: remainingAmount,
                paymentId: response.razorpay_payment_id,
              });
            } else if (booking.type === "restaurant") {
              await restaurantAPI.updatePayment(booking._id, {
                amount: remainingAmount,
                paymentId: response.razorpay_payment_id,
              });
            }

            // Reload bookings
            loadBookings();
            if (selectedBooking) closeDetails();
            alert("Payment successful!");
          } catch (error) {
            console.error("Failed to update payment status:", error);
            alert(
              "Payment successful but failed to update status. Please contact support."
            );
          }
        },
        prefill: {
          name: `${user?.firstName} ${user?.lastName}`,
          email: user?.email,
          contact: user?.phone || "",
        },
        theme: {
          color: "#B8860B",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment initialization failed:", error);
      alert("Failed to initialize payment");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBF9F4] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#B8860B] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#B8860B] font-semibold">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  const allBookings = [
    ...bookings.map((b) => ({ ...b, type: "room" })),
    ...banquetBookings.map((b) => ({ ...b, type: "banquet" })),
    ...restaurantBookings.map((b) => ({ ...b, type: "restaurant" })),
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const filteredBookings =
    activeTab === "all"
      ? allBookings
      : allBookings.filter((b) => b.type === activeTab);

  return (
    <div className="pt-[90px]">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-[#1a1a1a] to-[#2a2a2a] text-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-6">
            <div>
              <h1 className="text-5xl md:text-6xl font-serif mb-3">
                Welcome back,{" "}
                <span className="text-[#D4AF37]">{user?.firstName}</span>
              </h1>
              <p className="text-xl text-white/70">
                Manage your royal experiences
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-8 pb-16">
        {/* Debug toggle (only visible in development builds) */}
        {import.meta.env.DEV && (
          <div className="flex justify-end mb-4">
            <label className="inline-flex items-center gap-2 text-sm text-[#6a6a6a]">
              <input
                type="checkbox"
                checked={debugShowRefunds}
                onChange={() => setDebugShowRefunds((v) => !v)}
                className="form-checkbox h-4 w-4 text-[#B8860B]"
              />
              <span className="font-medium">Debug: Show Refund Buttons</span>
            </label>
          </div>
        )}
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {/* ... stats cards ... */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#B8860B]/20 transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#B8860B] to-[#D4AF37] rounded-xl flex items-center justify-center">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-[#2a2a2a] mb-1">
              {bookings.length}
            </div>
            <p className="text-sm text-[#6a6a6a]">Room Bookings</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#B8860B]/20 transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#8B6914] to-[#B8860B] rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-[#2a2a2a] mb-1">
              {banquetBookings.length}
            </div>
            <p className="text-sm text-[#6a6a6a]">Banquet Events</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#B8860B]/20 transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-[#F4CF47] rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-[#2a2a2a] mb-1">
              {restaurantBookings.length}
            </div>
            <p className="text-sm text-[#6a6a6a]">Dining Reservations</p>
          </div>

          <div className="bg-gradient-to-br from-[#B8860B] to-[#D4AF37] rounded-2xl p-6 shadow-lg transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              ₹{calculateTotalSpent().toLocaleString()}
            </div>
            <p className="text-sm text-white/80">Total Spent</p>
          </div>
        </div>

        {/* User Info Card */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#B8860B]/20 mb-12">
          <h2 className="text-2xl font-serif text-[#2a2a2a] mb-6">
            Account Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#B8860B]/10 rounded-xl flex items-center justify-center">
                <Mail className="w-6 h-6 text-[#B8860B]" />
              </div>
              <div>
                <p className="text-sm text-[#6a6a6a]">Email Address</p>
                <p className="text-[#2a2a2a] font-semibold">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#B8860B]/10 rounded-xl flex items-center justify-center">
                <Phone className="w-6 h-6 text-[#B8860B]" />
              </div>
              <div>
                <p className="text-sm text-[#6a6a6a]">Phone Number</p>
                <p className="text-[#2a2a2a] font-semibold">
                  {user?.phone || "Not provided"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bookings Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-[#B8860B]/20 overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-[#B8860B]/20">
            <div className="flex overflow-x-auto">
              {[
                { id: "all", label: "All Bookings", count: allBookings.length },
                { id: "room", label: "Rooms", count: bookings.length },
                {
                  id: "banquet",
                  label: "Banquets",
                  count: banquetBookings.length,
                },
                {
                  id: "restaurant",
                  label: "Dining",
                  count: restaurantBookings.length,
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-8 py-4 font-semibold transition-all duration-300 border-b-2 whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-[#B8860B] text-[#B8860B] bg-[#B8860B]/5"
                      : "border-transparent text-[#6a6a6a] hover:text-[#B8860B] hover:bg-[#B8860B]/5"
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>
          </div>

          {/* Bookings List */}
          <div className="p-8">
            {filteredBookings.length > 0 ? (
              <div className="space-y-6">
                {filteredBookings.map((booking) => (
                  <div
                    key={booking._id}
                    className="border border-[#B8860B]/20 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:border-[#B8860B]/40"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-xs uppercase tracking-wider font-semibold text-[#B8860B] bg-[#B8860B]/10 px-3 py-1 rounded-full">
                            {booking.type}
                          </span>
                          <span
                            className={`text-xs uppercase tracking-wider font-semibold px-3 py-1 rounded-full border ${getStatusColor(
                              booking.paymentStatus === "completed" &&
                                booking.status === "pending"
                                ? "confirmed"
                                : booking.status
                            )}`}
                          >
                            {booking.paymentStatus === "completed" &&
                            booking.status === "pending"
                              ? "confirmed"
                              : booking.status}
                          </span>
                        </div>
                        <h3 className="text-xl font-serif text-[#2a2a2a] mb-1">
                          {booking.bookingNumber}
                        </h3>
                        {booking.type === "room" && booking.room && (
                          <p className="text-sm text-[#6a6a6a]">
                            Room {booking.room.roomNumber} -{" "}
                            {booking.room.roomType}
                          </p>
                        )}
                        {booking.type === "banquet" && (
                          <p className="text-sm text-[#6a6a6a] capitalize">
                            {booking.eventType} Event
                          </p>
                        )}
                        {booking.type === "restaurant" && (
                          <p className="text-sm text-[#6a6a6a] capitalize">
                            {booking.timeSlot?.replace("_", " ")}
                          </p>
                        )}
                      </div>
                      {booking.totalPrice && (
                        <div className="text-right">
                          <p className="text-2xl font-bold text-[#B8860B]">
                            ₹{booking.totalPrice.toLocaleString()}
                          </p>
                          {booking.paymentStatus && (
                            <div className="flex flex-col items-end">
                              <p
                                className={`text-sm font-semibold ${getPaymentStatusColor(
                                  booking.paymentStatus
                                )}`}
                              >
                                {booking.refundStatus === "approved" ? (
                                  <span className="text-blue-600">
                                    Refund Approved
                                  </span>
                                ) : booking.refundStatus === "processed" ? (
                                  <span className="text-green-600">
                                    Refunded
                                  </span>
                                ) : booking.refundStatus === "rejected" ? (
                                  <span className="text-red-600">
                                    Refund Rejected
                                  </span>
                                ) : booking.refundStatus === "requested" ? (
                                  <span className="text-yellow-600">
                                    Refund Requested
                                  </span>
                                ) : booking.paymentStatus === "completed" ? (
                                  "✓ Paid"
                                ) : booking.paymentStatus === "partial" ? (
                                  `${Math.round(
                                    ((booking.totalPrice -
                                      (booking.paidAmount || 0)) /
                                      booking.totalPrice) *
                                      100
                                  )}% Remaining`
                                ) : (
                                  booking.paymentStatus
                                )}
                              </p>
                              {booking.paymentStatus === "partial" &&
                                booking.status !== "cancelled" && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handlePayRemaining(booking);
                                    }}
                                    className="mt-2 text-xs bg-[#B8860B] text-white px-3 py-1 rounded hover:bg-[#8B6914] transition-colors"
                                  >
                                    Pay Remaining ₹
                                    {(
                                      booking.totalPrice -
                                      (booking.paidAmount || 0)
                                    ).toLocaleString()}
                                  </button>
                                )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      {booking.type === "room" && (
                        <>
                          <div className="flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-[#B8860B]" />
                            <div>
                              <p className="text-xs text-[#6a6a6a]">Check-in</p>
                              <p className="text-sm font-semibold text-[#2a2a2a]">
                                {new Date(
                                  booking.checkInDate
                                ).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-[#B8860B]" />
                            <div>
                              <p className="text-xs text-[#6a6a6a]">
                                Check-out
                              </p>
                              <p className="text-sm font-semibold text-[#2a2a2a]">
                                {new Date(
                                  booking.checkOutDate
                                ).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Clock className="w-5 h-5 text-[#B8860B]" />
                            <div>
                              <p className="text-xs text-[#6a6a6a]">Duration</p>
                              <p className="text-sm font-semibold text-[#2a2a2a]">
                                {booking.numberOfNights} night
                                {booking.numberOfNights > 1 ? "s" : ""}
                              </p>
                            </div>
                          </div>
                        </>
                      )}
                      {booking.type === "banquet" && (
                        <>
                          <div className="flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-[#B8860B]" />
                            <div>
                              <p className="text-xs text-[#6a6a6a]">
                                Event Date
                              </p>
                              <p className="text-sm font-semibold text-[#2a2a2a]">
                                {new Date(booking.eventDate).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  }
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Users className="w-5 h-5 text-[#B8860B]" />
                            <div>
                              <p className="text-xs text-[#6a6a6a]">
                                Expected Guests
                              </p>
                              <p className="text-sm font-semibold text-[#2a2a2a]">
                                {booking.expectedGuests} guests
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <MapPin className="w-5 h-5 text-[#B8860B]" />
                            <div>
                              <p className="text-xs text-[#6a6a6a]">
                                Setup Type
                              </p>
                              <p className="text-sm font-semibold text-[#2a2a2a] capitalize">
                                {booking.setupType}
                              </p>
                            </div>
                          </div>
                        </>
                      )}
                      {booking.type === "restaurant" && (
                        <>
                          <div className="flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-[#B8860B]" />
                            <div>
                              <p className="text-xs text-[#6a6a6a]">
                                Booking Date
                              </p>
                              <p className="text-sm font-semibold text-[#2a2a2a]">
                                {new Date(
                                  booking.bookingDate
                                ).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Users className="w-5 h-5 text-[#B8860B]" />
                            <div>
                              <p className="text-xs text-[#6a6a6a]">Guests</p>
                              <p className="text-sm font-semibold text-[#2a2a2a]">
                                {booking.numberOfGuests} guest
                                {booking.numberOfGuests > 1 ? "s" : ""}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Clock className="w-5 h-5 text-[#B8860B]" />
                            <div>
                              <p className="text-xs text-[#6a6a6a]">
                                Time Slot
                              </p>
                              <p className="text-sm font-semibold text-[#2a2a2a] capitalize">
                                {booking.timeSlot?.replace("_", " ")}
                              </p>
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    {(booking.specialRequests ||
                      booking.specialRequirements ||
                      booking.specialDietaryRequirements) && (
                      <div className="bg-[#B8860B]/5 rounded-lg p-4 mb-4">
                        <p className="text-xs text-[#6a6a6a] mb-1">
                          Special Requests
                        </p>
                        <p className="text-sm text-[#2a2a2a]">
                          {booking.specialRequests ||
                            booking.specialRequirements ||
                            booking.specialDietaryRequirements}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-[#B8860B]/10">
                      <p className="text-xs text-[#6a6a6a]">
                        Booked on{" "}
                        {new Date(booking.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </p>
                      <div className="flex items-center gap-3">
                        {booking.paymentStatus === "completed" &&
                          booking.status !== "cancelled" &&
                          (!booking.refundStatus ||
                            booking.refundStatus === "none" ||
                            booking.refundStatus === "rejected") && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedBooking(booking);
                                setShowRefundModal(true);
                              }}
                              className="flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700 transition-colors bg-red-50 px-4 py-2 rounded-lg hover:bg-red-100"
                            >
                              Request Refund
                            </button>
                          )}
                        {booking.refundStatus === "requested" && (
                          <span className="text-xs font-semibold text-yellow-600 bg-yellow-50 px-3 py-2 rounded-lg">
                            Refund Pending
                          </span>
                        )}
                        {booking.refundStatus === "processed" && (
                          <span className="text-xs font-semibold text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                            ✓ Refunded
                          </span>
                        )}
                        <button
                          onClick={() => openDetails(booking)}
                          className="flex items-center gap-2 text-sm font-semibold text-[#B8860B] hover:text-[#8B6914] transition-colors"
                        >
                          View Details
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-[#B8860B]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-10 h-10 text-[#B8860B]" />
                </div>
                <h3 className="text-xl font-serif text-[#2a2a2a] mb-2">
                  No bookings yet
                </h3>
                <p className="text-[#6a6a6a] mb-6">
                  Start your royal journey by making your first booking
                </p>
                <a
                  href="/rooms"
                  className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300"
                >
                  Browse Rooms
                  <ChevronRight className="w-5 h-5" />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 🔹 VIEW DETAILS MODAL */}
      {showModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative border border-[#B8860B]/30">
            {/* Close icon */}
            <button
              onClick={closeDetails}
              className="absolute top-4 right-4 text-gray-600 hover:text-black text-xl"
            >
              ×
            </button>

            <h2 className="text-3xl font-serif text-[#B8860B] mb-4">
              Booking Details
            </h2>

            <p className="text-sm text-[#6a6a6a] mb-1">
              Booking ID:{" "}
              <span className="font-semibold text-[#2a2a2a]">
                {selectedBooking.bookingNumber}
              </span>
            </p>
            <p className="text-sm text-[#6a6a6a] mb-4">
              Status:{" "}
              <span className="font-semibold text-[#2a2a2a] capitalize">
                {selectedBooking.status}
              </span>
            </p>

            {/* TYPE-SPECIFIC DETAILS */}
            {selectedBooking.type === "room" && (
              <div className="space-y-2 mb-4">
                <p>
                  <span className="font-semibold">Room:</span>{" "}
                  {selectedBooking.room?.roomNumber} –{" "}
                  {selectedBooking.room?.roomType}
                </p>
                <p>
                  <span className="font-semibold">Check-in:</span>{" "}
                  {new Date(selectedBooking.checkInDate).toLocaleDateString()}
                </p>
                <p>
                  <span className="font-semibold">Check-out:</span>{" "}
                  {new Date(selectedBooking.checkOutDate).toLocaleDateString()}
                </p>
                <p>
                  <span className="font-semibold">Nights:</span>{" "}
                  {selectedBooking.numberOfNights}
                </p>
                {selectedBooking.totalPrice && (
                  <p>
                    <span className="font-semibold">Total Price:</span> ₹
                    {selectedBooking.totalPrice.toLocaleString()}
                  </p>
                )}
              </div>
            )}

            {selectedBooking.type === "banquet" && (
              <div className="space-y-2 mb-4">
                <p>
                  <span className="font-semibold">Event:</span>{" "}
                  {selectedBooking.eventType}
                </p>
                <p>
                  <span className="font-semibold">Event Date:</span>{" "}
                  {new Date(selectedBooking.eventDate).toLocaleDateString()}
                </p>
                <p>
                  <span className="font-semibold">Expected Guests:</span>{" "}
                  {selectedBooking.expectedGuests}
                </p>
                <p>
                  <span className="font-semibold">Setup Type:</span>{" "}
                  {selectedBooking.setupType}
                </p>
                {selectedBooking.totalPrice && (
                  <p>
                    <span className="font-semibold">Total Price:</span> ₹
                    {selectedBooking.totalPrice.toLocaleString()}
                  </p>
                )}
              </div>
            )}

            {selectedBooking.type === "restaurant" && (
              <div className="space-y-2 mb-4">
                <p>
                  <span className="font-semibold">Booking Date:</span>{" "}
                  {new Date(selectedBooking.bookingDate).toLocaleDateString()}
                </p>
                <p>
                  <span className="font-semibold">Guests:</span>{" "}
                  {selectedBooking.numberOfGuests}
                </p>
                <p>
                  <span className="font-semibold">Time Slot:</span>{" "}
                  {selectedBooking.timeSlot?.replace("_", " ")}
                </p>
              </div>
            )}

            {(selectedBooking.specialRequests ||
              selectedBooking.specialRequirements ||
              selectedBooking.specialDietaryRequirements) && (
              <div className="mt-2 p-3 bg-[#B8860B]/10 rounded-lg">
                <p className="font-semibold text-gray-800 mb-1">
                  Special Requests:
                </p>
                <p className="text-gray-700 text-sm">
                  {selectedBooking.specialRequests ||
                    selectedBooking.specialRequirements ||
                    selectedBooking.specialDietaryRequirements}
                </p>
              </div>
            )}

            {/* Pay Remaining Button in Modal */}
            {selectedBooking.paymentStatus === "partial" &&
              selectedBooking.status !== "cancelled" && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-yellow-800">
                      Remaining Balance
                    </span>
                    <span className="text-lg font-bold text-[#B8860B]">
                      ₹
                      {(
                        selectedBooking.totalPrice -
                        (selectedBooking.paidAmount || 0)
                      ).toLocaleString()}
                    </span>
                  </div>
                  <button
                    onClick={() => handlePayRemaining(selectedBooking)}
                    className="w-full bg-[#B8860B] text-white py-2 rounded-lg font-semibold hover:bg-[#8B6914] transition-colors"
                  >
                    Pay Remaining Balance
                  </button>
                </div>
              )}

            {/* Refund Status in Modal */}
            {selectedBooking.paymentStatus === "completed" &&
              selectedBooking.status !== "cancelled" && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-semibold text-blue-800">
                      Refund Status
                    </span>
                    <span
                      className={`text-sm font-bold ${getRefundStatusColor(
                        selectedBooking.refundStatus
                      )}`}
                    >
                      {selectedBooking.refundStatus || "none"}
                    </span>
                  </div>
                  {selectedBooking.refundStatus === "none" ||
                  selectedBooking.refundStatus === "rejected" ? (
                    <button
                      onClick={() => setShowRefundModal(true)}
                      className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Request Refund
                    </button>
                  ) : selectedBooking.refundStatus === "requested" ? (
                    <p className="text-sm text-blue-700">
                      Refund request pending admin approval
                    </p>
                  ) : selectedBooking.refundStatus === "processed" ? (
                    <p className="text-sm text-green-700">
                      ✓ Refund has been processed
                    </p>
                  ) : null}
                </div>
              )}

            {selectedBooking.paymentStatus === "refunded" && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-700 font-semibold">
                  ✓ Refund Processed
                </p>
                {selectedBooking.refundProcessedAt && (
                  <p className="text-xs text-green-600 mt-1">
                    Refunded on{" "}
                    {new Date(
                      selectedBooking.refundProcessedAt
                    ).toLocaleDateString()}
                  </p>
                )}
              </div>
            )}

            {/* DEV helper: mark booking as paid without gateway (visible only in development) */}
            {import.meta.env.DEV &&
              selectedBooking.paymentStatus !== "completed" &&
              selectedBooking.status !== "cancelled" && (
                <button
                  onClick={async () => {
                    try {
                      const res = await bookingAPI.markAsPaid(
                        selectedBooking._id
                      );
                      // update selected booking and reload bookings
                      setSelectedBooking((prev) => ({
                        ...prev,
                        ...res.data.booking,
                      }));
                      await loadBookings();
                      alert("Marked as paid (dev). Booking confirmed.");
                    } catch (err) {
                      console.error("Mark as paid failed:", err);
                      alert(
                        err.response?.data?.message || "Failed to mark as paid"
                      );
                    }
                  }}
                  className="mt-4 w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
                >
                  Done (Mark as Paid)
                </button>
              )}

            <button
              onClick={closeDetails}
              className="mt-4 w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* 🔹 REFUND REQUEST MODAL */}
      {showRefundModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative border border-blue-300">
            <button
              onClick={() => {
                setShowRefundModal(false);
                setRefundReason("");
              }}
              className="absolute top-4 right-4 text-gray-600 hover:text-black text-xl"
            >
              ×
            </button>

            <h2 className="text-3xl font-serif text-[#2a2a2a] mb-2">
              Request Refund
            </h2>
            <p className="text-sm text-[#6a6a6a] mb-4">
              Booking: {selectedBooking.bookingNumber}
            </p>

            <div className="mb-4">
              <p className="text-sm font-semibold text-[#2a2a2a] mb-2">
                Refund Amount
              </p>
              <p className="text-2xl font-bold text-green-600">
                ₹{selectedBooking.paidAmount?.toLocaleString() || 0}
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-[#2a2a2a] mb-2">
                Reason for Refund *
              </label>
              <textarea
                rows="4"
                placeholder="Please explain why you need a refund..."
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                className="w-full px-4 py-3 border-2 border-[#B8860B]/30 rounded-lg focus:border-[#B8860B] focus:outline-none resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRefundModal(false);
                  setRefundReason("");
                }}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleRequestRefund}
                disabled={refundLoading || !refundReason.trim()}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {refundLoading ? "Processing..." : "Submit Request"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
