import React from 'react';

// Button Component
export const Button = ({ children, variant = 'primary', size = 'md', className = '', ...props }) => {
  const baseStyles = 'font-semibold transition-all duration-300 border-2 tracking-wide';
  
  const variants = {
    primary: 'bg-transparent border-[#B8860B] text-[#B8860B] hover:bg-[#B8860B] hover:text-white',
    filled: 'bg-[#B8860B] border-[#B8860B] text-white hover:bg-[#8B6914] hover:border-[#8B6914]',
    outline: 'bg-transparent border-gray-300 text-gray-700 hover:border-[#B8860B] hover:text-[#B8860B]'
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };
  
  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Input Component
export const Input = ({ label, error, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-3 border-2 border-gray-300 focus:border-[#B8860B] focus:outline-none transition-colors ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

// Card Component
export const Card = ({ children, hoverable = false, className = '' }) => {
  return (
    <div className={`bg-white border border-gray-200 overflow-hidden ${hoverable ? 'hover:shadow-2xl transition-shadow duration-500' : ''} ${className}`}>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

// Section Title Component
export const SectionTitle = ({ children, subtitle, className = '' }) => {
  return (
    <div className={`text-center mb-12 ${className}`}>
      <div className="inline-block mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-[2px] bg-[#B8860B]"></div>
          <h2 className="text-4xl md:text-5xl font-serif text-[#B8860B] tracking-wide">
            {children}
          </h2>
          <div className="w-12 h-[2px] bg-[#B8860B]"></div>
        </div>
      </div>
      {subtitle && (
        <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};

// Hero Section Component
export const HeroSection = ({ 
  title, 
  subtitle, 
  backgroundImage = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600',
  height = 'h-[70vh]',
  children 
}) => {
  return (
    <div className={`relative ${height} flex items-center justify-center overflow-hidden`}>
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto animate-fadeIn">
        <div className="mb-6">
          <div className="w-16 h-[2px] bg-[#B8860B] mx-auto mb-4"></div>
          <p className="text-sm uppercase tracking-[0.3em] mb-2 font-light">
            {subtitle || 'Maharaja Palace'}
          </p>
        </div>
        <h1 className="text-5xl md:text-7xl font-serif mb-6 leading-tight">
          {title}
        </h1>
        {children}
      </div>
    </div>
  );
};

// Image Card Component
export const ImageCard = ({ 
  image, 
  title, 
  description, 
  onClick,
  badge,
  className = '' 
}) => {
  return (
    <div 
      className={`group cursor-pointer overflow-hidden bg-white border border-gray-100 ${className}`}
      onClick={onClick}
    >
      <div className="relative overflow-hidden h-64">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {badge && (
          <div className="absolute top-4 right-4 bg-[#B8860B] text-white px-4 py-2 text-sm font-semibold">
            {badge}
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-2xl font-serif text-[#B8860B] mb-3 group-hover:text-[#8B6914] transition-colors">
          {title}
        </h3>
        {description && (
          <p className="text-gray-600 leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

// Divider Component
export const Divider = ({ className = '' }) => {
  return (
    <div className={`flex items-center justify-center my-12 ${className}`}>
      <div className="w-12 h-[2px] bg-[#B8860B]"></div>
      <div className="mx-4 w-2 h-2 bg-[#B8860B] rotate-45"></div>
      <div className="w-12 h-[2px] bg-[#B8860B]"></div>
    </div>
  );
};