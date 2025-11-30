import React, { useState, useEffect } from "react";
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

  const nextReview = () => {
    setCurrentReview((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentReview((prev) =>
      prev === 0 ? reviews.length - 1 : prev - 1
    );
  };

  return (
    <div className="bg-[#faf9f6] font-royal">
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
      <section id="banquet-slider" className="max-w-7xl mx-auto px-6 mb-20">
        <SectionTitle subtitle="Signature Venues">
          <span className="font-royal">Explore Our Banquet Collection</span>
        </SectionTitle>

        <div className="relative mt-12">
          <div className="flex items-stretch justify-center gap-8 overflow-visible">
            {[getIndex(-1), getIndex(0), getIndex(1)].map((idx, position) => {
              const hall = halls[idx];
              const isCenter = position === 1;

              return (
                <div
                  key={hall.id}
                  className={`relative bg-white rounded-3xl shadow-xl overflow-hidden transition-all duration-500 ${
                    isCenter
                      ? "scale-100 opacity-100"
                      : "scale-90 opacity-40 blur-[1px]"
                  } w-full md:w-1/3`}
                >
                  <div className="relative h-64">
                    <img
                      src={hall.image}
                      alt={hall.name}
                      className={`w-full h-full object-cover ${
                        isCenter ? "" : "grayscale-[15%]"
                      }`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>

                  <div className="p-7">
                    <h3 className="text-2xl font-royal text-gold mb-2">
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
            className="hidden md:flex absolute top-1/2 -translate-y-1/2 -left-6 bg-white shadow-xl w-12 h-12 rounded-full items-center justify-center hover:bg-cream transition"
          >
            <ArrowLeft className="w-5 h-5 text-gray-800" />
          </button>

          <button
            onClick={nextSlide}
            className="hidden md:flex absolute top-1/2 -translate-y-1/2 -right-6 bg-white shadow-xl w-12 h-12 rounded-full items-center justify-center hover:bg-cream transition"
          >
            <ArrowRight className="w-5 h-5 text-gray-800" />
          </button>
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
    </div>
  );
};




