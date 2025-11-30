import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/BaseComponents';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-cream border-b-4 border-gold shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-3xl font-bold text-gold font-playfair">🏰</span>
              <span className="text-2xl font-bold text-gold font-playfair hidden sm:inline">
                Maharaja Palace
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/rooms" className="text-lightText hover:text-gold transition-colors">
              Rooms
            </Link>
            <Link to="/banquet" className="text-lightText hover:text-gold transition-colors">
              Banquet
            </Link>
            <Link to="/restaurant" className="text-lightText hover:text-gold transition-colors">
              Restaurant
            </Link>
            <Link to="/gallery" className="text-lightText hover:text-gold transition-colors">
              Gallery
            </Link>
            <Link to="/about" className="text-lightText hover:text-gold transition-colors">
              About
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {user?.role === 'admin' ? (
                  <Link to="/admin">
                    <Button variant="secondary" size="sm">
                      Admin Portal
                    </Button>
                  </Link>
                ) : (
                  <Link to="/dashboard">
                    <Button variant="secondary" size="sm">
                      Dashboard
                    </Button>
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="text-lightText hover:text-gold transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="primary" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="filled" size="sm">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export const Footer = () => {
  return (
    <footer className="bg-lightText text-cream border-t-4 border-gold mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold text-gold font-playfair mb-4">
              Maharaja Palace
            </h3>
            <p className="text-cream/80">Experience luxury at its finest</p>
          </div>
          <div>
            <h4 className="font-semibold text-gold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-cream/80 hover:text-gold">Rooms</a></li>
              <li><a href="#" className="text-cream/80 hover:text-gold">Banquet</a></li>
              <li><a href="#" className="text-cream/80 hover:text-gold">Restaurant</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gold mb-4">Contact</h4>
            <ul className="space-y-2 text-cream/80">
              <li>Email: info@maharajapalace.com</li>
              <li>Phone: +91-XXX-XXX-XXXX</li>
              <li>Address: Palace Avenue, City</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-cream/80 hover:text-gold">Facebook</a>
              <a href="#" className="text-cream/80 hover:text-gold">Instagram</a>
              <a href="#" className="text-cream/80 hover:text-gold">Twitter</a>
            </div>
          </div>
        </div>
        <div className="border-t border-gold/30 pt-8 text-center">
          <p className="text-cream/60">
            &copy; 2024 Maharaja Palace Hotel. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
