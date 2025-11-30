import { useState, useEffect, useRef } from 'react';

export const GalleryPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [lightboxImage, setLightboxImage] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [visibleItems, setVisibleItems] = useState(new Set());
  const galleryRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleItems((prev) => new Set([...prev, entry.target.dataset.id]));
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );
    return () => observerRef.current?.disconnect();
  }, []);

  useEffect(() => {
    const items = document.querySelectorAll('[data-gallery-item]');
    items.forEach((item) => observerRef.current?.observe(item));
    return () => items.forEach((item) => observerRef.current?.unobserve(item));
  }, [selectedCategory]);

  // Professional SVG icons for categories
  const categoryIcons = {
    all: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
    rooms: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    dining: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v18M8 3v3a4 4 0 004 4M8 3H6m10 0v3a4 4 0 01-4 4m4-7h2M3 21h18" />
      </svg>
    ),
    banquet: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    exterior: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
      </svg>
    ),
    events: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    )
  };

  const categories = [
    { id: 'all', name: 'All Photos' },
    { id: 'rooms', name: 'Rooms & Suites' },
    { id: 'dining', name: 'Dining' },
    { id: 'banquet', name: 'Banquet Halls' },
    { id: 'exterior', name: 'Exteriors' },
    { id: 'events', name: 'Events' }
  ];

  const galleryImages = [
    { id: 1, category: 'rooms', image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800', title: 'Deluxe Suite', desc: 'Luxurious comfort redefined' },
    { id: 2, category: 'dining', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800', title: 'Fine Dining', desc: 'Culinary excellence awaits' },
    { id: 3, category: 'exterior', image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800', title: 'Grand Facade', desc: 'Majestic architecture' },
    { id: 4, category: 'banquet', image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800', title: 'Grand Ballroom', desc: 'Where dreams come alive' },
    { id: 5, category: 'rooms', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800', title: 'Royal Penthouse', desc: 'The pinnacle of luxury' },
    { id: 6, category: 'dining', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800', title: 'All Day Dining', desc: 'Global flavors, local charm' },
    { id: 7, category: 'exterior', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', title: 'Night Elegance', desc: 'Illuminated grandeur' },
    { id: 8, category: 'events', image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800', title: 'Wedding Dreams', desc: 'Your perfect day begins' },
    { id: 9, category: 'rooms', image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800', title: 'Premium Room', desc: 'Elegant simplicity' },
    { id: 10, category: 'dining', image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800', title: 'The Polo Bar', desc: 'Refined spirits & ambiance' },
    { id: 11, category: 'banquet', image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800', title: 'Conference Hall', desc: 'Where business meets luxury' },
    { id: 12, category: 'exterior', image: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800', title: 'Infinity Pool', desc: 'Serenity meets sky' },
    { id: 13, category: 'events', image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800', title: 'Garden Soirée', desc: "Nature's embrace" },
    { id: 14, category: 'rooms', image: 'https://images.unsplash.com/photo-1596436889106-be35e843f974?w=800', title: 'Marble Sanctuary', desc: 'Bathing in opulence' },
    { id: 15, category: 'dining', image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800', title: 'Al Fresco', desc: 'Dining under stars' },
    { id: 16, category: 'exterior', image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800', title: 'Royal Entrance', desc: 'Where journeys begin' }
  ];

  const filteredImages = selectedCategory === 'all'
    ? galleryImages
    : galleryImages.filter(img => img.category === selectedCategory);

  const openLightbox = (image, index) => {
    setLightboxImage(image);
    setLightboxIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxImage(null);
    document.body.style.overflow = 'unset';
  };

  const navigateLightbox = (direction) => {
    const newIndex = (lightboxIndex + direction + filteredImages.length) % filteredImages.length;
    setLightboxIndex(newIndex);
    setLightboxImage(filteredImages[newIndex]);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxImage) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigateLightbox(-1);
      if (e.key === 'ArrowRight') navigateLightbox(1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxImage, lightboxIndex]);

  const parallaxOffset = scrollY * 0.4;

  return (
    <div className="bg-[#FBF9F4] min-h-screen overflow-x-hidden">
      <style>{`
        .royal-title { font-family: 'Playfair Display', 'Cormorant Garamond', Georgia, serif; font-weight: 600; font-style: italic; letter-spacing: 0.02em; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.6s ease-out forwards; }
        .animate-fadeInUp { animation: fadeInUp 0.8s ease-out forwards; }
      `}</style>

      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        <div className="absolute inset-0 scale-110" style={{ transform: `translateY(${parallaxOffset}px) scale(1.1)` }}>
          <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920" alt="Gallery Hero" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a]/60 via-[#1a1a1a]/40 to-[#1a1a1a]/60" />
        </div>
        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-6" style={{ transform: `translateY(${scrollY * 0.2}px)` }}>
          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#B8860B] to-transparent mx-auto mb-8" />
          <p className="text-sm uppercase tracking-[0.5em] text-[#B8860B] mb-6 font-light">Visual Journey</p>
          <h1 className="royal-title text-7xl md:text-9xl text-white mb-6 tracking-wide drop-shadow-lg">Gallery</h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto font-light leading-relaxed drop-shadow-md">A curated collection of moments that define royal elegance</p>
          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#B8860B] to-transparent mx-auto mt-8" />
        </div>
      </section>

      {/* Introduction */}
      <section className="relative py-32 px-6">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-20 w-96 h-96 bg-[#B8860B]/20 rounded-full blur-[150px]" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#D4AF37]/20 rounded-full blur-[150px]" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-12 border border-[#B8860B]/20 shadow-2xl" style={{ transform: 'perspective(1000px) rotateX(2deg)', boxShadow: '0 25px 50px -12px rgba(184, 134, 11, 0.15)' }}>
            <div className="w-16 h-[2px] bg-[#B8860B] mx-auto mb-8" />
            <p className="text-sm uppercase tracking-[0.4em] text-[#B8860B] mb-6">Explore Our Palace</p>
            <p className="text-xl text-[#4a4a4a] leading-relaxed font-light">Every corner of Maharaja Palace tells a story of heritage, craftsmanship, and timeless elegance. Our gallery captures the essence of royal living—from opulent suites to magnificent banquet halls.</p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="flex flex-wrap justify-center gap-4">
          {categories.map((category) => (
            <button key={category.id} onClick={() => setSelectedCategory(category.id)}
              className={`group relative px-8 py-4 transition-all duration-500 text-sm uppercase tracking-wider overflow-hidden rounded-lg ${selectedCategory === category.id ? 'text-white shadow-lg' : 'text-[#5a5a5a] hover:text-[#B8860B]'}`}
              style={{ transform: selectedCategory === category.id ? 'translateY(-4px)' : 'translateY(0)' }}>
              <span className={`absolute inset-0 transition-all duration-500 rounded-lg ${selectedCategory === category.id ? 'bg-gradient-to-r from-[#B8860B] to-[#D4AF37] opacity-100' : 'bg-white border border-[#B8860B]/30 opacity-100 group-hover:border-[#B8860B]'}`} />
              <span className="relative z-10 flex items-center gap-2">{categoryIcons[category.id]}{category.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Gallery Grid */}
      <section ref={galleryRef} className="max-w-7xl mx-auto px-6 pb-32">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredImages.map((item, index) => (
            <div key={item.id} data-gallery-item data-id={item.id}
              className={`group relative overflow-hidden cursor-pointer transition-all duration-700 rounded-xl shadow-lg ${visibleItems.has(String(item.id)) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} ${index % 5 === 0 ? 'sm:col-span-2 sm:row-span-2' : ''}`}
              style={{ transitionDelay: `${(index % 8) * 100}ms`, aspectRatio: index % 5 === 0 ? '1' : '4/5' }}
              onClick={() => openLightbox(item, index)}>
              <div className="relative w-full h-full transform-gpu transition-all duration-700 group-hover:scale-[1.02]" style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}>
                <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a]/80 via-[#1a1a1a]/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />
                <div className="absolute inset-0 border-2 border-[#B8860B]/0 group-hover:border-[#B8860B]/60 transition-all duration-500 rounded-xl" />
                <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-[#B8860B]/0 group-hover:border-[#B8860B] transition-all duration-500 transform group-hover:translate-x-0 group-hover:translate-y-0 -translate-x-2 -translate-y-2 rounded-tl-lg" />
                <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-[#B8860B]/0 group-hover:border-[#B8860B] transition-all duration-500 transform group-hover:translate-x-0 group-hover:translate-y-0 translate-x-2 translate-y-2 rounded-br-lg" />
                <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <p className="royal-title text-3xl text-white mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 drop-shadow-lg">{item.title}</p>
                  <p className="text-white/80 text-sm font-light opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">{item.desc}</p>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-[#B8860B]/30 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 transition-all duration-500">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" /></svg>
                </div>
              </div>
            </div>
          ))}
        </div>
        {filteredImages.length === 0 && <div className="text-center py-32"><p className="text-[#8a8a8a] text-xl font-light">No images found in this category</p></div>}
      </section>

      {/* Lightbox */}
      {lightboxImage && (
        <div className="fixed inset-0 z-50 bg-[#FBF9F4]/98 backdrop-blur-xl flex items-center justify-center" onClick={closeLightbox}>
          <button className="absolute top-6 right-6 w-12 h-12 rounded-full bg-[#B8860B]/10 hover:bg-[#B8860B]/20 flex items-center justify-center text-[#B8860B] hover:text-[#8B6914] transition-all duration-300 z-50" onClick={closeLightbox}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <button className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white shadow-lg hover:bg-[#B8860B]/10 flex items-center justify-center text-[#B8860B] transition-all duration-300 z-50 border border-[#B8860B]/20" onClick={(e) => { e.stopPropagation(); navigateLightbox(-1); }}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white shadow-lg hover:bg-[#B8860B]/10 flex items-center justify-center text-[#B8860B] transition-all duration-300 z-50 border border-[#B8860B]/20" onClick={(e) => { e.stopPropagation(); navigateLightbox(1); }}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" /></svg>
          </button>
          <div className="max-w-6xl max-h-[85vh] flex flex-col items-center px-20" onClick={(e) => e.stopPropagation()}>
            <div className="relative overflow-hidden rounded-2xl shadow-2xl" style={{ boxShadow: '0 25px 80px rgba(184, 134, 11, 0.25)' }}>
              <img src={lightboxImage.image} alt={lightboxImage.title} className="max-w-full max-h-[70vh] object-contain animate-fadeIn" />
              <div className="absolute inset-0 border-2 border-[#B8860B]/30 rounded-2xl pointer-events-none" />
            </div>
            <div className="text-center mt-8 animate-fadeInUp">
              <h3 className="royal-title text-4xl text-[#2a2a2a] mb-2">{lightboxImage.title}</h3>
              <p className="text-[#6a6a6a] font-light">{lightboxImage.desc}</p>
            </div>
            <div className="mt-6 flex items-center gap-2">
              {filteredImages.map((_, idx) => (
                <button key={idx} onClick={(e) => { e.stopPropagation(); setLightboxIndex(idx); setLightboxImage(filteredImages[idx]); }}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === lightboxIndex ? 'bg-[#B8860B] w-8' : 'bg-[#B8860B]/30 hover:bg-[#B8860B]/50'}`} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-fixed" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1920)' }}>
          <div className="absolute inset-0 bg-[#1a1a1a]/70 backdrop-blur-sm" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mb-8" />
          <p className="text-sm uppercase tracking-[0.4em] text-[#D4AF37] mb-6">Experience It Yourself</p>
          <h2 className="royal-title text-5xl md:text-7xl text-white mb-8">Visit Maharaja Palace</h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-12 font-light leading-relaxed">Pictures capture moments, but memories are made in person. Come experience the grandeur and hospitality that awaits you.</p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <a href="/rooms" className="group relative px-12 py-5 overflow-hidden rounded-lg">
              <span className="absolute inset-0 bg-gradient-to-r from-[#B8860B] to-[#D4AF37] transition-transform duration-500 group-hover:scale-105 rounded-lg" />
              <span className="relative z-10 text-white font-semibold tracking-wider flex items-center gap-3">
                Book Your Stay
                <svg className="w-5 h-5 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </span>
            </a>
            <a href="/contact" className="group relative px-12 py-5 border-2 border-white text-white hover:text-[#1a1a1a] font-semibold tracking-wider transition-all duration-500 overflow-hidden rounded-lg">
              <span className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-lg" />
              <span className="relative z-10">Schedule a Tour</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GalleryPage;
