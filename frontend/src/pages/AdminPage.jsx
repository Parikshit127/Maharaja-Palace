import { useState } from "react";
import { AdminDashboard } from "../components/AdminDashboard";
import { AdminBookings } from "../components/AdminBookings";
import { AdminRooms } from "../components/AdminRooms";
import { AdminRestaurant } from "../components/AdminRestaurant";
import { AdminBanquet } from "../components/AdminBanquet";
import { AdminUsers } from "../components/AdminUsers";

export const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  /* --------------------------------------------
     NEW: Shared month state for Dashboard -> Bookings
  --------------------------------------------- */
  const [selectedMonth, setSelectedMonth] = useState(null);

  return (
    <div className="min-h-screen bg-[#FBF9F4] pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* MOBILE HORIZONTAL SIDEBAR */}
        <div className="lg:hidden mb-6 -mx-4 px-4 overflow-x-auto">
          <div className="flex gap-2 min-w-max pb-2">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`px-4 py-2 rounded-xl font-semibold transition text-sm whitespace-nowrap ${
                activeTab === "dashboard"
                  ? "bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-white shadow-lg"
                  : "bg-white text-[#2a2a2a] border-2 border-[#B8860B]/20"
              }`}
            >
              📊 Dashboard
            </button>

            <button
              onClick={() => setActiveTab("bookings")}
              className={`px-4 py-2 rounded-xl font-semibold transition text-sm whitespace-nowrap ${
                activeTab === "bookings"
                  ? "bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-white shadow-lg"
                  : "bg-white text-[#2a2a2a] border-2 border-[#B8860B]/20"
              }`}
            >
              📅 Bookings
            </button>

            <button
              onClick={() => setActiveTab("refunds")}
              className={`px-4 py-2 rounded-xl font-semibold transition text-sm whitespace-nowrap ${
                activeTab === "refunds"
                  ? "bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-white shadow-lg"
                  : "bg-white text-[#2a2a2a] border-2 border-[#B8860B]/20"
              }`}
            >
              💸 Refunds
            </button>

            <button
              onClick={() => setActiveTab("rooms")}
              className={`px-4 py-2 rounded-xl font-semibold transition text-sm whitespace-nowrap ${
                activeTab === "rooms"
                  ? "bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-white shadow-lg"
                  : "bg-white text-[#2a2a2a] border-2 border-[#B8860B]/20"
              }`}
            >
              🛏️ Rooms
            </button>

            <button
              onClick={() => setActiveTab("restaurant")}
              className={`px-4 py-2 rounded-xl font-semibold transition text-sm whitespace-nowrap ${
                activeTab === "restaurant"
                  ? "bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-white shadow-lg"
                  : "bg-white text-[#2a2a2a] border-2 border-[#B8860B]/20"
              }`}
            >
              🍽️ Restaurant
            </button>

            <button
              onClick={() => setActiveTab("banquet")}
              className={`px-4 py-2 rounded-xl font-semibold transition text-sm whitespace-nowrap ${
                activeTab === "banquet"
                  ? "bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-white shadow-lg"
                  : "bg-white text-[#2a2a2a] border-2 border-[#B8860B]/20"
              }`}
            >
              🎉 Banquet
            </button>

            <button
              onClick={() => setActiveTab("users")}
              className={`px-4 py-2 rounded-xl font-semibold transition text-sm whitespace-nowrap ${
                activeTab === "users"
                  ? "bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-white shadow-lg"
                  : "bg-white text-[#2a2a2a] border-2 border-[#B8860B]/20"
              }`}
            >
              👤 Users
            </button>
          </div>
        </div>

        {/* DESKTOP LAYOUT */}
        <div className="flex gap-6">
          {/* LEFT SIDEBAR NAVIGATION - Desktop Only */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-lg p-4 sticky top-32">
              <h3 className="text-lg font-serif text-[#B8860B] mb-4 px-2">Admin Panel</h3>
              <nav className="flex flex-col gap-2">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`px-4 py-3 rounded-xl font-semibold transition text-left ${
                  activeTab === "dashboard"
                    ? "bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-white shadow-lg"
                    : "bg-gray-50 hover:bg-gray-100 text-[#2a2a2a]"
                }`}
              >
                📊 Dashboard
              </button>

              <button
                onClick={() => setActiveTab("bookings")}
                className={`px-4 py-3 rounded-xl font-semibold transition text-left ${
                  activeTab === "bookings"
                    ? "bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-white shadow-lg"
                    : "bg-gray-50 hover:bg-gray-100 text-[#2a2a2a]"
                }`}
              >
                📅 Bookings
              </button>

              <button
                onClick={() => setActiveTab("refunds")}
                className={`px-4 py-3 rounded-xl font-semibold transition text-left ${
                  activeTab === "refunds"
                    ? "bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-white shadow-lg"
                    : "bg-gray-50 hover:bg-gray-100 text-[#2a2a2a]"
                }`}
              >
                💸 Refunds
              </button>

              <button
                onClick={() => setActiveTab("rooms")}
                className={`px-4 py-3 rounded-xl font-semibold transition text-left ${
                  activeTab === "rooms"
                    ? "bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-white shadow-lg"
                    : "bg-gray-50 hover:bg-gray-100 text-[#2a2a2a]"
                }`}
              >
                🛏️ Rooms
              </button>

              <button
                onClick={() => setActiveTab("restaurant")}
                className={`px-4 py-3 rounded-xl font-semibold transition text-left ${
                  activeTab === "restaurant"
                    ? "bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-white shadow-lg"
                    : "bg-gray-50 hover:bg-gray-100 text-[#2a2a2a]"
                }`}
              >
                🍽️ Restaurant
              </button>

              <button
                onClick={() => setActiveTab("banquet")}
                className={`px-4 py-3 rounded-xl font-semibold transition text-left ${
                  activeTab === "banquet"
                    ? "bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-white shadow-lg"
                    : "bg-gray-50 hover:bg-gray-100 text-[#2a2a2a]"
                }`}
              >
                🎉 Banquet
              </button>

              <button
                onClick={() => setActiveTab("users")}
                className={`px-4 py-3 rounded-xl font-semibold transition text-left ${
                  activeTab === "users"
                    ? "bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-white shadow-lg"
                    : "bg-gray-50 hover:bg-gray-100 text-[#2a2a2a]"
                }`}
              >
                👤 Users
              </button>
            </nav>
          </div>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 min-w-0">
          {activeTab === "dashboard" && (
            <AdminDashboard
              setActiveTab={setActiveTab}
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
            />
          )}

          {activeTab === "bookings" && (
            <AdminBookings
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
            />
          )}

          {activeTab === "refunds" && (
            <AdminBookings
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
              initialFilter="refunds"
            />
          )}

          {activeTab === "rooms" && <AdminRooms />}
          {activeTab === "restaurant" && <AdminRestaurant selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} />}
          {activeTab === "banquet" && <AdminBanquet selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} />}
          {activeTab === "users" && <AdminUsers selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} />}
        </div>
      </div>
      </div>
    </div>
  );
};
