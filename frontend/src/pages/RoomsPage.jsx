import React, { useState, useEffect, useRef } from "react";

export const RoomsPage = () => {
  const [activeRoom, setActiveRoom] = useState(null);
  const [visibleSections, setVisibleSections] = useState(new Set());
  const [activeImageIndexes, setActiveImageIndexes] = useState({});
  const sectionRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = entry.target.dataset.index;
            setVisibleSections((prev) => new Set([...prev, index]));
          }
        });
      },
      { threshold: 0.2 }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      sectionRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  // Auto-rotate images
  useEffect(() => {
    const intervals = roomCategories.map((room, index) => {
      return setInterval(() => {
        setActiveImageIndexes((prev) => ({
          ...prev,
          [index]: ((prev[index] || 0) + 1) % room.images.length,
        }));
      }, 3000);
    });

    return () => intervals.forEach(clearInterval);
  }, []);

  const roomCategories = [
    {
      id: "khwabgah",
      title: "KHWABGAH (Penthouse)",
      subtitle: "For a regal experience!",
      description:
        "Khwabgah is a spacious royal chamber encompassing 2 bedrooms, a living room, a dining room, a separate bar, a private butler service and an office chamber with a private terrace.",
      images: [
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200",
        "https://images.unsplash.com/photo-1629140727571-9b5c6f6267b4?w=1200",
        "https://images.unsplash.com/photo-1631049552240-59c37f563fd5?w=1200",
      ],
      link: "/rooms/khwabgah",
    },
    {
      id: "presidential",
      title: "PRESIDENTIAL SUITE",
      subtitle: "Unprecedented luxury coupled with bespoke services!",
      description:
        "Bedecked with demure interiors and soft lights, this suite is an epitome of effortless luxury coupled with immaculate services for bespoke experiences. Flaunting a regal décor, this centrally air-conditioned suite offers unparalleled comfort.",
      images: [
        "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200",
        "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200",
        "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=1200",
      ],
      link: "/rooms/presidential",
    },
    {
      id: "heritage",
      title: "HERITAGE SUITES",
      subtitle: "Designed with a dash of majestic past!",
      description:
        "These graceful suites offer the best of both worlds – luxury and comfort in Karnal. These suites have a bedroom, which have been opulently furnished with modern comforts and Indian art forms.",
      images: [
        "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200",
        "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=1200",
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200",
      ],
      link: "/rooms/heritage",
    },
    {
      id: "club-royal",
      title: "CLUB ROYAL ROOMS",
      subtitle: "Intimate luxury and personalized care!",
      description:
        "These well appointed rooms are adorned by vibrant upholstery that represents a rich royal history of the land & subtle interiors. They have an array of modern amenities to facilitate a luxurious stay for the guests.",
      images: [
        "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1200",
        "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200",
        "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200",
      ],
      link: "/rooms/club-royal",
    },
    {
      id: "club",
      title: "CLUB ROOMS",
      subtitle: "Flawlessly comfortable!",
      description:
        "Beautifully bedecked with aesthetically pleasing interiors, these rooms offer a beautiful view. Pleasant sceneries adorn the pastel walls of the room. They are furnished with all the modern comforts providing an authentic royal experience at Noormahal.",
      images: [
        "https://images.unsplash.com/photo-1631049035182-249067d7618e?w=1200",
        "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=1200",
        "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=1200",
      ],
      link: "/rooms/club",
    },
  ];

  return (
    <div className="bg-[#faf9f6]">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1600)",
          }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        <div className="relative z-10 text-center text-white px-4">
          <p className="text-sm uppercase tracking-[0.3em] mb-4">OUR</p>
          <h1 className="text-5xl md:text-6xl font-serif mb-6">
            LUXURIOUS STAY
          </h1>
        </div>
      </section>

      {/* Introduction Text */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <p className="text-gray-700 leading-relaxed font-serif text-base mb-4">
          At Maharaja Palace, Rohtak, we offer an exclusive collection of 125
          ultra-luxurious rooms and suites, each adorned with premium royal
          furnishings and exquisite upholstery. Designed in the grand style of
          traditional Indian palatial architecture, the palace seamlessly blends
          timeless heritage with world-class modern comforts. Immerse yourself
          in an atmosphere of majestic elegance and experience the true
          splendour of Indian royalty at Maharaja Palace — the 7-star Crown
          Jewel of Rohtak.
        </p>
        {/* <p className="text-sm text-gray-600 italic font-serif">
          Note: Dear Guest, our rooftop is undergoing soft refurbishment to
          enhance your future experience; we apologize for any inconvenience and
          appreciate your patience.
        </p> */}
      </section>

      <h2 className="text-4xl md:text-5xl font-serif text-gray-800 mb-12 text-center">
        OUR LUXURIOUS STAY
      </h2>

      {/* Detailed Room Sections with Image Carousel */}
      {roomCategories.map((room, index) => {
        const currentImageIndex = activeImageIndexes[index] || 0;

        return (
          <section
            key={room.id}
            ref={(el) => (sectionRefs.current[index] = el)}
            data-index={index}
            className={`py-20 overflow-hidden ${
              index % 2 === 0 ? "bg-[#f8f6f3]" : "bg-[#faf9f6]"
            }`}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center`}
              >
                {/* Image Carousel - Animated from Left on Even, Right on Odd */}
                <div
                  className={`relative h-[450px] overflow-hidden group transition-all duration-1000 ${
                    visibleSections.has(String(index))
                      ? "opacity-100 translate-x-0"
                      : index % 2 === 0
                      ? "opacity-0 -translate-x-32"
                      : "opacity-0 translate-x-32"
                  } ${index % 2 === 1 ? "lg:order-2" : ""}`}
                  onMouseEnter={() => setActiveRoom(room.id)}
                  onMouseLeave={() => setActiveRoom(null)}
                >
                  {/* Image Slider */}
                  <div className="relative w-full h-full">
                    {room.images.map((image, imgIndex) => (
                      <img
                        key={imgIndex}
                        src={image}
                        alt={`${room.title} ${imgIndex + 1}`}
                        className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ${
                          imgIndex === currentImageIndex
                            ? "opacity-100 scale-100"
                            : "opacity-0 scale-105"
                        } ${activeRoom === room.id ? "scale-110" : ""}`}
                      />
                    ))}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>

                  {/* Image Indicators */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
                    {room.images.map((_, imgIndex) => (
                      <button
                        key={imgIndex}
                        onClick={() =>
                          setActiveImageIndexes((prev) => ({
                            ...prev,
                            [index]: imgIndex,
                          }))
                        }
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          imgIndex === currentImageIndex
                            ? "bg-white w-8"
                            : "bg-white/50"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Content - Animated from Right on Even, Left on Odd */}
                <div
                  className={`transition-all duration-1000 delay-300 ${
                    visibleSections.has(String(index))
                      ? "opacity-100 translate-x-0"
                      : index % 2 === 0
                      ? "opacity-0 translate-x-32"
                      : "opacity-0 -translate-x-32"
                  } ${index % 2 === 1 ? "lg:order-1" : ""}`}
                >
                  <div className="bg-white/60 backdrop-blur-sm p-8 shadow-lg">
                    <div className="w-12 h-[2px] bg-[#B8860B] mb-4"></div>
                    <h2 className="text-2xl md:text-3xl font-serif text-gray-800 mb-3">
                      {room.title}
                    </h2>
                    <p className="text-[#B8860B] font-serif text-base mb-3 italic">
                      {room.subtitle}
                    </p>
                    <p className="text-gray-700 leading-relaxed font-serif text-sm mb-6">
                      {room.description}
                    </p>
                    <button
                      onClick={() => (window.location.href = room.link)}
                      className="bg-[#B8860B] text-white px-6 py-2.5 hover:bg-[#8B6914] transition-colors duration-300 uppercase text-xs tracking-wider shadow-md"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      })}

      {/* CTA Section */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1600)",
          }}
        >
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        <div className="relative z-10 text-center text-white px-4 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-serif mb-6">
            Ready to Experience Royal Luxury?
          </h2>
          <p className="text-xl mb-8 font-light font-serif">
            Book your stay at Maharaja Palace and immerse yourself in
            unparalleled elegance
          </p>
          <button
            onClick={() => (window.location.href = "/booking")}
            className="bg-[#B8860B] text-white px-12 py-4 text-lg hover:bg-[#8B6914] transition-colors duration-300 uppercase tracking-wider"
          >
            Book Now
          </button>
        </div>
      </section>
    </div>
  );
};