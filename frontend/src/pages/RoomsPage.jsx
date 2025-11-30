import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { roomAPI } from '../api/api';
import { Bed, Users, Maximize, ChevronRight, Star, Sparkles } from 'lucide-react';

export const RoomsPage = () => {
  const navigate = useNavigate();
  const [visibleSections, setVisibleSections] = useState(new Set());
  const [activeImageIndexes, setActiveImageIndexes] = useState({});
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const sectionRefs = useRef([]);

  // Static room data with all details
  const staticRoomData = {
    'Maharaja Suite': {
      category: 'SUITE ROOM',
      subtitle: 'Step into timeless elegance where royal charm meets modern luxury',
      description: 'Spanning 80 sq. m., the Maharaja Suite captures the grandeur of a bygone era with antique accents, rich textures, and refined comfort. Every detail reflects the spirit of heritage, creating a space that\'s both regal and restful.',
      size: '80 sq. m.',
      features: [
        'King-size bed with handcrafted décor',
        'Marble bathroom with soaking tub and premium amenities',
        'Elegant living area for relaxation or dining',
        'Large windows with courtyard or palace views',
        'Personalized butler service',
        'Curated artefacts reflecting royal legacy',
        'Modern amenities including Wi-Fi and minibar'
      ],
      defaultImage: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'
    },
    'Maharani Suite': {
      category: 'SUITE ROOM',
      subtitle: 'Graceful, elegant, and timeless — a sanctuary of regal femininity',
      description: 'Spanning 75 sq. m., the Maharani Suite offers a harmonious blend of classic heritage charm and modern sophistication. Soft tones, intricate detailing, and elegant furnishings create an atmosphere of warmth and poise, perfect for a serene retreat.',
      size: '75 sq. m.',
      features: [
        'King-size bed with fine linen and artisanal décor',
        'Lavish marble bathroom with soaking tub and premium amenities',
        'Cozy living area ideal for leisure or intimate dining',
        'Large windows with soothing courtyard or garden views',
        'Personalized butler service',
        'Handcrafted artefacts celebrating royal elegance',
        'Modern amenities including Wi-Fi and minibar'
      ],
      defaultImage: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800'
    },
    'Yuvraj Suite': {
      category: 'SUITE ROOM',
      subtitle: 'Dynamic and stylish, blending youthful energy with refined heritage charm',
      description: 'Spanning 64 sq. m., the Yuvraj Suite offers a cozy yet luxurious space designed for comfort and elegance. Thoughtful décor, rich textures, and modern amenities make it a perfect retreat for both leisure and sophistication.',
      size: '64 sq. m.',
      features: [
        'King-size bed with handcrafted décor',
        'Marble bathroom with soaking tub and premium amenities',
        'Elegant living area for relaxation or dining',
        'Large windows with courtyard or palace views',
        'Personalized butler service',
        'Curated artefacts reflecting royal legacy',
        'Modern amenities including Wi-Fi and minibar'
      ],
      defaultImage: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800'
    },
    'Executive Room': {
      category: 'ROOM CATEGORY',
      subtitle: 'Designed for comfort and convenience with subtle heritage charm',
      description: 'Spanning 32 sq. m., the Executive Room provides a cozy and elegant space ideal for business or leisure travellers seeking a refined stay. A perfect blend of modern amenities and subtle heritage charm.',
      size: '32 sq. m.',
      features: [
        'Plush king-size or twin beds',
        'Contemporary bathroom with premium amenities',
        'Comfortable seating area for work or relaxation',
        'Large windows with courtyard or garden views',
        'Personalized butler service',
        'Curated artefacts reflecting royal legacy',
        'Modern amenities including Wi-Fi and minibar'
      ],
      defaultImage: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800'
    },
    'Standard Room': {
      category: 'ROOM CATEGORY',
      subtitle: 'Compact yet inviting with tasteful heritage-inspired touches',
      description: 'Spanning 22 sq. m., the Standard Room is designed for travellers seeking a cozy and elegant retreat with all essential modern amenities. Compact yet inviting with tasteful heritage-inspired touches.',
      size: '22 sq. m.',
      features: [
        'Comfortable queen-size or twin beds',
        'Modern bathroom with premium amenities',
        'Cozy seating area for relaxation',
        'Windows with courtyard or garden views',
        'High-speed Wi-Fi and essential in-room facilities',
        'Subtle décor reflecting heritage charm'
      ],
      defaultImage: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800'
    }
  };

  useEffect(() => {
    const fetchRoomTypes = async () => {
      try {
        const response = await roomAPI.getRoomTypes();
        setRoomTypes(response.data.roomTypes || []);
      } catch (error) {
        console.error('Error fetching room types:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRoomTypes();
  }, []);

  useEffect(() => {
    if (roomCategories.length === 0) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = entry.target.dataset.index;
            setVisibleSections((prev) => new Set([...prev, index]));
          }
        });
      },
      { threshold: 0.15 }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      sectionRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [roomTypes]);

  // Auto-rotate images
  useEffect(() => {
    if (roomCategories.length === 0) return;
    
    const intervals = roomCategories.map((room, index) => {
      if (!room.images || room.images.length === 0) return null;
      return setInterval(() => {
        setActiveImageIndexes((prev) => ({
          ...prev,
          [index]: ((prev[index] || 0) + 1) % room.images.length,
        }));
      }, 4000);
    }).filter(Boolean);

    return () => intervals.forEach(interval => clearInterval(interval));
  }, [roomTypes]);

  // Merge API data with static data
  const roomCategories = roomTypes.map(rt => {
    const staticData = staticRoomData[rt.name] || {};
    return {
      id: rt._id,
      title: rt.name,
      category: staticData.category || 'ROOM',
      subtitle: staticData.subtitle || 'Luxury accommodation',
      description: staticData.description || rt.description,
      size: staticData.size || 'N/A',
      features: staticData.features || [],
      images: rt.images?.map(img => img.url) || [staticData.defaultImage],
      price: rt.basePrice,
      maxGuests: rt.maxOccupancy,
      link: `/rooms/${rt._id}`,
    };
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBF9F4] flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-[#B8860B] border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-[#B8860B] font-serif text-lg tracking-wider">Loading Accommodations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FBF9F4]">
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transform scale-105"
          style={{
            backgroundImage: "url(https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1600)",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60"></div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-32 h-32 border border-[#D4AF37]/20 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 border border-[#D4AF37]/30 rounded-full animate-pulse delay-1000"></div>

        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-[1px] bg-gradient-to-r from-transparent to-[#D4AF37]"></div>
            <Sparkles className="w-6 h-6 text-[#D4AF37]" />
            <div className="w-16 h-[1px] bg-gradient-to-l from-transparent to-[#D4AF37]"></div>
          </div>
          <p className="text-sm uppercase tracking-[0.4em] mb-4 text-[#D4AF37]">Accommodations</p>
          <h1 
            className="text-5xl md:text-7xl mb-6 tracking-wide"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontStyle: 'italic' }}
          >
            Luxurious Stay
          </h1>
          <p className="text-lg md:text-xl text-white/80 font-light max-w-2xl mx-auto">
            Where royal heritage meets contemporary elegance
          </p>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="w-20 h-[1px] bg-gradient-to-r from-transparent to-[#B8860B]"></div>
            <Star className="w-5 h-5 text-[#B8860B]" />
            <div className="w-20 h-[1px] bg-gradient-to-l from-transparent to-[#B8860B]"></div>
          </div>
          <h2 
            className="text-3xl md:text-4xl text-[#2a2a2a] mb-8 uppercase tracking-wider"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600 }}
          >
            Experience Heritage Luxury
          </h2>
          <p className="text-[#6a6a6a] leading-relaxed text-lg font-light max-w-3xl mx-auto">
            Our accommodations are designed to offer an unforgettable blend of royal heritage and modern comfort, 
            creating the perfect sanctuary for every type of traveller. From the grandeur of royal suites to the 
            cozy charm of our standard rooms, each space is thoughtfully crafted with unique décor, luxurious 
            amenities, and a touch of timeless elegance.
          </p>
        </div>
      </section>

      {/* Room Sections */}
      {roomCategories.map((room, index) => {
        const currentImageIndex = activeImageIndexes[index] || 0;
        const isEven = index % 2 === 0;

        return (
          <section
            key={room.id}
            ref={(el) => (sectionRefs.current[index] = el)}
            data-index={index}
            className={`py-24 overflow-hidden ${isEven ? "bg-[#FBF9F4]" : "bg-white"}`}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                
                {/* Image Section */}
                <div
                  className={`relative transition-all duration-1000 ${
                    visibleSections.has(String(index))
                      ? "opacity-100 translate-x-0"
                      : isEven ? "opacity-0 -translate-x-20" : "opacity-0 translate-x-20"
                  } ${!isEven ? "lg:order-2" : ""}`}
                >
                  {/* Category Badge */}
                  <div className="absolute top-6 left-6 z-20">
                    <span className="bg-[#B8860B] text-white px-4 py-2 text-xs uppercase tracking-[0.2em] font-medium">
                      {room.category}
                    </span>
                  </div>

                  {/* Main Image Container */}
                  <div className="relative h-[500px] overflow-hidden group shadow-2xl">
                    {room.images.length > 0 ? (
                      room.images.map((image, imgIndex) => (
                        <img
                          key={imgIndex}
                          src={image}
                          alt={`${room.title} ${imgIndex + 1}`}
                          className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ${
                            imgIndex === currentImageIndex ? "opacity-100 scale-100" : "opacity-0 scale-110"
                          }`}
                        />
                      ))
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#B8860B]/20 to-[#D4AF37]/10 flex items-center justify-center">
                        <Bed className="w-20 h-20 text-[#B8860B]/40" />
                      </div>
                    )}
                    
                    {/* Overlay on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                    
                    {/* Quick Info on Hover */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                      <div className="flex items-center gap-6 text-white">
                        <div className="flex items-center gap-2">
                          <Maximize className="w-4 h-4" />
                          <span className="text-sm">{room.size}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          <span className="text-sm">{room.maxGuests} Guests</span>
                        </div>
                        {room.price && (
                          <div className="ml-auto">
                            <span className="text-lg font-semibold">₹{room.price?.toLocaleString()}</span>
                            <span className="text-xs opacity-80">/night</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Image Indicators */}
                  {room.images.length > 1 && (
                    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
                      {room.images.map((_, imgIndex) => (
                        <button
                          key={imgIndex}
                          onClick={() => setActiveImageIndexes((prev) => ({ ...prev, [index]: imgIndex }))}
                          className={`h-1 rounded-full transition-all duration-300 ${
                            imgIndex === currentImageIndex ? "bg-[#B8860B] w-8" : "bg-[#B8860B]/30 w-4"
                          }`}
                        />
                      ))}
                    </div>
                  )}

                  {/* Decorative Frame */}
                  <div className={`absolute -bottom-4 ${isEven ? '-right-4' : '-left-4'} w-full h-full border-2 border-[#B8860B]/20 -z-10`}></div>
                </div>

                {/* Content Section */}
                <div
                  className={`transition-all duration-1000 delay-200 ${
                    visibleSections.has(String(index))
                      ? "opacity-100 translate-x-0"
                      : isEven ? "opacity-0 translate-x-20" : "opacity-0 -translate-x-20"
                  } ${!isEven ? "lg:order-1" : ""}`}
                >
                  <div className="space-y-6">
                    {/* Title */}
                    <div>
                      <div className="w-16 h-[2px] bg-gradient-to-r from-[#B8860B] to-[#D4AF37] mb-6"></div>
                      <h2 
                        className="text-3xl md:text-4xl text-[#2a2a2a] mb-3"
                        style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600 }}
                      >
                        {room.title}
                      </h2>
                      <p className="text-[#B8860B] text-lg italic font-light">
                        {room.subtitle}
                      </p>
                    </div>

                    {/* Description */}
                    <p className="text-[#6a6a6a] leading-relaxed text-base">
                      {room.description}
                    </p>

                    {/* Room Stats */}
                    <div className="flex flex-wrap gap-6 py-4 border-y border-[#B8860B]/10">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#B8860B]/10 flex items-center justify-center">
                          <Maximize className="w-5 h-5 text-[#B8860B]" />
                        </div>
                        <div>
                          <p className="text-xs text-[#6a6a6a] uppercase tracking-wider">Size</p>
                          <p className="text-[#2a2a2a] font-semibold">{room.size}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#B8860B]/10 flex items-center justify-center">
                          <Users className="w-5 h-5 text-[#B8860B]" />
                        </div>
                        <div>
                          <p className="text-xs text-[#6a6a6a] uppercase tracking-wider">Guests</p>
                          <p className="text-[#2a2a2a] font-semibold">{room.maxGuests} Max</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#B8860B]/10 flex items-center justify-center">
                          <Bed className="w-5 h-5 text-[#B8860B]" />
                        </div>
                        <div>
                          <p className="text-xs text-[#6a6a6a] uppercase tracking-wider">Bed</p>
                          <p className="text-[#2a2a2a] font-semibold">King Size</p>
                        </div>
                      </div>
                    </div>

                    {/* Features Preview */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {room.features.slice(0, 4).map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-[#6a6a6a]">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#B8860B]"></div>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Price & CTA */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4">
                      {room.price && (
                        <div>
                          <span className="text-3xl font-bold text-[#B8860B]">₹{room.price?.toLocaleString()}</span>
                          <span className="text-[#6a6a6a] text-sm ml-1">/ night</span>
                        </div>
                      )}
                      <button
                        onClick={() => navigate(room.link)}
                        className="group flex items-center gap-3 bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-white px-8 py-3 hover:shadow-lg hover:shadow-[#B8860B]/20 transition-all duration-300 uppercase text-sm tracking-wider"
                      >
                        <span>View Details</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      })}

      {/* CTA Section */}
      <section className="relative py-32 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{
            backgroundImage: "url(https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1600)",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/60 to-black/70"></div>
        </div>
        
        {/* Decorative Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 border border-[#D4AF37] rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 border border-[#D4AF37] rounded-full"></div>
          <div className="absolute top-1/2 left-1/4 w-20 h-20 border border-[#D4AF37] rounded-full"></div>
        </div>

        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="w-16 h-[1px] bg-gradient-to-r from-transparent to-[#D4AF37]"></div>
            <Sparkles className="w-6 h-6 text-[#D4AF37]" />
            <div className="w-16 h-[1px] bg-gradient-to-l from-transparent to-[#D4AF37]"></div>
          </div>
          
          <h2 
            className="text-4xl md:text-5xl mb-6"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontStyle: 'italic' }}
          >
            Ready to Experience Royal Luxury?
          </h2>
          <p className="text-xl mb-10 font-light text-white/80 max-w-2xl mx-auto">
            Book your stay at Maharaja Palace and immerse yourself in unparalleled elegance and timeless heritage
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate("/booking")}
              className="group bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-white px-12 py-4 text-lg hover:shadow-xl hover:shadow-[#B8860B]/30 transition-all duration-300 uppercase tracking-wider flex items-center gap-3"
            >
              <span>Book Your Stay</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate("/contact")}
              className="border-2 border-white/30 text-white px-12 py-4 text-lg hover:bg-white/10 hover:border-white/50 transition-all duration-300 uppercase tracking-wider"
            >
              Contact Us
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
