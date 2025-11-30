# 🔐 Admin Portal Access Guide

## 🎯 Admin Credentials

### Default Admin Account:
```
Email: admin@maharajapalace.com
Password: admin123
```

---

## 🚀 How to Access Admin Portal

### Step 1: Start the Application

**Backend:**
```bash
cd backend
npm run dev
```
✅ Backend runs on: http://localhost:5000


**Frontend:**
```bash
cd frontend
npm run dev
```
✅ Frontend runs on: http://localhost:5173

---

### Step 2: Login as Admin

1. Open your browser and go to: **http://localhost:5173/login**

2. Enter the admin credentials:
   - **Email:** `admin@maharajapalace.com`
   - **Password:** `admin123`

3. Click **"Login"**

4. You will be redirected to the dashboard

---

### Step 3: Access Admin Panel

Once logged in, you have two ways to access the admin panel:

**Option 1: Direct URL**
- Navigate to: **http://localhost:5173/admin**

**Option 2: Via Navbar**
- Look for "Dashboard" in the navbar
- Or manually navigate to `/admin` in the URL

---

## 🎛️ Admin Panel Features

### Dashboard Overview
- Quick statistics
- Recent bookings
- System overview

### 1. 🛏️ Rooms Management
**Features:**
- View all room types
- Create new room types
- Edit room details
- Delete rooms
- Update room status (Available, Occupied, Maintenance)
- Manage room pricing
- Upload room images

**Actions:**
- Add Room Type
- Edit Room Type
- Delete Room Type
- View Room Details

---

### 2. ✨ Banquet Halls Management
**Features:**
- View all banquet halls
- Create new halls
- Edit hall details
- Delete halls
- Manage capacity (Theater, Cocktail, Banquet)
- Set base pricing
- Add amenities and features
- Upload hall images

**Actions:**
- Add Banquet Hall
- Edit Hall Details
- Delete Hall
- View Hall Bookings

---

### 3. 🍽️ Restaurant Management
**Features:**
- View all restaurant tables
- Create new tables
- Edit table details
- Delete tables
- Manage table capacity
- Set table locations
- Update table status

**Actions:**
- Add Table
- Edit Table
- Delete Table
- View Table Bookings

---

### 4. 📅 Bookings Management
**Features:**
- View all bookings (Rooms, Banquet, Restaurant)
- Filter by type
- Filter by status
- Update booking status
- View booking details
- Manage payments
- Cancel bookings

**Booking Statuses:**
- Pending
- Confirmed
- Checked-in
- Checked-out
- Completed
- Cancelled
- No-show

**Actions:**
- View Booking Details
- Update Status
- Cancel Booking
- Process Payment

---

### 5. 👥 Users Management
**Features:**
- View all users
- Search users
- Filter by role (Guest, Admin, Staff)
- View user details
- Update user information
- Toggle user status (Active/Inactive)
- View user booking history

**User Roles:**
- **Guest:** Regular customers
- **Admin:** Full system access
- **Staff:** Limited access (future feature)

**Actions:**
- View User Details
- Edit User
- Toggle Active Status
- View User Bookings

---

## 🔒 Admin-Only API Endpoints

### Rooms:
```
POST   /api/rooms/room-types       - Create room type
PUT    /api/rooms/room-types/:id   - Update room type
DELETE /api/rooms/room-types/:id   - Delete room type
POST   /api/rooms                  - Create room
PUT    /api/rooms/:id              - Update room
DELETE /api/rooms/:id              - Delete room
PUT    /api/rooms/:id/status       - Update room status
```

### Banquet:
```
POST   /api/banquet/halls          - Create hall
PUT    /api/banquet/halls/:id      - Update hall
DELETE /api/banquet/halls/:id      - Delete hall
GET    /api/banquet/bookings       - Get all bookings
```

### Restaurant:
```
POST   /api/restaurant/tables      - Create table
PUT    /api/restaurant/tables/:id  - Update table
DELETE /api/restaurant/tables/:id  - Delete table
GET    /api/restaurant/bookings    - Get all bookings
```

### Users:
```
GET    /api/auth/users             - Get all users
GET    /api/auth/users/:id         - Get user details
PUT    /api/auth/users/:id         - Update user
PUT    /api/auth/users/:id/status  - Toggle user status
```

---

## 🛠️ Creating Additional Admin Users

### Method 1: Via Script (Recommended)

1. Edit `backend/src/scripts/seedAdmin.js`
2. Change the email and password
3. Run:
```bash
cd backend
node src/scripts/seedAdmin.js
```

### Method 2: Via Database

1. Register a normal user via the website
2. Connect to MongoDB
3. Update the user's role:
```javascript
db.users.updateOne(
  { email: "newadmin@example.com" },
  { $set: { role: "admin" } }
)
```

### Method 3: Via API (Future Enhancement)

Create an admin endpoint to promote users to admin role.

---

## 🎨 Admin Panel UI Features

