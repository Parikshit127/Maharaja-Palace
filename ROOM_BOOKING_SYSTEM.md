# Room Booking System with Razorpay Integration

## Overview
Complete room booking system with detailed room pages, date selection, pricing calculation, and Razorpay payment gateway integration.

## Features Implemented

### 1. **Enhanced Room Details Page** (`/rooms/:id`)

#### Visual Features
- **Image Carousel**: Auto-rotating images with manual navigation
- **Hero Section**: Full-screen image display with overlay
- **Navigation Arrows**: Previous/Next image controls
- **Image Indicators**: Dots showing current image position
- **Responsive Design**: Mobile-friendly layout

#### Room Information Display
- Room name and subtitle
- Detailed description
- Room size (sq ft)
- Maximum guests capacity
- 5-star rating display
- Comprehensive amenities list with checkmarks

#### Booking Widget (Sticky Sidebar)
- **Price Display**: Per night rate with currency formatting
- **Date Selection**:
  - Check-in date picker (min: today)
  - Check-out date picker (min: check-in date)
  - Calendar icons for visual clarity
- **Guest Selection**: Dropdown limited to room's max capacity
- **Price Breakdown**:
  - Subtotal calculation (rate × nights)
  - Service fee (10%)
  - Total with formatting
- **Book Now Button**: Passes all data to booking page

#### Room Types Available
1. **KHWABGAH (Penthouse)** - ₹25,000/night
   - 2500 sq ft, 4 guests max
   - 2 bedrooms, living room, dining, bar, butler, office, terrace

2. **PRESIDENTIAL SUITE** - ₹18,000/night
   - 1800 sq ft, 3 guests max
   - 1 bedroom, living area, luxury amenities

3. **HERITAGE SUITES** - ₹12,000/night
   - 1200 sq ft, 2 guests max
   - 1 bedroom, opulent furnishings

4. **CLUB ROYAL ROOMS** - ₹8,000/night
   - 800 sq ft, 2 guests max
   - Well-appointed with modern amenities

5. **CLUB ROOMS** - ₹6,000/night
   - 600 sq ft, 2 guests max
   - Comfortable and elegant

### 2. **Complete Booking Page** (`/booking`)

#### Guest Information Section
- Auto-filled from logged-in user
- First name, last name, email, phone
- Read-only fields (pre-populated)

#### Booking Details Section
- **Room Information**: Name and price display
- **Date Selection**: 
  - Check-in and check-out date pickers
  - Calendar icons
  - Validation for date logic
- **Guest Count**: Number input with min/max validation
- **Special Requests**: Optional textarea for preferences

#### Price Summary (Sticky Sidebar)
- **Breakdown Display**:
  - Room rate × number of nights
  - Service fee (10%)
  - GST (12%)
  - **Total Amount** in large, bold text
- **Benefits Listed**:
  - Free cancellation within 24 hours
  - Secure payment via Razorpay
  - Instant booking confirmation

#### Payment Integration
- **Razorpay Payment Gateway**
- **Payment Button**: "Pay with Razorpay" with credit card icon
- **Loading State**: Shows spinner during processing
- **Success State**: Confirmation message with redirect

### 3. **Razorpay Integration**

#### Implementation Details
```javascript
// Script Loading
- Dynamically loads Razorpay SDK
- Handles script load failures

// Payment Options
- Key: Razorpay test/live key
- Amount: In paise (₹ × 100)
- Currency: INR
- Name: Maharaja Palace
- Description: Room details
- Prefill: User information
- Theme: Brand color (#B8860B)
- Notes: Booking metadata

// Payment Flow
1. User clicks "Pay with Razorpay"
2. Creates booking in database
3. Opens Razorpay modal
4. User completes payment
5. Payment verification (to be implemented on backend)
6. Success confirmation
7. Redirect to dashboard
```

#### Configuration Required
```javascript
// In BookingPage.jsx, line ~120
key: 'rzp_test_xxxxx', // Replace with your Razorpay key

// In backend/.env
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

### 4. **Price Calculation System**

#### Formula
```
Subtotal = Room Rate × Number of Nights
Service Fee = Subtotal × 10%
GST = Subtotal × 12%
Total = Subtotal + Service Fee + GST
```

#### Example Calculation
```
Room: Presidential Suite (₹18,000/night)
Nights: 3
Guests: 2

