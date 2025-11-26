import React, { useState, useEffect } from 'react';
import { HeroSection, SectionTitle, Button } from '../components/BaseComponents';
import { restaurantAPI } from '../api/api';

export const RestaurantPage = () => {
  const [restaurants] = useState([
    {
      _id: '1',
      name: 'The Frontier Mail',
      description: 'Step back in time with our award-winning restaurant, which takes its inspiration from the legendary Frontier Mail train that operated between Bombay and Peshawar during the pre-independence days. The menu comprises cuisines from the regions through which the train made its initial journey.',
      cuisine: 'Multi-Regional Indian',
      timing: 'Monday to Sunday: 12:30 hrs - 15:30 hrs | Saturday & Sunday: 19:30 hrs - 23:00 hrs',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200',
      specialty: 'Regional Indian Cuisine',
      capacity: 80
    },
    {
      _id: '2',
      name: 'The Brown Sugar',
      description: 'A place where you can enjoy an international dining experience that is quite unforgettable, this all-day diner offers buffet meals as well as an à la carte menu. Relax, entertain or conduct leisurely meetings over a wide range of exotic teas, coffees and savories.',
      cuisine: 'International',
      timing: '24 Hours Coffee Shop | Breakfast: 07:00 hrs - 10:30 hrs',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200',
      specialty: 'All-Day Dining',
      capacity: 100
    },
    {
      _id: '3',
      name: 'The Polo Bar',
      description: 'Adorned with trophies and memorabilia of the yesteryears, this colonial-style English bar serves signature cocktails inspired by the royal sport. The shelves are lined with the finest rare whiskies, single malts, cognacs, wines and liqueurs, and a hand-picked selection of Cuban cigars.',
      cuisine: 'Bar & Lounge',
      timing: '11:00 hrs - 00:00 hrs',
      image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=1200',
      specialty: 'Premium Spirits & Cocktails',
      capacity: 50
    },
    {
      _id: '4',
      name: 'Khaas Mahal',
      description: 'An exclusive al fresco restaurant for a niche dining experience, this is a great place to enjoy a delectable melt-in-the-mouth meal under the light of a stellar sky. Available on special dining request.',
      cuisine: 'Fine Dining',
      timing: 'By Special Reservation',
      image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1200',
      specialty: 'Outdoor Fine Dining',
      capacity: 35
    },
    {
      _id: '5',
      name: 'The Lounge',
      description: 'The Lounge Access is on the Lobby Floor of the hotel for an ultra-quick check-in with welcome drinks on arrival. On special occasions, you can access the lounge in the evening for complimentary drinks and light snacks.',
      cuisine: 'Lounge',
      timing: 'Check-in Hours | Evening: 18:00 hrs - 22:00 hrs',
      image: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=1200',
      specialty: 'Welcome Lounge',
      capacity: 30
    },
    {
      _id: '6',
      name: 'The Cake Factory',
      description: 'The Cake Factory offers a delicious spread of freshly baked hand-crafted breads, tarts, an assortment of savories as well as freshly baked cakes, pastries, pralines and truffles.',
      cuisine: 'Bakery & Confectionery',
      timing: '09:00 hrs - 21:00 hrs',
      image: 'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=1200',
      specialty: 'Artisan Bakery',
      capacity: 20
    }
  ]);

  return (
    <div className="bg-[#faf9f6]">
      {/* Hero Section */}
      <HeroSection
        title="Culinary Excellence"
        subtitle="Our Dining Experiences"
        backgroundImage="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600"
        height="h-[70vh]"
      />

      {/* Introduction */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="w-16 h-[2px] bg-[#B8860B] mx-auto mb-6"></div>
          <p className="text-sm uppercase tracking-[0.3em] text-[#B8860B] mb-4">
            A Journey of Flavors
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            Maharaja Palace welcomes its guests to a pleasant dining experience with exquisitely 
            handcrafted delicacies. Indulge in the art of fine dining from the royal kitchens of India 
            and savour global cuisines. Each restaurant has an interesting tale to tell on account of 
            its origin or inspiration.
          </p>
        </div>
      </section>

      {/* Restaurants */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="space-y-20">
          {restaurants.map((restaurant, index) => (
            <div 
              key={restaurant._id}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? 'lg:grid-flow-dense' : ''
              }`}
            >
              {/* Image */}
              <div 
                className={`${index % 2 === 1 ? 'lg:col-start-2' : ''} group overflow-hidden relative h-[450px]`}
              >
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 bg-[#B8860B] text-white px-4 py-2 text-sm font-semibold uppercase tracking-wider">
                  {restaurant.specialty}
                </div>
              </div>

              {/* Content */}
              <div className={index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}>
                <div className="w-12 h-[2px] bg-[#B8860B] mb-6"></div>
                <h3 className="text-3xl md:text-4xl font-serif text-[#B8860B] mb-4">
                  {restaurant.name}
                </h3>
                
                {/* Info Tags */}
                <div className="flex flex-wrap gap-3 mb-6">
                  <span className="bg-white px-4 py-2 text-sm text-gray-700 border border-gray-200">
                    {restaurant.cuisine}
                  </span>
                  <span className="bg-white px-4 py-2 text-sm text-gray-700 border border-gray-200">
                    Capacity: {restaurant.capacity}
                  </span>
                </div>

                <p className="text-gray-600 leading-relaxed mb-6">
                  {restaurant.description}
                </p>

                {/* Timing */}
                <div className="bg-white p-4 border-l-4 border-[#B8860B] mb-8">
                  <p className="text-sm text-gray-500 uppercase tracking-wider mb-1">Operating Hours</p>
                  <p className="text-gray-700 font-medium">{restaurant.timing}</p>
                </div>

                <Button 
                  variant="filled"
                  size="lg"
                  onClick={() => window.location.href = `/booking?type=restaurant&restaurantId=${restaurant._id}`}
                >
                  Reserve a Table
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Special Features */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle subtitle="What makes our dining special">
            The Maharaja Experience
          </SectionTitle>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-12">
            {[
              { icon: '👨‍🍳', title: 'Award-Winning Chefs', desc: 'Michelin-trained culinary experts' },
              { icon: '🌿', title: 'Fresh Ingredients', desc: 'Locally sourced organic produce' },
              { icon: '🍷', title: 'Curated Beverages', desc: 'Extensive wine & cocktail selection' },
              { icon: '🎵', title: 'Live Entertainment', desc: 'Traditional & contemporary music' }
            ].map((feature, index) => (
              <div 
                key={index}
                className="text-center group"
              >
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h4 className="text-lg font-serif text-[#B8860B] mb-2">{feature.title}</h4>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cuisine Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <SectionTitle subtitle="Explore our culinary repertoire">
          Signature Cuisines
        </SectionTitle>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {[
            {
              title: 'Indian Delicacies',
              description: 'Authentic regional dishes from across India, prepared with traditional techniques and royal recipes.',
              image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800'
            },
            {
              title: 'Continental Cuisine',
              description: 'European favorites crafted with premium ingredients and contemporary presentation.',
              image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800'
            },
            {
              title: 'Asian Fusion',
              description: 'A perfect blend of flavors from China, Thailand, Japan, and Southeast Asia.',
              image: 'https://images.unsplash.com/photo-1580959375944-c6f52d969f62?w=800'
            }
          ].map((cuisine, index) => (
            <div 
              key={index}
              className="group bg-white overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-500"
            >
              <div className="h-64 overflow-hidden">
                <img
                  src={cuisine.image}
                  alt={cuisine.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="p-6">
                <h4 className="text-xl font-serif text-[#B8860B] mb-3">{cuisine.title}</h4>
                <p className="text-gray-600 leading-relaxed">{cuisine.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=1600)' }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-serif mb-6">
            Reserve Your Table Today
          </h2>
          <p className="text-xl mb-8 font-light">
            Experience culinary excellence at Maharaja Palace
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="filled" 
              size="lg"
              onClick={() => window.location.href = '/booking?type=restaurant'}
            >
              Make a Reservation
            </Button>
            <Button 
              variant="primary" 
              size="lg"
              onClick={() => window.location.href = '/contact'}
            >
              View Menus
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};