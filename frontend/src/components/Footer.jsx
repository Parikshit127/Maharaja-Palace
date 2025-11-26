import React from 'react';

export const Footer = () => {
  return (
    <footer className="bg-[#1a1a1a] text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* About Section */}
          <div>
            <h3 className="text-2xl font-serif text-[#B8860B] mb-6">
              Maharaja Palace
            </h3>
            <p className="text-gray-400 leading-relaxed mb-6">
              Experience unparalleled luxury and royal hospitality in the heart of grandeur. Where tradition meets contemporary elegance.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 border border-[#B8860B] flex items-center justify-center hover:bg-[#B8860B] transition-colors">
                <span className="text-sm">f</span>
              </a>
              <a href="#" className="w-10 h-10 border border-[#B8860B] flex items-center justify-center hover:bg-[#B8860B] transition-colors">
                <span className="text-sm">in</span>
              </a>
              <a href="#" className="w-10 h-10 border border-[#B8860B] flex items-center justify-center hover:bg-[#B8860B] transition-colors">
                <span className="text-sm">ig</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li>
                <a href="/" className="text-gray-400 hover:text-[#B8860B] transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/rooms" className="text-gray-400 hover:text-[#B8860B] transition-colors">
                  Rooms
                </a>
              </li>
              <li>
                <a href="/banquet" className="text-gray-400 hover:text-[#B8860B] transition-colors">
                  Banquet Halls
                </a>
              </li>
              <li>
                <a href="/restaurant" className="text-gray-400 hover:text-[#B8860B] transition-colors">
                  Dining
                </a>
              </li>
              <li>
                <a href="/gallery" className="text-gray-400 hover:text-[#B8860B] transition-colors">
                  Gallery
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-6 uppercase tracking-wider">
              Services
            </h4>
            <ul className="space-y-3">
              <li className="text-gray-400">24/7 Room Service</li>
              <li className="text-gray-400">Concierge Services</li>
              <li className="text-gray-400">Spa & Wellness</li>
              <li className="text-gray-400">Airport Transfer</li>
              <li className="text-gray-400">Business Center</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6 uppercase tracking-wider">
              Contact Us
            </h4>
            <ul className="space-y-4 text-gray-400">
              <li className="flex items-start">
                <span className="text-[#B8860B] mr-3">📍</span>
                <span>123 Royal Avenue, Palace District, Ludhiana, Punjab, India</span>
              </li>
              <li className="flex items-center">
                <span className="text-[#B8860B] mr-3">📞</span>
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center">
                <span className="text-[#B8860B] mr-3">✉️</span>
                <span>info@maharajapalace.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>© 2025 Maharaja Palace. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-[#B8860B] transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-[#B8860B] transition-colors">
                Terms & Conditions
              </a>
              <a href="#" className="hover:text-[#B8860B] transition-colors">
                Sitemap
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};