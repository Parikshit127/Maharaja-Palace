import React, { useState, useEffect, useRef } from 'react';
import { ChefHat, Clock, Users, Award, Wine, Sparkles, ArrowRight, MapPin, Phone } from 'lucide-react';

const RestaurantPage = () => {
  const [scrollY, setScrollY] = useState(0);
  const [activeRestaurant, setActiveRestaurant] = useState(null);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const heroRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const restaurants = [
    {
      _id: '1',
      name: 'The Frontier Mail',
      description: 'Step back in time with our award-winning restaurant, which takes its inspiration from the legendary Frontier Mail train that operated between Bombay and Peshawar during the pre-independence days. The menu comprises cuisines from the regions through which the train made its initial journey.',
      cuisine: 'Multi-Regional Indian',
      timing: 'Mon-Sun: 12:30-15:30 | Sat-Sun: 19:30-23:00',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200',
      specialty: 'Regional Indian Cuisine',
      capacity: 80,
      priceRange: '₹₹₹₹',
      highlights: ['Signature Thali', 'Heritage Recipes', 'Wine Pairing']
    },
    {
      _id: '2',
      name: 'The Brown Sugar',
      description: 'A place where you can enjoy an international dining experience that is quite unforgettable, this all-day diner offers buffet meals as well as an à la carte menu. Relax, entertain or conduct leisurely meetings over a wide range of exotic teas, coffees and savories.',
      cuisine: 'International',
      timing: '24 Hours | Breakfast: 07:00-10:30',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200',
      specialty: 'All-Day Dining',
      capacity: 100,
      priceRange: '₹₹₹',
      highlights: ['Live Cooking', 'Global Buffet', '24/7 Service']
    },
    {
      _id: '3',
      name: 'The Polo Bar',
      description: 'Adorned with trophies and memorabilia of the yesteryears, this colonial-style English bar serves signature cocktails inspired by the royal sport. The shelves are lined with the finest rare whiskies, single malts, cognacs, wines and liqueurs, and a hand-picked selection of Cuban cigars.',
      cuisine: 'Bar & Lounge',
      timing: '11:00 hrs - 00:00 hrs',
      image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=1200',
      specialty: 'Premium Spirits & Cocktails',
      capacity: 50,
      priceRange: '₹₹₹₹₹',
      highlights: ['Rare Whiskeys', 'Cuban Cigars', 'Live Jazz']
    },
    {
      _id: '4',
      name: 'Khaas Mahal',
      description: 'An exclusive al fresco restaurant for a niche dining experience, this is a great place to enjoy a delectable melt-in-the-mouth meal under the light of a stellar sky. Available on special dining request.',
      cuisine: 'Fine Dining',
      timing: 'By Special Reservation',
      image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1200',
      specialty: 'Outdoor Fine Dining',
      capacity: 35,
      priceRange: '₹₹₹₹₹',
      highlights: ['Starlit Dining', 'Private Chef', 'Bespoke Menu']
    },
    {
      _id: '5',
      name: 'The Lounge',
      description: 'The Lounge Access is on the Lobby Floor of the hotel for an ultra-quick check-in with welcome drinks on arrival. On special occasions, you can access the lounge in the evening for complimentary drinks and light snacks.',
      cuisine: 'Lounge',
      timing: 'Check-in Hours | Evening: 18:00-22:00',
      image: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=1200',
      specialty: 'Welcome Lounge',
      capacity: 30,
      priceRange: '₹₹',
      highlights: ['Welcome Drinks', 'Premium Access', 'Light Bites']
    },
    {
      _id: '6',
      name: 'The Cake Factory',
      description: 'The Cake Factory offers a delicious spread of freshly baked hand-crafted breads, tarts, an assortment of savories as well as freshly baked cakes, pastries, pralines and truffles.',
      cuisine: 'Bakery & Confectionery',
      timing: '09:00 hrs - 21:00 hrs',
      image: 'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=1200',
      specialty: 'Artisan Bakery',
      capacity: 20,
      priceRange: '₹₹',
      highlights: ['Fresh Daily', 'Custom Cakes', 'Artisan Bread']
    }
  ];

  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'Food Critic, Delhi Times',
      text: 'An extraordinary culinary journey. The Frontier Mail transported us through flavors of India with impeccable service and ambiance.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
    },
    {
      name: 'Rajesh Kumar',
      role: 'Business Executive',
      text: 'The Polo Bar is my sanctuary. Rare whiskeys, perfect cigars, and an atmosphere that speaks volumes of refined taste.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
    },
    {
      name: 'Sarah Williams',
      role: 'Travel Blogger',
      text: 'Khaas Mahal under the stars was magical. A dining experience that rivals the finest restaurants in Europe.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150'
    }
  ];

  const features = [
    { icon: <ChefHat className="w-8 h-8" />, title: 'Michelin-Trained Chefs', desc: 'Award-winning culinary masters' },
    { icon: <Sparkles className="w-8 h-8" />, title: 'Farm to Table', desc: 'Organic local ingredients' },
    { icon: <Wine className="w-8 h-8" />, title: 'Curated Cellars', desc: '500+ premium wines' },
    { icon: <Award className="w-8 h-8" />, title: 'Forbes Rated', desc: '5-star dining excellence' }
  ];

  const parallaxOffset = scrollY * 0.5;

  return (
    <div className="bg-[#FAF8F3] font-sans overflow-x-hidden">
      {/* Premium Navigation */}

      {/* Hero Section with Parallax */}
      <section ref={heroRef} className="relative h-screen overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=1920)',
            transform: `translateY(${parallaxOffset}px)`
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-black/20 to-black/70"></div>
        </div>

        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-6">
          <div className="animate-fadeInUp">
            <div className="w-20 h-[1px] bg-[#D4AF37] mx-auto mb-6"></div>
            <p className="text-sm uppercase tracking-[0.4em] text-[#D4AF37] mb-4 animate-fadeIn drop-shadow-lg" style={{ animationDelay: '0.3s' }}>
              Culinary Artistry Since 1947
            </p>
            <h1 className="royal-title text-7xl md:text-9xl text-white mb-6 tracking-tight animate-fadeInUp drop-shadow-2xl" style={{ animationDelay: '0.5s' }}>
              Exquisite Dining
            </h1>
            <p className="text-xl md:text-2xl text-white/95 max-w-3xl mx-auto mb-12 font-light leading-relaxed animate-fadeInUp drop-shadow-lg" style={{ animationDelay: '0.7s' }}>
              A symphony of flavors, crafted by masters, served in palatial elegance
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fadeInUp" style={{ animationDelay: '0.9s' }}>
              <button
                onClick={() => window.location.href = '/restaurant/book'}
                className="group relative px-10 py-5 bg-[#D4AF37] text-[#0B1A33] font-semibold tracking-wider overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-[#D4AF37]/50 rounded-sm">
                <span className="relative z-10 flex items-center justify-center gap-2">
                  RESERVE YOUR TABLE
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                </span>
                <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              </button>
              <button
                onClick={() => window.location.href = '/contact'}
                className="px-10 py-5 border-2 border-white text-white font-semibold tracking-wider hover:bg-white hover:text-[#0B1A33] transition-all duration-500 rounded-sm backdrop-blur-sm">
                EXPLORE MENUS
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#D4AF37] rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#8B7355] rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="w-20 h-[2px] bg-[#D4AF37] mx-auto mb-8"></div>
          <p className="text-sm uppercase tracking-[0.4em] text-[#D4AF37] mb-6">A Gastronomic Legacy</p>
          <h2 className="royal-title text-5xl md:text-7xl text-[#0B1A33] mb-8 leading-tight">
            Where Royalty Dines
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed max-w-4xl mx-auto">
            Maharaja Palace welcomes discerning guests to an unparalleled dining journey.
            From the royal kitchens of India to global culinary traditions, each restaurant
            tells a story of heritage, passion, and extraordinary craftsmanship.
          </p>
        </div>
      </section>

      {/* Premium Features */}
      <section className="py-20 bg-gradient-to-br from-[#0B1A33] to-[#1a2940] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #D4AF37 1px, transparent 0)', backgroundSize: '50px 50px' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group text-center transform hover:-translate-y-4 transition-all duration-500"
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-[#0B1A33] transition-all duration-500 group-hover:rotate-12 group-hover:scale-110">
                  {feature.icon}
                </div>
                <h4 className="text-xl font-serif text-white mb-3 tracking-wide">{feature.title}</h4>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Restaurants Showcase */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="w-20 h-[2px] bg-[#D4AF37] mx-auto mb-8"></div>
            <p className="text-sm uppercase tracking-[0.4em] text-[#D4AF37] mb-6">Our Destinations</p>
            <h2 className="royal-title text-5xl md:text-7xl text-[#0B1A33] leading-tight">
              Signature Restaurants
            </h2>
          </div>

          <div className="space-y-32">
            {restaurants.map((restaurant, index) => (
              <div
                key={restaurant._id}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center ${index % 2 === 1 ? 'lg:grid-flow-dense' : ''
                  }`}
                onMouseEnter={() => setActiveRestaurant(restaurant._id)}
                onMouseLeave={() => setActiveRestaurant(null)}
              >
                {/* Image */}
                <div className={`${index % 2 === 1 ? 'lg:col-start-2' : ''} relative group`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10 rounded-lg"></div>
                  <div className="relative overflow-hidden rounded-lg shadow-2xl transform group-hover:scale-[1.02] transition-all duration-700">
                    <div className="absolute top-6 left-6 z-20">
                      <div className="bg-[#D4AF37] text-[#0B1A33] px-6 py-3 font-semibold text-sm uppercase tracking-widest shadow-xl">
                        {restaurant.specialty}
                      </div>
                    </div>
                    <div className="absolute top-6 right-6 z-20 bg-black/70 backdrop-blur-sm text-[#D4AF37] px-4 py-2 rounded-full text-sm font-semibold">
                      {restaurant.priceRange}
                    </div>
                    <img
                      src={restaurant.image}
                      alt={restaurant.name}
                      className="w-full h-[550px] object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  </div>
                </div>

                {/* Content */}
                <div className={`${index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''} space-y-8`}>
                  <div>
                    <div className="w-16 h-[2px] bg-[#D4AF37] mb-6"></div>
                    <h3 className="royal-title text-5xl md:text-6xl text-[#0B1A33] mb-4 tracking-tight leading-tight">
                      {restaurant.name}
                    </h3>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <span className="bg-white px-5 py-2 text-sm text-gray-700 border border-gray-200 rounded-full shadow-sm">
                      {restaurant.cuisine}
                    </span>
                    <span className="bg-white px-5 py-2 text-sm text-gray-700 border border-gray-200 rounded-full shadow-sm flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      {restaurant.capacity} Seats
                    </span>
                  </div>

                  <p className="text-lg text-gray-600 leading-relaxed">
                    {restaurant.description}
                  </p>

                  {/* Highlights */}
                  <div className="grid grid-cols-3 gap-4">
                    {restaurant.highlights.map((highlight, i) => (
                      <div key={i} className="text-center p-4 bg-gradient-to-br from-[#FAF8F3] to-white rounded-lg border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                        <p className="text-sm text-[#D4AF37] font-semibold">{highlight}</p>
                      </div>
                    ))}
                  </div>

                  {/* Timing */}
                  <div className="bg-gradient-to-r from-white to-[#FAF8F3] p-6 border-l-4 border-[#D4AF37] rounded-r-lg shadow-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <Clock className="w-5 h-5 text-[#D4AF37]" />
                      <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Operating Hours</p>
                    </div>
                    <p className="text-gray-700 font-medium text-lg">{restaurant.timing}</p>
                  </div>

                  <button
                    onClick={() => window.location.href = '/restaurant/book'}
                    className="group relative px-10 py-5 bg-[#0B1A33] text-white font-semibold tracking-wider overflow-hidden transition-all duration-500 hover:shadow-2xl w-full sm:w-auto">
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      RESERVE TABLE
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                    </span>
                    <div className="absolute inset-0 bg-[#D4AF37] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Slider */}
      <section className="py-32 bg-gradient-to-br from-[#0B1A33] via-[#1a2940] to-[#0B1A33] relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#D4AF37] rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="w-20 h-[2px] bg-[#D4AF37] mx-auto mb-8"></div>
            <h2 className="royal-title text-6xl text-white mb-4">Guest Testimonials</h2>
            <p className="text-gray-400 text-lg">What our distinguished guests say</p>
          </div>

          <div className="relative">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`transition-all duration-1000 ${index === currentTestimonial ? 'opacity-100 scale-100' : 'opacity-0 scale-95 absolute inset-0'
                  }`}
              >
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-12 border border-white/10 shadow-2xl">
                  <div className="flex items-center gap-6 mb-8">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-20 h-20 rounded-full object-cover border-4 border-[#D4AF37]"
                    />
                    <div>
                      <h4 className="text-2xl font-serif text-white mb-1">{testimonial.name}</h4>
                      <p className="text-[#D4AF37] text-sm tracking-wider">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-xl text-gray-300 leading-relaxed italic mb-6">
                    "{testimonial.text}"
                  </p>
                  <div className="flex gap-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-[#D4AF37] text-2xl">★</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {/* Navigation Dots */}
            <div className="flex justify-center gap-3 mt-10">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-500 ${index === currentTestimonial ? 'bg-[#D4AF37] w-12' : 'bg-white/30 hover:bg-white/50'
                    }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=1600)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/70 to-black/80"></div>
        </div>

        <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto">
          <div className="w-20 h-[1px] bg-[#D4AF37] mx-auto mb-8"></div>
          <h2 className="royal-title text-6xl md:text-8xl mb-8 tracking-tight leading-tight">
            Begin Your Culinary Journey
          </h2>
          <p className="text-2xl mb-12 font-light text-gray-300">
            Reserve your table at Maharaja Palace today
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button
              onClick={() => window.location.href = '/restaurant/book'}
              className="group relative px-12 py-6 bg-[#D4AF37] text-[#0B1A33] font-bold tracking-wider text-lg overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-[#D4AF37]/50">
              <span className="relative z-10 flex items-center justify-center gap-3">
                BOOK NOW
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
              </span>
              <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </button>
            <button
              onClick={() => window.location.href = '/contact'}
              className="px-12 py-6 border-2 border-white text-white font-bold tracking-wider text-lg hover:bg-white hover:text-[#0B1A33] transition-all duration-500 flex items-center justify-center gap-3">
              <Phone className="w-5 h-5" />
              CALL US
            </button>
          </div>
        </div>
      </section>

      <style>{`
        .royal-title {
          font-family: 'Playfair Display', 'Cormorant Garamond', Georgia, serif;
          font-weight: 600;
          font-style: italic;
          letter-spacing: 0.02em;
        }
        
        h4, .font-serif {
          font-family: 'Playfair Display', Georgia, serif;
          font-weight: 600;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 1s ease-out forwards;
        }

        .animate-fadeInUp {
          animation: fadeInUp 1s ease-out forwards;
          opacity: 0;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 10px;
        }

        ::-webkit-scrollbar-track {
          background: #0B1A33;
        }

        ::-webkit-scrollbar-thumb {
          background: #D4AF37;
          border-radius: 5px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #B8960C;
        }
      `}</style>
    </div>
  );
};

export default RestaurantPage;