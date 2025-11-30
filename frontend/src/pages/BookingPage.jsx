import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { bookingAPI, roomAPI } from '../api/api';
import { Calendar, Users, CreditCard, Check, AlertCircle, Loader } from 'lucide-react';

export const BookingPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const roomTypeId = searchParams.get('roomTypeId');
  const checkIn = searchParams.get('checkIn');
  const checkOut = searchParams.get('checkOut');
  const guestsParam = searchParams.get('guests');
  const priceParam = searchParams.get('price');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [roomType, setRoomType] = useState(null);
  const [availableRoom, setAvailableRoom] = useState(null);

  const [formData, setFormData] = useState({
    checkInDate: checkIn || '',
    checkOutDate: checkOut || '',
    numberOfGuests: parseInt(guestsParam) || 1,
    specialRequests: '',
  });

  const roomRate = parseInt(priceParam) || roomType?.basePrice || 0;

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        // Fetch room type details
        const roomTypesResponse = await roomAPI.getRoomTypes();
        const selectedRoomType = roomTypesResponse.data.roomTypes.find(rt => rt._id === roomTypeId);
        setRoomType(selectedRoomType);

        // Fetch available rooms of this type
        const availableResponse = await roomAPI.getAvailableRooms({
          checkIn: formData.checkInDate,
          checkOut: formData.checkOutDate,
          guests: formData.numberOfGuests,
        });
        
        // Find first available room of this type
        const room = availableResponse.data.rooms.find(r => r.roomType._id === roomTypeId);
        setAvailableRoom(room);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching room data:', error);
        setError('Failed to load room details');
        setLoading(false);
      }
    };

    if (roomTypeId) {
      fetchRoomData();
    }
  }, [roomTypeId, formData.checkInDate, formData.checkOutDate, formData.numberOfGuests]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/booking?${searchParams.toString()}` } });
    }
  }, [isAuthenticated, navigate, searchParams]);

  const calculateNights = () => {
    if (!formData.checkInDate || !formData.checkOutDate) return 0;
    const checkInDate = new Date(formData.checkInDate);
    const checkOutDate = new Date(formData.checkOutDate);
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    return nights > 0 ? nights : 0;
  };

  const calculateSubtotal = () => calculateNights() * roomRate;
  const calculateServiceFee = () => Math.round(calculateSubtotal() * 0.1);
  const calculateTax = () => Math.round(calculateSubtotal() * 0.12); // 12% GST
  const calculateTotal = () => calculateSubtotal() + calculateServiceFee() + calculateTax();

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setPaymentProcessing(true);
    setError('');

    try {
      if (!availableRoom) {
        throw new Error('No available rooms found for selected dates');
      }

      // Create booking first
      const bookingResponse = await bookingAPI.createBooking({
        room: availableRoom._id,
        checkInDate: formData.checkInDate,
        checkOutDate: formData.checkOutDate,
        numberOfGuests: formData.numberOfGuests,
        roomRate: roomRate,
        specialRequests: formData.specialRequests,
      });

      const booking = bookingResponse.data.booking;

      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Razorpay SDK failed to load');
      }

      const totalAmount = calculateTotal();

      // Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_YOUR_KEY_HERE',
        amount: totalAmount * 100,
        currency: 'INR',
        name: 'Maharaja Palace',
        description: `${roomType?.name} - ${calculateNights()} nights`,
        image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=200',
        handler: async function (response) {
          console.log('Payment successful:', response);
          setPaymentProcessing(false);
          setSuccess(true);
          setTimeout(() => navigate('/dashboard'), 2000);
        },
        prefill: {
          name: `${user?.firstName} ${user?.lastName}`,
          email: user?.email,
          contact: user?.phone || '',
        },
        notes: {
          booking_id: booking._id,
          room_type: roomType?.name,
        },
        theme: {
          color: '#B8860B',
        },
        modal: {
          ondismiss: function() {
            setPaymentProcessing(false);
            setError('Payment cancelled');
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
      setPaymentProcessing(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Booking failed');
      setPaymentProcessing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (calculateNights() <= 0) {
      setError('Check-out date must be after check-in date');
      return;
    }

    await handlePayment();
  };

  if (!isAuthenticated) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBF9F4] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#B8860B] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#B8860B] font-semibold">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (!roomType || !availableRoom) {
    return (
      <div className="min-h-screen bg-[#FBF9F4] flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-3xl font-serif text-[#2a2a2a] mb-4">No Rooms Available</h2>
          <p className="text-[#6a6a6a] mb-6">Sorry, no rooms are available for the selected dates. Please try different dates.</p>
          <button onClick={() => navigate('/rooms')} className="px-8 py-3 bg-[#B8860B] text-white rounded-lg hover:bg-[#8B6914] transition-colors">
            Back to Rooms
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#FBF9F4] flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-serif text-[#2a2a2a] mb-4">Booking Confirmed!</h2>
          <p className="text-[#6a6a6a] mb-6">Your payment was successful. Redirecting to dashboard...</p>
          <div className="w-12 h-12 border-4 border-[#B8860B] border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBF9F4] py-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-serif text-[#2a2a2a] mb-4">Complete Your Booking</h1>
          <p className="text-lg text-[#6a6a6a]">You're just one step away from your royal experience</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg border border-[#B8860B]/20 p-8 space-y-8">
              {/* Room Details */}
              <div className="border-b border-[#B8860B]/20 pb-6">
                <h2 className="text-2xl font-serif text-[#2a2a2a] mb-4">Room Details</h2>
                <div className="bg-[#B8860B]/5 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-[#B8860B] mb-2">{roomType?.name}</h3>
                  <p className="text-[#6a6a6a]">₹{roomRate.toLocaleString()} per night</p>
                  <p className="text-sm text-[#8a8a8a] mt-2">Room: {availableRoom?.roomNumber}</p>
                </div>
              </div>

              {/* Guest Information */}
              <div className="border-b border-[#B8860B]/20 pb-6">
                <h2 className="text-2xl font-serif text-[#2a2a2a] mb-4">Guest Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#2a2a2a] mb-2">First Name</label>
                    <input
                      type="text"
                      value={user?.firstName || ''}
                      disabled
                      className="w-full px-4 py-3 border-2 border-[#B8860B]/20 rounded-lg bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#2a2a2a] mb-2">Last Name</label>
                    <input
                      type="text"
                      value={user?.lastName || ''}
                      disabled
                      className="w-full px-4 py-3 border-2 border-[#B8860B]/20 rounded-lg bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#2a2a2a] mb-2">Email</label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="w-full px-4 py-3 border-2 border-[#B8860B]/20 rounded-lg bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#2a2a2a] mb-2">Phone</label>
                    <input
                      type="tel"
                      value={user?.phone || ''}
                      disabled
                      className="w-full px-4 py-3 border-2 border-[#B8860B]/20 rounded-lg bg-gray-50"
                    />
                  </div>
                </div>
              </div>

              {/* Booking Dates */}
              <div className="border-b border-[#B8860B]/20 pb-6">
                <h2 className="text-2xl font-serif text-[#2a2a2a] mb-4">Booking Dates</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#2a2a2a] mb-2">Check-in Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B8860B]" />
                      <input
                        type="date"
                        required
                        value={formData.checkInDate}
                        onChange={(e) => setFormData({ ...formData, checkInDate: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 border-2 border-[#B8860B]/30 rounded-lg focus:border-[#B8860B] focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#2a2a2a] mb-2">Check-out Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B8860B]" />
                      <input
                        type="date"
                        required
                        value={formData.checkOutDate}
                        onChange={(e) => setFormData({ ...formData, checkOutDate: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 border-2 border-[#B8860B]/30 rounded-lg focus:border-[#B8860B] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Number of Guests */}
              <div className="border-b border-[#B8860B]/20 pb-6">
                <h2 className="text-2xl font-serif text-[#2a2a2a] mb-4">Number of Guests</h2>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B8860B]" />
                  <input
                    type="number"
                    min="1"
                    max="10"
                    required
                    value={formData.numberOfGuests}
                    onChange={(e) => setFormData({ ...formData, numberOfGuests: parseInt(e.target.value) })}
                    className="w-full pl-12 pr-4 py-3 border-2 border-[#B8860B]/30 rounded-lg focus:border-[#B8860B] focus:outline-none"
                  />
                </div>
              </div>

              {/* Special Requests */}
              <div>
                <h2 className="text-2xl font-serif text-[#2a2a2a] mb-4">Special Requests (Optional)</h2>
                <textarea
                  rows="4"
                  placeholder="Any special requirements or preferences..."
                  value={formData.specialRequests}
                  onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-[#B8860B]/30 rounded-lg focus:border-[#B8860B] focus:outline-none resize-none"
                ></textarea>
              </div>

              {error && (
                <div className="flex items-center gap-3 bg-red-50 border-2 border-red-200 rounded-lg p-4">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <p className="text-red-700">{error}</p>
                </div>
              )}
            </form>
          </div>

          {/* Price Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-2xl shadow-xl border-2 border-[#B8860B]/20 p-8">
              <h2 className="text-2xl font-serif text-[#2a2a2a] mb-6">Price Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-[#6a6a6a]">
                  <span>₹{roomRate.toLocaleString()} × {calculateNights()} night{calculateNights() !== 1 ? 's' : ''}</span>
                  <span className="font-semibold text-[#2a2a2a]">₹{calculateSubtotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#6a6a6a]">
                  <span>Service fee</span>
                  <span className="font-semibold text-[#2a2a2a]">₹{calculateServiceFee().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#6a6a6a]">
                  <span>GST (12%)</span>
                  <span className="font-semibold text-[#2a2a2a]">₹{calculateTax().toLocaleString()}</span>
                </div>
              </div>

              <div className="border-t-2 border-[#B8860B]/20 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-[#2a2a2a]">Total</span>
                  <span className="text-3xl font-bold text-[#B8860B]">₹{calculateTotal().toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={paymentProcessing || calculateNights() <= 0}
                className="w-full py-4 bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-white font-bold rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {paymentProcessing ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    Proceed to Payment
                  </>
                )}
              </button>

              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-2 text-sm text-[#6a6a6a]">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Free cancellation within 24 hours</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#6a6a6a]">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Secure payment via Razorpay</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#6a6a6a]">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Instant booking confirmation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
};
