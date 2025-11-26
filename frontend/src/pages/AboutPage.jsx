import React from 'react';
import { HeroSection, SectionTitle, Divider } from '../components/BaseComponents';

export const AboutPage = () => {
  return (
    <div className="bg-[#faf9f6]">
      {/* Hero Section */}
      <HeroSection
        title="Our Story"
        subtitle="About Maharaja Palace"
        backgroundImage="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600"
        height="h-[70vh]"
      />

      {/* Heritage Story */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="w-16 h-[2px] bg-[#B8860B] mb-6"></div>
            <p className="text-sm uppercase tracking-[0.3em] text-[#B8860B] mb-4">
              A Legacy of Excellence
            </p>
            <h2 className="text-4xl md:text-5xl font-serif text-gray-800 mb-6 leading-tight">
              Where Heritage Meets Modern Luxury
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              Maharaja Palace stands as a testament to royal Indian heritage, seamlessly blending 
              centuries-old architectural grandeur with contemporary luxury. Established with a vision 
              to provide guests with an authentic royal experience, our palace has been meticulously 
              restored to preserve its historical significance while offering world-class modern amenities.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Every corner of our palace tells a story — from the intricately carved pillars to the 
              hand-painted frescoes adorning our walls. We take pride in maintaining the traditions 
              of royal hospitality while ensuring that every guest experiences unparalleled comfort 
              and personalized service.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <img
                src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800"
                alt="Palace Architecture"
                className="w-full h-64 object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800"
                alt="Interior Detail"
                className="w-full h-48 object-cover"
              />
            </div>
            <div className="space-y-4 pt-8">
              <img
                src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800"
                alt="Grand Entrance"
                className="w-full h-48 object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800"
                alt="Palace Gardens"
                className="w-full h-64 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="text-center p-12 bg-[#faf9f6]">
              <div className="text-6xl mb-6">🎯</div>
              <h3 className="text-2xl font-serif text-[#B8860B] mb-4">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed">
                To provide every guest with an authentic royal experience through exceptional 
                hospitality, luxurious accommodations, and personalized service that exceeds 
                expectations. We strive to create lasting memories while preserving our rich 
                cultural heritage.
              </p>
            </div>
            <div className="text-center p-12 bg-[#faf9f6]">
              <div className="text-6xl mb-6">✨</div>
              <h3 className="text-2xl font-serif text-[#B8860B] mb-4">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed">
                To be recognized globally as the premier destination for luxury hospitality in India, 
                setting new standards in heritage hotels while promoting sustainable tourism and 
                preserving the timeless traditions of royal Indian culture for future generations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <SectionTitle subtitle="What guides us every day">
          Our Core Values
        </SectionTitle>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {[
            {
              icon: '👑',
              title: 'Royal Excellence',
              description: 'We maintain the highest standards in everything we do, from service to amenities, ensuring a truly regal experience.'
            },
            {
              icon: '🤝',
              title: 'Genuine Hospitality',
              description: 'Treating every guest as a member of our royal family with warmth, respect, and personalized attention.'
            },
            {
              icon: '🏛️',
              title: 'Heritage Preservation',
              description: 'Honoring and preserving our rich cultural heritage while embracing sustainable and responsible tourism practices.'
            },
            {
              icon: '💎',
              title: 'Attention to Detail',
              description: 'Every element is carefully curated, from the décor to the dining experience, ensuring perfection in every moment.'
            },
            {
              icon: '🌟',
              title: 'Innovation',
              description: 'Constantly evolving to incorporate modern luxury and technology while maintaining our traditional charm.'
            },
            {
              icon: '❤️',
              title: 'Integrity',
              description: 'Operating with transparency, honesty, and ethical practices in all our relationships and business dealings.'
            }
          ].map((value, index) => (
            <div
              key={index}
              className="bg-white p-8 border border-gray-100 hover:shadow-xl transition-all duration-500 group"
            >
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {value.icon}
              </div>
              <h4 className="text-xl font-serif text-[#B8860B] mb-3">{value.title}</h4>
              <p className="text-gray-600 leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Awards & Recognition */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle subtitle="Celebrating excellence">
            Awards & Recognition
          </SectionTitle>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            {[
              { year: '2024', award: 'Best Luxury Heritage Hotel', org: 'Travel + Leisure Awards' },
              { year: '2023', award: '7-Star Excellence Award', org: 'World Luxury Hotel Awards' },
              { year: '2023', award: 'Best Fine Dining Restaurant', org: 'Indian Culinary Excellence' },
              { year: '2022', award: 'Heritage Preservation Award', org: 'UNESCO Tourism' }
            ].map((award, index) => (
              <div
                key={index}
                className="text-center p-6 border-2 border-[#B8860B] hover:bg-[#B8860B] hover:text-white transition-all duration-300 group"
              >
                <div className="text-4xl font-serif text-[#B8860B] group-hover:text-white mb-2">
                  {award.year}
                </div>
                <h4 className="text-lg font-semibold mb-2">{award.award}</h4>
                <p className="text-sm text-gray-600 group-hover:text-white/90">{award.org}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <SectionTitle subtitle="Meet the people behind the magic">
          Our Leadership
        </SectionTitle>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {[
            { name: 'Rajendra Singh', role: 'Managing Director', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600' },
            { name: 'Priya Sharma', role: 'General Manager', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600' },
            { name: 'Chef Vikram Kumar', role: 'Executive Chef', image: 'https://images.unsplash.com/photo-1583394293214-28ded15ee548?w=600' }
          ].map((member, index) => (
            <div key={index} className="group text-center">
              <div className="overflow-hidden mb-4">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-80 object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                />
              </div>
              <h4 className="text-xl font-serif text-[#B8860B] mb-1">{member.name}</h4>
              <p className="text-gray-600">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sustainability */}
      <section className="bg-gradient-to-b from-white to-[#faf9f6] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-6xl mb-6">🌱</div>
            <h2 className="text-4xl font-serif text-[#B8860B] mb-6">
              Committed to Sustainability
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              At Maharaja Palace, we believe in responsible luxury. Our commitment to sustainability 
              includes eco-friendly practices such as rainwater harvesting, solar energy utilization, 
              waste management programs, and support for local communities. We strive to minimize our 
              environmental footprint while providing an exceptional guest experience.
            </p>
            <Divider />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1596436889106-be35e843f974?w=1600)' }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-serif mb-6">
            Become Part of Our Story
          </h2>
          <p className="text-xl mb-8 font-light">
            Experience the legacy of Maharaja Palace and create your own memories
          </p>
          <button
            onClick={() => window.location.href = '/rooms'}
            className="px-8 py-4 bg-[#B8860B] border-2 border-[#B8860B] text-white hover:bg-transparent hover:border-white transition-all duration-300 text-lg"
          >
            Plan Your Visit
          </button>
        </div>
      </section>
    </div>
  );
};