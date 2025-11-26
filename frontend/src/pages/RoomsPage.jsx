import React, { useState, useEffect } from 'react';
import { HeroSection, SectionTitle, Button } from '../components/BaseComponents';
import { roomAPI } from '../api/api';

export const RoomsPage = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await roomAPI.getAllRooms();
        setRooms(response.data.rooms);
      } catch (error) {
        console.error('Failed to fetch rooms', error);
        // Fallback to dummy data if API fails
        setRooms(getDummyRooms());
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  const getDummyRooms = () => [
    {
      _id: '1',
      roomNumber: '101',
      roomType: { 
        name: 'Deluxe Suite', 
        description: 'Elegant suite with king-size bed and city view' 
      },
      currentPrice: 8500,
      images: [{ url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800' }],
      category: 'suite'
    },
    {
      _id: '2',
      roomNumber: '201',
      roomType: { 
        name: 'Royal Penthouse', 
        description: 'Luxurious penthouse with panoramic views and private terrace' 
      },
      currentPrice: 25000,
      images: [{ url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800' }],
      category: 'penthouse'
    },
    {
      _id: '3',
      roomNumber: '102',
      roomType: { 
        name: 'Premium Room', 
        description: 'Comfortable room with modern amenities and elegant decor' 
      },
      currentPrice: 5500,
      images: [{ url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800' }],
      category: 'room'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Rooms' },
    { id: 'room', name: 'Premium Rooms' },
    { id: 'suite', name: 'Suites' },
    { id: 'penthouse', name: 'Penthouses' }
  ];

  const filteredRooms = selectedCategory === 'all' 
    ? rooms 
    : rooms.filter(room => room.category === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf9f6]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#B8860B] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading our luxurious rooms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#faf9f6]">
      {/* Hero Section */}
      <HeroSection
        title="Our Luxurious Accommodations"
        subtitle="Rooms & Suites"
        backgroundImage="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600"
        height="h-[70vh]"
      />

      {/* Introduction */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="w-16 h-[2px] bg-[#B8860B] mx-auto mb-6"></div>
          <p className="text-sm uppercase tracking-[0.3em] text-[#B8860B] mb-4">
            Where Comfort Meets Elegance
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            Discover our collection of elegantly designed accommodations, from intimate premium rooms 
            to sprawling royal penthouses. Each space is meticulously crafted to provide you with 
            unparalleled comfort and luxury, ensuring an unforgettable stay.
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="flex flex-wrap justify-center gap-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 border-2 transition-all duration-300 ${
                selectedCategory === category.id
                  ? 'bg-[#B8860B] border-[#B8860B] text-white'
                  : 'bg-transparent border-[#B8860B] text-[#B8860B] hover:bg-[#B8860B] hover:text-white'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </section>

      {/* Rooms Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRooms.map((room) => (
            <div 
              key={room._id}
              className="group bg-white overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-500 cursor-pointer"
              onClick={() => window.location.href = `/rooms/${room._id}`}
            >
              {/* Room Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={room.images?.[0]?.url || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800'}
                  alt={room.roomType?.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4 bg-[#B8860B] text-white px-4 py-2 text-sm font-semibold">
                  Room {room.roomNumber}
                </div>
              </div>

              {/* Room Details */}
              <div className="p-6">
                <h3 className="text-2xl font-serif text-[#B8860B] mb-2 group-hover:text-[#8B6914] transition-colors">
                  {room.roomType?.name}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {room.roomType?.description}
                </p>

                {/* Amenities Preview */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-xs bg-gray-100 px-3 py-1 rounded-full text-gray-600">
                    WiFi
                  </span>
                  <span className="text-xs bg-gray-100 px-3 py-1 rounded-full text-gray-600">
                    AC
                  </span>
                  <span className="text-xs bg-gray-100 px-3 py-1 rounded-full text-gray-600">
                    TV
                  </span>
                  <span className="text-xs bg-gray-100 px-3 py-1 rounded-full text-gray-600">
                    Mini Bar
                  </span>
                </div>

                {/* Price and CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <span className="text-2xl font-bold text-[#B8860B]">
                      ₹{room.currentPrice?.toLocaleString()}
                    </span>
                    <span className="text-gray-500 text-sm"> / night</span>
                  </div>
                  <Button 
                    variant="primary" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.location.href = `/booking?type=room&roomId=${room._id}`;
                    }}
                  >
                    Book Now
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredRooms.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No rooms found in this category</p>
          </div>
        )}
      </section>

      {/* Room Features Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle subtitle="Every room includes">
            Premium Amenities
          </SectionTitle>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12">
            {[
              { icon: '📶', text: 'High-Speed WiFi' },
              { icon: '❄️', text: 'Climate Control' },
              { icon: '📺', text: 'Smart TV' },
              { icon: '🛁', text: 'Luxury Bathroom' },
              { icon: '☕', text: 'In-Room Dining' },
              { icon: '🔒', text: 'Electronic Safe' },
              { icon: '🧺', text: 'Laundry Service' },
              { icon: '🛎️', text: '24/7 Concierge' }
            ].map((amenity, index) => (
              <div 
                key={index}
                className="text-center group"
              >
                <div className="text-5xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {amenity.icon}
                </div>
                <p className="text-gray-700 font-medium">{amenity.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1600)' }}
        >
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-serif mb-6">
            Need Help Choosing?
          </h2>
          <p className="text-xl mb-8 font-light">
            Our concierge team is here to help you find the perfect room for your stay
          </p>
          <Button 
            variant="filled" 
            size="lg"
            onClick={() => window.location.href = '/contact'}
          >
            Contact Our Team
          </Button>
        </div>
      </section>
    </div>
  );
};