Subtotal: ₹18,000 × 3 = ₹54,000
Service Fee: ₹54,000 × 10% = ₹5,400
GST: ₹54,000 × 12% = ₹6,480
Total: ₹65,880
```

### 5. **Data Flow**

#### Room Details → Booking Page
```
URL Parameters:
- roomType: Room identifier (khwabgah, presidential, etc.)
- checkIn: Selected check-in date
- checkOut: Selected check-out date
- guests: Number of guests
- price: Room rate per night
```

#### Booking Page → Backend API
```javascript
POST /api/bookings
{
  room: roomType,
  checkInDate: "2024-01-15",
  checkOutDate: "2024-01-18",
  numberOfGuests: 2,
  roomRate: 18000,
  specialRequests: "Late check-in please"
}
```

#### Backend Response
```javascript
{
  success: true,
  message: "Booking created successfully",
  booking: {
    _id: "...",
    bookingNumber: "BK-1234567890-5678",
    guest: {...},
    room: {...},
    checkInDate: "2024-01-15",
    checkOutDate: "2024-01-18",
    numberOfNights: 3,
    numberOfGuests: 2,
    roomRate: 18000,
    totalPrice: 54000,
    status: "pending",
    paymentStatus: "pending"
  }
}
```

## User Journey

### 1. Browse Rooms
- User visits `/rooms`
- Views all room categories
- Clicks "Book Now" on desired room

### 2. View Room Details
- Redirected to `/rooms/:roomType`
- Views images, amenities, pricing
- Selects check-in/out dates
- Selects number of guests
- Sees price calculation
- Clicks "Book Now"

### 3. Complete Booking
- Redirected to `/booking` with parameters
- Reviews booking details
- Sees price breakdown
- Adds special requests (optional)
- Clicks "Pay with Razorpay"

### 4. Payment
- Razorpay modal opens
- User enters payment details
- Completes payment
- Receives confirmation

### 5. Confirmation
- Success message displayed
- Booking saved to database
- Redirected to dashboard
- Can view booking details

## Setup Instructions

### 1. Install Razorpay
No npm package needed - script loaded dynamically

### 2. Get Razorpay Credentials
1. Sign up at https://razorpay.com
2. Get Test/Live API keys
3. Add to environment variables

### 3. Update Configuration

**Frontend** (`frontend/src/pages/BookingPage.jsx`):
```javascript
key: 'YOUR_RAZORPAY_KEY_ID', // Line ~120
```

**Backend** (`backend/.env`):
```
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=your_secret_key
```

### 4. Test Payment
Use Razorpay test cards:
- Card: 4111 1111 1111 1111
- CVV: Any 3 digits
- Expiry: Any future date

## Backend Integration Points

### Required API Endpoints

#### 1. Create Booking
```
POST /api/bookings
Headers: Authorization: Bearer <token>
Body: {
  room, checkInDate, checkOutDate,
  numberOfGuests, roomRate, specialRequests
}
```

#### 2. Verify Payment (To Implement)
```
POST /api/bookings/:id/verify-payment
Body: {
  razorpay_payment_id,
  razorpay_order_id,
  razorpay_signature
}
```

#### 3. Get Room Details (Optional)
```
GET /api/rooms/:id
Response: Room details with pricing
```

## Security Considerations

### 1. Payment Verification
- **Current**: Client-side only (for demo)
- **Production**: Must verify on backend
- Implement signature verification
- Use Razorpay webhooks

### 2. Price Validation
- Validate prices on backend
- Don't trust client-sent prices
- Recalculate totals server-side

### 3. Authentication
- All booking endpoints require auth
- User can only view own bookings
- Admin can view all bookings

## Testing Checklist

- [ ] Room details page loads correctly
- [ ] Image carousel works
- [ ] Date selection validates properly
- [ ] Price calculation is accurate
- [ ] Guest count limits work
- [ ] Booking page receives correct data
- [ ] User information pre-fills
- [ ] Price summary displays correctly
- [ ] Razorpay modal opens
- [ ] Test payment completes
- [ ] Success message shows
- [ ] Redirect to dashboard works
- [ ] Booking appears in dashboard
- [ ] Mobile responsive design works

## Future Enhancements

1. **Room Availability Check**
   - Check if room is available for selected dates
   - Show unavailable dates in calendar
   - Suggest alternative dates

2. **Dynamic Pricing**
   - Weekend/holiday pricing
   - Seasonal rates
   - Early bird discounts
   - Last-minute deals

3. **Payment Options**
   - Multiple payment methods
   - Partial payment/deposit
   - Pay at hotel option
   - EMI options

4. **Booking Modifications**
   - Change dates
   - Upgrade room
   - Add services
   - Cancel with refund

5. **Email Notifications**
   - Booking confirmation
   - Payment receipt
   - Check-in reminders
   - Post-stay feedback

6. **Reviews & Ratings**
   - Guest reviews
   - Photo uploads
   - Rating system
   - Response from hotel

## Troubleshooting

### Razorpay Not Loading
- Check internet connection
- Verify script URL is correct
- Check browser console for errors
- Ensure no ad blockers

### Payment Fails
- Verify Razorpay key is correct
- Check test mode vs live mode
- Ensure amount is in paise
- Check Razorpay dashboard for logs

### Booking Not Created
- Check authentication token
- Verify API endpoint is correct
- Check backend logs
- Ensure all required fields sent

### Price Calculation Wrong
- Verify date selection
- Check room rate is correct
- Ensure nights calculation is accurate
- Verify tax percentages

## Support

For Razorpay integration help:
- Documentation: https://razorpay.com/docs/
- Support: https://razorpay.com/support/

For booking system issues:
- Check backend logs
- Verify database connection
- Test API endpoints with Postman
- Review browser console errors
