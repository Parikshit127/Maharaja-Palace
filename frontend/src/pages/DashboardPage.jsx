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
    const roomTotal = bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
    const banquetTotal = banquetBookings.reduce(
      (sum, b) => sum + (b.totalPrice || 0),
      0
    );
    return roomTotal + banquetTotal;
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
            {/* <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-white/60">Member Since</p>
                <p className="text-lg font-semibold">
                  {new Date(user?.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div> */}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-8 pb-16">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
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
                              booking.status
                            )}`}
                          >
                            {booking.status}
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
                            <p
                              className={`text-sm font-semibold ${getPaymentStatusColor(
                                booking.paymentStatus
                              )}`}
                            >
                              {booking.paymentStatus === "completed"
                                ? "✓ Paid"
                                : booking.paymentStatus}
                            </p>
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
                      <button
                        onClick={() => openDetails(booking)}
                        className="flex items-center gap-2 text-sm font-semibold text-[#B8860B] hover:text-[#8B6914] transition-colors"
                      >
                        View Details
                        <ChevronRight className="w-4 h-4" />
                      </button>
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

            <button
              onClick={closeDetails}
              className="mt-6 w-full bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-white py-3 rounded-lg font-semibold hover:shadow-lg transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
