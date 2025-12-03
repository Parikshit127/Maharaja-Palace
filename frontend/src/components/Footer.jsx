import React from "react";

export const Footer = () => {
  return (
    <footer className="bg-[#1a1a1a] text-white">
      {/* Main Footer Content - Reduced Padding */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-serif text-[#B8860B] mb-4">
              Maharaja Palace
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Experience unparalleled luxury and royal hospitality in the heart
              of grandeur.
            </p>
            <div className="flex space-x-3">
              <a
                href="#"
                className="w-8 h-8 border border-[#B8860B] flex items-center justify-center hover:bg-[#B8860B] transition-colors text-xs"
              >
                f
              </a>
              <a
                href="#"
                className="w-8 h-8 border border-[#B8860B] flex items-center justify-center hover:bg-[#B8860B] transition-colors text-xs"
              >
                in
              </a>
              <a
                href="#"
                className="w-8 h-8 border border-[#B8860B] flex items-center justify-center hover:bg-[#B8860B] transition-colors text-xs"
              >
                ig
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base font-semibold mb-4 uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="/"
                  className="text-gray-400 hover:text-[#B8860B] transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/rooms"
                  className="text-gray-400 hover:text-[#B8860B] transition-colors"
                >
                  Rooms
                </a>
              </li>
              <li>
                <a
                  href="/banquet"
                  className="text-gray-400 hover:text-[#B8860B] transition-colors"
                >
                  Banquet Halls
                </a>
              </li>
              <li>
                <a
                  href="/restaurant"
                  className="text-gray-400 hover:text-[#B8860B] transition-colors"
                >
                  Dining
                </a>
              </li>
              <li>
                <a
                  href="/gallery"
                  className="text-gray-400 hover:text-[#B8860B] transition-colors"
                >
                  Gallery
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-base font-semibold mb-4 uppercase tracking-wider">
              Services
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>24/7 Room Service</li>
              <li>Concierge Services</li>
              <li>Spa & Wellness</li>
              <li>Airport Transfer</li>
              <li>Business Center</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-base font-semibold mb-4 uppercase tracking-wider">
              Contact Us
            </h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start">
                <span className="text-[#B8860B] mr-2">📍</span>
                <span>
                  Near, sai mandir NH9, Kharawar, Haryana 124021, Rohtak, India,
                  Haryana
                </span>
              </li>
              <li className="flex items-center">
                <span className="text-[#B8860B] mr-2">📞</span>
                <span>090530 88819</span>
              </li>
              <li className="flex items-center">
                <span className="text-[#B8860B] mr-2">✉️</span>
                <span>reservations@maharajapalaces.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar - Reduced Padding */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-400">
            <p>© 2025 Maharaja Palace. All rights reserved.</p>
            <div className="flex space-x-4 mt-2 md:mt-0">
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
