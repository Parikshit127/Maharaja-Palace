import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Crown, Users, Award, Star, MapPin, Phone, ArrowRight, ChevronDown, Bed, PartyPopper, UtensilsCrossed, Building2, Sparkle, Theater } from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════════
// SCROLL EXPAND MEDIA COMPONENT - Premium Hero Animation with Full Screen Video
// ═══════════════════════════════════════════════════════════════════════════════
const ScrollExpandMedia = ({ mediaSrc, bgImageSrc, mediaType = 'image', title, subtitle, scrollToExpand, children }) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [mediaFullyExpanded, setMediaFullyExpanded] = useState(false);
  const [touchStartY, setTouchStartY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
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
        const scrollDelta = e.deltaY * 0.0008;
        const newProgress = Math.min(Math.max(scrollProgress + scrollDelta, 0), 1);
        setScrollProgress(newProgress);
        if (newProgress >= 1) { setMediaFullyExpanded(true); setShowContent(true); }
        else if (newProgress < 0.75) { setShowContent(false); }
      }
    };

    const handleTouchStart = (e) => setTouchStartY(e.touches[0].clientY);
    const handleTouchMove = (e) => {
      if (!touchStartY) return;
      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY - touchY;
      if (mediaFullyExpanded && deltaY < -20 && window.scrollY <= 5) {
        setMediaFullyExpanded(false);
        e.preventDefault();
      } else if (!mediaFullyExpanded) {
        e.preventDefault();
        const scrollDelta = deltaY * (deltaY < 0 ? 0.008 : 0.005);
        const newProgress = Math.min(Math.max(scrollProgress + scrollDelta, 0), 1);
        setScrollProgress(newProgress);
        if (newProgress >= 1) { setMediaFullyExpanded(true); setShowContent(true); }
        else if (newProgress < 0.75) { setShowContent(false); }
        setTouchStartY(touchY);
      }
    };

    const handleTouchEnd = () => setTouchStartY(0);
    const handleScroll = () => { if (!mediaFullyExpanded) window.scrollTo(0, 0); };

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

  // Full screen expansion - video fills entire viewport
  const mediaWidth = 280 + scrollProgress * (isMobile ? (window.innerWidth - 280) : (window.innerWidth - 280));
  const mediaHeight = 380 + scrollProgress * (window.innerHeight - 380);
  const borderRadius = 24 - scrollProgress * 24; // Rounded to square
  const textTranslateX = scrollProgress * (isMobile ? 200 : 160);
  const titleWords = title ? title.split(' ') : [];

  return (
    <div className="transition-colors duration-700 ease-in-out overflow-x-hidden">
      <section className="relative flex flex-col items-center justify-start min-h-screen">
        <div className="relative w-full flex flex-col items-center min-h-screen">
          <motion.div className="absolute inset-0 z-0 h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 - scrollProgress }} transition={{ duration: 0.1 }}>
            <img src={bgImageSrc} alt="Background" className="w-screen h-screen object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40" />
          </motion.div>
          <div className="container mx-auto flex flex-col items-center justify-start relative z-10">
            <div className="flex flex-col items-center justify-center w-full h-screen relative">
              <div 
                className="absolute z-0 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-none overflow-hidden" 
                style={{ 
                  width: `${mediaWidth}px`, 
                  height: `${mediaHeight}px`, 
                  maxWidth: '100vw', 
                  maxHeight: '100vh',
                  borderRadius: `${borderRadius}px`,
                  boxShadow: scrollProgress < 1 ? '0px 0px 80px rgba(184, 134, 11, 0.3), 0px 0px 120px rgba(0, 0, 0, 0.4)' : 'none'
                }}
              >
                <div className="relative w-full h-full">
                  {mediaType === 'video' ? (
                    <video src={mediaSrc} autoPlay muted loop playsInline className="w-full h-full object-cover" />
                  ) : (
                    <img src={mediaSrc} alt={title} className="w-full h-full object-cover" />
                  )}
                  <motion.div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" initial={{ opacity: 0.8 }} animate={{ opacity: 0.8 - scrollProgress * 0.5 }} transition={{ duration: 0.2 }} />
                </div>
              </div>

              {/* Hero Text with Royal Italic Font */}
              <div className="flex items-center justify-center text-center gap-3 w-full relative z-10 transition-none flex-col mix-blend-difference">
                <motion.p className="text-sm md:text-base uppercase tracking-[0.5em] text-white/90 font-light mb-2" initial={{ opacity: 0 }} animate={{ opacity: 1 - scrollProgress * 2.5 }}>Est. 2016 • Rohtak, Haryana</motion.p>
                {/* Royal Italic Title - Maharaja */}
                <motion.h1 
                  className="text-5xl md:text-7xl lg:text-9xl text-white transition-none" 
                  style={{ 
                    transform: `translateX(-${textTranslateX}vw)`, 
                    textShadow: '0 4px 30px rgba(0,0,0,0.5)',
                    fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif",
                    fontStyle: 'italic',
                    fontWeight: '600',
                    letterSpacing: '0.05em'
                  }}
                >
                  {titleWords[0] || ''}
                </motion.h1>
                {/* Royal Italic Title - Palace */}
                <motion.h1 
                  className="text-5xl md:text-7xl lg:text-9xl text-white transition-none" 
                  style={{ 
                    transform: `translateX(${textTranslateX}vw)`, 
                    textShadow: '0 4px 30px rgba(0,0,0,0.5)',
                    fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif",
                    fontStyle: 'italic',
                    fontWeight: '600',
                    letterSpacing: '0.05em'
                  }}
                >
                  {titleWords.slice(1).join(' ') || ''}
                </motion.h1>
                {subtitle && <motion.p className="text-lg md:text-2xl text-white/90 font-light mt-6 tracking-wider" initial={{ opacity: 0 }} animate={{ opacity: 1 - scrollProgress * 2 }}>{subtitle}</motion.p>}
              </div>
              {scrollToExpand && (
                <motion.div className="absolute bottom-12 text-white text-xs uppercase tracking-[0.4em] flex flex-col items-center" initial={{ opacity: 1 }} animate={{ opacity: 1 - scrollProgress * 3 }}>
                  <span className="mb-4">{scrollToExpand}</span>
                  <ChevronDown className="w-6 h-6 animate-bounce" />
                </motion.div>
              )}
            </div>
            <motion.section className="flex flex-col w-full px-6 py-12 md:px-20 lg:py-24" initial={{ opacity: 0 }} animate={{ opacity: showContent ? 1 : 0 }} transition={{ duration: 0.8 }}>{children}</motion.section>
          </div>
        </div>
      </section>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// PREMIUM BUTTON COMPONENT - Responsive
// ═══════════════════════════════════════════════════════════════════════════════
const Button = ({ variant = 'filled', size = 'md', children, onClick, icon }) => {
  const baseStyles = "font-medium transition-all duration-500 tracking-wider uppercase inline-flex items-center justify-center gap-2 sm:gap-3 group";
  const sizeStyles = { 
    md: "px-5 sm:px-8 py-3 sm:py-4 text-xs sm:text-sm", 
    lg: "px-6 sm:px-10 py-3.5 sm:py-5 text-xs sm:text-base" 
  };
  const variantStyles = {
    filled: "bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-white hover:from-[#9a7209] hover:to-[#B8860B] shadow-xl hover:shadow-2xl hover:shadow-[#B8860B]/30",
    outline: "border-2 border-[#B8860B] text-[#B8860B] hover:bg-[#B8860B] hover:text-white backdrop-blur-sm",
    secondary: "border border-white/50 text-white bg-white/10 backdrop-blur-md hover:bg-white hover:text-[#1a1a1a]",
    ghost: "text-[#B8860B] hover:text-[#9a7209] underline-offset-8 hover:underline"
  };
  return (
    <button onClick={onClick} className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]}`}>
      {children}
      {icon && <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />}
    </button>
  );
};


// ═══════════════════════════════════════════════════════════════════════════════
// LUXURY IMAGE CARD WITH SLIDER COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
const LuxuryCard = ({ images, image, title, subtitle, description, onClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const imageList = images || [image];
  
  useEffect(() => {
    if (imageList.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % imageList.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [imageList.length]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.8 }} 
      viewport={{ once: true }}
      className="group cursor-pointer overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-700 relative rounded-xl" 
      onClick={onClick}
    >
      <div className="relative h-72 sm:h-80 overflow-hidden">
        {imageList.map((img, idx) => (
          <img 
            key={idx}
            src={img} 
            alt={`${title} ${idx + 1}`} 
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ${
              idx === currentIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
            } group-hover:scale-110`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* Image Indicators */}
        {imageList.length > 1 && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {imageList.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
                className={`h-1 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? 'bg-[#D4AF37] w-6' : 'bg-white/50 w-2'
                }`}
              />
            ))}
          </div>
        )}
        
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
          <p className="text-[#D4AF37] text-[10px] sm:text-xs uppercase tracking-[0.3em] mb-2">{subtitle}</p>
          <h3 className="text-xl sm:text-2xl font-serif text-white mb-2">{title}</h3>
        </div>
      </div>
      <div className="p-6 sm:p-8 bg-gradient-to-b from-white to-[#faf9f6]">
        <p className="text-gray-600 leading-relaxed text-xs sm:text-sm line-clamp-3">{description}</p>
        <div className="mt-4 sm:mt-6 flex items-center text-[#B8860B] text-xs sm:text-sm font-medium group-hover:gap-3 gap-2 transition-all">
          <span>Explore</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
        </div>
      </div>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// ANIMATED COUNT UP COMPONENT - Numbers animate from 0 to target
