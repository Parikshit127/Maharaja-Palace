import React, { useState, useEffect } from "react";
import {
  HeroSection,
  SectionTitle,
  Divider,
} from "../components/BaseComponents";
import { Leaf } from "lucide-react";

// Animated Card Component
const AnimatedCard = ({ children, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = React.useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => ref.current && observer.unobserve(ref.current);
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      {children}
    </div>
  );
};

export const AboutPage = () => {
  const awards = [
    {
      year: "2024",
      award: "Best Luxury Heritage Hotel",
      org: "Travel + Leisure Awards",
    },
    {
      year: "2023",
      award: "7-Star Excellence Award",
      org: "World Luxury Hotel Awards",
    },
    {
      year: "2023",
      award: "Best Fine Dining Restaurant",
      org: "Indian Culinary Excellence",
    },
    {
      year: "2022",
      award: "Heritage Preservation Award",
      org: "UNESCO Tourism",
    },
  ];

  return (
    <div className="bg-[#faf9f6]">
      <style>{`
        .royal-title {
          font-family: 'Playfair Display', 'Cormorant Garamond', Georgia, serif;
          font-weight: 600;
          font-style: italic;
          letter-spacing: 0.02em;
        }
        
        h2, h3, h4, .font-serif {
          font-family: 'Playfair Display', Georgia, serif;
          font-weight: 600;
        }
      `}</style>

      {/* HERO */}
      <HeroSection
        title="Our Story"
        subtitle="About Maharaja Palace"
        backgroundImage="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600"
        height="h-screen"
      />

      {/* HERITAGE INTRO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <AnimatedCard>
            <div className="relative">
              <p className="text-sm uppercase tracking-[0.3em] text-[#B8860B] mb-4 font-light">
                A Legacy of Excellence
              </p>

              <h2 className="royal-title text-4xl md:text-5xl lg:text-6xl text-gray-800 mb-8 leading-tight">
                Where Heritage Meets{" "}
                <span className="text-[#B8860B] relative inline-block">
                  Modern Luxury
                  <div className="absolute -bottom-2 left-0 w-full h-1 bg-[#B8860B]/20"></div>
                </span>
              </h2>

              <div className="space-y-6">
                <p className="text-lg text-gray-600 leading-relaxed">
                  Maharaja Palace stands as a testament to royal Indian
                  heritage, seamlessly blending centuries-old architectural
                  grandeur with contemporary luxury. Established with a vision
                  to provide guests with an authentic royal experience, our
                  palace has been meticulously restored to preserve its
                  historical significance while offering world-class modern
                  amenities.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed border-l-2 border-[#B8860B] pl-6">
                  Every corridor, courtyard, and carved archway is a living
                  chapter of history. Today, we reimagine that legacy for the
                  modern guest—curating experiences that feel both timeless and
                  refreshingly contemporary.
                </p>
              </div>
            </div>
          </AnimatedCard>

          {/* Image Grid */}
          <AnimatedCard delay={200}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="overflow-hidden rounded-lg shadow-lg">
                  <img
                    src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800"
                    alt="Palace Architecture"
                    className="w-full h-64 object-cover transform transition-transform duration-700 hover:scale-110"
                  />
                </div>
                <div className="overflow-hidden rounded-lg shadow-lg">
                  <img
                    src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800"
                    alt="Interior Detail"
                    className="w-full h-48 object-cover transform transition-transform duration-700 hover:scale-110"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-12">
                <div className="overflow-hidden rounded-lg shadow-lg">
                  <img
                    src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800"
                    alt="Grand Entrance"
                    className="w-full h-48 object-cover transform transition-transform duration-700 hover:scale-110"
                  />
                </div>
                <div className="overflow-hidden rounded-lg shadow-lg">
                  <img
                    src="https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800"
                    alt="Palace Gardens"
                    className="w-full h-64 object-cover transform transition-transform duration-700 hover:scale-110"
                  />
                </div>
              </div>
            </div>
          </AnimatedCard>
        </div>
      </section>

      {/* BRAND FILM / VIDEO SECTION */}
      <section className="bg-black py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <AnimatedCard>
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-[#B8860B]/40">
              <video
                src="/assets/maharaja.mp4"
                className="w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="pointer-events-none absolute inset-0 ring-1 ring-white/10" />
            </div>
          </AnimatedCard>

          <AnimatedCard delay={200}>
            <div className="text-white">
              <p className="text-xs tracking-[0.3em] uppercase text-[#D4AF37] mb-4">
                Signature Brand Film
              </p>
              <h2 className="royal-title text-4xl md:text-5xl mb-6">
                The Soul of{" "}
                <span className="text-[#D4AF37]">Maharaja Palace</span>
              </h2>
              <p className="text-lg text-gray-200 leading-relaxed mb-6">
                Our brand film captures more than walls and corridors—it
                captures a way of life. From dawn-lit courtyards to candlelit
                dinners under carved ceilings, every frame is a tribute to royal
                living, reimagined for today.
              </p>
              <p className="text-lg text-gray-300 leading-relaxed">
                Watch the story unfold as tradition, architecture, and
                hospitality come together to create an experience that is not
                just seen—but felt.
              </p>
            </div>
          </AnimatedCard>
        </div>
      </section>

      {/* SIGNATURE PHILOSOPHY */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <SectionTitle subtitle="Our Guiding Philosophy">
          The Spirit of Maharaja Palace
        </SectionTitle>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-16">
          {[
            {
              title: "Living Legacy",
              text: "A celebration of royal craftsmanship, artistry, and timeless architectural brilliance.",
            },
            {
              title: "Royal Hospitality",
              text: "Inspired by tradition, delivered with warmth—crafting moments that linger long after you leave.",
            },
            {
              title: "Modern Luxury Reimagined",
              text: "Contemporary comfort blended seamlessly with imperial elegance and cultural richness.",
            },
          ].map((item, index) => (
            <AnimatedCard delay={index * 150} key={index}>
              <div className="p-10 bg-white shadow-xl border border-gray-200 hover:border-[#B8860B] transition-all duration-500">
                <h3 className="royal-title text-3xl text-[#B8860B] mb-4">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {item.text}
                </p>
              </div>
            </AnimatedCard>
          ))}
        </div>
      </section>

      {/* ROYAL TIMELINE SECTION */}
      <section className="bg-white py-24">
        <SectionTitle subtitle="A Journey Through Time">
          Royal Timeline
        </SectionTitle>

        <div className="max-w-4xl mx-auto mt-16 relative border-l-2 border-[#B8860B]/40 pl-8 space-y-16">
          {[
            {
              year: "1850",
              text: "Foundations laid for a residence that would become a symbol of royal power.",
            },
            {
              year: "1920",
              text: "Restoration and embellishments that elevated its architectural grandeur.",
            },
            {
              year: "1999",
              text: "Modern luxury and comforts woven into the palace's historic framework.",
            },
            {
              year: "2024",
              text: "Maharaja Palace emerges as a world-class destination for refined travelers.",
            },
          ].map((item, index) => (
            <AnimatedCard delay={index * 200} key={index}>
              <div className="relative">
                <span className="absolute -left-5 top-1 w-3 h-3 bg-[#B8860B] rounded-full"></span>
                <h4 className="royal-title text-2xl text-[#B8860B]">
                  {item.year}
                </h4>
                <p className="text-gray-700 mt-2 text-lg">{item.text}</p>
              </div>
            </AnimatedCard>
          ))}
        </div>
      </section>

      {/* PARALLAX GRAND STATEMENT SECTION */}
      <section className="relative h-[70vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-fixed bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600')",
          }}
        ></div>

        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white px-6">
          <AnimatedCard>
            <h2 className="royal-title text-5xl mb-6">
              A Palace. A Legacy. A Living Story.
            </h2>
            <p className="max-w-3xl text-xl text-gray-200">
              More than a destination—Maharaja Palace is an experience shaped by
              centuries of culture and reimagined for the modern world.
            </p>
          </AnimatedCard>
        </div>
      </section>

      {/* AWARDS */}
      <section className="relative py-24 bg-gradient-to-b from-white to-[#faf9f6]">
        <SectionTitle subtitle="Celebrating Excellence">
          Awards & Recognition
        </SectionTitle>

        <div className="max-w-7xl mx-auto px-4 mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {awards.map((award, index) => (
            <AnimatedCard key={index} delay={index * 100}>
              <div className="p-10 bg-white border-2 border-gray-200 hover:border-[#B8860B] transition-all duration-500 text-center">
                <div className="royal-title text-5xl text-[#B8860B] mb-4">
                  {award.year}
                </div>
                <h4 className="text-lg font-semibold mt-2">{award.award}</h4>
                <p className="text-gray-600 mt-1">{award.org}</p>
              </div>
            </AnimatedCard>
          ))}
        </div>
      </section>

      {/* SUSTAINABILITY */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#faf9f6] via-white to-[#faf9f6]"></div>
        <div className="relative max-w-4xl mx-auto text-center px-6">
          <AnimatedCard>
            <Leaf className="mx-auto w-20 h-20 text-[#B8860B] mb-6" />

            <h2 className="royal-title text-4xl text-[#B8860B] mb-6">
              Committed to Sustainability
            </h2>

            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              From energy conservation to eco-friendly initiatives, Maharaja
              Palace continues to embrace practices that honor our environment
              while offering luxurious comfort.
            </p>

            <Divider />
          </AnimatedCard>
        </div>
      </section>

      {/* CTA */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1596436889106-be35e843f974?w=1600')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80"></div>
        </div>

        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <p className="text-sm uppercase tracking-[0.4em] text-[#D4AF37] mb-4">
            Join Our Journey
          </p>
          <h2 className="royal-title text-5xl md:text-6xl mb-6 leading-tight">
            Become Part of Our Story
          </h2>
          <button
            onClick={() => (window.location.href = "/rooms")}
            className="group relative px-10 py-5 bg-transparent border-2 border-white text-white overflow-hidden transition-all duration-500 hover:border-[#B8860B]"
          >
            <span className="relative z-10 text-lg tracking-wider">
              Plan Your Visit
            </span>
            <div className="absolute inset-0 bg-[#B8860B] translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
          </button>
        </div>
      </section>
    </div>
  );
};
