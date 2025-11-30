import { useState } from 'react';
import { AdminRooms } from '../components/AdminRooms';
import { AdminBanquet } from '../components/AdminBanquet';
import { AdminRestaurant } from '../components/AdminRestaurant';
import { AdminBookings } from '../components/AdminBookings';
import { AdminUsers } from '../components/AdminUsers';
import { AdminDashboard } from '../components/AdminDashboard';

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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-playfair text-gold mb-8 text-center">Admin Dashboard</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gold/20">
            <nav className="flex flex-col">
              {[
                { id: 'dashboard', label: 'Overview', icon: '📊' },
                { id: 'rooms', label: 'Rooms', icon: '🛏️' },
                { id: 'banquet', label: 'Banquet Halls', icon: '✨' },
                { id: 'restaurant', label: 'Restaurant', icon: '🍽️' },
                { id: 'bookings', label: 'Bookings', icon: '📅' },
                { id: 'users', label: 'Users', icon: '👥' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center px-6 py-4 text-left transition-colors ${activeTab === item.id
                      ? 'bg-gold text-white'
                      : 'text-gray-700 hover:bg-cream'
                    }`}
                >
                  <span className="mr-3 text-xl">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-grow">
          <div className="bg-white shadow-lg rounded-lg p-6 border border-gold/20 min-h-[500px]">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};


