import React, { useState } from 'react';
import { HeroSection, SectionTitle, Input, Button } from '../components/BaseComponents';

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
    // Simulate submission
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="bg-[#faf9f6]">
      {/* Hero Section */}
      <HeroSection
        title="Get in Touch"
        subtitle="Contact Us"
        backgroundImage="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1600"
        height="h-[70vh]"
      />

      {/* Contact Information Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: '📍',
              title: 'Visit Us',
              details: ['123 Royal Avenue', 'Palace District', 'Ludhiana, Punjab 141001', 'India']
            },
            {
              icon: '📞',
              title: 'Call Us',
              details: ['Reservations: +91 98765 43210', 'General Inquiries: +91 98765 43211', 'Events: +91 98765 43212', 'Available 24/7']
            },
            {
              icon: '✉️',
              title: 'Email Us',
              details: ['General: info@maharajapalace.com', 'Reservations: bookings@maharajapalace.com', 'Events: events@maharajapalace.com', 'Careers: careers@maharajapalace.com']
            }
          ].map((contact, index) => (
            <div
              key={index}
              className="bg-white p-8 text-center border border-gray-100 hover:shadow-xl transition-all duration-500 group"
            >
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {contact.icon}
              </div>
              <h3 className="text-2xl font-serif text-[#B8860B] mb-4">{contact.title}</h3>
              {contact.details.map((detail, idx) => (
                <p key={idx} className="text-gray-600 text-sm mb-1 leading-relaxed">
                  {detail}
                </p>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Contact Form */}
      <section className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle subtitle="We'd love to hear from you">
            Send Us a Message
          </SectionTitle>

          {submitted && (
            <div className="mb-8 p-6 bg-green-50 border-2 border-green-500 text-green-700 text-center">
              <p className="text-lg font-semibold">Thank you for contacting us!</p>
              <p className="mt-2">We'll get back to you within 24 hours.</p>
            </div>
          )}

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Full Name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                placeholder="Enter your name"
              />
              <Input
                label="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                placeholder="your.email@example.com"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Phone Number"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                error={errors.phone}
                placeholder="+91 98765 43210"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 focus:border-[#B8860B] focus:outline-none transition-colors"
                >
                  <option value="">Select a subject</option>
                  <option value="reservation">Room Reservation</option>
                  <option value="event">Event Booking</option>
                  <option value="dining">Restaurant Reservation</option>
                  <option value="general">General Inquiry</option>
                  <option value="feedback">Feedback</option>
                  <option value="other">Other</option>
                </select>
                {errors.subject && (
                  <p className="mt-1 text-sm text-red-600">{errors.subject}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={6}
                placeholder="Tell us how we can help you..."
                className="w-full px-4 py-3 border-2 border-gray-300 focus:border-[#B8860B] focus:outline-none transition-colors resize-none"
              />
              {errors.message && (
                <p className="mt-1 text-sm text-red-600">{errors.message}</p>
              )}
            </div>

            <div className="text-center">
              <Button variant="filled" size="lg" onClick={handleSubmit}>
                Send Message
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="h-[500px] relative overflow-hidden">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3423.0123456789!2d75.8573!3d30.9010!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDU0JzAzLjYiTiA3NcKwNTEnMjYuMyJF!5e0!3m2!1sen!2sin!4v1234567890"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Maharaja Palace Location"
        />
      </section>

      {/* Quick Links */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle subtitle="Looking for something specific?">
            Quick Links
          </SectionTitle>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {[
              { title: 'Book a Room', icon: '🛏️', link: '/rooms' },
              { title: 'Reserve a Table', icon: '🍽️', link: '/restaurant' },
              { title: 'Event Inquiry', icon: '🎉', link: '/banquet' },
              { title: 'View Gallery', icon: '📸', link: '/gallery' }
            ].map((item, index) => (
              <button
                key={index}
                onClick={() => window.location.href = item.link}
                className="group p-8 bg-[#faf9f6] border-2 border-transparent hover:border-[#B8860B] hover:bg-white transition-all duration-300"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <h4 className="text-lg font-serif text-[#B8860B] group-hover:text-[#8B6914]">
                  {item.title}
                </h4>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <SectionTitle subtitle="Find answers to common questions">
          Frequently Asked Questions
        </SectionTitle>

        <div className="space-y-6 mt-12">
          {[
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
          ].map((faq, index) => (
            <div key={index} className="bg-white p-6 border-l-4 border-[#B8860B]">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">{faq.q}</h4>
              <p className="text-gray-600 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};