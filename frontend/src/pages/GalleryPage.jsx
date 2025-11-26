import React, { useState } from 'react';
import { HeroSection, SectionTitle } from '../components/BaseComponents';

export const GalleryPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [lightboxImage, setLightboxImage] = useState(null);

  const categories = [
    { id: 'all', name: 'All Photos' },
    { id: 'rooms', name: 'Rooms & Suites' },
    { id: 'dining', name: 'Dining' },
    { id: 'banquet', name: 'Banquet Halls' },
    { id: 'exterior', name: 'Exteriors' },
    { id: 'events', name: 'Events' }
  ];

  const galleryImages = [
    { id: 1, category: 'rooms', image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800', title: 'Deluxe Suite' },
    { id: 2, category: 'dining', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800', title: 'Fine Dining Restaurant' },
    { id: 3, category: 'exterior', image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800', title: 'Hotel Exterior' },
    { id: 4, category: 'banquet', image: 'https://images.unsplash.com/photo-1519167758481-83f29da8c2f0?w=800', title: 'Grand Banquet Hall' },
    { id: 5, category: 'rooms', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800', title: 'Royal Penthouse' },
    { id: 6, category: 'dining', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800', title: 'All Day Dining' },
    { id: 7, category: 'exterior', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', title: 'Night View' },
    { id: 8, category: 'events', image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800', title: 'Wedding Setup' },
    { id: 9, category: 'rooms', image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800', title: 'Premium Room' },
    { id: 10, category: 'dining', image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800', title: 'The Polo Bar' },
    { id: 11, category: 'banquet', image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800', title: 'Conference Hall' },
    { id: 12, category: 'exterior', image: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800', title: 'Poolside' },
    { id: 13, category: 'events', image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800', title: 'Garden Event' },
    { id: 14, category: 'rooms', image: 'https://images.unsplash.com/photo-1596436889106-be35e843f974?w=800', title: 'Suite Bathroom' },
    { id: 15, category: 'dining', image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800', title: 'Al Fresco Dining' },
    { id: 16, category: 'exterior', image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800', title: 'Grand Entrance' }
  ];

  const filteredImages = selectedCategory === 'all'
    ? galleryImages
    : galleryImages.filter(img => img.category === selectedCategory);

  const openLightbox = (image) => {
    setLightboxImage(image);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxImage(null);
    document.body.style.overflow = 'unset';
  };

  return (
    <div className="bg-[#faf9f6]">
      {/* Hero Section */}
      <HeroSection
        title="Visual Journey"
        subtitle="Gallery"
        backgroundImage="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600"
        height="h-[70vh]"
      />

      {/* Introduction */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="w-16 h-[2px] bg-[#B8860B] mx-auto mb-6"></div>
          <p className="text-sm uppercase tracking-[0.3em] text-[#B8860B] mb-4">
            Explore Our Palace
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            Take a visual tour through Maharaja Palace and discover the exquisite details, 
            luxurious spaces, and royal ambiance that make every moment here unforgettable. 
            From our opulent rooms to our magnificent banquet halls, each photograph tells a story of elegance.
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="flex flex-wrap justify-center gap-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 border-2 transition-all duration-300 text-sm uppercase tracking-wider ${
                selectedCategory === category.id
                  ? 'bg-[#B8860B] border-[#B8860B] text-white'
                  : 'bg-transparent border-[#B8860B] text-[#B8860B] hover:bg-[#B8860B] hover:text-white'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredImages.map((item) => (
            <div
              key={item.id}
              className="group relative aspect-square overflow-hidden cursor-pointer bg-white"
              onClick={() => openLightbox(item)}
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white text-center text-lg font-serif px-4">
                    {item.title}
                  </p>
                  <p className="text-white/80 text-center text-sm mt-2">
                    Click to view
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredImages.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No images found in this category</p>
          </div>
        )}
      </section>

      {/* Lightbox */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button
            className="absolute top-4 right-4 text-white text-4xl hover:text-[#B8860B] transition-colors"
            onClick={closeLightbox}
          >
            ×
          </button>
          <div className="max-w-6xl max-h-[90vh] flex flex-col items-center">
            <img
              src={lightboxImage.image}
              alt={lightboxImage.title}
              className="max-w-full max-h-[80vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <p className="text-white text-xl font-serif mt-6">
              {lightboxImage.title}
            </p>
          </div>
        </div>
      )}

      {/* Virtual Tour CTA */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionTitle subtitle="Experience it yourself">
            Visit Maharaja Palace
          </SectionTitle>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Pictures can only capture so much. Come experience the grandeur and hospitality 
            of Maharaja Palace in person. Schedule a tour or book your stay today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.location.href = '/rooms'}
              className="px-8 py-4 bg-[#B8860B] border-2 border-[#B8860B] text-white hover:bg-[#8B6914] hover:border-[#8B6914] transition-all duration-300"
            >
              Book Your Stay
            </button>
            <button
              onClick={() => window.location.href = '/contact'}
              className="px-8 py-4 bg-transparent border-2 border-[#B8860B] text-[#B8860B] hover:bg-[#B8860B] hover:text-white transition-all duration-300"
            >
              Schedule a Tour
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};