import React, { useState, useEffect } from 'react';
import { HeroSection, SectionTitle, Button } from '../components/BaseComponents';
import { MapPin, Phone, Mail, Send, CheckCircle, Hotel, UtensilsCrossed, PartyPopper, Camera, ChevronDown } from 'lucide-react';

// Animated Card
const AnimatedCard = ({ children, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = React.useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [delay]);

  return (
    <div 
      ref={ref}
      className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
    >
      {children}
    </div>
  );
};

// Enhanced Input
const EnhancedInput = ({ label, error, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);
  
  return (
    <div className="relative">
      <label className={`absolute left-4 transition-all duration-300 pointer-events-none ${
        isFocused || props.value 
          ? '-top-2 text-xs bg-white px-2 text-[#B8860B]' 
          : 'top-4 text-gray-500'
      }`}>
        {label}
      </label>
      <input
        {...props}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`w-full px-4 py-4 border-2 transition-all duration-300 outline-none ${
          error 
            ? 'border-red-500' 
            : isFocused 
              ? 'border-[#B8860B] shadow-lg shadow-[#B8860B]/10' 
              : 'border-gray-200 hover:border-gray-300'
        }`}
      />
      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center gap-2">
          <span className="w-1 h-1 bg-red-600 rounded-full"></span>
          {error}
        </p>
      )}
    </div>
  );
};

