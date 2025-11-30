import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Sparkles, Users, Award, Heart, Star, MapPin, Phone, ArrowRight, Play, ChevronDown } from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════════
// SCROLL EXPAND MEDIA COMPONENT - Premium Hero Animation
// ═══════════════════════════════════════════════════════════════════════════════
const ScrollExpandMedia = ({ mediaSrc, bgImageSrc, bgVideoSrc, mediaType = 'image', title, subtitle, scrollToExpand, children }) => {
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

  const mediaWidth = 280 + scrollProgress * (isMobile ? 680 : 1320);
  const mediaHeight = 380 + scrollProgress * (isMobile ? 220 : 420);
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
              <div className="absolute z-0 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-none rounded-3xl overflow-hidden" style={{ width: `${mediaWidth}px`, height: `${mediaHeight}px`, maxWidth: '96vw', maxHeight: '88vh', boxShadow: '0px 0px 80px rgba(184, 134, 11, 0.3), 0px 0px 120px rgba(0, 0, 0, 0.4)' }}>
                <div className="relative w-full h-full">
                  {mediaType === 'video' ? (
                    <video src={mediaSrc} autoPlay muted loop playsInline className="w-full h-full object-cover" />
                  ) : (
                    <img src={mediaSrc} alt={title} className="w-full h-full object-cover" />
                  )}
                  <motion.div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" initial={{ opacity: 0.8 }} animate={{ opacity: 0.8 - scrollProgress * 0.5 }} transition={{ duration: 0.2 }} />
                </div>
              </div>
              <div className="flex items-center justify-center text-center gap-3 w-full relative z-10 transition-none flex-col mix-blend-difference">
                <motion.p className="text-sm md:text-base uppercase tracking-[0.5em] text-white/90 font-light mb-2" initial={{ opacity: 0 }} animate={{ opacity: 1 - scrollProgress * 2.5 }}>Est. 1847 • Rohtak, Haryana</motion.p>
                <motion.h1 className="text-5xl md:text-7xl lg:text-9xl font-serif font-bold text-white transition-none" style={{ transform: `translateX(-${textTranslateX}vw)`, textShadow: '0 4px 30px rgba(0,0,0,0.5)' }}>{titleWords[0] || ''}</motion.h1>
                <motion.h1 className="text-5xl md:text-7xl lg:text-9xl font-serif font-bold text-white transition-none" style={{ transform: `translateX(${textTranslateX}vw)`, textShadow: '0 4px 30px rgba(0,0,0,0.5)' }}>{titleWords.slice(1).join(' ') || ''}</motion.h1>
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
// PREMIUM BUTTON COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
const Button = ({ variant = 'filled', size = 'md', children, onClick, icon }) => {
  const baseStyles = "font-medium transition-all duration-500 tracking-wider uppercase inline-flex items-center justify-center gap-3 group";
  const sizeStyles = { md: "px-8 py-4 text-sm", lg: "px-10 py-5 text-base" };
  const variantStyles = {
    filled: "bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-white hover:from-[#9a7209] hover:to-[#B8860B] shadow-xl hover:shadow-2xl hover:shadow-[#B8860B]/30",
    outline: "border-2 border-[#B8860B] text-[#B8860B] hover:bg-[#B8860B] hover:text-white backdrop-blur-sm",
    secondary: "border border-white/50 text-white bg-white/10 backdrop-blur-md hover:bg-white hover:text-[#1a1a1a]",
    ghost: "text-[#B8860B] hover:text-[#9a7209] underline-offset-8 hover:underline"
  };
  return (
    <button onClick={onClick} className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]}`}>
      {children}
      {icon && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
    </button>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// LUXURY IMAGE CARD COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
const LuxuryCard = ({ image, title, subtitle, description, onClick }) => (
  <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}
    className="group cursor-pointer overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-700 relative" onClick={onClick}>
    <div className="relative h-80 overflow-hidden">
      <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
        <p className="text-[#D4AF37] text-xs uppercase tracking-[0.3em] mb-2">{subtitle}</p>
        <h3 className="text-2xl font-serif text-white mb-2">{title}</h3>
      </div>
    </div>
    <div className="p-8 bg-gradient-to-b from-white to-[#faf9f6]">
      <p className="text-gray-600 leading-relaxed text-sm">{description}</p>
      <div className="mt-6 flex items-center text-[#B8860B] text-sm font-medium group-hover:gap-3 gap-2 transition-all">
        <span>Explore</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
      </div>
    </div>
  </motion.div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION HEADER COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
const SectionHeader = ({ eyebrow, title, subtitle, light = false }) => (
  <div className="text-center mb-16 md:mb-20">
    <div className="flex items-center justify-center gap-4 mb-6">
      <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-[#B8860B]" />
      <Crown className={`w-6 h-6 ${light ? 'text-[#D4AF37]' : 'text-[#B8860B]'}`} />
      <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-[#B8860B]" />
    </div>
    <p className={`text-xs uppercase tracking-[0.4em] ${light ? 'text-[#D4AF37]' : 'text-[#B8860B]'} mb-4 font-light`}>{eyebrow}</p>
    <h2 className={`text-4xl md:text-5xl lg:text-6xl font-serif ${light ? 'text-white' : 'text-gray-800'} leading-tight`}>{title}</h2>
    {subtitle && <p className={`text-lg ${light ? 'text-white/80' : 'text-gray-600'} mt-6 max-w-3xl mx-auto leading-relaxed font-light`}>{subtitle}</p>}
  </div>
);


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

  const amenities = [
    { icon: '🏛️', title: 'Royal Accommodations', desc: 'Sumptuous suites adorned with heritage artefacts, handwoven textiles, and modern indulgences' },
    { icon: '💒', title: 'Grand Celebrations', desc: 'Majestic venues for weddings, galas, and ceremonies that echo the splendor of royal courts' },
    { icon: '🍷', title: 'Culinary Artistry', desc: 'Award-winning chefs crafting exquisite cuisines from royal Mughlai to contemporary global fare' },
    { icon: '🏢', title: 'Executive Retreats', desc: 'State-of-the-art conference halls designed for distinguished corporate gatherings' },
    { icon: '🧘', title: 'Wellness Sanctuary', desc: 'Ancient Ayurvedic therapies and modern spa treatments for complete rejuvenation' },
    { icon: '🎭', title: 'Cultural Immersion', desc: 'Traditional performances, heritage walks, and curated experiences of Indian royalty' }
  ];

  const testimonials = [
    { text: "The Maharaja Palace transcends the ordinary. Every moment felt like stepping into a living heritage, where centuries of royal tradition embrace you with warmth and grace. An experience that will forever remain etched in our hearts.", author: "Her Excellency Priya Mehta", role: "Royal Wedding, December 2024", rating: 5 },
    { text: "In my travels across the world's finest establishments, rarely have I encountered such an exquisite marriage of heritage and hospitality. The attention to detail, the warmth of service, the sheer magnificence—truly unparalleled.", author: "Mr. Vikram Singhania", role: "Chairman, Singhania Group", rating: 5 },
    { text: "From the moment we arrived, we were transported to an era of kings and queens. The palace exceeded every expectation—the architecture, the cuisine, the impeccable service. A crown jewel of Indian hospitality.", author: "Lady Sarah Winchester", role: "International Dignitary, UK", rating: 5 }
  ];

  const experiences = [
    { image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800", title: "Royal Suites & Chambers", subtitle: "Accommodation", description: "From intimate heritage rooms to sprawling maharaja suites, each space tells a story of tradition, craftsmanship, and uncompromising comfort. Ornate arches, carved furnishings, rich fabrics, and curated artefacts create an ambience of timeless elegance." },
    { image: "https://images.unsplash.com/photo-1519167758481-83f29da8a97f?w=800", title: "Majestic Celebrations", subtitle: "Weddings & Events", description: "Choose from grand ballrooms, heritage courtyards, and palace gardens. Each venue is designed with regal architecture, intricate detailing, and luxurious interiors that transform your special moments into legendary celebrations." },
    { image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800", title: "Culinary Excellence", subtitle: "Fine Dining", description: "Our master chefs present a symphony of flavors—from royal Awadhi cuisine to contemporary international gastronomy. Every dish is a masterpiece, every meal an unforgettable journey through culinary heritage." }
  ];

  return (
    <div className="bg-[#faf9f6]">
      {/* ═══════════════════════════════════════════════════════════════════════════════ */}
      {/* HERO SECTION - Scroll Expand Animation */}
      {/* ═══════════════════════════════════════════════════════════════════════════════ */}
      <ScrollExpandMedia
        mediaType="video"
        mediaSrc="/assets/maharaja.mp4"
        bgImageSrc="https://maharajapalaces.com/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-03-at-4.37.49-PM-2.jpeg"
        title="Maharaja Palace"
        subtitle="Where Heritage Embraces Grandeur • Since 1847"
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
        {/* STATS SECTION - Distinguished Numbers */}
        {/* ═══════════════════════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto mb-20">
          {stats.map((stat, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.15, duration: 0.7 }} viewport={{ once: true }}
              className="p-8 bg-white/70 backdrop-blur-md rounded-2xl border border-[#B8860B]/10 hover:border-[#B8860B]/30 transition-all duration-500 hover:shadow-2xl hover:shadow-[#B8860B]/10 group text-center">
              <div className="text-[#B8860B] flex justify-center mb-4 group-hover:scale-110 transition-transform duration-500">{stat.icon}</div>
              <div className="text-4xl md:text-5xl font-serif font-bold text-gray-800 mb-2">{stat.value}</div>
              <div className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-1">{stat.label}</div>
              <div className="text-xs text-gray-500 tracking-wide">{stat.desc}</div>
            </motion.div>
          ))}
        </div>
      </ScrollExpandMedia>


      {/* ═══════════════════════════════════════════════════════════════════════════════ */}
      {/* SIGNATURE EXPERIENCES SECTION */}
      {/* ═══════════════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="Curated for Royalty" title="Signature Experiences" subtitle="Immerse yourself in a world where every detail is crafted to perfection, every moment designed to create lasting memories of unparalleled luxury." />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {experiences.map((exp, index) => (
              <LuxuryCard key={index} {...exp} onClick={() => navigate(index === 0 ? '/rooms' : index === 1 ? '/banquet' : '/restaurant')} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════════════ */}
      {/* PALACE AMENITIES SECTION */}
      {/* ═══════════════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-gradient-to-b from-[#faf9f6] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="World-Class Offerings" title="Palace Amenities" subtitle="At Maharaja Palace, every moment of your stay is crafted to reflect the grandeur of royal living and the comfort of contemporary hospitality." />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {amenities.map((amenity, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1, duration: 0.6 }} viewport={{ once: true }}
                className="group text-center p-10 bg-white hover:shadow-2xl transition-all duration-700 rounded-2xl border border-transparent hover:border-[#B8860B]/20 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#B8860B] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-500">{amenity.icon}</div>
                <h3 className="text-xl font-serif text-[#B8860B] mb-4">{amenity.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm">{amenity.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════════════ */}
      {/* BANQUETING & EVENTS - Full Width Feature */}
      {/* ═══════════════════════════════════════════════════════════════════════════════ */}
      <section className="relative py-32 md:py-40 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1519167758481-83f29da8a97f?w=1920" alt="Banquet Hall" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-[1px] bg-[#D4AF37]" />
              <Crown className="w-6 h-6 text-[#D4AF37]" />
            </div>
            <p className="text-xs uppercase tracking-[0.4em] text-[#D4AF37] mb-4">Celebrations Fit for Royalty</p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-8 leading-tight">Grand Banqueting<br /><span className="italic text-[#D4AF37]">& Majestic Events</span></h2>
            <p className="text-lg text-white/90 leading-relaxed mb-8 font-light">
              Choose from majestic courtyards, grand ballrooms, and heritage-inspired banquet halls. Each space is designed with 
              regal architecture, intricate detailing, and luxurious interiors that echo the splendor of a bygone era—transforming 
              your celebrations into legendary occasions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="filled" size="lg" onClick={() => navigate('/banquet')} icon>Explore Venues</Button>
              <Button variant="secondary" size="lg" onClick={() => navigate('/contact')} icon>Plan Your Event</Button>
            </div>
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════════════════════════ */}
      {/* ACCOMMODATION HIGHLIGHT */}
      {/* ═══════════════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-[1px] bg-[#B8860B]" />
                <Crown className="w-6 h-6 text-[#B8860B]" />
              </div>
              <p className="text-xs uppercase tracking-[0.4em] text-[#B8860B] mb-4">Royal Accommodations</p>
              <h2 className="text-4xl md:text-5xl font-serif text-gray-800 mb-8 leading-tight">Suites Worthy of<br /><span className="italic text-[#B8860B]">Maharajas</span></h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6 font-light">
                Every space at Maharaja Palace tells a story of tradition, craftsmanship, and comfort. From ornate arches and 
                carved furnishings to rich fabrics and curated artefacts, the interiors exude the charm of a bygone era.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                Complementing this royal ambience are modern conveniences—high-speed Wi-Fi, premium bedding, luxurious bathrooms, 
                and personalized butler service—ensuring an indulgent stay that honors heritage while embracing contemporary luxury.
              </p>
              <Button variant="filled" size="lg" onClick={() => navigate('/rooms')} icon>View All Suites</Button>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="relative">
              <div className="grid grid-cols-2 gap-4">
                <img src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600" alt="Suite 1" className="rounded-2xl shadow-2xl" />
                <img src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600" alt="Suite 2" className="rounded-2xl shadow-2xl mt-8" />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-[#B8860B] text-white p-6 rounded-xl shadow-xl">
                <p className="text-3xl font-serif font-bold">250+</p>
                <p className="text-sm uppercase tracking-wider">Luxury Suites</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════════════ */}
      {/* GALLERY PREVIEW */}
      {/* ═══════════════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-[#faf9f6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="Visual Journey" title="Gallery of Grandeur" subtitle="Take a glimpse into our royal world—where every frame captures the essence of palatial magnificence." />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800', 'https://images.unsplash.com/photo-1596436889106-be35e843f974?w=800', 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800'].map((img, index) => (
              <motion.div key={index} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.1, duration: 0.6 }} viewport={{ once: true }}
                className="aspect-square overflow-hidden group cursor-pointer rounded-xl">
                <img src={img} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button variant="outline" size="lg" onClick={() => navigate('/gallery')} icon>Explore Full Gallery</Button>
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════════════════════════ */}
      {/* TESTIMONIALS SECTION */}
      {/* ═══════════════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-gradient-to-b from-white to-[#faf9f6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="Distinguished Voices" title="Guest Experiences" subtitle="Hear from those who have experienced the magic of Maharaja Palace—where every stay becomes a cherished memory." />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.15, duration: 0.7 }} viewport={{ once: true }}
                className="bg-white p-10 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border-l-4 border-[#B8860B] relative">
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => <Star key={i} className="w-5 h-5 fill-[#D4AF37] text-[#D4AF37]" />)}
                </div>
                <div className="text-5xl text-[#B8860B]/20 font-serif absolute top-6 right-8">"</div>
                <p className="text-gray-700 italic mb-8 leading-relaxed text-sm">{testimonial.text}</p>
                <div className="flex items-center">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#B8860B] to-[#D4AF37] rounded-full flex items-center justify-center text-white font-serif text-xl shadow-lg">
                    {testimonial.author.split(' ').slice(-1)[0].charAt(0)}
                  </div>
                  <div className="ml-4">
                    <p className="font-semibold text-gray-800">{testimonial.author}</p>
                    <p className="text-sm text-[#B8860B]">{testimonial.role}</p>
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
      <section className="py-16 bg-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <MapPin className="w-8 h-8 text-[#D4AF37]" />
              <div>
                <p className="text-white font-medium">Prime Location</p>
                <p className="text-white/60 text-sm">45 mins from Delhi • 30 mins from Gurgaon</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-4">
              <Phone className="w-8 h-8 text-[#D4AF37]" />
              <div>
                <p className="text-white font-medium">Reservations</p>
                <p className="text-white/60 text-sm">+91 1234 567 890 • 24/7 Concierge</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-4">
              <Award className="w-8 h-8 text-[#D4AF37]" />
              <div>
                <p className="text-white font-medium">Award-Winning</p>
                <p className="text-white/60 text-sm">Best Heritage Hotel 2024</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════════════ */}
      {/* FINAL CTA SECTION */}
      {/* ═══════════════════════════════════════════════════════════════════════════════ */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1920" alt="CTA Background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
        </div>
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="w-16 h-[1px] bg-white/50" />
              <Crown className="w-8 h-8 text-[#D4AF37]" />
              <div className="w-16 h-[1px] bg-white/50" />
            </div>
            <p className="text-xs uppercase tracking-[0.5em] text-[#D4AF37] mb-6">Your Royal Journey Awaits</p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-8 leading-tight">Begin Your Legacy<br /><span className="italic text-[#D4AF37]">at Maharaja Palace</span></h2>
            <p className="text-xl mb-10 font-light text-white/90 max-w-2xl mx-auto">
              Step into a world where every moment is extraordinary, every experience unforgettable, and every guest is treated like royalty.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <Button variant="filled" size="lg" onClick={() => navigate('/rooms')} icon>Reserve Your Suite</Button>
              <Button variant="secondary" size="lg" onClick={() => navigate('/contact')} icon>Speak with Concierge</Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
