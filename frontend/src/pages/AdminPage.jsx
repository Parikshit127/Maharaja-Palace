import { useState } from 'react';
import { AdminRooms } from '../components/AdminRooms';
import { AdminBanquet } from '../components/AdminBanquet';
import { AdminRestaurant } from '../components/AdminRestaurant';
import { AdminBookings } from '../components/AdminBookings';
import { AdminUsers } from '../components/AdminUsers';
import { AdminDashboard } from '../components/AdminDashboard';
import { LayoutDashboard, BedDouble, Users as UsersIcon, Utensils, CalendarDays, UserCog } from 'lucide-react';

export const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'rooms':
        return <AdminRooms />;
      case 'banquet':
        return <AdminBanquet />;
      case 'restaurant':
        return <AdminRestaurant />;
      case 'bookings':
        return <AdminBookings />;
      case 'users':
        return <AdminUsers />;
      default:
        return <AdminDashboard setActiveTab={setActiveTab} />;
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'rooms', label: 'Rooms', icon: BedDouble },
    { id: 'banquet', label: 'Banquet Halls', icon: UsersIcon },
    { id: 'restaurant', label: 'Restaurant', icon: Utensils },
    { id: 'bookings', label: 'Bookings', icon: CalendarDays },
    { id: 'users', label: 'Users', icon: UserCog },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FBF9F4] to-[#F5EFE0] pt-[100px] pb-16">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-[#B8860B] to-[#D4AF37] mb-3">
            Admin Management Panel
          </h1>
          <p className="text-[#6a6a6a] text-lg">Manage your hotel operations with ease</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Sidebar */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <div className="bg-white/80 backdrop-blur-sm shadow-[0_8px_32px_rgba(184,134,11,0.15)] rounded-2xl overflow-hidden border border-[#B8860B]/20 sticky top-[120px]">
              <div className="bg-gradient-to-r from-[#B8860B] to-[#D4AF37] px-6 py-4">
                <h2 className="text-white text-lg font-semibold uppercase tracking-wider">Navigation</h2>
              </div>
              <nav className="p-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl text-left transition-all duration-300 mb-1 group ${
                        activeTab === item.id
                          ? 'bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-white shadow-lg shadow-[#B8860B]/30 scale-[1.02]'
                          : 'text-[#2a2a2a] hover:bg-[#B8860B]/10 hover:translate-x-2'
                      }`}
                    >
                      <Icon className={`w-5 h-5 transition-transform duration-300 ${
                        activeTab === item.id ? 'scale-110' : 'group-hover:scale-110'
                      }`} />
                      <span className="font-semibold text-sm uppercase tracking-wide">{item.label}</span>
                      {activeTab === item.id && (
                        <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse" />
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="bg-white/80 backdrop-blur-sm shadow-[0_8px_32px_rgba(184,134,11,0.15)] rounded-2xl p-6 md:p-8 border border-[#B8860B]/20 min-h-[600px]">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