// FAQ Item
const FAQItem = ({ question, answer, index }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <AnimatedCard delay={index * 100}>
      <div className="bg-white border-l-4 border-[#B8860B] overflow-hidden transition-all duration-300 hover:shadow-lg">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full p-6 text-left flex items-center justify-between gap-4 group"
        >
          <h4 className="text-lg font-semibold text-gray-800 group-hover:text-[#B8860B] transition-colors duration-300">
            {question}
          </h4>
          <ChevronDown className={`w-5 h-5 text-[#B8860B] transition-transform duration-300 flex-shrink-0 ${
            isOpen ? 'rotate-180' : ''
          }`} />
        </button>
        <div className={`transition-all duration-300 overflow-hidden ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <p className="px-6 pb-6 text-gray-600 leading-relaxed">
            {answer}
          </p>
        </div>
      </div>
    </AnimatedCard>
  );
};

export const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.phone) newErrors.phone = 'Phone is required';
    if (!formData.subject) newErrors.subject = 'Subject is required';
    if (!formData.message) newErrors.message = 'Message is required';
    return newErrors;
  };

  const handleSubmit = () => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsSubmitting(true);
    setTimeout(() => {
      console.log('Form submitted:', formData);
      setSubmitted(true);
      setIsSubmitting(false);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    }, 1500);
  };

  const contactCards = [
    {
      icon: MapPin,
      title: 'Visit Us',
      details: ['123 Royal Avenue', 'Palace District', 'Ludhiana, Punjab 141001', 'India']
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: ['Reservations: +91 98765 43210', 'General Inquiries: +91 98765 43211', 'Events: +91 98765 43212', 'Available 24/7']
    },
    {
      icon: Mail,
      title: 'Email Us',
      details: ['General: info@maharajapalace.com', 'Reservations: bookings@maharajapalace.com', 'Events: events@maharajapalace.com', 'Careers: careers@maharajapalace.com']
    }
  ];

  const quickLinks = [
    { title: 'Book a Room', icon: Hotel, link: '/rooms' },
    { title: 'Reserve a Table', icon: UtensilsCrossed, link: '/restaurant' },
    { title: 'Event Inquiry', icon: PartyPopper, link: '/banquet' },
    { title: 'View Gallery', icon: Camera, link: '/gallery' }
  ];

  const faqs = [
    {
      q: 'What are your check-in and check-out times?',
      a: 'Check-in time is 2:00 PM and check-out time is 12:00 PM. Early check-in and late check-out are subject to availability and may incur additional charges.'
    },
    {
      q: 'Do you offer airport transfer services?',
      a: 'Yes, we provide complimentary airport transfers for our suite and penthouse guests. Other guests can arrange airport pickup at a nominal fee.'
    },
    {
      q: 'Is parking available at the hotel?',
      a: 'Yes, we offer complimentary valet parking for all our guests with 24/7 security.'
    },
    {
      q: 'What is your cancellation policy?',
      a: 'Cancellations made 72 hours prior to arrival are eligible for a full refund. Cancellations within 72 hours will incur a one-night charge.'
    }
  ];

  return (
    <div className="bg-[#faf9f6]">
      <style>{`
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        .shimmer-effect {
          background: linear-gradient(90deg, transparent, rgba(184, 134, 11, 0.1), transparent);
          background-size: 1000px 100%;
          animation: shimmer 3s infinite;
        }
      `}</style>

      {/* Hero Section - Full screen */}
      <HeroSection
        title="Get in Touch"
        subtitle="Contact Us"
        backgroundImage="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1600"
        height="h-screen"
      />

      {/* Contact Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {contactCards.map((contact, index) => {
            const Icon = contact.icon;
            return (
              <AnimatedCard key={index} delay={index * 100}>
                <div className="group relative bg-white p-10 border border-gray-100 hover:border-[#B8860B] transition-all duration-500 overflow-hidden hover:shadow-2xl">
                  <div className="absolute inset-0 shimmer-effect opacity-0 group-hover:opacity-100"></div>
                  <div className="relative text-center">
                    <div className="w-20 h-20 bg-[#B8860B]/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-[#B8860B] transition-all duration-500">
                      <Icon className="w-10 h-10 text-[#B8860B] group-hover:text-white transition-colors duration-500" />
                    </div>
                    <h3 className="text-2xl font-serif text-[#B8860B] mb-6">{contact.title}</h3>
                    <div className="w-16 h-[1px] bg-[#B8860B]/30 mx-auto mb-6 group-hover:w-full transition-all duration-500"></div>
                    <div className="space-y-2">
                      {contact.details.map((detail, idx) => (
                        <p key={idx} className="text-gray-600 text-sm leading-relaxed">
                          {detail}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </AnimatedCard>
            );
          })}
        </div>
      </section>

      {/* Contact Form */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-[#faf9f6] to-white"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#B8860B] to-transparent"></div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle subtitle="We'd love to hear from you">
            Send Us a Message
          </SectionTitle>

          {submitted && (
            <AnimatedCard>
              <div className="mb-10 p-8 bg-white border-2 border-green-500 relative overflow-hidden">
                <div className="absolute inset-0 bg-green-50"></div>
                <div className="relative flex items-center justify-center gap-4 text-green-700">
                  <CheckCircle className="w-8 h-8" />
                  <div>
                    <p className="text-xl font-semibold">Thank you for contacting us!</p>
                    <p className="mt-1 text-sm">We'll get back to you within 24 hours.</p>
                  </div>
                </div>
              </div>
            </AnimatedCard>
          )}

          <AnimatedCard delay={200}>
            <div className="bg-white p-10 border border-gray-100 shadow-xl">
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <EnhancedInput
                    label="Full Name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    error={errors.name}
                  />
                  <EnhancedInput
                    label="Email Address"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <EnhancedInput
                    label="Phone Number"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    error={errors.phone}
                  />
                  <div className="relative">
                    <label className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                      formData.subject ? '-top-2 text-xs bg-white px-2 text-[#B8860B]' : 'top-4 text-gray-500'
                    }`}>
                      Subject
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className={`w-full px-4 py-4 border-2 transition-all duration-300 outline-none appearance-none ${
                        errors.subject ? 'border-red-500' : 'border-gray-200 hover:border-gray-300 focus:border-[#B8860B] focus:shadow-lg focus:shadow-[#B8860B]/10'
                      }`}
                    >
                      <option value=""></option>
                      <option value="reservation">Room Reservation</option>
                      <option value="event">Event Booking</option>
                      <option value="dining">Restaurant Reservation</option>
                      <option value="general">General Inquiry</option>
                      <option value="feedback">Feedback</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.subject && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-2">
                        <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                        {errors.subject}
                      </p>
                    )}
                  </div>
                </div>

                <div className="relative">
                  <label className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                    formData.message ? '-top-2 text-xs bg-white px-2 text-[#B8860B]' : 'top-4 text-gray-500'
                  }`}>
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className={`w-full px-4 py-4 pt-6 border-2 transition-all duration-300 outline-none resize-none ${
                      errors.message ? 'border-red-500' : 'border-gray-200 hover:border-gray-300 focus:border-[#B8860B] focus:shadow-lg focus:shadow-[#B8860B]/10'
                    }`}
                  />
                  {errors.message && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-2">
                      <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                      {errors.message}
                    </p>
                  )}
                </div>

                <div className="text-center pt-4">
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="group relative px-12 py-4 bg-[#B8860B] text-white overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-[#B8860B]/30 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="relative z-10 flex items-center gap-3 text-lg tracking-wider">
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                        </>
                      )}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#8B6914] to-[#B8860B] translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                  </button>
                </div>
              </div>
            </div>
          </AnimatedCard>
        </div>
      </section>

      {/* Map */}
      <section className="h-[500px] relative overflow-hidden">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3423.0123456789!2d75.8573!3d30.9010!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDU0JzAzLjYiTiA3NcKwNTEnMjYuMyJF!5e0!3m2!1sen!2sin!4v1234567890"
          width="100%"
          height="100%"
          style={{ border: 0, filter: 'grayscale(0.3)' }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Maharaja Palace Location"
        />
      </section>

      {/* Quick Links */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle subtitle="Looking for something specific?">
            Quick Links
          </SectionTitle>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
            {quickLinks.map((item, index) => {
              const Icon = item.icon;
              return (
                <AnimatedCard key={index} delay={index * 100}>
                  <button
                    onClick={() => window.location.href = item.link}
                    className="group relative w-full p-10 bg-[#faf9f6] border-2 border-transparent hover:border-[#B8860B] transition-all duration-500 overflow-hidden hover:shadow-xl"
                  >
                    <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                    <div className="relative">
                      <div className="w-16 h-16 bg-white group-hover:bg-[#B8860B]/10 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-500">
                        <Icon className="w-8 h-8 text-[#B8860B] group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <div className="w-12 h-[1px] bg-[#B8860B]/30 mx-auto mb-4 group-hover:w-full transition-all duration-500"></div>
                      <h4 className="text-lg font-serif text-[#B8860B]">
                        {item.title}
                      </h4>
                    </div>
                  </button>
                </AnimatedCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <SectionTitle subtitle="Find answers to common questions">
          Frequently Asked Questions
        </SectionTitle>

        <div className="space-y-4 mt-16">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.q} answer={faq.a} index={index} />
          ))}
        </div>
      </section>
    </div>
  );
};