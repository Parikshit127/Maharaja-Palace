import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Rooms', path: '/rooms' },
    { name: 'Banquet', path: '/banquet' },
    { name: 'Restaurant', path: '/restaurant' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav 
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white shadow-lg py-4' 
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-2xl md:text-3xl font-serif font-bold text-[#B8860B]">
              MAHARAJA PALACE
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm uppercase tracking-wider transition-colors duration-300 ${
                  isActive(link.path)
                    ? 'text-[#B8860B] font-semibold'
                    : isScrolled
                    ? 'text-gray-700 hover:text-[#B8860B]'
                    : 'text-white hover:text-[#B8860B]'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className={`text-sm uppercase tracking-wider transition-colors duration-300 ${
                    isScrolled ? 'text-gray-700 hover:text-[#B8860B]' : 'text-white hover:text-[#B8860B]'
                  }`}
                >
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="px-5 py-2 border-2 border-[#B8860B] text-[#B8860B] hover:bg-[#B8860B] hover:text-white transition-all duration-300 text-sm uppercase tracking-wider"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`text-sm uppercase tracking-wider transition-colors duration-300 ${
                    isScrolled ? 'text-gray-700 hover:text-[#B8860B]' : 'text-white hover:text-[#B8860B]'
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 border-2 border-[#B8860B] text-[#B8860B] hover:bg-[#B8860B] hover:text-white transition-all duration-300 text-sm uppercase tracking-wider"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <span className={`block h-0.5 w-full transition-all ${isScrolled ? 'bg-gray-700' : 'bg-white'}`}></span>
              <span className={`block h-0.5 w-full transition-all ${isScrolled ? 'bg-gray-700' : 'bg-white'}`}></span>
              <span className={`block h-0.5 w-full transition-all ${isScrolled ? 'bg-gray-700' : 'bg-white'}`}></span>
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4 mt-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-sm uppercase tracking-wider ${
                    isActive(link.path)
                      ? 'text-[#B8860B] font-semibold'
                      : 'text-gray-700 hover:text-[#B8860B]'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-sm uppercase tracking-wider text-gray-700 hover:text-[#B8860B]"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="px-5 py-2 border-2 border-[#B8860B] text-[#B8860B] hover:bg-[#B8860B] hover:text-white transition-all text-sm uppercase tracking-wider text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-sm uppercase tracking-wider text-gray-700 hover:text-[#B8860B]"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-5 py-2 border-2 border-[#B8860B] text-[#B8860B] hover:bg-[#B8860B] hover:text-white transition-all text-sm uppercase tracking-wider inline-block"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};