import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, LogOut, Settings } from 'lucide-react';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Fade in navbar on mount
    setIsVisible(true);

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

  const leftNav = navLinks.slice(0, 4);
  const rightNav = navLinks.slice(4);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Luxury Navbar */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: isVisible ? 0 : -100, opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed w-full top-0 z-50 transition-all duration-500 ${isScrolled
          ? 'bg-[#F9F4E8]/98 backdrop-blur-xl shadow-[0_8px_32px_rgba(201,162,63,0.12)] py-4'
          : 'bg-gradient-to-b from-black/40 via-black/20 to-transparent backdrop-blur-md py-6'
          }`}
      >

        <div className="w-full max-w-[1400px] mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            {/* Left Navigation */}
            <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              {leftNav.map((link, index) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05, duration: 0.6 }}
                >
                  <Link
                    to={link.path}
                    className="relative group"
                  >
                    <span
                      className={`text-[11px] font-medium uppercase tracking-[0.2em] transition-all duration-500 ${isActive(link.path)
                        ? 'text-[#C9A23F]'
                        : isScrolled
                          ? 'text-[#111111] group-hover:text-[#C9A23F] group-hover:tracking-[0.25em]'
                          : 'text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] group-hover:text-[#C9A23F] group-hover:tracking-[0.25em]'
                        }`}
                    >
                      {link.name}
                    </span>
                    {/* Gold Underline Animation */}
                    <span
                      className={`absolute -bottom-2 left-0 h-[2px] bg-gradient-to-r from-[#C9A23F] to-[#D4AF37] transition-all duration-500 ${isActive(link.path)
                        ? 'w-full opacity-100'
                        : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-100'
                        }`}
                    />
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Centered Logo with Shimmer */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: isScrolled ? 0.92 : 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="flex-shrink-0 mx-1 sm:mx-2 lg:mx-4"
            >
              <Link to="/" className="group flex flex-col items-center">
                <h1
                  className={`text-sm sm:text-lg md:text-xl lg:text-2xl font-bold uppercase tracking-[0.08em] sm:tracking-[0.12em] lg:tracking-[0.15em] transition-all duration-500 relative ${isScrolled
                    ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#C9A23F] via-[#D4AF37] to-[#C9A23F]'
                    : 'text-[#D4AF37] drop-shadow-[0_0_20px_rgba(212,175,55,0.5)]'
                    }`}
                  style={{
                    fontFamily: "'Cinzel', 'Playfair Display', serif",
                    fontWeight: 700,
                    textShadow: isScrolled ? 'none' : '0 2px 12px rgba(212, 175, 55, 0.4)',
                  }}
                >
                  MAHARAJA PALACE
                  {/* Shimmer Effect */}
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shimmer" />
                </h1>
                <div
                  className={`text-[6px] sm:text-[7px] uppercase tracking-[0.2em] sm:tracking-[0.3em] transition-colors duration-500 hidden sm:block ${isScrolled ? 'text-[#C9A23F]/70' : 'text-[#D4AF37]/80'
                    }`}
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  Est. 2016
                </div>
              </Link>
            </motion.div>

            {/* Right Navigation */}
            <div className="hidden lg:flex items-center space-x-6 xl:space-x-8 justify-end">
              {rightNav.map((link, index) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.05, duration: 0.6 }}
                >
                  <Link
                    to={link.path}
                    className="relative group"
                  >
                    <span
                      className={`text-[11px] font-medium uppercase tracking-[0.2em] transition-all duration-500 ${isActive(link.path)
                        ? 'text-[#C9A23F]'
                        : isScrolled
                          ? 'text-[#111111] group-hover:text-[#C9A23F] group-hover:tracking-[0.25em]'
                          : 'text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] group-hover:text-[#C9A23F] group-hover:tracking-[0.25em]'
                        }`}
                    >
                      {link.name}
                    </span>
                    <span
                      className={`absolute -bottom-2 left-0 h-[2px] bg-gradient-to-r from-[#C9A23F] to-[#D4AF37] transition-all duration-500 ${isActive(link.path)
                        ? 'w-full opacity-100'
                        : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-100'
                        }`}
                    />
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Auth Buttons - Desktop */}
            <div className="hidden lg:flex items-center space-x-3 ml-4">
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className={`flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.15em] transition-all duration-500 hover:tracking-[0.2em] whitespace-nowrap ${isScrolled
                      ? 'text-[#111111] hover:text-[#C9A23F]'
                      : 'text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] hover:text-[#C9A23F]'
                      }`}
                  >
                    <User className="w-3.5 h-3.5" />
                    My Bookings
                  </Link>

                  {/* Admin Panel Link - Only for Admin Users */}
                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      className={`flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.15em] transition-all duration-500 hover:tracking-[0.2em] whitespace-nowrap ${isScrolled
                        ? 'text-[#111111] hover:text-[#C9A23F]'
                        : 'text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] hover:text-[#C9A23F]'
                        }`}
                    >
                      <Settings className="w-3.5 h-3.5" />
                      Admin Panel
                    </Link>
                  )}

                  <button
                    onClick={logout}
                    className="group relative px-4 py-2 overflow-hidden transition-all duration-500 hover:shadow-[0_0_20px_rgba(201,162,63,0.3)] whitespace-nowrap"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-[#C9A23F] to-[#D4AF37] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                    <span className="relative z-10 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#C9A23F] group-hover:text-white transition-colors duration-500">
                      <LogOut className="w-3 h-3" />
                      Logout
                    </span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className={`text-[10px] font-medium uppercase tracking-[0.15em] transition-all duration-500 hover:tracking-[0.2em] whitespace-nowrap ${isScrolled
                      ? 'text-[#111111] hover:text-[#C9A23F]'
                      : 'text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] hover:text-[#C9A23F]'
                      }`}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="group relative px-4 py-2 overflow-hidden transition-all duration-500 hover:shadow-[0_0_20px_rgba(201,162,63,0.3)] whitespace-nowrap"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-[#C9A23F] to-[#D4AF37] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                    <span className="relative z-10 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#C9A23F] group-hover:text-white transition-colors duration-500">
                      Register
                    </span>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden flex-shrink-0 p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X
                  className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-300 ${isScrolled ? 'text-[#111111]' : 'text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]'
                    }`}
                />
              ) : (
                <Menu
                  className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-300 ${isScrolled ? 'text-[#111111]' : 'text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]'
                    }`}
                />
              )}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Premium Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-[60px] sm:top-[72px] md:top-[88px] left-0 right-0 z-40 lg:hidden overflow-hidden"
          >
            <div className="bg-[#F9F4E8]/98 backdrop-blur-xl shadow-[0_8px_32px_rgba(201,162,63,0.15)] max-h-[calc(100vh-60px)] sm:max-h-[calc(100vh-72px)] md:max-h-[calc(100vh-88px)] overflow-y-auto">
              <div className="max-w-md mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8">
                {/* Mobile Nav Links */}
                <div className="flex flex-col space-y-4 sm:space-y-6 mb-6 sm:mb-8">
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.path}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.4 }}
                    >
                      <Link
                        to={link.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="group relative inline-block"
                      >
                        <span
                          className={`text-xs sm:text-sm font-medium uppercase tracking-[0.15em] sm:tracking-[0.2em] transition-all duration-300 ${isActive(link.path)
                            ? 'text-[#C9A23F]'
                            : 'text-[#111111] group-hover:text-[#C9A23F] group-hover:tracking-[0.2em] sm:group-hover:tracking-[0.25em]'
                            }`}
                        >
                          {link.name}
                        </span>
                        <span
                          className={`absolute -bottom-1 left-0 h-[2px] bg-gradient-to-r from-[#C9A23F] to-[#D4AF37] transition-all duration-300 ${isActive(link.path)
                            ? 'w-full opacity-100'
                            : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-100'
                            }`}
                        />
                      </Link>
                      {/* Gold Divider */}
                      <div className="mt-4 sm:mt-6 h-[1px] bg-gradient-to-r from-transparent via-[#C9A23F]/30 to-transparent" />
                    </motion.div>
                  ))}
                </div>

                {/* Mobile Auth Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                  className="flex flex-col space-y-3 sm:space-y-4 pt-4 border-t-2 border-[#C9A23F]/20"
                >
                  {user ? (
                    <>
                      <Link
                        to="/dashboard"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-white text-[#C9A23F] hover:bg-[#C9A23F] hover:text-white transition-all duration-300"
                      >
                        <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.15em] sm:tracking-[0.2em]">My Bookings</span>
                      </Link>

                      {/* Admin Panel Link - Mobile - Only for Admin Users */}
                      {user.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-white text-[#C9A23F] hover:bg-[#C9A23F] hover:text-white transition-all duration-300"
                        >
                          <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.15em] sm:tracking-[0.2em]">Admin Panel</span>
                        </Link>
                      )}

                      <button
                        onClick={() => {
                          logout();
                          setIsMobileMenuOpen(false);
                        }}
                        className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-[#C9A23F] to-[#D4AF37] text-white hover:shadow-[0_0_20px_rgba(201,162,63,0.4)] transition-all duration-300"
                      >
                        <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.15em] sm:tracking-[0.2em]">Logout</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="px-4 sm:px-6 py-2.5 sm:py-3 text-center bg-white text-[#C9A23F] hover:bg-[#C9A23F] hover:text-white transition-all duration-300"
                      >
                        <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.15em] sm:tracking-[0.2em]">Login</span>
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="px-4 sm:px-6 py-2.5 sm:py-3 text-center bg-gradient-to-r from-[#C9A23F] to-[#D4AF37] text-white hover:shadow-[0_0_20px_rgba(201,162,63,0.4)] transition-all duration-300"
                      >
                        <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.15em] sm:tracking-[0.2em]">Register</span>
                      </Link>
                    </>
                  )}
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Shimmer Animation */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </>
  );
};