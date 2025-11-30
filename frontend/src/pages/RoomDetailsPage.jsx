import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { roomAPI } from '../api/api';
import { Calendar, Users, Bed, ChevronLeft, ChevronRight, Star, Check } from 'lucide-react';

export const RoomDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [guests, setGuests] = useState(1);



  useEffect(() => {
    const fetchRoomType = async () => {
      try {
        const response = await roomAPI.getRoomTypes();
        const roomType = response.data.roomTypes.find(rt => rt._id === id);
        if (roomType) {
          const roomDetails = getRoomDetails(roomType.name);
          setRoom({
            id: roomType._id,
            name: roomType.name,
            subtitle: getSubtitle(roomType.name),
            description: roomType.description,
            images: roomType.images?.map(img => img.url) || [],
            price: roomType.basePrice,
            maxGuests: roomType.maxOccupancy,
            size: roomDetails.size,
            amenities: roomDetails.features,
            category: roomType.name.includes('Suite') ? 'SUITE ROOM' : 'ROOM CATEGORY'
          });
        }
      } catch (error) {
        console.error('Error fetching room:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRoomType();
  }, [id]);

  const getSubtitle = (name) => {
    const subtitles = {
      'Maharaja Suite': 'Step into timeless elegance where royal charm meets modern luxury',
      'Maharani Suite': 'Graceful, elegant, and timeless — a sanctuary of regal femininity',
      'Yuvraj Suite': 'Dynamic and stylish, blending youthful energy with refined heritage',
      'Executive Room': 'Designed for comfort and convenience with subtle heritage charm',
      'Standard Room': 'Compact yet inviting with tasteful heritage-inspired touches',
    };
    return subtitles[name] || 'Luxury accommodation';
  };

  const getRoomDetails = (name) => {
    const details = {
      'Maharaja Suite': {
        size: '80 sq. m.',
        features: [
          'King-size bed with handcrafted décor',
          'Marble bathroom with soaking tub and premium amenities',
          'Elegant living area for relaxation or dining',
          'Large windows with courtyard or palace views',
          'Personalized butler service',
          'Curated artefacts reflecting royal legacy',
          'Modern amenities including Wi-Fi and minibar'
        ]
      },
      'Maharani Suite': {
        size: '75 sq. m.',
        features: [
          'King-size bed with fine linen and artisanal décor',
          'Lavish marble bathroom with soaking tub and premium amenities',
          'Cozy living area ideal for leisure or intimate dining',
          'Large windows with soothing courtyard or garden views',
          'Personalized butler service',
          'Handcrafted artefacts celebrating royal elegance',
          'Modern amenities including Wi-Fi and minibar'
        ]
      },
      'Yuvraj Suite': {
        size: '64 sq. m.',
        features: [
          'King-size bed with handcrafted décor',
          'Marble bathroom with soaking tub and premium amenities',
          'Elegant living area for relaxation or dining',
          'Large windows with courtyard or palace views',
          'Personalized butler service',
          'Curated artefacts reflecting royal legacy',
          'Modern amenities including Wi-Fi and minibar'
        ]
      },
      'Executive Room': {
        size: '32 sq. m.',
        features: [
          'Plush king-size or twin beds',
          'Contemporary bathroom with premium amenities',
          'Comfortable seating area for work or relaxation',
          'Large windows with courtyard or garden views',
          'Personalized butler service',
          'Curated artefacts reflecting royal legacy',
          'Modern amenities including Wi-Fi and minibar'
        ]
      },
      'Standard Room': {
        size: '22 sq. m.',
        features: [
          'Comfortable queen-size or twin beds',
          'Modern bathroom with premium amenities',
          'Cozy seating area for relaxation',
          'Windows with courtyard or garden views',
          'High-speed Wi-Fi and essential in-room facilities',
          'Subtle décor reflecting heritage charm'
        ]
      }
    };
    return details[name] || { size: 'N/A', features: [] };
  };

  useEffect(() => {
    if (room) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % room.images.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [room]);

  const calculateNights = () => {
    if (!checkInDate || !checkOutDate) return 0;
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    return nights > 0 ? nights : 0;
  };

  const calculateTotal = () => {
    const nights = calculateNights();
    return nights * (room?.price || 0);
  };

  const handleBookNow = () => {
    if (!checkInDate || !checkOutDate) {
      alert('Please select check-in and check-out dates');
      return;
    }
    if (calculateNights() <= 0) {
      alert('Check-out date must be after check-in date');
      return;
    }
    navigate(`/booking?type=room&roomTypeId=${id}&checkIn=${checkInDate}&checkOut=${checkOutDate}&guests=${guests}&price=${room.price}`);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % room.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + room.images.length) % room.images.length);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBF9F4] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#B8860B] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#B8860B] font-semibold">Loading room details...</p>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-[#FBF9F4] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-serif text-[#2a2a2a] mb-4">Room not found</h2>
          <button onClick={() => navigate('/rooms')} className="px-6 py-3 bg-[#B8860B] text-white rounded-lg hover:bg-[#8B6914] transition-colors">
            Back to Rooms
          </button>
        </div>
      </div>
    );
  }

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-[#FBF9F4]">
      {/* Hero Image Carousel */}
      <div className="relative h-[70vh] overflow-hidden">
        {room.images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`${room.name} ${index + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        
        {/* Navigation Arrows */}
        <button onClick={prevImage} className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all z-10">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button onClick={nextImage} className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all z-10">
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Image Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {room.images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentImageIndex ? 'bg-white w-8' : 'bg-white/50'
              }`}
            />
          ))}
        </div>

        {/* Room Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
          <div className="max-w-7xl mx-auto">
            <p className="text-sm uppercase tracking-[0.3em] text-[#D4AF37] mb-2">{room.category}</p>
            <h1 className="text-5xl md:text-6xl font-serif text-white mb-2">{room.name}</h1>
            <p className="text-xl text-white/90 italic">{room.subtitle}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Description */}
            <div>
              <h2 className="text-3xl font-serif text-[#2a2a2a] mb-4">About This Room</h2>
              <p className="text-lg text-[#6a6a6a] leading-relaxed">{room.description}</p>
            </div>

            {/* Room Details */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 border border-[#B8860B]/20 shadow-sm">
                <Bed className="w-8 h-8 text-[#B8860B] mb-3" />
                <p className="text-sm text-[#6a6a6a]">Room Size</p>
                <p className="text-lg font-semibold text-[#2a2a2a]">{room.size}</p>
              </div>
              <div className="bg-white rounded-xl p-6 border border-[#B8860B]/20 shadow-sm">
                <Users className="w-8 h-8 text-[#B8860B] mb-3" />
                <p className="text-sm text-[#6a6a6a]">Max Guests</p>
                <p className="text-lg font-semibold text-[#2a2a2a]">{room.maxGuests} Guests</p>
              </div>
              <div className="bg-white rounded-xl p-6 border border-[#B8860B]/20 shadow-sm">
                <Star className="w-8 h-8 text-[#B8860B] mb-3" />
                <p className="text-sm text-[#6a6a6a]">Rating</p>
                <p className="text-lg font-semibold text-[#2a2a2a]">5.0 ★★★★★</p>
              </div>
            </div>

            {/* Amenities */}
            <div>
              <h2 className="text-3xl font-serif text-[#2a2a2a] mb-6">Amenities</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {room.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-3 bg-white rounded-lg p-4 border border-[#B8860B]/10">
                    <Check className="w-5 h-5 text-[#B8860B] flex-shrink-0" />
                    <span className="text-[#2a2a2a]">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-2xl shadow-xl border-2 border-[#B8860B]/20 p-8">
              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-bold text-[#B8860B]">₹{room.price.toLocaleString()}</span>
                  <span className="text-[#6a6a6a]">/ night</span>
                </div>
                <p className="text-sm text-[#6a6a6a]">Exclusive of taxes</p>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-[#2a2a2a] mb-2">Check-in Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B8860B]" />
                    <input
                      type="date"
                      min={today}
                      value={checkInDate}
                      onChange={(e) => setCheckInDate(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border-2 border-[#B8860B]/30 rounded-lg focus:border-[#B8860B] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#2a2a2a] mb-2">Check-out Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B8860B]" />
                    <input
                      type="date"
                      min={checkInDate || today}
                      value={checkOutDate}
                      onChange={(e) => setCheckOutDate(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border-2 border-[#B8860B]/30 rounded-lg focus:border-[#B8860B] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#2a2a2a] mb-2">Number of Guests</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B8860B]" />
                    <select
                      value={guests}
                      onChange={(e) => setGuests(parseInt(e.target.value))}
                      className="w-full pl-12 pr-4 py-3 border-2 border-[#B8860B]/30 rounded-lg focus:border-[#B8860B] focus:outline-none transition-colors appearance-none"
                    >
                      {[...Array(room.maxGuests)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1} Guest{i + 1 > 1 ? 's' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {checkInDate && checkOutDate && calculateNights() > 0 && (
                <div className="bg-[#B8860B]/5 rounded-lg p-4 mb-6 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#6a6a6a]">₹{room.price.toLocaleString()} × {calculateNights()} night{calculateNights() > 1 ? 's' : ''}</span>
                    <span className="font-semibold text-[#2a2a2a]">₹{calculateTotal().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#6a6a6a]">Service fee</span>
                    <span className="font-semibold text-[#2a2a2a]">₹{Math.round(calculateTotal() * 0.1).toLocaleString()}</span>
                  </div>
                  <div className="border-t border-[#B8860B]/20 pt-2 mt-2">
                    <div className="flex justify-between">
                      <span className="font-bold text-[#2a2a2a]">Total</span>
                      <span className="font-bold text-[#B8860B] text-xl">₹{(calculateTotal() + Math.round(calculateTotal() * 0.1)).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={handleBookNow}
                className="w-full py-4 bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-white font-bold rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                Book Now
              </button>

              <p className="text-xs text-center text-[#6a6a6a] mt-4">You won't be charged yet</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
