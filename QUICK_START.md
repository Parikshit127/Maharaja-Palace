# Quick Start Guide - Maharaja Palace Hotel

## Prerequisites
- Node.js (v16 or higher)
- MongoDB (running locally or MongoDB Atlas)
- npm or yarn

## Initial Setup

### 1. Clone and Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment Variables

**Backend (.env):**
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/maharaja-palace
JWT_SECRET=your-secret-key-here
JWT_EXPIRE=7d
NODE_ENV=development
```

**Frontend (.env):**
```bash
cd frontend
cp .env.example .env
```

Edit `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Start MongoDB

Make sure MongoDB is running:
```bash
# If using local MongoDB
mongod

# Or if using MongoDB as a service
sudo systemctl start mongod
```

### 4. Create Admin User

From the backend directory:
```bash
cd backend
npm run create-admin
```

This creates an admin account:
- **Email:** admin@maharajapalace.com
- **Password:** admin123

### 5. Seed Sample Data (Optional)

```bash
cd backend
npm run seed-rooms
```

### 6. Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Backend will run on: http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend will run on: http://localhost:5173

## Access the Application

### User Access
- **URL:** http://localhost:5173
- **Register:** Create a new account at /register
- **Login:** Use your credentials at /login
- **Dashboard:** View bookings at /dashboard

### Admin Access
- **URL:** http://localhost:5173/admin
- **Email:** admin@maharajapalace.com
- **Password:** admin123
- **Features:**
  - Manage rooms
  - Manage bookings
  - Manage users
  - Manage banquet halls
  - Manage restaurant reservations
  - View dashboard statistics

## Common Commands

### Backend
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start

# Create admin user
npm run create-admin

# Seed rooms
npm run seed-rooms
```

### Frontend
```bash
# Development mode
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Troubleshooting

### Backend won't start
- Check MongoDB is running
- Verify .env file exists and has correct values
- Check port 5000 is not in use

### Frontend won't start
- Check backend is running
- Verify .env file has correct API URL
- Check port 5173 is not in use

### Admin login not working
1. Clear browser localStorage
2. Re-run create-admin script
3. Check console for errors
4. See ADMIN_LOGIN_FIX_COMPLETE.md for detailed troubleshooting

### Database connection errors
- Verify MongoDB is running
- Check MONGODB_URI in backend/.env
- Ensure database name is correct

## Project Structure

```
maharaja-palace/
├── backend/
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Custom middleware
│   │   ├── config/         # Configuration files
│   │   ├── scripts/        # Utility scripts
│   │   └── utils/          # Helper functions
│   ├── .env               # Environment variables
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/     # Reusable components
    │   ├── pages/          # Page components
    │   ├── context/        # React context
    │   ├── api/            # API client
    │   ├── layout/         # Layout components
    │   └── styles/         # Global styles
    ├── .env               # Environment variables
    └── package.json
```

## Available Routes

### Public Routes
- `/` - Home page
- `/login` - Login page
- `/register` - Registration page
- `/rooms` - Browse rooms
- `/banquet` - Banquet halls
- `/restaurant` - Restaurant
- `/gallery` - Photo gallery
- `/about` - About us
- `/contact` - Contact page

### Protected Routes (Requires Login)
- `/dashboard` - User dashboard
- `/restaurant/book` - Restaurant booking
- `/banquet/book` - Banquet booking

### Admin Routes (Requires Admin Role)
- `/admin` - Admin dashboard
- Admin can manage all aspects of the system

## Next Steps

1. ✅ Complete initial setup
2. ✅ Create admin user
3. ✅ Start both servers
4. ✅ Login as admin
5. ✅ Add rooms, banquet halls, etc.
6. ✅ Test user registration and booking flow

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review the documentation files:
   - ADMIN_LOGIN_FIX_COMPLETE.md
   - ADMIN_ACCESS_GUIDE.md
   - IMPLEMENTATION_COMPLETE.md
3. Check console logs for errors
4. Verify all environment variables are set correctly

## Security Notes

⚠️ **Important for Production:**
- Change default admin password
- Use strong JWT_SECRET
- Enable HTTPS
- Set NODE_ENV=production
- Configure proper CORS settings
- Use environment-specific .env files
- Never commit .env files to version control

## Development Tips

- Use browser DevTools to debug frontend issues
- Check backend console for API errors
- Use MongoDB Compass to inspect database
- Clear browser cache if seeing stale data
- Use React DevTools for component debugging