### Design:
- ✅ Clean, professional interface
- ✅ Sidebar navigation
- ✅ Tabbed content areas
- ✅ Data tables with sorting
- ✅ Modal forms for CRUD operations
- ✅ Responsive design
- ✅ Loading states
- ✅ Success/error notifications

### Color Scheme:
- Gold accents (#B8860B, #D4AF37)
- Cream backgrounds (#FBF9F4)
- Professional grays
- Status color coding

---

## 📊 Admin Dashboard Statistics

### Overview Cards:
- Total Rooms
- Total Bookings
- Total Revenue
- Active Users
- Pending Bookings
- Today's Check-ins
- Today's Check-outs
- Occupancy Rate

### Charts (Future Enhancement):
- Revenue trends
- Booking trends
- Occupancy rates
- Popular room types

---

## 🔐 Security Features

### Authentication:
- ✅ JWT token-based auth
- ✅ Protected routes
- ✅ Role-based access control
- ✅ Auto-logout on token expiry

### Authorization:
- ✅ Admin-only routes
- ✅ Middleware protection
- ✅ API endpoint guards
- ✅ Frontend route guards

### Best Practices:
- Change default password immediately
- Use strong passwords
- Don't share admin credentials
- Regular security audits
- Monitor admin activities

---

## 🐛 Troubleshooting

### Can't Access Admin Panel?

**Issue 1: "Unauthorized" or redirected to login**
- **Solution:** Make sure you're logged in with admin credentials
- Check if token is valid
- Try logging out and logging in again

**Issue 2: "Access Denied" or "Forbidden"**
- **Solution:** Your account doesn't have admin role
- Run the seed script to create admin user
- Or update your role in the database

**Issue 3: Admin page shows blank or errors**
- **Solution:** Check browser console for errors
- Ensure backend is running
- Check API endpoints are accessible
- Verify MongoDB connection

**Issue 4: Can't create/edit/delete items**
- **Solution:** Check API responses in Network tab
- Verify admin token is being sent
- Check backend logs for errors
- Ensure MongoDB is connected

---

## 📝 Common Admin Tasks

### Adding a New Room Type:
1. Go to Admin Panel → Rooms
2. Click "Add Room Type"
3. Fill in details:
   - Name (e.g., "Deluxe Suite")
   - Description
   - Base price
   - Max guests
   - Size
   - Amenities
   - Images
4. Click "Save"

### Creating a Banquet Hall:
1. Go to Admin Panel → Banquet Halls
2. Click "Add Hall"
3. Fill in details:
   - Name
   - Description
   - Capacity (Theater, Cocktail, Banquet)
   - Base price
   - Amenities
   - Features
   - Images
4. Click "Save"

### Managing Bookings:
1. Go to Admin Panel → Bookings
2. View all bookings
3. Filter by type or status
4. Click on a booking to view details
5. Update status as needed
6. Process payments

### Managing Users:
1. Go to Admin Panel → Users
2. View all registered users
3. Search for specific users
4. Click on a user to view details
5. Edit user information
6. Toggle active/inactive status

---

## 🚀 Quick Start Checklist

- [ ] Backend server running (port 5000)
- [ ] Frontend server running (port 5173)
- [ ] MongoDB connected
- [ ] Admin user created (run seed script)
- [ ] Login with admin credentials
- [ ] Navigate to /admin
- [ ] Verify all tabs are accessible
- [ ] Test creating a room type
- [ ] Test creating a banquet hall
- [ ] Test creating a restaurant table
- [ ] View bookings
- [ ] View users

---

## 📞 Support

### If you encounter issues:

1. **Check Backend Logs:**
   ```bash
   cd backend
   npm run dev
   # Watch console for errors
   ```

2. **Check Frontend Console:**
   - Open browser DevTools (F12)
   - Check Console tab for errors
   - Check Network tab for failed requests

3. **Verify Database:**
   - Check MongoDB connection
   - Verify admin user exists
   - Check collections are created

4. **Clear Cache:**
   - Clear browser cache
   - Clear localStorage
   - Restart servers

---

## 🎯 Admin Credentials Summary

```
URL: http://localhost:5173/admin
Email: admin@maharajapalace.com
Password: admin123

⚠️ IMPORTANT: Change this password in production!
```

---

## 🔄 Password Reset (If Needed)

If you forget the admin password:

1. Connect to MongoDB
2. Run:
```javascript
// Delete existing admin
db.users.deleteOne({ email: "admin@maharajapalace.com" })

// Run seed script again
cd backend
node src/scripts/seedAdmin.js
```

Or manually update password:
```javascript
const bcrypt = require('bcryptjs');
const newPassword = await bcrypt.hash('newpassword123', 10);

db.users.updateOne(
  { email: "admin@maharajapalace.com" },
  { $set: { password: newPassword } }
)
```

---

## ✅ Admin Access Verified

Your admin account is ready to use!

**Next Steps:**
1. Login with the credentials above
2. Navigate to /admin
3. Start managing your hotel system
4. Change the default password for security

---

*Last Updated: November 30, 2024*
*Admin Portal Version: 2.0.0*
