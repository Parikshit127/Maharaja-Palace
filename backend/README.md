# Maharaja Palace - Hotel Booking System
## Backend

This is the Node.js + Express backend for the 7-star Maharaja Palace Hotel Booking System.

### Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files (DB, env)
│   ├── models/          # MongoDB schemas
│   ├── controllers/     # Business logic
│   ├── routes/          # API routes
│   ├── services/        # Business services (email, payment)
│   ├── middleware/      # Custom middleware (auth, error)
│   ├── utils/           # Utility functions
│   ├── app.js          # Express app
│   └── server.js       # Server entry point
├── .env                # Environment variables
└── package.json        # Dependencies
```

### Features Implemented (Milestone 1)

✅ User Authentication (JWT-based)
✅ Role-based Access Control (Admin, Guest, Staff)
✅ Room Management (CRUD)
✅ Booking Management (CRUD)
✅ Banquet Hall Booking
✅ Restaurant Table Booking
✅ Email Service (Nodemailer ready)
✅ Database Models (9 schemas)
✅ Error Handling
✅ Logger Utility

### Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   - Copy `.env` file and update with your values:
     - MongoDB URI
     - JWT Secret
     - Email credentials
     - Port

3. **Start MongoDB**
   ```bash
   # Using MongoDB locally
   mongod
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

### API Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

#### Rooms
- `POST /api/rooms/room-types` - Create room type (admin)
- `GET /api/rooms/room-types` - Get all room types
- `POST /api/rooms` - Create room (admin)
- `GET /api/rooms` - Get all rooms (admin)
- `GET /api/rooms/available` - Get available rooms
- `PUT /api/rooms/:roomId/status` - Update room status (admin)

#### Bookings
- `POST /api/bookings` - Create booking (protected)
- `GET /api/bookings/me` - Get my bookings (protected)
- `GET /api/bookings/:bookingId` - Get booking details (protected)
- `PUT /api/bookings/:bookingId/cancel` - Cancel booking (protected)
- `GET /api/bookings` - Get all bookings (admin)

#### Banquet
- `POST /api/banquet/halls` - Create banquet hall (admin)
- `GET /api/banquet/halls` - Get all banquet halls
- `POST /api/banquet/bookings` - Create banquet booking (protected)
- `GET /api/banquet/bookings/me` - Get my banquet bookings (protected)

#### Restaurant
- `POST /api/restaurant/tables` - Create restaurant table (admin)
- `GET /api/restaurant/tables` - Get all restaurant tables
- `POST /api/restaurant/bookings` - Create restaurant booking (protected)
- `GET /api/restaurant/bookings/me` - Get my restaurant bookings (protected)

### Testing with Postman

Use the provided Postman collection for testing: `Maharaja_Palace_API.postman_collection.json`

1. Register a new user
2. Use the token in Authorization header for protected routes
3. Test admin endpoints with an admin account

### Technologies Used

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT
- **Password Hashing**: bcryptjs
- **Email**: Nodemailer
- **Validation**: express-validator (ready)

### Next Steps (Phase 2)

- Payment Gateway Integration (Razorpay/Stripe)
- Advanced booking validation (date conflicts)
- Reviews & Ratings system
- Notification system
- Admin analytics dashboard
- Inventory management
- Calendar view for availability

---

Happy Coding! 🚀
