import React, { useState, useEffect } from 'react';
import { HeroSection, SectionTitle, Divider } from '../components/BaseComponents';
import { Target, Sparkles, Crown, Handshake, Building2, Gem, Zap, Heart, Leaf } from 'lucide-react';

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

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [delay]);

  return (
    <div 
      ref={ref}
      className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
    >
      {children}
    </div>
  );
};

export const AboutPage = () => {
  const coreValues = [
    { icon: Crown, title: 'Royal Excellence', description: 'We maintain the highest standards in everything we do, from service to amenities, ensuring a truly regal experience.' },
    { icon: Handshake, title: 'Genuine Hospitality', description: 'Treating every guest as a member of our royal family with warmth, respect, and personalized attention.' },
    { icon: Building2, title: 'Heritage Preservation', description: 'Honoring and preserving our rich cultural heritage while embracing sustainable and responsible tourism practices.' },
    { icon: Gem, title: 'Attention to Detail', description: 'Every element is carefully curated, from the décor to the dining experience, ensuring perfection in every moment.' },
    { icon: Zap, title: 'Innovation', description: 'Constantly evolving to incorporate modern luxury and technology while maintaining our traditional charm.' },
    { icon: Heart, title: 'Integrity', description: 'Operating with transparency, honesty, and ethical practices in all our relationships and business dealings.' }
  ];

  const awards = [
    { year: '2024', award: 'Best Luxury Heritage Hotel', org: 'Travel + Leisure Awards' },
    { year: '2023', award: '7-Star Excellence Award', org: 'World Luxury Hotel Awards' },
    { year: '2023', award: 'Best Fine Dining Restaurant', org: 'Indian Culinary Excellence' },
    { year: '2022', award: 'Heritage Preservation Award', org: 'UNESCO Tourism' }
  ];

  const team = [
    { name: 'Rajendra Singh', role: 'Managing Director', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600' },
    { name: 'Priya Sharma', role: 'General Manager', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600' },
    { name: 'Chef Vikram Kumar', role: 'Executive Chef', image: 'https://images.unsplash.com/photo-1583394293214-28ded15ee548?w=600' }
  ];

  return (
    <div className="bg-[#faf9f6]">
      <style>{`
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        .shimmer-effect {
          background: linear-gradient(90deg, transparent, rgba(184, 134, 11, 0.1), transparent);
          background-size: 1000px 100%;
          animation: shimmer 3s infinite;
        }
      `}</style>

      {/* Hero Section - Full screen */}
      <HeroSection
        title="Our Story"
        subtitle="About Maharaja Palace"
        backgroundImage="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600"
        height="h-screen"
      />

      {/* Heritage Story */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <AnimatedCard>
            <div className="relative">
              <div className="absolute -left-4 top-0 w-1 h-32 bg-gradient-to-b from-[#B8860B] to-transparent"></div>
              <p className="text-sm uppercase tracking-[0.3em] text-[#B8860B] mb-4 font-light">
                A Legacy of Excellence
              </p>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-gray-800 mb-8 leading-tight">
                Where Heritage Meets <span className="text-[#B8860B] relative inline-block">Modern Luxury
                  <div className="absolute -bottom-2 left-0 w-full h-1 bg-[#B8860B]/20"></div>
                </span>
              </h2>
              <div className="space-y-6">
                <p className="text-lg text-gray-600 leading-relaxed">
                  Maharaja Palace stands as a testament to royal Indian heritage, seamlessly blending 
                  centuries-old architectural grandeur with contemporary luxury. Established with a vision 
                  to provide guests with an authentic royal experience, our palace has been meticulously 
                  restored to preserve its historical significance while offering world-class modern amenities.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed border-l-2 border-[#B8860B] pl-6">
                  Every corner of our palace tells a story — from the intricately carved pillars to the 
                  hand-painted frescoes adorning our walls. We take pride in maintaining the traditions 
                  of royal hospitality while ensuring that every guest experiences unparalleled comfort 
                  and personalized service.
                </p>
              </div>
            </div>
          </AnimatedCard>
          
          <AnimatedCard delay={200}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="group overflow-hidden relative">
                  <img
                    src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800"
                    alt="Palace Architecture"
                    className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                <div className="group overflow-hidden relative">
                  <img
                    src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800"
                    alt="Interior Detail"
                    className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </div>
              <div className="space-y-4 pt-12">
                <div className="group overflow-hidden relative">
                  <img
                    src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800"
                    alt="Grand Entrance"
                    className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                <div className="group overflow-hidden relative">
                  <img
                    src="https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800"
                    alt="Palace Gardens"
                    className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </div>
            </div>
          </AnimatedCard>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-[#faf9f6] to-white"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#B8860B] to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AnimatedCard>
              <div className="group relative bg-white p-12 overflow-hidden border border-gray-100 hover:border-[#B8860B] transition-all duration-500 hover:shadow-2xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#B8860B]/5 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>
                <div className="relative">
                  <Target className="w-16 h-16 text-[#B8860B] mb-6 group-hover:rotate-90 transition-transform duration-500" />
                  <h3 className="text-3xl font-serif text-[#B8860B] mb-6">Our Mission</h3>
                  <div className="w-16 h-[2px] bg-[#B8860B] mb-6 group-hover:w-full transition-all duration-500"></div>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    To provide every guest with an authentic royal experience through exceptional 
                    hospitality, luxurious accommodations, and personalized service that exceeds 
                    expectations. We strive to create lasting memories while preserving our rich 
                    cultural heritage.
                  </p>
                </div>
              </div>
            </AnimatedCard>

            <AnimatedCard delay={200}>
              <div className="group relative bg-white p-12 overflow-hidden border border-gray-100 hover:border-[#B8860B] transition-all duration-500 hover:shadow-2xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#B8860B]/5 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>
                <div className="relative">
                  <Sparkles className="w-16 h-16 text-[#B8860B] mb-6 group-hover:rotate-90 transition-transform duration-500" />
                  <h3 className="text-3xl font-serif text-[#B8860B] mb-6">Our Vision</h3>
                  <div className="w-16 h-[2px] bg-[#B8860B] mb-6 group-hover:w-full transition-all duration-500"></div>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    To be recognized globally as the premier destination for luxury hospitality in India, 
                    setting new standards in heritage hotels while promoting sustainable tourism and 
                    preserving the timeless traditions of royal Indian culture for future generations.
                  </p>
                </div>
              </div>
            </AnimatedCard>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <SectionTitle subtitle="What guides us every day">
          Our Core Values
        </SectionTitle>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          {coreValues.map((value, index) => {
            const Icon = value.icon;
            return (
              <AnimatedCard key={index} delay={index * 100}>
                <div className="group relative bg-white p-8 border border-gray-100 hover:border-[#B8860B] transition-all duration-500 overflow-hidden">
                  <div className="absolute inset-0 shimmer-effect opacity-0 group-hover:opacity-100"></div>
                  <div className="relative">
                    <div className="w-16 h-16 bg-[#B8860B]/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-[#B8860B] transition-all duration-500">
                      <Icon className="w-8 h-8 text-[#B8860B] group-hover:text-white transition-colors duration-500" />
                    </div>
                    <h4 className="text-xl font-serif text-[#B8860B] mb-4">{value.title}</h4>
                    <div className="w-12 h-[1px] bg-[#B8860B]/30 mb-4 group-hover:w-full transition-all duration-500"></div>
                    <p className="text-gray-600 leading-relaxed">{value.description}</p>
                  </div>
                </div>
              </AnimatedCard>
            );
          })}
        </div>
      </section>

      {/* Awards */}
      <section className="relative py-24 bg-gradient-to-b from-white to-[#faf9f6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle subtitle="Celebrating excellence">
            Awards & Recognition
          </SectionTitle>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
            {awards.map((award, index) => (
              <AnimatedCard key={index} delay={index * 100}>
                <div className="group relative h-full bg-white p-8 border-2 border-gray-100 hover:border-[#B8860B] transition-all duration-500 overflow-hidden">
                  <div className="absolute inset-0 bg-[#B8860B] translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                  <div className="relative z-10">
                    <div className="text-5xl font-serif text-[#B8860B] group-hover:text-white mb-4 transition-colors duration-500">
                      {award.year}
                    </div>
                    <div className="w-12 h-[2px] bg-[#B8860B] group-hover:bg-white mb-4 transition-colors duration-500"></div>
                    <h4 className="text-lg font-semibold mb-3 text-gray-800 group-hover:text-white transition-colors duration-500">
                      {award.award}
                    </h4>
                    <p className="text-sm text-gray-600 group-hover:text-white/90 transition-colors duration-500">
                      {award.org}
                    </p>
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <SectionTitle subtitle="Meet the people behind the magic">
          Our Leadership
        </SectionTitle>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-16">
          {team.map((member, index) => (
            <AnimatedCard key={index} delay={index * 150}>
              <div className="group">
                <div className="relative overflow-hidden mb-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-96 object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <div className="w-12 h-[2px] bg-white mb-3"></div>
                  </div>
                </div>
                <div className="text-center">
                  <h4 className="text-2xl font-serif text-[#B8860B] mb-2">{member.name}</h4>
                  <p className="text-gray-600 uppercase text-sm tracking-wider">{member.role}</p>
                </div>
              </div>
            </AnimatedCard>
          ))}
        </div>
      </section>

      {/* Sustainability */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#faf9f6] via-white to-[#faf9f6]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#B8860B]/5 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedCard>
            <div className="inline-block mb-8">
              <div className="w-24 h-24 bg-[#B8860B]/10 rounded-full flex items-center justify-center mx-auto group hover:bg-[#B8860B] transition-all duration-500">
                <Leaf className="w-12 h-12 text-[#B8860B] group-hover:text-white transition-colors duration-500" />
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif text-[#B8860B] mb-8">
              Committed to Sustainability
            </h2>
            <div className="w-24 h-[2px] bg-gradient-to-r from-transparent via-[#B8860B] to-transparent mx-auto mb-8"></div>
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              At Maharaja Palace, we believe in responsible luxury. Our commitment to sustainability 
              includes eco-friendly practices such as rainwater harvesting, solar energy utilization, 
              waste management programs, and support for local communities. We strive to minimize our 
              environmental footprint while providing an exceptional guest experience.
            </p>
            <Divider />
          </AnimatedCard>
        </div>
      </section>

      {/* CTA */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: 'ur[](https://images.unsplash.com/photo-1596436889106-be35e843f974?w=1600)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80"></div>
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <p className="text-sm uppercase tracking-[0.4em] text-[#D4AF37] mb-4">Join Our Legacy</p>
          <h2 className="text-5xl md:text-6xl font-serif mb-6 leading-tight">
            Become Part of Our Story
          </h2>
          <div className="w-24 h-[1px] bg-[#D4AF37] mx-auto mb-8"></div>
          <p className="text-xl mb-10 font-light text-gray-200">
            Experience the legacy of Maharaja Palace and create your own memories
          </p>
          <button
            onClick={() => window.location.href = '/rooms'}
            className="group relative px-10 py-5 bg-transparent border-2 border-white text-white overflow-hidden transition-all duration-500 hover:border-[#B8860B]"
          >
            <span className="relative z-10 text-lg tracking-wider">Plan Your Visit</span>
            <div className="absolute inset-0 bg-[#B8860B] translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
          </button>
        </div>
      </section>
    </div>
  );
};