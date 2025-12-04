import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { restaurantAPI } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { Calendar, Clock, Users, ChefHat, Check, ArrowLeft } from 'lucide-react';
import { showToast } from '../utils/toast';
import { CustomPaymentModal } from '../components/CustomPaymentModal';

const RestaurantBookingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);

  const [formData, setFormData] = useState({
    table: '',
    bookingDate: '',
    timeSlot: 'dinner',
    numberOfGuests: 2,
    specialDietaryRequirements: '',
    specialRequests: ''
  });

  const timeSlots = [
    { value: 'breakfast', label: 'Breakfast (7:00 AM - 10:30 AM)' },
    { value: 'lunch', label: 'Lunch (12:00 PM - 3:00 PM)' },
    { value: 'afternoon-tea', label: 'Afternoon Tea (3:00 PM - 5:00 PM)' },
    { value: 'dinner', label: 'Dinner (7:00 PM - 11:00 PM)' },
    { value: 'late-dinner', label: 'Late Dinner (11:00 PM - 1:00 AM)' }
  ];

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const response = await restaurantAPI.getAllTables();
      setTables(response.data.tables || []);
    } catch (error) {
      console.error('Error fetching tables:', error);
      showToast('Failed to load tables', 'error');
    } finally {
      setLoading(false);
    }
  };

  const [bookingType, setBookingType] = useState('full');

  const calculatePayableAmount = () => {
    const pricePerGuest = 500;
    const total = formData.numberOfGuests * pricePerGuest;
    if (bookingType === 'partial') {
      return Math.round(total * 0.10);
    }
    return total;
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!formData.table || !formData.bookingDate) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    setSubmitting(true);

    try {
      const payableAmount = calculatePayableAmount();
      const pricePerGuest = 500;
      const totalAmount = formData.numberOfGuests * pricePerGuest;

      const response = await restaurantAPI.createBooking({
        ...formData,
        bookingType,
        paidAmount: payableAmount,
        totalPrice: totalAmount
      });

      setCurrentBooking(response.data.booking);
      setShowPaymentModal(true);
    } catch (error) {
      console.error('Booking creation failed:', error);
      showToast(error.response?.data?.message || 'Booking failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTestPaymentComplete = async () => {
    try {
      const markResp = await restaurantAPI.markAsPaid(currentBooking._id);
      if (markResp?.data?.success) {
        setShowPaymentModal(false);
        showToast('Restaurant booking confirmed!', 'success');
        setTimeout(() => navigate('/dashboard'), 1500);
      } else {
        throw new Error(markResp?.data?.message || 'Failed to mark booking as paid');
      }
    } catch (error) {
      console.error('Payment error:', error);
      showToast('Payment failed', 'error');
      setShowPaymentModal(false);
    }
  };


  const selectedTable = tables.find(t => t._id === formData.table);
  const pricePerGuest = 500;
  const totalPrice = formData.numberOfGuests * pricePerGuest;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FAF8F3] to-[#F5F1E8] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#D4AF37] font-semibold">Loading tables...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF8F3] to-[#F5F1E8] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <button
          onClick={() => navigate('/restaurant')}
          className="flex items-center gap-2 text-gray-600 hover:text-[#D4AF37] transition-colors mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Restaurants
        </button>

        <div className="text-center mb-12">
          <div className="w-20 h-[2px] bg-[#D4AF37] mx-auto mb-6"></div>
          <h1 className="text-5xl font-serif text-[#0B1A33] mb-4">Reserve Your Table</h1>
          <p className="text-xl text-gray-600">Experience culinary excellence at Maharaja Palace</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handlePayment} className="bg-white rounded-2xl shadow-2xl p-8 space-y-8">
              {/* Guest Information */}
              <div>
                <h3 className="text-2xl font-serif text-[#0B1A33] mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  Guest Information
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

              {/* Booking Details */}
              <div>
                <h3 className="text-2xl font-serif text-[#0B1A33] mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
                    <ChefHat className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  Reservation Details
                </h3>

                <div className="space-y-6">
                  {/* Table Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Select Table <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.table}
                      onChange={(e) => setFormData({ ...formData, table: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all"
                      required
                    >
                      <option value="">Choose a table...</option>
                      {tables.map(table => (
                        <option key={table._id} value={table._id}>
                          Table {table.tableNumber} - {table.location} (Capacity: {table.capacity})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Date and Time */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Calendar className="w-4 h-4 inline mr-2" />
                        Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={formData.bookingDate}
                        onChange={(e) => setFormData({ ...formData, bookingDate: e.target.value })}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Clock className="w-4 h-4 inline mr-2" />
                        Time Slot <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.timeSlot}
                        onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all"
                        required
                      >
                        {timeSlots.map(slot => (
                          <option key={slot.value} value={slot.value}>
                            {slot.icon} {slot.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Number of Guests */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Users className="w-4 h-4 inline mr-2" />
                      Number of Guests <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.numberOfGuests}
                      onChange={(e) => setFormData({ ...formData, numberOfGuests: parseInt(e.target.value) })}
                      min="1"
                      max={selectedTable?.capacity || 10}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all"
                      required
                    />
                    {selectedTable && (
                      <p className="text-sm text-gray-500 mt-2">
                        Maximum capacity: {selectedTable.capacity} guests
                      </p>
                    )}
                  </div>

                  {/* Dietary Requirements */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Dietary Requirements
                    </label>
                    <input
                      type="text"
                      value={formData.specialDietaryRequirements}
                      onChange={(e) => setFormData({ ...formData, specialDietaryRequirements: e.target.value })}
                      placeholder="e.g., Vegetarian, Vegan, Gluten-free, Allergies..."
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all"
                    />
                  </div>

                  {/* Special Requests */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Special Requests
                    </label>
                    <textarea
                      value={formData.specialRequests}
                      onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                      placeholder="Any special requests or occasions we should know about..."
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
                    Proceed to Pay ₹{calculatePayableAmount().toLocaleString()}
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-2xl p-8 sticky top-24">
              <h3 className="text-2xl font-serif text-[#0B1A33] mb-6">Reservation Summary</h3>

              <div className="space-y-4 mb-6">
                {selectedTable && (
                  <div className="pb-4 border-b border-gray-200">
                    <p className="text-sm text-gray-500 mb-1">Table</p>
                    <p className="text-lg font-semibold text-gray-800">
                      Table {selectedTable.tableNumber}
                    </p>
                    <p className="text-sm text-gray-600">{selectedTable.location}</p>
                  </div>
                )}

                {formData.bookingDate && (
                  <div className="pb-4 border-b border-gray-200">
                    <p className="text-sm text-gray-500 mb-1">Date</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {new Date(formData.bookingDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                )}

                <div className="pb-4 border-b border-gray-200">
                  <p className="text-sm text-gray-500 mb-1">Time Slot</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {timeSlots.find(s => s.value === formData.timeSlot)?.label}
                  </p>
                </div>

                <div className="pb-4 border-b border-gray-200">
                  <p className="text-sm text-gray-500 mb-1">Guests</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {formData.numberOfGuests} {formData.numberOfGuests === 1 ? 'Guest' : 'Guests'}
                  </p>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="bg-gradient-to-br from-[#FAF8F3] to-[#F5F1E8] rounded-lg p-6 space-y-3 mb-6">
                {/* Payment Option Selection */}
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Payment Option</p>
                  <div className="space-y-2">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="bookingType"
                        value="full"
                        checked={bookingType === 'full'}
                        onChange={(e) => setBookingType('full')}
                        className="w-4 h-4 text-[#D4AF37] focus:ring-[#D4AF37]"
                      />
                      <span className="ml-2 text-sm text-gray-700">Full Payment</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="bookingType"
                        value="partial"
                        checked={bookingType === 'partial'}
                        onChange={(e) => setBookingType('partial')}
                        className="w-4 h-4 text-[#D4AF37] focus:ring-[#D4AF37]"
                      />
                      <span className="ml-2 text-sm text-gray-700">Booking Amount (10%)</span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Reservation Fee</span>
                  <span className="font-semibold">₹500 / guest</span>
                </div>

                <div className="pt-3 border-t-2 border-[#D4AF37]">
                  <div className="flex justify-between mb-2">
                    <span className="font-bold text-gray-800">Total Amount</span>
                    <span className="font-bold text-xl text-gray-800">
                      ₹{totalPrice.toLocaleString()}
                    </span>
                  </div>

                  {bookingType === 'partial' ? (
                    <>
                      <div className="flex justify-between text-[#D4AF37]">
                        <span className="font-bold">Payable Now (10%)</span>
                        <span className="font-bold text-2xl">
                          ₹{Math.round(totalPrice * 0.1).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-500 mt-1">
                        <span>Due Later</span>
                        <span>₹{(totalPrice - Math.round(totalPrice * 0.1)).toLocaleString()}</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between text-[#D4AF37]">
                      <span className="font-bold">Payable Now</span>
                      <span className="font-bold text-2xl">
                        ₹{totalPrice.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-[#D4AF37]" />
                  Complimentary welcome drinks
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-[#D4AF37]" />
                  Priority seating
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-[#D4AF37]" />
                  Dedicated service staff
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      <CustomPaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        amount={calculatePayableAmount()}
        bookingDetails={{
          bookingNumber: currentBooking?.bookingNumber,
          roomType: `Table ${selectedTable?.tableNumber}`,
          checkIn: formData.bookingDate,
          checkOut: formData.bookingDate,
        }}
        onTestComplete={handleTestPaymentComplete}
      />
    </div>

  );
};

export default RestaurantBookingPage;
