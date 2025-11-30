import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { banquetAPI } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { Calendar, Users, Sparkles, Check, ArrowLeft, IndianRupee } from 'lucide-react';
import { showToast } from '../utils/toast';

const BanquetBookingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const hallId = searchParams.get('hallId');
  
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    banquetHall: hallId || '',
    eventDate: '',
    eventType: 'wedding',
    expectedGuests: 100,
    setupType: 'banquet',
    hallRate: 0,
    specialRequirements: ''
  });

  const eventTypes = [
    { value: 'wedding', label: 'Wedding', icon: '💑', desc: 'Celebrate your special day' },
    { value: 'conference', label: 'Conference', icon: '💼', desc: 'Professional meetings' },
    { value: 'party', label: 'Party', icon: '🎉', desc: 'Social celebrations' },
    { value: 'corporate', label: 'Corporate Event', icon: '🏢', desc: 'Business gatherings' },
    { value: 'other', label: 'Other', icon: '✨', desc: 'Custom events' }
  ];

  const setupTypes = [
    { value: 'theater', label: 'Theater Style', icon: '🎭', desc: 'Rows of chairs facing stage' },
    { value: 'cocktail', label: 'Cocktail Style', icon: '🍸', desc: 'Standing reception' },
    { value: 'banquet', label: 'Banquet Style', icon: '🍽️', desc: 'Seated dining' }
  ];

  useEffect(() => {
    fetchHalls();
  }, []);

  useEffect(() => {
    if (formData.banquetHall) {
      const selectedHall = halls.find(h => h._id === formData.banquetHall);
      if (selectedHall) {
        setFormData(prev => ({ ...prev, hallRate: selectedHall.basePrice || 0 }));
      }
    }
  }, [formData.banquetHall, halls]);

  const fetchHalls = async () => {
    try {
      const response = await banquetAPI.getAllHalls();
      setHalls(response.data.banquetHalls || []);
    } catch (error) {
      console.error('Error fetching halls:', error);
      showToast('Failed to load banquet halls', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.banquetHall || !formData.eventDate) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    setSubmitting(true);
    try {
      await banquetAPI.createBooking(formData);
      showToast('Banquet booking created successfully!', 'success');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (error) {
      console.error('Booking error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const selectedHall = halls.find(h => h._id === formData.banquetHall);
  const serviceFee = formData.hallRate * 0.10;
  const gst = formData.hallRate * 0.12;
  const totalPrice = formData.hallRate + serviceFee + gst;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FAF8F3] to-[#F5F1E8] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#D4AF37] font-semibold">Loading banquet halls...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF8F3] to-[#F5F1E8] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <button
          onClick={() => navigate('/banquet')}
          className="flex items-center gap-2 text-gray-600 hover:text-[#D4AF37] transition-colors mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Banquet Halls
        </button>

        <div className="text-center mb-12">
          <div className="w-20 h-[2px] bg-[#D4AF37] mx-auto mb-6"></div>
          <h1 className="text-5xl font-serif text-[#0B1A33] mb-4">Book Your Event</h1>
          <p className="text-xl text-gray-600">Create unforgettable memories at Maharaja Palace</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl p-8 space-y-8">
              {/* Guest Information */}
              <div>
                <h3 className="text-2xl font-serif text-[#0B1A33] mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      value={`${user?.firstName || ''} ${user?.lastName || ''}`}
                      disabled
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Event Details */}
              <div>
                <h3 className="text-2xl font-serif text-[#0B1A33] mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  Event Details
                </h3>

                <div className="space-y-6">
                  {/* Hall Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Select Banquet Hall <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.banquetHall}
                      onChange={(e) => setFormData({ ...formData, banquetHall: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all"
                      required
                    >
                      <option value="">Choose a hall...</option>
                      {halls.map(hall => (
                        <option key={hall._id} value={hall._id}>
                          {hall.name} - Capacity: {hall.capacity?.theater || hall.capacity?.banquet || 'N/A'}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Event Type */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Event Type <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {eventTypes.map(type => (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, eventType: type.value })}
                          className={`p-4 border-2 rounded-lg transition-all ${
                            formData.eventType === type.value
                              ? 'border-[#D4AF37] bg-[#D4AF37]/5 shadow-lg'
                              : 'border-gray-200 hover:border-[#D4AF37]/50'
                          }`}
                        >
                          <div className="text-3xl mb-2">{type.icon}</div>
                          <div className="text-sm font-semibold text-gray-800">{type.label}</div>
                          <div className="text-xs text-gray-500 mt-1">{type.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Date and Guests */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Calendar className="w-4 h-4 inline mr-2" />
                        Event Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={formData.eventDate}
                        onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Users className="w-4 h-4 inline mr-2" />
                        Expected Guests <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={formData.expectedGuests}
                        onChange={(e) => setFormData({ ...formData, expectedGuests: parseInt(e.target.value) })}
                        min="1"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all"
                        required
                      />
                    </div>
                  </div>

                  {/* Setup Type */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Setup Type <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {setupTypes.map(setup => (
                        <button
                          key={setup.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, setupType: setup.value })}
                          className={`p-4 border-2 rounded-lg transition-all ${
                            formData.setupType === setup.value
                              ? 'border-[#D4AF37] bg-[#D4AF37]/5 shadow-lg'
                              : 'border-gray-200 hover:border-[#D4AF37]/50'
                          }`}
                        >
                          <div className="text-3xl mb-2">{setup.icon}</div>
                          <div className="text-sm font-semibold text-gray-800">{setup.label}</div>
                          <div className="text-xs text-gray-500 mt-1">{setup.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Special Requirements */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Special Requirements
                    </label>
                    <textarea
                      value={formData.specialRequirements}
                      onChange={(e) => setFormData({ ...formData, specialRequirements: e.target.value })}
                      placeholder="Any special requirements, decorations, or services you need..."
                      rows="4"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-[#D4AF37] to-[#B8960C] text-white py-4 rounded-lg font-semibold text-lg hover:shadow-2xl hover:shadow-[#D4AF37]/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    Confirm Booking
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-2xl p-8 sticky top-24">
              <h3 className="text-2xl font-serif text-[#0B1A33] mb-6">Booking Summary</h3>
              
              <div className="space-y-4 mb-6">
                {selectedHall && (
                  <div className="pb-4 border-b border-gray-200">
                    <p className="text-sm text-gray-500 mb-1">Banquet Hall</p>
                    <p className="text-lg font-semibold text-gray-800">{selectedHall.name}</p>
                  </div>
                )}

                {formData.eventDate && (
                  <div className="pb-4 border-b border-gray-200">
                    <p className="text-sm text-gray-500 mb-1">Event Date</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {new Date(formData.eventDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                )}

                <div className="pb-4 border-b border-gray-200">
                  <p className="text-sm text-gray-500 mb-1">Event Type</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {eventTypes.find(t => t.value === formData.eventType)?.label}
                  </p>
                </div>

                <div className="pb-4 border-b border-gray-200">
                  <p className="text-sm text-gray-500 mb-1">Expected Guests</p>
                  <p className="text-lg font-semibold text-gray-800">{formData.expectedGuests}</p>
                </div>

                <div className="pb-4 border-b border-gray-200">
                  <p className="text-sm text-gray-500 mb-1">Setup Type</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {setupTypes.find(s => s.value === formData.setupType)?.label}
                  </p>
                </div>
              </div>

              {/* Price Breakdown */}
              {formData.hallRate > 0 && (
                <div className="bg-gradient-to-br from-[#FAF8F3] to-[#F5F1E8] rounded-lg p-6 space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Hall Rate</span>
                    <span className="font-semibold flex items-center">
                      <IndianRupee className="w-4 h-4" />
                      {formData.hallRate.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Service Fee (10%)</span>
                    <span className="font-semibold flex items-center">
                      <IndianRupee className="w-4 h-4" />
                      {serviceFee.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">GST (12%)</span>
                    <span className="font-semibold flex items-center">
                      <IndianRupee className="w-4 h-4" />
                      {gst.toLocaleString()}
                    </span>
                  </div>
                  <div className="pt-3 border-t-2 border-[#D4AF37] flex justify-between">
                    <span className="font-bold text-gray-800">Total Amount</span>
                    <span className="font-bold text-2xl text-[#D4AF37] flex items-center">
                      <IndianRupee className="w-5 h-5" />
                      {totalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-[#D4AF37]" />
                  Dedicated event coordinator
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-[#D4AF37]" />
                  Professional audio-visual setup
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-[#D4AF37]" />
                  Complimentary valet parking
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BanquetBookingPage;
