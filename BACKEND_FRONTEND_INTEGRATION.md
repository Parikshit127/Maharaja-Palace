# Backend-Frontend Integration Guide

## Changes Made

### 1. Fixed Port Configuration
- **Backend**: Running on port `5002` (as configured in `backend/.env`)
- **Frontend**: Updated to connect to `http://localhost:5002/api`
  - Updated `frontend/.env`: `VITE_API_URL=http://localhost:5002/api`
  - Updated `frontend/src/api/api.js` to use environment variable

### 2. Fixed CORS Configuration
- Updated `backend/.env` FRONTEND_URL from `http://localhost:3001` to `http://localhost:5173` (Vite's default port)

### 3. Added Missing API Endpoint
- Added `/api/auth/me` route in `backend/src/routes/authRoutes.js`
- This endpoint is used by the frontend to verify the user's token on page load

### 4. Improved AuthContext
- Enhanced error handling in token verification
- Added success check for API responses

## API Endpoints Available

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth token)
- `GET /api/auth/users` - Get all users (requires auth token)

### Rooms
- `GET /api/rooms/room-types` - Get room types
- `GET /api/rooms/available` - Get available rooms
- `GET /api/rooms` - Get all rooms
- `GET /api/rooms/:id` - Get room by ID
- `POST /api/rooms` - Create room
- `PUT /api/rooms/:id/status` - Update room status

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/me` - Get my bookings
- `GET /api/bookings/:id` - Get booking details
- `PUT /api/bookings/:id/cancel` - Cancel booking

### Banquet
- `GET /api/banquet/halls` - Get all halls
- `GET /api/banquet/halls/:id` - Get hall by ID
- `POST /api/banquet/halls` - Create hall
- `POST /api/banquet/bookings` - Create booking
- `GET /api/banquet/bookings` - Get all bookings
- `GET /api/banquet/bookings/me` - Get my bookings

### Restaurant
- `GET /api/restaurant/tables` - Get all tables
- `GET /api/restaurant/tables/:id` - Get table by ID
- `POST /api/restaurant/tables` - Create table
- `POST /api/restaurant/bookings` - Create booking
- `GET /api/restaurant/bookings` - Get all bookings
- `GET /api/restaurant/bookings/me` - Get my bookings

## Running the Application

### Start Backend
```bash
cd backend
npm run dev
```
Backend will run on: http://localhost:5002

### Start Frontend
```bash
cd frontend
npm run dev
```
Frontend will run on: http://localhost:5173

## Testing Login/Register

### Register a New User
1. Go to http://localhost:5173/register
2. Fill in the form:
   - First Name
   - Last Name
   - Email
   - Phone (10 digits)
   - Password (min 6 characters)
   - Confirm Password
3. Click "Register"
4. You should be redirected to the dashboard

### Login
1. Go to http://localhost:5173/login
2. Enter your email and password
3. Click "Login"
4. You should be redirected to the dashboard

## Authentication Flow

1. User submits login/register form
2. Frontend sends request to backend API
3. Backend validates credentials and returns JWT token
4. Frontend stores token in localStorage
5. Frontend includes token in Authorization header for all subsequent requests
6. Backend verifies token using middleware for protected routes

## Troubleshooting

### CORS Errors
- Make sure backend FRONTEND_URL matches your frontend URL
- Check that CORS is enabled in `backend/src/app.js`

### Connection Refused
- Verify backend is running on port 5002
- Verify frontend is connecting to the correct port
- Check `frontend/.env` has correct VITE_API_URL

### Token Issues
- Clear localStorage and try logging in again
- Check that JWT_SECRET is set in `backend/.env`
- Verify token is being sent in Authorization header

### Database Connection
- Ensure MongoDB connection string is correct in `backend/.env`
- Check MongoDB Atlas allows connections from your IP

## Environment Variables

### Backend (.env)
```
PORT=5002
NODE_ENV=development
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5002/api
```

## Next Steps

1. Test all authentication flows (login, register, logout)
2. Test protected routes (dashboard, bookings, etc.)
3. Integrate room booking functionality
4. Integrate banquet booking functionality
5. Integrate restaurant booking functionality
6. Add admin panel functionality
7. Add payment integration (Razorpay)
