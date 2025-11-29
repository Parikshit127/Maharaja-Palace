import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Crown, Sparkles, Calendar, Users, Award, Heart } from 'lucide-react';

// ScrollExpandMedia Component
const ScrollExpandMedia = ({
  mediaType = 'image',
  mediaSrc,
  bgImageSrc,
  title,
  subtitle,
  scrollToExpand,
  children,
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [mediaFullyExpanded, setMediaFullyExpanded] = useState(false);
  const [touchStartY, setTouchStartY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  useEffect(() => {
    const handleWheel = (e) => {
      if (mediaFullyExpanded && e.deltaY < 0 && window.scrollY <= 5) {
        setMediaFullyExpanded(false);
        e.preventDefault();
      } else if (!mediaFullyExpanded) {
        e.preventDefault();
        const scrollDelta = e.deltaY * 0.0009;
        const newProgress = Math.min(Math.max(scrollProgress + scrollDelta, 0), 1);
        setScrollProgress(newProgress);

        if (newProgress >= 1) {
          setMediaFullyExpanded(true);
          setShowContent(true);
        } else if (newProgress < 0.75) {
          setShowContent(false);
        }
      }
    };

    const handleTouchStart = (e) => {
      setTouchStartY(e.touches[0].clientY);
    };

    const handleTouchMove = (e) => {
      if (!touchStartY) return;

      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY - touchY;

      if (mediaFullyExpanded && deltaY < -20 && window.scrollY <= 5) {
        setMediaFullyExpanded(false);
        e.preventDefault();
      } else if (!mediaFullyExpanded) {
        e.preventDefault();
        const scrollFactor = deltaY < 0 ? 0.008 : 0.005;
        const scrollDelta = deltaY * scrollFactor;
        const newProgress = Math.min(Math.max(scrollProgress + scrollDelta, 0), 1);
        setScrollProgress(newProgress);

        if (newProgress >= 1) {
          setMediaFullyExpanded(true);
          setShowContent(true);
        } else if (newProgress < 0.75) {
          setShowContent(false);
        }

        setTouchStartY(touchY);
      }
    };

    const handleTouchEnd = () => {
      setTouchStartY(0);
    };

    const handleScroll = () => {
      if (!mediaFullyExpanded) {
        window.scrollTo(0, 0);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [scrollProgress, mediaFullyExpanded, touchStartY]);

  const mediaWidth = 300 + scrollProgress * (isMobile ? 650 : 1250);
  const mediaHeight = 400 + scrollProgress * (isMobile ? 200 : 400);
  const textTranslateX = scrollProgress * (isMobile ? 180 : 150);

  const titleWords = title ? title.split(' ') : [];
  const firstWord = titleWords[0] || '';
  const restOfTitle = titleWords.slice(1).join(' ') || '';

  return (
    <div className="transition-colors duration-700 ease-in-out overflow-x-hidden">
      <section className="relative flex flex-col items-center justify-start min-h-screen">
        <div className="relative w-full flex flex-col items-center min-h-screen">
          <motion.div
            className="absolute inset-0 z-0 h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 - scrollProgress }}
            transition={{ duration: 0.1 }}
          >
            <img
              src={bgImageSrc}
              alt="Background"
              className="w-screen h-screen object-cover"
            />
            <div className="absolute inset-0 bg-black/20" />
          </motion.div>

          <div className="container mx-auto flex flex-col items-center justify-start relative z-10">
            <div className="flex flex-col items-center justify-center w-full h-screen relative">
              <div
                className="absolute z-0 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-none rounded-2xl overflow-hidden"
                style={{
                  width: `${mediaWidth}px`,
                  height: `${mediaHeight}px`,
                  maxWidth: '95vw',
                  maxHeight: '85vh',
                  boxShadow: '0px 0px 50px rgba(0, 0, 0, 0.3)',
                }}
              >
                <div className="relative w-full h-full">
                  <img
                    src={mediaSrc}
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                  <motion.div
                    className="absolute inset-0 bg-black/40"
                    initial={{ opacity: 0.7 }}
                    animate={{ opacity: 0.7 - scrollProgress * 0.4 }}
                    transition={{ duration: 0.2 }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-center text-center gap-4 w-full relative z-10 transition-none flex-col mix-blend-difference">
                <motion.h1
                  className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white transition-none"
                  style={{ transform: `translateX(-${textTranslateX}vw)` }}
                >
                  {firstWord}
                </motion.h1>
                <motion.h1
                  className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white transition-none"
                  style={{ transform: `translateX(${textTranslateX}vw)` }}
                >
                  {restOfTitle}
                </motion.h1>
                {subtitle && (
                  <motion.p
                    className="text-xl md:text-2xl text-white font-light mt-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 - scrollProgress * 2 }}
                  >
                    {subtitle}
                  </motion.p>
                )}
              </div>

              {scrollToExpand && (
                <motion.div
                  className="absolute bottom-8 text-white text-sm uppercase tracking-widest"
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 1 - scrollProgress * 3 }}
                >
                  {scrollToExpand}
                  <div className="w-[1px] h-12 bg-white mx-auto mt-2 animate-pulse" />
                </motion.div>
              )}
            </div>

            <motion.section
              className="flex flex-col w-full px-8 py-10 md:px-16 lg:py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: showContent ? 1 : 0 }}
              transition={{ duration: 0.7 }}
            >
              {children}
            </motion.section>
          </div>
        </div>
      </section>
    </div>
  );
};

// Button Component
const Button = ({ variant = 'filled', size = 'md', children, onClick }) => {
  const baseStyles = "font-semibold transition-all duration-300 tracking-wide";
  const sizeStyles = {
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };
  const variantStyles = {
    filled: "bg-[#B8860B] text-white hover:bg-[#9a7209] shadow-lg hover:shadow-xl",
    outline: "border-2 border-[#B8860B] text-[#B8860B] hover:bg-[#B8860B] hover:text-white",
    secondary: "border-2 border-white text-white bg-transparent hover:bg-white hover:text-[#0B1A33]"
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]}`}
    >
      {children}
    </button>
  );
};

// ImageCard Component
const ImageCard = ({ image, title, description, onClick }) => (
  <div
    className="group cursor-pointer overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-500"
    onClick={onClick}
  >
    <div className="relative h-64 overflow-hidden">
      <img
        src={image}
        alt={title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
    </div>
    <div className="p-6">
      <h3 className="text-xl font-serif text-[#B8860B] mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  </div>
);

// Main HomePage Component
export function HomePage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#faf9f6]">
      {/* Scroll Expand Hero Section */}
      <ScrollExpandMedia
        mediaType="image"
        mediaSrc="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1600&q=80"
        bgImageSrc="https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=2400&q=80"
        title="Maharaja Palace"
        subtitle="Where Royalty Meets Luxury"
        scrollToExpand="Scroll to Explore"
      >
        {/* Welcome Section - Now appears after scroll */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <div className="w-16 h-[2px] bg-[#B8860B] mx-auto mb-6" />
          <p className="text-sm uppercase tracking-[0.3em] text-[#B8860B] mb-4">
            A Royal Experience
          </p>
          <h2 className="text-4xl md:text-5xl font-serif text-gray-800 mb-6 leading-tight">
            Discover the Essence of Regal Hospitality
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-8">
            Maharaja Palace welcomes its guests to a pleasant experience with exquisitely handcrafted delicacies,
            luxurious accommodations, and world-class amenities. Indulge in the art of fine living from the royal
            traditions of India and savour moments that create lasting memories.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="filled" size="lg">
              Explore Rooms
            </Button>
            <Button variant="outline" size="lg">
              Our Story
            </Button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto mb-20 text-center">
          {[
            { icon: <Crown size={40} />, value: '7-Star', label: 'Luxury Rating' },
            { icon: <Award size={40} />, value: '50+', label: 'Awards Won' },
            { icon: <Users size={40} />, value: '10K+', label: 'Happy Guests' },
            { icon: <Heart size={40} />, value: '100%', label: 'Satisfaction' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 bg-white/50 backdrop-blur-sm rounded-lg"
            >
              <div className="text-[#B8860B] flex justify-center mb-3">
                {stat.icon}
              </div>
              <div className="text-3xl font-serif font-bold text-gray-800 mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 uppercase tracking-wider">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </ScrollExpandMedia>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="w-16 h-[2px] bg-[#B8860B] mx-auto mb-6" />
            <p className="text-sm uppercase tracking-[0.3em] text-[#B8860B] mb-4">
              Immerse yourself in luxury
            </p>
            <h2 className="text-4xl md:text-5xl font-serif text-gray-800">
              Our Signature Experiences
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ImageCard
              image="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800"
              title="Luxurious Suites"
              description="From intimate single rooms to sprawling royal penthouses, each accommodation is designed with meticulous attention to detail."
            />
            <ImageCard
              image="https://images.unsplash.com/photo-1519167758481-83f29da8a97f?w=800"
              title="Banquet Halls"
              description="Host your special events in our magnificent banquet halls that blend grandeur with modern amenities."
            />
            <ImageCard
              image="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800"
              title="Fine Dining"
              description="Experience culinary excellence at our award-winning restaurants featuring global and regional cuisines."
            />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-[#faf9f6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="w-16 h-[2px] bg-[#B8860B] mx-auto mb-6" />
            <p className="text-sm uppercase tracking-[0.3em] text-[#B8860B] mb-4">
              Everything you need for an unforgettable stay
            </p>
            <h2 className="text-4xl md:text-5xl font-serif text-gray-800">
              Why Choose Maharaja Palace
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: '👑', title: '7-Star Service', desc: 'World-class hospitality with personalized attention' },
              { icon: '🏛️', title: 'Palace Architecture', desc: 'Stunning heritage architecture with modern luxury' },
              { icon: '🍽️', title: 'Culinary Excellence', desc: 'Award-winning restaurants serving global delicacies' },
              { icon: '💎', title: 'Premium Suites', desc: 'Elegantly furnished rooms with royal decor' },
              { icon: '🎭', title: 'Cultural Events', desc: 'Traditional performances and entertainment' },
              { icon: '🧘', title: 'Spa & Wellness', desc: 'State-of-the-art wellness and rejuvenation' }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group text-center p-8 bg-white hover:shadow-xl transition-all duration-500"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-serif text-[#B8860B] mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="w-16 h-[2px] bg-[#B8860B] mx-auto mb-6" />
            <p className="text-sm uppercase tracking-[0.3em] text-[#B8860B] mb-4">
              Take a glimpse into our royal world
            </p>
            <h2 className="text-4xl md:text-5xl font-serif text-gray-800">
              Gallery Highlights
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
              'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
              'https://images.unsplash.com/photo-1596436889106-be35e843f974?w=800',
              'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800'
            ].map((img, index) => (
              <div key={index} className="aspect-square overflow-hidden group cursor-pointer">
                <img
                  src={img}
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              View Full Gallery
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-b from-[#faf9f6] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="w-16 h-[2px] bg-[#B8860B] mx-auto mb-6" />
            <p className="text-sm uppercase tracking-[0.3em] text-[#B8860B] mb-4">
              What our guests say about us
            </p>
            <h2 className="text-4xl md:text-5xl font-serif text-gray-800">
              Guest Experiences
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { text: "An absolutely breathtaking experience. The attention to detail made our stay unforgettable.", author: "Priya Sharma", role: "Wedding Guest" },
              { text: "The perfect blend of heritage and modern luxury. Every corner tells a story.", author: "Rajesh Kumar", role: "Business Traveler" },
              { text: "From arrival to departure, we felt like royalty. Exceptional dining experience!", author: "Sarah Johnson", role: "International Visitor" }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-8 border-l-4 border-[#B8860B] shadow-sm"
              >
                <div className="text-4xl text-[#B8860B] mb-4">"</div>
                <p className="text-gray-600 italic mb-6 leading-relaxed">
                  {testimonial.text}
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-[#B8860B] rounded-full flex items-center justify-center text-white font-serif text-xl">
                    {testimonial.author.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <p className="font-semibold text-gray-800">{testimonial.author}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1600"
            alt="CTA Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="relative z-10 text-center text-white px-4 max-w-3xl mx-auto">
          <div className="w-16 h-[2px] bg-white mx-auto mb-8" />
          <h2 className="text-4xl md:text-5xl font-serif mb-6">
            Begin Your Royal Journey
          </h2>
          <p className="text-xl mb-8 font-light">
            Book your perfect stay or event at Maharaja Palace today and experience luxury redefined
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="filled" size="lg">
              Book Your Stay
            </Button>
            <Button variant="secondary" size="lg">
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}