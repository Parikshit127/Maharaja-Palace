import React, { useState, useEffect } from 'react';
import { HeroSection, SectionTitle, Button } from '../components/BaseComponents';

export const BanquetPage = () => {
  const [banquetHalls] = useState([
    {
      _id: '1',
      name: 'Grand Maharaja Hall',
      capacity: 500,
      description: 'Our largest and most opulent banquet hall, perfect for grand weddings and large-scale events. Features crystal chandeliers, marble flooring, and state-of-the-art audio-visual systems.',
      area: '8,000 sq ft',
      image: 'https://images.unsplash.com/photo-1762765684673-d22ece602b10?w=800',
      features: ['Stage Setup', 'Professional Lighting', 'Audio System', 'Bridal Suite', 'Valet Parking']
    },
    {
      _id: '2',
      name: 'Royal Durbar Hall',
      capacity: 300,
      description: 'An elegant space adorned with traditional Indian artwork and modern amenities. Ideal for corporate events, conferences, and medium-sized celebrations.',
      area: '5,000 sq ft',
      image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&q=80',
      features: ['Projector & Screen', 'Conference Setup', 'High-Speed WiFi', 'Podium', 'Catering Services']
    },
    {
      _id: '3',
      name: 'Garden Pavilion',
      capacity: 200,
      description: 'A stunning outdoor venue surrounded by lush gardens and fountains. Perfect for intimate gatherings, cocktail parties, and sunset celebrations.',
      area: '4,000 sq ft',
      image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&q=80',
      features: ['Open Air Setting', 'Garden Views', 'Decorative Lighting', 'Weather Protection', 'Bar Setup']
    },
    {
      _id: '4',
      name: 'Crystal Ballroom',
      capacity: 150,
      description: 'An intimate and sophisticated space with floor-to-ceiling windows and contemporary decor. Ideal for cocktail receptions and social gatherings.',
      area: '2,500 sq ft',
      image: 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=1200&q=80',
      features: ['Natural Lighting', 'Dance Floor', 'Premium Decor', 'Cocktail Bar', 'Lounge Area']
    }
  ]);

  return (
    <div className="bg-[#faf9f6]">
      {/* Hero Section - FIXED IMAGE URL */}
      <HeroSection
        title="Magnificent Banquet Halls"
        subtitle="Events & Celebrations"
        backgroundImage="https://images.unsplash.com/photo-1762765684673-d22ece602b10?w=800"
        height="h-[70vh]"
      />

      {/* Introduction */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="w-16 h-[2px] bg-[#B8860B] mx-auto mb-6"></div>
          <p className="text-sm uppercase tracking-[0.3em] text-[#B8860B] mb-4">
            Creating Unforgettable Moments
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            At Maharaja Palace, we understand that every celebration is unique. Our magnificent banquet halls 
            offer the perfect blend of elegance and functionality, ensuring your special occasion becomes an 
            unforgettable memory. From intimate gatherings to grand celebrations, we have the perfect venue for you.
          </p>
        </div>
      </section>

      {/* Banquet Halls */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="space-y-20">
          {banquetHalls.map((hall, index) => (
            <div 
              key={hall._id}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? 'lg:grid-flow-dense' : ''
              }`}
            >
              {/* Image */}
              <div 
                className={`${index % 2 === 1 ? 'lg:col-start-2' : ''} group overflow-hidden`}
              >
                <img
                  src={hall.image}
                  alt={hall.name}
                  className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              {/* Content */}
              <div className={index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}>
                <div className="w-12 h-[2px] bg-[#B8860B] mb-6"></div>
                <h3 className="text-3xl md:text-4xl font-serif text-[#B8860B] mb-4">
                  {hall.name}
                </h3>
                
                {/* Capacity Info */}
                <div className="flex gap-6 mb-6">
                  <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wider mb-1">Capacity</p>
                    <p className="text-2xl font-bold text-[#B8860B]">{hall.capacity}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wider mb-1">Area</p>
                    <p className="text-2xl font-bold text-[#B8860B]">{hall.area}</p>
                  </div>
                </div>

                <p className="text-gray-600 leading-relaxed mb-6">
                  {hall.description}
                </p>

                {/* Features */}
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Features & Amenities</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {hall.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="text-[#B8860B]">✓</span>
                        <span className="text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button 
                  variant="filled"
                  size="lg"
                  onClick={() => window.location.href = `/banquet/book?hallId=${hall._id}`}
                >
                  Book This Hall
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Event Types Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle subtitle="We specialize in hosting">
            Perfect for Every Occasion
          </SectionTitle>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            {[
              { icon: '💑', title: 'Weddings', desc: 'Make your special day truly magical' },
              { icon: '🎉', title: 'Social Events', desc: 'Birthdays, anniversaries & celebrations' },
              { icon: '💼', title: 'Corporate', desc: 'Conferences, seminars & meetings' },
              { icon: '🎭', title: 'Cultural', desc: 'Performances, exhibitions & galas' }
            ].map((event, index) => (
              <div 
                key={index}
                className="text-center p-8 bg-[#faf9f6] group hover:bg-white hover:shadow-lg transition-all duration-300"
              >
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {event.icon}
                </div>
                <h4 className="text-xl font-serif text-[#B8860B] mb-2">{event.title}</h4>
                <p className="text-gray-600">{event.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <SectionTitle subtitle="Everything you need for a perfect event">
          Comprehensive Event Services
        </SectionTitle>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {[
            {
              title: 'Catering Excellence',
              description: 'Choose from our extensive menu featuring global cuisines and traditional delicacies, crafted by award-winning chefs.',
              icon: '🍽️'
            },
            {
              title: 'Event Planning',
              description: 'Dedicated event coordinators to help you plan every detail, from décor to entertainment.',
              icon: '📋'
            },
            {
              title: 'Technical Support',
              description: 'State-of-the-art audio-visual equipment, lighting systems, and professional technical assistance.',
              icon: '🎬'
            }
          ].map((service, index) => (
            <div 
              key={index}
              className="bg-white p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="text-5xl mb-4">{service.icon}</div>
              <h4 className="text-xl font-serif text-[#B8860B] mb-3">{service.title}</h4>
              <p className="text-gray-600 leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section - FIXED BUTTON VISIBILITY */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1600&q=80)' }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-serif mb-6">
            Plan Your Perfect Event
          </h2>
          <p className="text-xl mb-8 font-light">
            Let our expert team help you create an unforgettable celebration
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="filled" 
              size="lg"
              onClick={() => window.location.href = '/contact'}
            >
              Schedule Site Visit
            </Button>
            {/* FIXED: White border button for visibility on dark background */}
            <button
              onClick={() => window.location.href = '/contact'}
              className="px-8 py-4 text-lg font-semibold border-2 border-white text-white bg-transparent hover:bg-white hover:text-[#0B1A33] transition-all duration-300 tracking-wide"
            >
              Request Quote
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};