// ═══════════════════════════════════════════════════════════════════════════════
const CountUp = ({ end, duration = 2000, suffix = '', decimals = 0 }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const startTime = Date.now();
          const endValue = parseFloat(end.toString().replace(/,/g, ''));
          
          const animate = () => {
            const now = Date.now();
            const progress = Math.min((now - startTime) / duration, 1);
            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = easeOutQuart * endValue;
            
            if (decimals > 0) {
              setCount(currentValue.toFixed(decimals));
            } else {
              setCount(Math.floor(currentValue));
            }
            
            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              // Ensure we end exactly at the target
              setCount(decimals > 0 ? endValue.toFixed(decimals) : endValue);
            }
          };
          
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [end, duration, hasAnimated, decimals]);

  // Format number with commas
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  return (
    <span ref={ref}>
      {formatNumber(count)}{suffix}
    </span>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION HEADER COMPONENT - Responsive
// ═══════════════════════════════════════════════════════════════════════════════
const SectionHeader = ({ eyebrow, title, subtitle, light = false }) => (
  <div className="text-center mb-10 sm:mb-16 md:mb-20 px-4">
    <div className="flex items-center justify-center gap-3 sm:gap-4 mb-4 sm:mb-6">
      <div className="w-8 sm:w-12 h-[1px] bg-gradient-to-r from-transparent to-[#B8860B]" />
      <Crown className={`w-5 h-5 sm:w-6 sm:h-6 ${light ? 'text-[#D4AF37]' : 'text-[#B8860B]'}`} />
      <div className="w-8 sm:w-12 h-[1px] bg-gradient-to-l from-transparent to-[#B8860B]" />
    </div>
    <p className={`text-[10px] sm:text-xs uppercase tracking-[0.3em] sm:tracking-[0.4em] ${light ? 'text-[#D4AF37]' : 'text-[#B8860B]'} mb-3 sm:mb-4 font-light`}>{eyebrow}</p>
    <h2 className={`text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-serif ${light ? 'text-white' : 'text-gray-800'} leading-tight`}>{title}</h2>
    {subtitle && <p className={`text-sm sm:text-base lg:text-lg ${light ? 'text-white/80' : 'text-gray-600'} mt-4 sm:mt-6 max-w-3xl mx-auto leading-relaxed font-light`}>{subtitle}</p>}
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// AMENITY ICON COMPONENT - Replaces emojis with proper icons
// ═══════════════════════════════════════════════════════════════════════════════
const AmenityIcon = ({ type }) => {
  const iconClass = "w-10 h-10 sm:w-12 sm:h-12 text-[#B8860B] group-hover:scale-110 transition-transform duration-500";
  const icons = {
    accommodation: <Bed className={iconClass} />,
    celebrations: <PartyPopper className={iconClass} />,
    dining: <UtensilsCrossed className={iconClass} />,
    corporate: <Building2 className={iconClass} />,
    wellness: <Sparkle className={iconClass} />,
    cultural: <Theater className={iconClass} />
  };
  return icons[type] || <Crown className={iconClass} />;
};

// ═══════════════════════════════════════════════════════════════════════════════
// PREMIUM AMENITIES REVEAL - Sliding Background Hover Interaction
// ═══════════════════════════════════════════════════════════════════════════════
const PremiumAmenitiesReveal = () => {
  const [activePanel, setActivePanel] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const amenitiesData = [
    { 
      id: 0,
      title: 'Royal Accommodations', 
      subtitle: 'Heritage Living',
      desc: 'Sumptuous suites adorned with heritage artefacts, handwoven textiles, and modern indulgences for the discerning traveler.',
      icon: <Bed className="w-8 h-8" />
    },
    { 
      id: 1,
      title: 'Grand Celebrations', 
      subtitle: 'Majestic Events',
      desc: 'Majestic venues for weddings, galas, and ceremonies that echo the splendor of royal courts.',
      icon: <PartyPopper className="w-8 h-8" />
    },
    { 
      id: 2,
      title: 'Culinary Excellence', 
      subtitle: 'Fine Dining',
      desc: 'Award-winning chefs crafting exquisite cuisines from royal Mughlai to contemporary global fare.',
      icon: <UtensilsCrossed className="w-8 h-8" />
    },
    { 
      id: 3,
      title: 'Executive Retreats', 
      subtitle: 'Business & Conferences',
      desc: 'State-of-the-art conference halls designed for distinguished corporate gatherings.',
      icon: <Building2 className="w-8 h-8" />
    },
    { 
      id: 4,
      title: 'Wellness Sanctuary', 
      subtitle: 'Spa & Rejuvenation',
      desc: 'Ancient Ayurvedic therapies and modern spa treatments for complete rejuvenation of body and soul.',
      icon: <Sparkle className="w-8 h-8" />
    },
    { 
      id: 5,
      title: 'Cultural Immersion', 
      subtitle: 'Heritage Experiences',
      desc: 'Traditional performances, heritage walks, and curated experiences of Indian royalty.',
      icon: <Theater className="w-8 h-8" />
    }
  ];

  // Mobile horizontal scroll version
  if (isMobile) {
    return (
      <section className="relative bg-[#0a0a0a] py-16 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920" 
            alt="Palace" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />
        </div>

        {/* Header */}
        <div className="relative z-10 text-center px-4 mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-[1px] bg-gradient-to-r from-transparent to-[#D4AF37]" />
            <Crown className="w-5 h-5 text-[#D4AF37]" />
            <div className="w-8 h-[1px] bg-gradient-to-l from-transparent to-[#D4AF37]" />
          </div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] mb-2">World-Class Offerings</p>
          <h2 className="text-2xl font-serif text-white" style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}>
            Palace Amenities
          </h2>
        </div>

        {/* Horizontal Scroll Cards */}
        <div className="relative z-10 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
          <div className="flex gap-4 px-4 pb-4" style={{ width: 'max-content' }}>
            {amenitiesData.map((amenity, index) => (
              <motion.div
                key={amenity.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="snap-center flex-shrink-0 w-[280px] bg-black/40 backdrop-blur-md border border-[#D4AF37]/20 rounded-xl p-6"
              >
                <div className="text-[#D4AF37] mb-4">{amenity.icon}</div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37]/70 mb-2">{amenity.subtitle}</p>
                <h3 
                  className="text-xl text-[#D4AF37] mb-3"
                  style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}
                >
                  {amenity.title}
                </h3>
                <p className="text-white/70 text-xs leading-relaxed">{amenity.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Desktop hover panels version
  return (
    <section className="relative min-h-[90vh] overflow-hidden">
      {/* Fixed Background Image */}
      <div className="absolute inset-0">
        <motion.img 
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920" 
          alt="Palace" 
          className="w-full h-full object-cover"
          animate={{ scale: activePanel !== null ? 1.05 : 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/20" />
      </div>

      {/* Section Header */}
      <div className="absolute top-8 left-0 right-0 z-20 text-center">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-[#D4AF37]" />
          <Crown className="w-6 h-6 text-[#D4AF37]" />
          <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-[#D4AF37]" />
        </div>
        <p className="text-xs uppercase tracking-[0.4em] text-[#D4AF37] mb-2">World-Class Offerings</p>
        <h2 
          className="text-4xl lg:text-5xl text-white"
          style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}
        >
          Palace Amenities
        </h2>
      </div>

      {/* Vertical Hover Panels */}
      <div className="relative z-10 h-[90vh] flex">
        {amenitiesData.map((amenity, index) => (
          <motion.div
            key={amenity.id}
            className="relative flex-1 cursor-pointer overflow-hidden"
            onMouseEnter={() => setActivePanel(index)}
            onMouseLeave={() => setActivePanel(null)}
            animate={{
              opacity: activePanel === null ? 1 : activePanel === index ? 1 : 0.4,
            }}
            transition={{ duration: 0.5 }}
          >
            {/* Gold Overlay on Hover */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/10 via-[#D4AF37]/5 to-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: activePanel === index ? 1 : 0 }}
              transition={{ duration: 0.5 }}
            />

            {/* Vertical Divider Line */}
            {index < amenitiesData.length - 1 && (
              <div className="absolute right-0 top-1/4 bottom-1/4 w-[1px] bg-gradient-to-b from-transparent via-[#D4AF37]/30 to-transparent" />
            )}

            {/* Content Container */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
              {/* Icon - Always Visible */}
              <motion.div
                className="text-[#D4AF37] mb-4"
                animate={{ 
                  scale: activePanel === index ? 1.2 : 1,
                  y: activePanel === index ? -20 : 0
                }}
                transition={{ duration: 0.5 }}
              >
                {amenity.icon}
              </motion.div>

              {/* Text Content - Reveals on Hover */}
              <motion.div
                className="text-center max-w-[200px]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: activePanel === index ? 1 : 0,
                  y: activePanel === index ? 0 : 20
                }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <p className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37]/80 mb-2">
                  {amenity.subtitle}
                </p>
                <h3 
                  className="text-2xl lg:text-3xl text-[#D4AF37] mb-4 leading-tight"
                  style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}
                >
                  {amenity.title}
                </h3>
                <p className="text-white/80 text-sm leading-relaxed font-light italic">
                  {amenity.desc}
                </p>
              </motion.div>

              {/* Bottom Index Number */}
              <motion.div
                className="absolute bottom-8 text-[#D4AF37]/30 text-6xl font-serif"
                animate={{ opacity: activePanel === index ? 0.5 : 0.2 }}
                transition={{ duration: 0.5 }}
              >
                0{index + 1}
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent z-10" />
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// ACCOMMODATION SECTION WITH IMAGE SLIDER
// ═══════════════════════════════════════════════════════════════════════════════
const AccommodationSection = ({ navigate }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const suiteImages = [
    { src: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800", title: "Maharaja Suite" },
    { src: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800", title: "Royal Penthouse" },
    { src: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800", title: "Heritage Room" },
    { src: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800", title: "Executive Suite" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % suiteImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [suiteImages.length]);

  return (
    <section className="py-16 sm:py-24 md:py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.8 }} 
            viewport={{ once: true }}
            className="order-2 lg:order-1"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-8 sm:w-12 h-[1px] bg-[#B8860B]" />
              <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-[#B8860B]" />
            </div>
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.4em] text-[#B8860B] mb-4">Royal Accommodations</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-gray-800 mb-6 sm:mb-8 leading-tight">
              Suites Worthy of<br /><span className="italic text-[#B8860B]">Maharajas</span>
            </h2>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-4 sm:mb-6 font-light">
              Every space at Maharaja Palace tells a story of tradition, craftsmanship, and comfort. From ornate arches and 
              carved furnishings to rich fabrics and curated artefacts, the interiors exude the charm of a bygone era.
            </p>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-6 sm:mb-8">
              Complementing this royal ambience are modern conveniences—high-speed Wi-Fi, premium bedding, luxurious bathrooms, 
              and personalized butler service.
            </p>
            <Button variant="filled" size="lg" onClick={() => navigate('/rooms')} icon>View All Suites</Button>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 50 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.8 }} 
            viewport={{ once: true }} 
            className="relative order-1 lg:order-2"
          >
            {/* Main Image Slider */}
            <div className="relative h-[300px] sm:h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              {suiteImages.map((img, idx) => (
                <img 
                  key={idx}
                  src={img.src} 
                  alt={img.title}
                  className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ${
                    idx === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
                  }`}
                />
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              
              {/* Slide Title */}
              <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6">
                <p className="text-white text-lg sm:text-xl font-serif">{suiteImages[currentSlide].title}</p>
              </div>
              
              {/* Slide Indicators */}
              <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 flex gap-2">
                {suiteImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === currentSlide ? 'bg-[#D4AF37] w-6' : 'bg-white/50 w-2'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            {/* Stats Badge */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              viewport={{ once: true }}
              className="absolute -bottom-4 sm:-bottom-6 -left-2 sm:-left-6 bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-white p-4 sm:p-6 rounded-xl shadow-xl"
            >
              <p className="text-2xl sm:text-3xl font-serif font-bold">250+</p>
              <p className="text-[10px] sm:text-sm uppercase tracking-wider">Luxury Suites</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};


// ═══════════════════════════════════════════════════════════════════════════════
// MAIN HOMEPAGE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export function HomePage() {
  const navigate = useNavigate();
  useEffect(() => { window.scrollTo(0, 0); }, []);

  // Premium Content Data
  const stats = [
    { icon: <Crown size={44} />, value: '250+', label: 'Palatial Suites', desc: 'Handcrafted Luxury' },
    { icon: <Star size={44} />, value: '4.9', label: 'Guest Rating', desc: 'Excellence Certified' },
    { icon: <Users size={44} />, value: '12,000+', label: 'Distinguished Guests', desc: 'Annually Welcomed' },
    { icon: <Award size={44} />, value: '47', label: 'Prestigious Awards', desc: 'International Recognition' }
  ];

  // Amenities with icon types instead of emojis
  const amenities = [
    { iconType: 'accommodation', title: 'Royal Accommodations', desc: 'Sumptuous suites adorned with heritage artefacts, handwoven textiles, and modern indulgences' },
    { iconType: 'celebrations', title: 'Grand Celebrations', desc: 'Majestic venues for weddings, galas, and ceremonies that echo the splendor of royal courts' },
    { iconType: 'dining', title: 'Culinary Artistry', desc: 'Award-winning chefs crafting exquisite cuisines from royal Mughlai to contemporary global fare' },
    { iconType: 'corporate', title: 'Executive Retreats', desc: 'State-of-the-art conference halls designed for distinguished corporate gatherings' },
    { iconType: 'wellness', title: 'Wellness Sanctuary', desc: 'Ancient Ayurvedic therapies and modern spa treatments for complete rejuvenation' },
    { iconType: 'cultural', title: 'Cultural Immersion', desc: 'Traditional performances, heritage walks, and curated experiences of Indian royalty' }
  ];

  const testimonials = [
    { text: "The Maharaja Palace transcends the ordinary. Every moment felt like stepping into a living heritage, where centuries of royal tradition embrace you with warmth and grace. An experience that will forever remain etched in our hearts.", author: "Her Excellency Priya Mehta", role: "Royal Wedding, December 2024", rating: 5 },
    { text: "In my travels across the world's finest establishments, rarely have I encountered such an exquisite marriage of heritage and hospitality. The attention to detail, the warmth of service, the sheer magnificence—truly unparalleled.", author: "Mr. Vikram Singhania", role: "Chairman, Singhania Group", rating: 5 },
    { text: "From the moment we arrived, we were transported to an era of kings and queens. The palace exceeded every expectation—the architecture, the cuisine, the impeccable service. A crown jewel of Indian hospitality.", author: "Lady Sarah Winchester", role: "International Dignitary, UK", rating: 5 }
  ];

  // Fixed experiences with multiple images for slider
  const experiences = [
    { 
      images: [
        "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800",
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800",
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800"
      ],
      title: "Royal Suites & Chambers", 
      subtitle: "Accommodation", 
      description: "From intimate heritage rooms to sprawling maharaja suites, each space tells a story of tradition, craftsmanship, and uncompromising comfort." 
    },
    { 
      images: [
        "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800",
        "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800",
        "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800"
      ],
      title: "Majestic Celebrations", 
      subtitle: "Weddings & Events", 
      description: "Choose from grand ballrooms, heritage courtyards, and palace gardens. Each venue transforms your special moments into legendary celebrations." 
    },
    { 
      images: [
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
        "https://images.unsplash.com/photo-1544148103-0773bf10d330?w=800"
      ],
      title: "Culinary Excellence", 
      subtitle: "Fine Dining", 
      description: "Our master chefs present a symphony of flavors—from royal Awadhi cuisine to contemporary international gastronomy." 
    }
  ];

  return (
    <div className="bg-[#faf9f6]">
      {/* ═══════════════════════════════════════════════════════════════════════════════ */}
      {/* HERO SECTION - Scroll Expand Animation with Full Screen Video */}
      {/* ═══════════════════════════════════════════════════════════════════════════════ */}
      <ScrollExpandMedia
        mediaType="video"
        mediaSrc="/assets/maharaja.mp4"
        bgImageSrc="https://maharajapalaces.com/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-03-at-4.37.49-PM-2.jpeg"
        title="Maharaja Palace"
        subtitle="Where Heritage Embraces Grandeur • Since 2016"
        scrollToExpand="Discover the Legacy"
      >

        {/* ═══════════════════════════════════════════════════════════════════════════════ */}
        {/* WELCOME SECTION - Premium Introduction */}
        {/* ═══════════════════════════════════════════════════════════════════════════════ */}
        <div className="text-center max-w-5xl mx-auto mb-28">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="w-16 h-[1px] bg-gradient-to-r from-transparent to-[#B8860B]" />
            <Crown className="w-8 h-8 text-[#B8860B]" />
            <div className="w-16 h-[1px] bg-gradient-to-l from-transparent to-[#B8860B]" />
          </div>
          <p className="text-xs uppercase tracking-[0.5em] text-[#B8860B] mb-6 font-light">Delhi NCR's Crown Jewel of Hospitality</p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-gray-800 mb-8 leading-tight">
            A Symphony of Regal Grandeur<br /><span className="text-[#B8860B] italic">& Timeless Elegance</span>
          </h2>
          <p className="text-xl text-gray-700 leading-relaxed mb-6 font-light max-w-4xl mx-auto">
            Welcome to The Maharaja Palace — a world where regal grandeur, timeless elegance, and warm Indian hospitality 
            converge to create an experience beyond imagination. Nestled in the heart of heritage, our palace stands as a 
            magnificent testament to royal architecture, cultural richness, and the art of refined living.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed mb-12 max-w-3xl mx-auto">
            Every corridor whispers tales of kings and queens. Every courtyard celebrates art and tradition. 
            Every chamber embodies grace, glory, and the promise of memories that last a lifetime.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Button variant="filled" size="lg" onClick={() => navigate('/rooms')} icon>Reserve Your Royal Suite</Button>
            <Button variant="outline" size="lg" onClick={() => navigate('/about')} icon>Discover Our Legacy</Button>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════════════════ */}
        {/* STATS SECTION - Distinguished Numbers with Count Animation */}
        {/* ═══════════════════════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto mb-20">
          {stats.map((stat, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.15, duration: 0.7 }} viewport={{ once: true }}
              className="p-8 bg-white/70 backdrop-blur-md rounded-2xl border border-[#B8860B]/10 hover:border-[#B8860B]/30 transition-all duration-500 hover:shadow-2xl hover:shadow-[#B8860B]/10 group text-center">
              <div className="text-[#B8860B] flex justify-center mb-4 group-hover:scale-110 transition-transform duration-500">{stat.icon}</div>
              <div className="text-4xl md:text-5xl font-serif font-bold text-gray-800 mb-2">
                {stat.value === '250+' && <CountUp end={250} duration={2000} suffix="+" />}
                {stat.value === '4.9' && <CountUp end={4.9} duration={1500} decimals={1} />}
                {stat.value === '12,000+' && <CountUp end={12000} duration={2500} suffix="+" />}
                {stat.value === '47' && <CountUp end={47} duration={1800} />}
              </div>
              <div className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-1">{stat.label}</div>
              <div className="text-xs text-gray-500 tracking-wide">{stat.desc}</div>
            </motion.div>
          ))}
        </div>
      </ScrollExpandMedia>

      {/* ═══════════════════════════════════════════════════════════════════════════════ */}
      {/* SIGNATURE EXPERIENCES SECTION */}
      {/* ═══════════════════════════════════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="Curated for Royalty" title="Signature Experiences" subtitle="Immerse yourself in a world where every detail is crafted to perfection, every moment designed to create lasting memories of unparalleled luxury." />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {experiences.map((exp, index) => (
              <LuxuryCard key={index} {...exp} onClick={() => navigate(index === 0 ? '/rooms' : index === 1 ? '/banquet' : '/restaurant')} />
            ))}
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════════════════════════ */}
      {/* PALACE AMENITIES SECTION - Premium Hover Reveal */}
      {/* ═══════════════════════════════════════════════════════════════════════════════ */}
      <PremiumAmenitiesReveal />

      {/* Spacer Section */}
      <div className="h-16 sm:h-24 md:h-32 bg-[#faf9f6]" />

      {/* ═══════════════════════════════════════════════════════════════════════════════ */}
      {/* BANQUETING & EVENTS - Full Width Feature */}
      {/* ═══════════════════════════════════════════════════════════════════════════════ */}
      <section className="relative py-20 sm:py-32 md:py-40 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1920" alt="Banquet Hall" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/70 to-black/50 sm:from-black/80 sm:via-black/60 sm:to-black/40" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="w-8 sm:w-12 h-[1px] bg-[#D4AF37]" />
              <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-[#D4AF37]" />
            </div>
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] sm:tracking-[0.4em] text-[#D4AF37] mb-3 sm:mb-4">Celebrations Fit for Royalty</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-6 sm:mb-8 leading-tight">
              Grand Banqueting<br /><span className="italic text-[#D4AF37]">& Majestic Events</span>
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-white/90 leading-relaxed mb-6 sm:mb-8 font-light">
              Choose from majestic courtyards, grand ballrooms, and heritage-inspired banquet halls. Each space is designed with 
              regal architecture, intricate detailing, and luxurious interiors that echo the splendor of a bygone era.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button variant="filled" size="lg" onClick={() => navigate('/banquet')} icon>Explore Venues</Button>
              <Button variant="secondary" size="lg" onClick={() => navigate('/contact')} icon>Plan Your Event</Button>
            </div>
          </motion.div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════════════════════════ */}
      {/* ACCOMMODATION HIGHLIGHT - Enhanced with Slider */}
      {/* ═══════════════════════════════════════════════════════════════════════════════ */}
      <AccommodationSection navigate={navigate} />

      {/* ═══════════════════════════════════════════════════════════════════════════════ */}
      {/* GALLERY PREVIEW - Enhanced with Animations */}
      {/* ═══════════════════════════════════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-24 md:py-32 bg-[#faf9f6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="Visual Journey" title="Gallery of Grandeur" subtitle="Take a glimpse into our royal world—where every frame captures the essence of palatial magnificence." />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {[
              { img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', title: 'Palace Exterior' },
              { img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800', title: 'Royal Suite' },
              { img: 'https://images.unsplash.com/photo-1596436889106-be35e843f974?w=800', title: 'Marble Bath' },
              { img: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800', title: 'Pool View' }
            ].map((item, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 30, scale: 0.95 }} 
                whileInView={{ opacity: 1, y: 0, scale: 1 }} 
                transition={{ delay: index * 0.15, duration: 0.7, ease: "easeOut" }} 
                viewport={{ once: true }}
                className="aspect-square overflow-hidden group cursor-pointer rounded-xl relative shadow-lg hover:shadow-2xl transition-all duration-500"
                onClick={() => navigate('/gallery')}
              >
                <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                  <p className="text-white text-xs sm:text-sm font-medium">{item.title}</p>
                </div>
                {/* Corner Decorations */}
                <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-[#D4AF37]/0 group-hover:border-[#D4AF37] transition-all duration-500 rounded-tl" />
                <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-[#D4AF37]/0 group-hover:border-[#D4AF37] transition-all duration-500 rounded-br" />
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8 sm:mt-12">
            <Button variant="outline" size="lg" onClick={() => navigate('/gallery')} icon>Explore Full Gallery</Button>
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════════════════════════ */}
      {/* TESTIMONIALS SECTION */}
      {/* ═══════════════════════════════════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-24 md:py-32 bg-gradient-to-b from-white to-[#faf9f6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="Distinguished Voices" title="Guest Experiences" subtitle="Hear from those who have experienced the magic of Maharaja Palace—where every stay becomes a cherished memory." />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.15, duration: 0.7 }} viewport={{ once: true }}
                className="bg-white p-6 sm:p-8 lg:p-10 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border-l-4 border-[#B8860B] relative">
                <div className="flex gap-1 mb-4 sm:mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-[#D4AF37] text-[#D4AF37]" />)}
                </div>
                <div className="text-4xl sm:text-5xl text-[#B8860B]/20 font-serif absolute top-4 sm:top-6 right-4 sm:right-8">"</div>
                <p className="text-gray-700 italic mb-6 sm:mb-8 leading-relaxed text-xs sm:text-sm line-clamp-4 sm:line-clamp-none">{testimonial.text}</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-br from-[#B8860B] to-[#D4AF37] rounded-full flex items-center justify-center text-white font-serif text-lg sm:text-xl shadow-lg flex-shrink-0">
                    {testimonial.author.split(' ').slice(-1)[0].charAt(0)}
                  </div>
                  <div className="ml-3 sm:ml-4 min-w-0">
                    <p className="font-semibold text-gray-800 text-sm sm:text-base truncate">{testimonial.author}</p>
                    <p className="text-xs sm:text-sm text-[#B8860B] truncate">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════════════ */}
      {/* LOCATION & CONTACT STRIP */}
      {/* ═══════════════════════════════════════════════════════════════════════════════ */}
      <section className="py-10 sm:py-16 bg-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-center sm:text-left">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4"
            >
              <MapPin className="w-6 h-6 sm:w-8 sm:h-8 text-[#D4AF37]" />
              <div>
                <p className="text-white font-medium text-sm sm:text-base">Prime Location</p>
                <p className="text-white/60 text-xs sm:text-sm">45 mins from Delhi • 30 mins from Gurgaon</p>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4"
            >
              <Phone className="w-6 h-6 sm:w-8 sm:h-8 text-[#D4AF37]" />
              <div>
                <p className="text-white font-medium text-sm sm:text-base">Reservations</p>
                <p className="text-white/60 text-xs sm:text-sm">+91 1234 567 890 • 24/7 Concierge</p>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4"
            >
              <Award className="w-6 h-6 sm:w-8 sm:h-8 text-[#D4AF37]" />
              <div>
                <p className="text-white font-medium text-sm sm:text-base">Award-Winning</p>
                <p className="text-white/60 text-xs sm:text-sm">Best Heritage Hotel 2024</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════════════════════════ */}
      {/* FINAL CTA SECTION */}
      {/* ═══════════════════════════════════════════════════════════════════════════════ */}
      <section className="relative h-[60vh] sm:h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1920" alt="CTA Background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/60 to-black/40 sm:from-black/80 sm:via-black/50 sm:to-black/30" />
        </div>
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
            <div className="flex items-center justify-center gap-3 sm:gap-4 mb-6 sm:mb-8">
              <div className="w-10 sm:w-16 h-[1px] bg-white/50" />
              <Crown className="w-6 h-6 sm:w-8 sm:h-8 text-[#D4AF37]" />
              <div className="w-10 sm:w-16 h-[1px] bg-white/50" />
            </div>
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] sm:tracking-[0.5em] text-[#D4AF37] mb-4 sm:mb-6">Your Royal Journey Awaits</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif mb-6 sm:mb-8 leading-tight">
              Begin Your Legacy<br /><span className="italic text-[#D4AF37]">at Maharaja Palace</span>
            </h2>
            <p className="text-sm sm:text-lg lg:text-xl mb-8 sm:mb-10 font-light text-white/90 max-w-2xl mx-auto px-4">
              Step into a world where every moment is extraordinary, every experience unforgettable, and every guest is treated like royalty.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 justify-center px-4">
              <Button variant="filled" size="lg" onClick={() => navigate('/rooms')} icon>Reserve Your Suite</Button>
              <Button variant="secondary" size="lg" onClick={() => navigate('/contact')} icon>Speak with Concierge</Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
