import React from 'react';
import { HeroSection, SectionTitle, ImageCard, Divider, Button } from '../components/BaseComponents';

export const HomePage = () => {
  return (
    <div className="bg-[#faf9f6]">
      {/* Hero Section */}
      <HeroSection
        title="Welcome to Maharaja Palace"
        subtitle="Where Royalty Meets Luxury"
        backgroundImage="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1600"
        height="h-screen"
      >
        <p className="text-xl md:text-2xl mb-8 font-light max-w-2xl mx-auto leading-relaxed">
          Experience unparalleled luxury in our world-class 7-star heritage hotel
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            variant="filled" 
            size="lg"
            onClick={() => window.location.href = '/rooms'}
          >
            Explore Rooms
          </Button>
          <Button 
            variant="primary" 
            size="lg"
            onClick={() => window.location.href = '/about'}
          >
            Our Story
          </Button>
        </div>
      </HeroSection>

      {/* Welcome Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-4xl mx-auto animate-fadeIn">
          <div className="w-16 h-[2px] bg-[#B8860B] mx-auto mb-6"></div>
          <p className="text-sm uppercase tracking-[0.3em] text-[#B8860B] mb-4">
            A Royal Experience
          </p>
          <h2 className="text-4xl md:text-5xl font-serif text-gray-800 mb-6 leading-tight">
            Discover the Essence of Regal Hospitality
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Maharaja Palace welcomes its guests to a pleasant experience with exquisitely handcrafted delicacies, 
            luxurious accommodations, and world-class amenities. Indulge in the art of fine living from the royal 
            traditions of India and savour moments that create lasting memories.
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle subtitle="Immerse yourself in luxury">
            Our Signature Experiences
          </SectionTitle>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <ImageCard
              image="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800"
              title="Luxurious Suites"
              description="From intimate single rooms to sprawling royal penthouses, each accommodation is designed with meticulous attention to detail."
              onClick={() => window.location.href = '/rooms'}
            />
            <ImageCard
              image="https://images.unsplash.com/photo-1762765684673-d22ece602b10?w=800"
              title="Banquet Halls"
              description="Host your special events in our magnificent banquet halls that blend grandeur with modern amenities."
              onClick={() => window.location.href = '/banquet'}
            />
            <ImageCard
              image="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800"
              title="Fine Dining"
              description="Experience culinary excellence at our award-winning restaurants featuring global and regional cuisines."
              onClick={() => window.location.href = '/restaurant'}
            />
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle subtitle="Everything you need for an unforgettable stay">
            Why Choose Maharaja Palace
          </SectionTitle>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {[
              {
                icon: '👑',
                title: '7-Star Service',
                description: 'World-class hospitality with personalized attention to every detail'
              },
              {
                icon: '🏛️',
                title: 'Palace Architecture',
                description: 'Stunning heritage architecture with modern luxury amenities'
              },
              {
                icon: '🍽️',
                title: 'Culinary Excellence',
                description: 'Award-winning restaurants serving global and regional delicacies'
              },
              {
                icon: '💎',
                title: 'Premium Suites',
                description: 'Elegantly furnished rooms with royal decor and comfort'
              },
              {
                icon: '🎭',
                title: 'Cultural Events',
                description: 'Experience traditional performances and modern entertainment'
              },
              {
                icon: '🧘',
                title: 'Spa & Wellness',
                description: 'State-of-the-art wellness facilities and rejuvenating treatments'
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="group text-center p-8 bg-white border border-gray-100 hover:shadow-xl transition-all duration-500"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-serif text-[#B8860B] mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Image Gallery Preview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle subtitle="Take a glimpse into our royal world">
            Gallery Highlights
          </SectionTitle>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
            {[
              'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
              'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
              'https://images.unsplash.com/photo-1596436889106-be35e843f974?w=800',
              'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800'
            ].map((img, index) => (
              <div 
                key={index}
                className="aspect-square overflow-hidden group cursor-pointer"
                onClick={() => window.location.href = '/gallery'}
              >
                <img 
                  src={img} 
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => window.location.href = '/gallery'}
            >
              View Full Gallery
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-b from-[#faf9f6] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle subtitle="What our guests say about us">
            Guest Experiences
          </SectionTitle>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {[
              {
                text: "An absolutely breathtaking experience. The attention to detail and the warmth of the staff made our stay unforgettable.",
                author: "Priya Sharma",
                role: "Wedding Guest"
              },
              {
                text: "The perfect blend of heritage and modern luxury. Every corner tells a story of royal grandeur.",
                author: "Rajesh Kumar",
                role: "Business Traveler"
              },
              {
                text: "From the moment we arrived, we felt like royalty. The dining experience was exceptional!",
                author: "Sarah Johnson",
                role: "International Visitor"
              }
            ].map((testimonial, index) => (
              <div 
                key={index}
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
                    <p className="font-semibold text-gray-800">
                      {testimonial.author}
                    </p>
                    <p className="text-sm text-gray-500">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1600)' }}
        >
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-3xl mx-auto">
          <Divider className="mb-8" />
          <h2 className="text-4xl md:text-5xl font-serif mb-6">
            Begin Your Royal Journey
          </h2>
          <p className="text-xl mb-8 font-light">
            Book your perfect stay or event at Maharaja Palace today and experience luxury redefined
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="filled" 
              size="lg"
              onClick={() => window.location.href = '/rooms'}
            >
              Book Your Stay
            </Button>
            <Button 
              variant="primary" 
              size="lg"
              onClick={() => window.location.href = '/contact'}
            >
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};