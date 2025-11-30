import { useState, useEffect } from "react";
import { SectionTitle } from "../components/BaseComponents";
import { ArrowLeft, ArrowRight } from "lucide-react";

export const BanquetPage = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrollY(y > 300 ? 300 : y);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // REAL PREMIUM BANQUET HALL IMAGES
  const halls = [
    {
      id: 1,
      name: "Grand Maharaja Ballroom",
      image:
        "https://i.pinimg.com/1200x/c5/91/95/c59195da3166c4dc498aee96dadc5b43.jpg",
      description:
        "Our largest and most opulent ballroom, featuring rich golden tones, ornate ceilings, and an ambience crafted for royal weddings and grand celebrations.",
      capacity: 500,
      areaSqFt: 8000,
    },
    {
      id: 2,
      name: "Royal Durbar Hall",
      image:
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1600&q=80",
      description:
        "A heritage-inspired hall featuring ornate wall carvings, handwoven drapery, and a majestic stage — ideal for receptions, cultural ceremonies, and lavish gatherings.",
      capacity: 320,
      areaSqFt: 5200,
    },
    {
      id: 3,
      name: "Imperial Wedding Hall",
      image:
        "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1600&q=80",
      description:
        "A breathtaking venue illuminated with warm golden hues, designed exclusively for grand wedding rituals and celebrations.",
      capacity: 240,
      areaSqFt: 4500,
    },
    {
      id: 4,
      name: "Crystal Banquet Chamber",
      image:
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1600&q=80",
      description:
        "A richly modern banquet hall featuring crystal lighting, elegant décor, and luxurious seating for elite events and corporate galas.",
      capacity: 150,
      areaSqFt: 3000,
    },
    {
      id: 5,
      name: "Heritage Maharaja Hall",
      image:
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1600&q=80",
      description:
        "An intimate venue with traditional motifs, handcrafted accents, and a regal charm perfect for private celebrations.",
      capacity: 200,
      areaSqFt: 3800,
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () =>
    setCurrentIndex((prev) => (prev === 0 ? halls.length - 1 : prev - 1));

  const nextSlide = () =>
    setCurrentIndex((prev) => (prev === halls.length - 1 ? 0 : prev + 1));

  const getIndex = (offset) => {
    const len = halls.length;
    return (currentIndex + offset + len) % len;
  };

  const [minArea, setMinArea] = useState("");
  const [minCapacity, setMinCapacity] = useState("");

  const filteredHalls = halls.filter((hall) => {
    const areaOk = !minArea || hall.areaSqFt >= Number(minArea);
    const capOk = !minCapacity || hall.capacity >= Number(minCapacity);
    return areaOk && capOk;
  });

  // REVIEWS – MINIMAL ROYAL SECTION
  const reviews = [
    {
      quote:
        "A truly enchanting venue — the grandeur of the halls and the warmth of the staff made our celebration unforgettable.",
      author: "Arjun Mehta",
    },
    {
      quote:
        "Every detail felt thoughtfully curated. Maharaja Palace gave our wedding the royal charm we always dreamed of.",
      author: "Rhea Lalwani",
    },
    {
      quote:
        "From décor to service, everything reflected elegance and heritage. Our guests were mesmerised.",
      author: "Devansh Kapoor",
    },
    {
      quote:
        "A perfect blend of tradition and luxury. The banquet team ensured a seamless and memorable experience.",
      author: "Nisha Bhandari",
    },
  ];

  const [currentReview, setCurrentReview] = useState(0);
  const [lightboxHall, setLightboxHall] = useState(null);

  const nextReview = () => {
    setCurrentReview((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentReview((prev) =>
      prev === 0 ? reviews.length - 1 : prev - 1
    );
  };

  const openLightbox = (hall) => {
    setLightboxHall(hall);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxHall(null);
    document.body.style.overflow = 'unset';
  };

  // Handle card click - center card opens lightbox, side cards become center
  const handleCardClick = (position, hall) => {
    if (position === 1) {
      // Center card - open lightbox
      openLightbox(hall);
    } else if (position === 0) {
      // Left card - go to previous
      prevSlide();
    } else if (position === 2) {
      // Right card - go to next
      nextSlide();
    }
  };

  return (
    <div className="bg-[#faf9f6] font-royal">
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
        .animate-fadeInUp { animation: fadeInUp 0.5s ease-out 0.2s forwards; opacity: 0; }
      `}</style>
      {/* ========= FULLSCREEN HERO ========= */}
      <section className="relative h-screen overflow-hidden flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://i.pinimg.com/1200x/c5/91/95/c59195da3166c4dc498aee96dadc5b43.jpg)",
            transform: `scale(${1 + scrollY * 0.0008})`,
            transition: "transform 0.1s linear",
          }}
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div
          className="relative z-10 text-center text-white px-4"
          style={{
            transform: `translateY(${scrollY * 0.12}px)`,
            transition: "transform 0.1s linear",
          }}
        >
          <p className="text-sm uppercase tracking-[0.4em] mb-4 text-gold">
            Celebrations Reimagined
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-royal text-white mb-4 drop-shadow-xl">
            Magnificent Banquet Halls
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-200 font-light">
            From intimate gatherings to royal weddings, our palace venues are
            crafted to host your most unforgettable moments.
          </p>
        </div>

        <button
          onClick={() =>
            document
              .getElementById("banquet-slider")
              ?.scrollIntoView({ behavior: "smooth" })
          }
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white flex flex-col items-center gap-2"
        >
          <span className="text-xs tracking-[0.3em] uppercase">Scroll</span>
          <span className="w-[1px] h-8 bg-white/80 animate-pulse" />
        </button>
      </section>

      {/* INTRO */}
      <section className="max-w-4xl mx-auto px-6 py-16 text-center">
        <p className="text-gray-700 leading-relaxed font-serif text-lg">
          At Maharaja Palace, every banquet space blends timeless grandeur with
          modern luxury—ensuring a regal experience for weddings, receptions,
          conferences, and royal celebrations.
        </p>
      </section>

      {/* ========= CAROUSEL ========= */}
      <section id="banquet-slider" className="max-w-7xl mx-auto px-4 sm:px-6 mb-20">
        <SectionTitle subtitle="Signature Venues">
          <span className="font-royal">Explore Our Banquet Collection</span>
        </SectionTitle>

        <div className="relative mt-8 sm:mt-12">
          {/* Mobile: Single card view */}
          <div className="block lg:hidden">
            <div 
              onClick={() => openLightbox(halls[currentIndex])}
              className="group relative bg-white rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden mx-auto max-w-md cursor-pointer transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-2"
            >
              <div className="relative h-48 sm:h-64 overflow-hidden">
                <img
                  src={halls[currentIndex].image}
                  alt={halls[currentIndex].name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent transition-opacity duration-500 group-hover:from-black/60" />
                {/* Corner accents on hover */}
                <div className="absolute top-3 left-3 w-6 h-6 border-l-2 border-t-2 border-gold/0 group-hover:border-gold transition-all duration-500 transform -translate-x-2 -translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0" />
                <div className="absolute bottom-3 right-3 w-6 h-6 border-r-2 border-b-2 border-gold/0 group-hover:border-gold transition-all duration-500 transform translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0" />
              </div>

              <div className="p-5 sm:p-7 transition-all duration-500 group-hover:bg-gradient-to-b group-hover:from-white group-hover:to-gold/5">
                <h3 className="text-xl sm:text-2xl font-royal text-gold mb-2 transition-all duration-300 group-hover:text-darkGold">
                  {halls[currentIndex].name}
                </h3>
                <p className="text-gray-700 mb-4 line-clamp-3 font-serif text-sm sm:text-base">
                  {halls[currentIndex].description}
                </p>
                <div className="flex items-center gap-4 sm:gap-6 text-xs uppercase tracking-wider text-gray-600">
                  <div>
                    <p className="text-[10px] text-gray-500 mb-1">Capacity</p>
                    <p className="font-semibold text-gold">
                      {halls[currentIndex].capacity} Guests
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 mb-1">Area</p>
                    <p className="font-semibold text-gold">
                      {halls[currentIndex].areaSqFt.toLocaleString()} Sq. Ft.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Navigation */}
            <div className="flex items-center justify-center gap-4 mt-6">
              <button
                onClick={prevSlide}
                className="bg-white shadow-lg w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center hover:bg-cream transition border border-gold/20"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-800" />
              </button>
              
              {/* Dots indicator */}
              <div className="flex items-center gap-2">
                {halls.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      idx === currentIndex ? "bg-gold w-6" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextSlide}
                className="bg-white shadow-lg w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center hover:bg-cream transition border border-gold/20"
              >
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-800" />
              </button>
            </div>
          </div>

          {/* Desktop: Three card view */}
          <div className="hidden lg:block">
            <div className="flex items-stretch justify-center gap-6 xl:gap-8 overflow-visible px-8">
              {[getIndex(-1), getIndex(0), getIndex(1)].map((idx, position) => {
                const hall = halls[idx];
                const isCenter = position === 1;

                return (
                  <div
                    key={hall.id}
                    onClick={() => handleCardClick(position, hall)}
                    className={`group relative bg-white rounded-3xl shadow-xl overflow-hidden transition-all duration-500 flex-1 max-w-sm cursor-pointer ${
                      isCenter
                        ? "scale-100 opacity-100 z-10 hover:scale-[1.05] hover:-translate-y-3 hover:shadow-2xl"
                        : "scale-90 opacity-60 hover:opacity-80 hover:scale-95"
                    }`}
                  >
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={hall.image}
                        alt={hall.name}
                        className={`w-full h-full object-cover transition-transform duration-700 ${
                          isCenter ? "group-hover:scale-110" : "grayscale-[15%] group-hover:grayscale-0"
                        }`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent transition-all duration-500 group-hover:from-black/60" />
                      {/* Corner accents on hover - for all cards */}
                      <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-gold/0 group-hover:border-gold transition-all duration-500 transform -translate-x-2 -translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 rounded-tl-lg" />
                      <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-gold/0 group-hover:border-gold transition-all duration-500 transform translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 rounded-br-lg" />
                    </div>

                    <div className={`p-7 transition-all duration-500 ${isCenter ? "group-hover:bg-gradient-to-b group-hover:from-white group-hover:to-gold/5" : ""}`}>
                      <h3 className={`text-2xl font-royal text-gold mb-2 transition-all duration-300 ${isCenter ? "group-hover:text-darkGold" : ""}`}>
                        {hall.name}
                      </h3>
                      <p className="text-gray-700 mb-4 line-clamp-3 font-serif">
                        {hall.description}
                      </p>
                      <div className="flex items-center gap-6 text-xs uppercase tracking-wider text-gray-600">
                        <div>
                          <p className="text-[10px] text-gray-500 mb-1">
                            Capacity
                          </p>
                          <p className="font-semibold text-gold">
                            {hall.capacity} Guests
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-500 mb-1">Area</p>
                          <p className="font-semibold text-gold">
                            {hall.areaSqFt.toLocaleString()} Sq. Ft.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={prevSlide}
              className="absolute top-1/2 -translate-y-1/2 left-0 bg-white shadow-xl w-12 h-12 rounded-full flex items-center justify-center hover:bg-cream transition z-20"
            >
              <ArrowLeft className="w-5 h-5 text-gray-800" />
            </button>

            <button
              onClick={nextSlide}
              className="absolute top-1/2 -translate-y-1/2 right-0 bg-white shadow-xl w-12 h-12 rounded-full flex items-center justify-center hover:bg-cream transition z-20"
            >
              <ArrowRight className="w-5 h-5 text-gray-800" />
            </button>
          </div>
        </div>
      </section>

      {/* ========= FILTERS ========= */}
      <section className="max-w-7xl mx-auto px-6 mb-16">
        <SectionTitle subtitle="Find Your Perfect Hall">
          <span className="font-royal">Filter by Space & Capacity</span>
        </SectionTitle>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 font-serif">
              Minimum Area (Sq. Ft.)
            </label>
            <select
              value={minArea}
              onChange={(e) => setMinArea(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:border-gold"
            >
              <option value="">Any Area</option>
              <option value="1000">1,000+ Sq. Ft.</option>
              <option value="2500">2,500+ Sq. Ft.</option>
              <option value="4000">4,000+ Sq. Ft.</option>
              <option value="6000">6,000+ Sq. Ft.</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 font-serif">
              Minimum Capacity
            </label>
            <select
              value={minCapacity}
              onChange={(e) => setMinCapacity(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:border-gold"
            >
              <option value="">Any Capacity</option>
              <option value="50">50+ Guests</option>
              <option value="150">150+ Guests</option>
              <option value="250">250+ Guests</option>
              <option value="400">400+ Guests</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setMinArea("");
                setMinCapacity("");
              }}
              className="w-full bg-gold text-white py-3 rounded-lg text-sm uppercase hover:bg-darkGold transition tracking-wider"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </section>

      {/* ========= FILTERED HALL LIST ========= */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {filteredHalls.map((hall) => (
            <div
              key={hall.id}
              className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition transform hover:-translate-y-1"
            >
              <div className="h-60 relative">
                <img
                  src={hall.image}
                  alt={hall.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
              <div className="p-7">
                <h3 className="text-2xl font-royal text-gold mb-2">
                  {hall.name}
                </h3>
                <p className="text-gray-700 mb-4 font-serif">
                  {hall.description}
                </p>
                <div className="flex gap-6 text-sm text-gray-700">
                  <p>
                    <span className="font-semibold text-gold">Capacity:</span>{" "}
                    {hall.capacity} Guests
                  </p>
                  <p>
                    <span className="font-semibold text-gold">Area:</span>{" "}
                    {hall.areaSqFt.toLocaleString()} Sq. Ft.
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredHalls.length === 0 && (
          <p className="text-center text-gray-500 mt-10 font-serif">
            No halls match your selected criteria.
          </p>
        )}
      </section>

      {/* ========= GUEST REVIEWS ========= */}
      <section className="max-w-5xl mx-auto px-6 py-20 text-center font-royal">
        {/* Title */}
        <div className="flex items-center justify-center gap-6 mb-10">
          <div className="w-20 h-[1px] bg-gold" />
          <h2 className="text-4xl md:text-5xl tracking-wide text-gray-900">
            Guest Impressions
          </h2>
          <div className="w-20 h-[1px] bg-gold" />
        </div>

        {/* Subtext */}
        <p className="text-gray-600 font-serif text-lg leading-relaxed mb-16 max-w-3xl mx-auto">
          A glimpse into the graceful experiences shared by our guests, echoing
          the warmth, elegance, and royal hospitality of Maharaja Palace.
        </p>

        {/* Review Slider */}
        <div className="relative">
          <div className="transition-all duration-500 ease-in-out">
            <p className="text-2xl md:text-3xl text-gray-800 font-royal leading-snug italic mb-6">
              {reviews[currentReview].quote}
            </p>
            <p className="text-gray-700 font-serif tracking-wide uppercase text-sm">
              — {reviews[currentReview].author}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mt-10">
            <button
              onClick={prevReview}
              className="w-10 h-10 flex items-center justify-center border border-gold rounded-full hover:bg-gold hover:text-white transition"
            >
              ‹
            </button>

            <button
              onClick={nextReview}
              className="w-10 h-10 flex items-center justify-center border border-gold rounded-full hover:bg-gold hover:text-white transition"
            >
              ›
            </button>
          </div>
        </div>
      </section>

      {/* ========= LIGHTBOX ========= */}
      {lightboxHall && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button 
            className="absolute top-4 right-4 sm:top-6 sm:right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all duration-300 z-50"
            onClick={closeLightbox}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Navigation arrows */}
          <button 
            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all duration-300 z-50"
            onClick={(e) => { e.stopPropagation(); prevSlide(); setLightboxHall(halls[getIndex(-1)]); }}
          >
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <button 
            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all duration-300 z-50"
            onClick={(e) => { e.stopPropagation(); nextSlide(); setLightboxHall(halls[getIndex(1)]); }}
          >
            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Lightbox content */}
          <div 
            className="max-w-5xl w-full flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image */}
            <div className="relative w-full overflow-hidden rounded-2xl shadow-2xl" style={{ maxHeight: '70vh' }}>
              <img 
                src={lightboxHall.image} 
                alt={lightboxHall.name}
                className="w-full h-full object-cover animate-fadeIn"
                style={{ maxHeight: '70vh' }}
              />
              <div className="absolute inset-0 border-2 border-gold/30 rounded-2xl pointer-events-none" />
            </div>

            {/* Info */}
            <div className="text-center mt-6 sm:mt-8 animate-fadeInUp">
              <h3 className="text-3xl sm:text-4xl font-royal text-gold mb-3">{lightboxHall.name}</h3>
              <p className="text-white/80 font-serif max-w-2xl mx-auto mb-4 text-sm sm:text-base px-4">{lightboxHall.description}</p>
              <div className="flex items-center justify-center gap-6 sm:gap-8 text-white/70 text-sm">
                <div>
                  <span className="text-gold font-semibold">{lightboxHall.capacity}</span> Guests
                </div>
                <div className="w-[1px] h-4 bg-white/30" />
                <div>
                  <span className="text-gold font-semibold">{lightboxHall.areaSqFt.toLocaleString()}</span> Sq. Ft.
                </div>
              </div>
            </div>

            {/* Dots indicator */}
            <div className="flex items-center gap-2 mt-6">
              {halls.map((hall, idx) => (
                <button
                  key={idx}
                  onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); setLightboxHall(hall); }}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    hall.id === lightboxHall.id ? "bg-gold w-8" : "bg-white/30 hover:bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};




