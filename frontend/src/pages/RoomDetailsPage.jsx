import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { roomAPI } from "../api/api";
import {
  Calendar,
  Users,
  Bed,
  ChevronLeft,
  ChevronRight,
  Star,
  Check,
  AlertCircle,
  Wifi,
  Coffee,
  Tv,
  Wind,
  Phone,
  Shield,
  Droplets,
  Sparkles,
  UtensilsCrossed,
  Clock,
  Shirt,
  Bath,
  Armchair,
} from "lucide-react";

export const RoomDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [guests, setGuests] = useState(1);
  const [availabilityStatus, setAvailabilityStatus] = useState(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [availabilityError, setAvailabilityError] = useState(null);

  useEffect(() => {
    const fetchRoomType = async () => {
      try {
        const response = await roomAPI.getRoomTypes();
        const roomType = response.data.roomTypes.find((rt) => rt._id === id);
        if (roomType) {
          const roomDetails = getRoomDetails(roomType.name);
          setRoom({
            id: roomType._id,
            name: roomType.name,
            subtitle: getSubtitle(roomType.name),
            description: roomType.description,
            images: roomType.images?.map((img) => img.url) || [],
            price: roomType.basePrice,
            maxGuests: roomType.maxOccupancy,
            size: roomDetails.size,
            amenities: roomDetails.features,
            category: roomType.name.includes("Suite")
              ? "SUITE ROOM"
              : "ROOM CATEGORY",
          });
        }
      } catch (error) {
        console.error("Error fetching room:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRoomType();
  }, [id]);

  // Check availability when dates change
  useEffect(() => {
    const checkAvailability = async () => {
      if (!checkInDate || !checkOutDate || !id) {
        setAvailabilityStatus(null);
        return;
      }

      if (new Date(checkInDate) >= new Date(checkOutDate)) {
        setAvailabilityError("Check-out date must be after check-in date");
        setAvailabilityStatus(null);
        return;
      }

      setCheckingAvailability(true);
      setAvailabilityError(null);

      try {
        const response = await roomAPI.getAvailableRoomTypes(
          checkInDate,
          checkOutDate,
          guests
        );
        const availableRoomType = response.data.roomTypes.find(
          (rt) => rt._id === id
        );

        if (availableRoomType && availableRoomType.availableRooms > 0) {
          setAvailabilityStatus({
            available: true,
            roomsLeft: availableRoomType.availableRooms,
          });
          setAvailabilityError(null);
        } else {
          setAvailabilityStatus({
            available: false,
            roomsLeft: 0,
          });
          setAvailabilityError("No rooms available for selected dates");
        }
      } catch (error) {
        console.error("Error checking availability:", error);
        setAvailabilityError("Unable to check availability. Please try again.");
        setAvailabilityStatus(null);
      } finally {
        setCheckingAvailability(false);
      }
    };

    const debounceTimer = setTimeout(checkAvailability, 500);
    return () => clearTimeout(debounceTimer);
  }, [checkInDate, checkOutDate, guests, id]);

  const getSubtitle = (name) => {
    const subtitles = {
      "Maharaja Suite":
        "Step into timeless elegance where royal charm meets modern luxury",
      "Maharani Suite":
        "Graceful, elegant, and timeless — a sanctuary of regal femininity",
      "Yuvraj Suite":
        "Dynamic and stylish, blending youthful energy with refined heritage",
      "Executive Room":
        "Designed for comfort and convenience with subtle heritage charm",
      "Standard Room":
        "Compact yet inviting with tasteful heritage-inspired touches",
    };
    return subtitles[name] || "Luxury accommodation";
  };

  const getRoomDetails = (name) => {
    const details = {
      "Maharaja Suite": {
        size: "80 sq. m.",
        features: [
          { icon: "Wifi", text: "Complimentary High-Speed Wi-Fi" },
          { icon: "Coffee", text: "24/7 In-Room Dining Service" },
          { icon: "Tv", text: "65\" Smart TV with Premium Channels" },
          { icon: "Wind", text: "Individual Climate Control" },
          { icon: "Bath", text: "Marble Bathroom with Jacuzzi & Rain Shower" },
          { icon: "Sparkles", text: "Premium Toiletries & Bathrobes" },
          { icon: "UtensilsCrossed", text: "Complimentary Breakfast Included" },
          { icon: "Phone", text: "Dedicated Butler Service" },
          { icon: "Shirt", text: "Complimentary Laundry & Dry Cleaning" },
          { icon: "Shield", text: "In-Room Safe & Security" },
          { icon: "Armchair", text: "Separate Living & Dining Area" },
          { icon: "Droplets", text: "Premium Minibar with Beverages" },
          { icon: "Clock", text: "Express Check-in/Check-out" },
          { icon: "Sparkles", text: "Daily Housekeeping & Turndown Service" },
        ],
      },
      "Maharani Suite": {
        size: "75 sq. m.",
        features: [
          { icon: "Wifi", text: "Complimentary High-Speed Wi-Fi" },
          { icon: "Coffee", text: "24/7 In-Room Dining Service" },
          { icon: "Tv", text: "55\" Smart TV with Premium Channels" },
          { icon: "Wind", text: "Individual Climate Control" },
          { icon: "Bath", text: "Luxurious Marble Bathroom with Soaking Tub" },
          { icon: "Sparkles", text: "Premium Toiletries & Plush Bathrobes" },
          { icon: "UtensilsCrossed", text: "Complimentary Breakfast Included" },
          { icon: "Phone", text: "Personalized Butler Service" },
          { icon: "Shirt", text: "Complimentary Laundry Service" },
          { icon: "Shield", text: "Electronic Safe & Security" },
          { icon: "Armchair", text: "Elegant Sitting Area" },
          { icon: "Droplets", text: "Curated Minibar Selection" },
          { icon: "Clock", text: "Priority Check-in/Check-out" },
          { icon: "Sparkles", text: "Twice Daily Housekeeping" },
        ],
      },
      "Yuvraj Suite": {
        size: "64 sq. m.",
        features: [
          { icon: "Wifi", text: "Complimentary High-Speed Wi-Fi" },
          { icon: "Coffee", text: "24-Hour Room Service" },
          { icon: "Tv", text: "50\" Smart TV with Streaming Services" },
          { icon: "Wind", text: "Dual Zone Climate Control" },
          { icon: "Bath", text: "Designer Bathroom with Rain Shower" },
          { icon: "Sparkles", text: "Luxury Amenities & Bathrobes" },
          { icon: "UtensilsCrossed", text: "Complimentary Breakfast" },
          { icon: "Phone", text: "Concierge Service Available" },
          { icon: "Shirt", text: "Same-Day Laundry Service" },
          { icon: "Shield", text: "In-Room Safe" },
          { icon: "Armchair", text: "Comfortable Lounge Area" },
          { icon: "Droplets", text: "Well-Stocked Minibar" },
          { icon: "Clock", text: "Flexible Check-in/Check-out" },
          { icon: "Sparkles", text: "Daily Housekeeping Service" },
        ],
      },
      "Executive Room": {
        size: "32 sq. m.",
        features: [
          { icon: "Wifi", text: "Free High-Speed Wi-Fi" },
          { icon: "Coffee", text: "24-Hour Room Service" },
          { icon: "Tv", text: "43\" Smart TV with Cable Channels" },
          { icon: "Wind", text: "Air Conditioning & Heating" },
          { icon: "Bath", text: "Modern Bathroom with Walk-in Shower" },
          { icon: "Sparkles", text: "Premium Toiletries Provided" },
          { icon: "UtensilsCrossed", text: "Complimentary Breakfast" },
          { icon: "Phone", text: "24/7 Front Desk Service" },
          { icon: "Shirt", text: "Laundry & Ironing Service" },
          { icon: "Shield", text: "Electronic Safe" },
          { icon: "Armchair", text: "Work Desk & Seating Area" },
          { icon: "Droplets", text: "Minibar & Coffee/Tea Maker" },
          { icon: "Clock", text: "Express Services Available" },
          { icon: "Sparkles", text: "Daily Housekeeping" },
        ],
      },
      "Standard Room": {
        size: "22 sq. m.",
        features: [
          { icon: "Wifi", text: "Complimentary Wi-Fi Access" },
          { icon: "Coffee", text: "Room Service Available" },
          { icon: "Tv", text: "32\" LED TV with Satellite Channels" },
          { icon: "Wind", text: "Air Conditioning" },
          { icon: "Bath", text: "Private Bathroom with Shower" },
          { icon: "Sparkles", text: "Quality Toiletries & Towels" },
          { icon: "UtensilsCrossed", text: "Breakfast Available" },
          { icon: "Phone", text: "24-Hour Reception" },
          { icon: "Shirt", text: "Laundry Service on Request" },
          { icon: "Shield", text: "In-Room Safe" },
          { icon: "Armchair", text: "Comfortable Seating" },
          { icon: "Droplets", text: "Tea/Coffee Making Facilities" },
          { icon: "Clock", text: "Standard Check-in/Check-out" },
          { icon: "Sparkles", text: "Daily Housekeeping" },
        ],
      },
    };
    return details[name] || { size: "N/A", features: [] };
  };

  useEffect(() => {
    if (room) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % room.images.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [room]);

  const calculateNights = () => {
    if (!checkInDate || !checkOutDate) return 0;
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    return nights > 0 ? nights : 0;
  };

  const calculateTotal = () => {
    const nights = calculateNights();
    return nights * (room?.price || 0);
  };

  const handleBookNow = () => {
    if (!checkInDate || !checkOutDate) {
      alert("Please select check-in and check-out dates");
      return;
    }
    if (calculateNights() <= 0) {
      alert("Check-out date must be after check-in date");
      return;
    }
    if (!availabilityStatus || !availabilityStatus.available) {
      alert(
        "This room type is not available for the selected dates. Please choose different dates."
      );
      return;
    }
    navigate(
      `/booking?type=room&roomTypeId=${id}&checkIn=${checkInDate}&checkOut=${checkOutDate}&guests=${guests}&price=${room.price}`
    );
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % room.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + room.images.length) % room.images.length
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBF9F4] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#B8860B] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#B8860B] font-semibold">
            Loading room details...
          </p>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-[#FBF9F4] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-serif text-[#2a2a2a] mb-4">
            Room not found
          </h2>
          <button
            onClick={() => navigate("/rooms")}
            className="px-6 py-3 bg-[#B8860B] text-white rounded-lg hover:bg-[#8B6914] transition-colors"
          >
            Back to Rooms
          </button>
        </div>
      </div>
    );
  }

  const today = new Date().toISOString().split("T")[0];

  // Icon mapping function
  const getIcon = (iconName) => {
    const icons = {
      Wifi: <Wifi className="w-5 h-5" />,
      Coffee: <Coffee className="w-5 h-5" />,
      Tv: <Tv className="w-5 h-5" />,
      Wind: <Wind className="w-5 h-5" />,
      Bath: <Bath className="w-5 h-5" />,
      Sparkles: <Sparkles className="w-5 h-5" />,
      UtensilsCrossed: <UtensilsCrossed className="w-5 h-5" />,
      Phone: <Phone className="w-5 h-5" />,
      Shirt: <Shirt className="w-5 h-5" />,
      Shield: <Shield className="w-5 h-5" />,
      Armchair: <Armchair className="w-5 h-5" />,
      Droplets: <Droplets className="w-5 h-5" />,
      Clock: <Clock className="w-5 h-5" />,
    };
    return icons[iconName] || <Check className="w-5 h-5" />;
  };

  return (
    <div className="min-h-screen bg-[#FBF9F4]">
      {/* Hero Image Carousel */}
      <div className="relative h-[70vh] overflow-hidden">
        {room.images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`${room.name} ${index + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${index === currentImageIndex ? "opacity-100" : "opacity-0"
              }`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        {/* Navigation Arrows */}
        <button
          onClick={prevImage}
          className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all z-10"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextImage}
          className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all z-10"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Image Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {room.images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentImageIndex ? "bg-white w-8" : "bg-white/50"
                }`}
            />
          ))}
        </div>

        {/* Room Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
          <div className="max-w-7xl mx-auto">
            <p className="text-sm uppercase tracking-[0.3em] text-[#D4AF37] mb-2">
              {room.category}
            </p>
            <h1 className="text-5xl md:text-6xl font-serif text-white mb-2">
              {room.name}
            </h1>
            <p className="text-xl text-white/90 italic">{room.subtitle}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Description */}
            <div>
              <h2 className="text-3xl font-serif text-[#2a2a2a] mb-4">
                About This Room
              </h2>
              <p className="text-lg text-[#6a6a6a] leading-relaxed">
                {room.description}
              </p>
            </div>

            {/* Room Details */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 border border-[#B8860B]/20 shadow-sm">
                <Bed className="w-8 h-8 text-[#B8860B] mb-3" />
                <p className="text-sm text-[#6a6a6a]">Room Size</p>
                <p className="text-lg font-semibold text-[#2a2a2a]">
                  {room.size}
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 border border-[#B8860B]/20 shadow-sm">
                <Users className="w-8 h-8 text-[#B8860B] mb-3" />
                <p className="text-sm text-[#6a6a6a]">Max Guests</p>
                <p className="text-lg font-semibold text-[#2a2a2a]">
                  {room.maxGuests} Guests
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 border border-[#B8860B]/20 shadow-sm">
                <Star className="w-8 h-8 text-[#B8860B] mb-3" />
                <p className="text-sm text-[#6a6a6a]">Rating</p>
                <p className="text-lg font-semibold text-[#2a2a2a]">
                  5.0 ★★★★★
                </p>
              </div>
            </div>

            {/* Amenities & Features */}
            <div>
              <h2 className="text-3xl font-serif text-[#2a2a2a] mb-6">
                Room Amenities & Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {room.amenities.map((amenity, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 bg-white rounded-lg p-5 border border-[#B8860B]/10 hover:border-[#B8860B]/30 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#B8860B]/10 flex items-center justify-center text-[#B8860B]">
                      {getIcon(amenity.icon)}
                    </div>
                    <span className="text-[#2a2a2a] font-medium pt-2">{amenity.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-2xl shadow-xl border-2 border-[#B8860B]/20 p-8">
              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-bold text-[#B8860B]">
                    ₹{room.price.toLocaleString()}
                  </span>
                  <span className="text-[#6a6a6a]">/ night</span>
                </div>
                <p className="text-sm text-[#6a6a6a]">Exclusive of taxes</p>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-[#2a2a2a] mb-2">
                    Check-in Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B8860B]" />
                    <input
                      type="date"
                      min={today}
                      value={checkInDate}
                      onChange={(e) => setCheckInDate(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border-2 border-[#B8860B]/30 rounded-lg focus:border-[#B8860B] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#2a2a2a] mb-2">
                    Check-out Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B8860B]" />
                    <input
                      type="date"
                      min={checkInDate || today}
                      value={checkOutDate}
                      onChange={(e) => setCheckOutDate(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border-2 border-[#B8860B]/30 rounded-lg focus:border-[#B8860B] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#2a2a2a] mb-2">
                    Number of Guests
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B8860B]" />
                    <select
                      value={guests}
                      onChange={(e) => setGuests(parseInt(e.target.value))}
                      className="w-full pl-12 pr-4 py-3 border-2 border-[#B8860B]/30 rounded-lg focus:border-[#B8860B] focus:outline-none transition-colors appearance-none"
                    >
                      {[...Array(room.maxGuests)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1} Guest{i + 1 > 1 ? "s" : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Availability Status */}
              {checkInDate && checkOutDate && (
                <div className="mb-6">
                  {checkingAvailability ? (
                    <div className="flex items-center gap-2 text-sm text-[#6a6a6a] bg-gray-50 p-3 rounded-lg">
                      <div className="w-4 h-4 border-2 border-[#B8860B] border-t-transparent rounded-full animate-spin"></div>
                      <span>Checking availability...</span>
                    </div>
                  ) : availabilityError ? (
                    <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>{availabilityError}</span>
                    </div>
                  ) : availabilityStatus?.available ? (
                    <div className="flex items-start gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-lg border border-green-200">
                      <Check className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold">Available!</p>
                        <p className="text-xs text-green-600/80">
                          {availabilityStatus.roomsLeft} room
                          {availabilityStatus.roomsLeft > 1 ? "s" : ""} left for
                          these dates
                        </p>
                      </div>
                    </div>
                  ) : null}
                </div>
              )}

              {checkInDate &&
                checkOutDate &&
                calculateNights() > 0 &&
                availabilityStatus?.available && (
                  <div className="bg-[#B8860B]/5 rounded-lg p-4 mb-6 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#6a6a6a]">
                        ₹{room.price.toLocaleString()} × {calculateNights()}{" "}
                        night{calculateNights() > 1 ? "s" : ""}
                      </span>
                      <span className="font-semibold text-[#2a2a2a]">
                        ₹{calculateTotal().toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#6a6a6a]">Service fee</span>
                      <span className="font-semibold text-[#2a2a2a]">
                        ₹{Math.round(calculateTotal() * 0.1).toLocaleString()}
                      </span>
                    </div>
                    <div className="border-t border-[#B8860B]/20 pt-2 mt-2">
                      <div className="flex justify-between">
                        <span className="font-bold text-[#2a2a2a]">Total</span>
                        <span className="font-bold text-[#B8860B] text-xl">
                          ₹
                          {(
                            calculateTotal() +
                            Math.round(calculateTotal() * 0.1)
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

              <button
                onClick={handleBookNow}
                disabled={
                  !availabilityStatus?.available || checkingAvailability
                }
                className={`w-full py-4 font-bold rounded-lg transition-all duration-300 transform ${availabilityStatus?.available && !checkingAvailability
                  ? "bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-white hover:shadow-lg hover:scale-105"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
              >
                {checkingAvailability ? "Checking..." : "Book Now"}
              </button>

              <p className="text-xs text-center text-[#6a6a6a] mt-4">
                {availabilityStatus?.available
                  ? "You won't be charged yet"
                  : "Select dates to check availability"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
