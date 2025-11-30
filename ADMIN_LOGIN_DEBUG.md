# Admin Login Debug Guide

## Issue
Admin users are seeing the user dashboard instead of the admin dashboard when logging in.

## Changes Made

### 1. Updated AuthContext (`frontend/src/context/AuthContext.jsx`)
- Added immediate loading of stored user data from localStorage
- This ensures the user role is available immediately on page load
- Still verifies token with backend for security

### 2. Added Debug Logging
Added console.log statements to track the login flow:
- **LoginPage**: Logs user data and role during login
- **AdminRoute**: Logs authentication state and user role when checking access

## How to Debug

### Step 1: Clear Browser Storage
1. Open browser DevTools (F12)
2. Go to Application/Storage tab
3. Clear localStorage and sessionStorage
4. Refresh the page

### Step 2: Login with Admin Credentials
1. Login with your admin account
2. Open browser console (F12 → Console tab)
3. Look for these log messages:
   ```
   Login Response: {...}
   User Object: {...}
   User Role: admin
   Redirecting to admin dashboard
   ```

### Step 3: Check AdminRoute Logs
After redirect, you should see:
```
AdminRoute - User: {id: "...", role: "admin", ...}
AdminRoute - isAuthenticated: true
AdminRoute - User Role: admin
```

## Common Issues & Solutions

### Issue 1: User role is undefined
**Symptom**: Console shows `User Role: undefined`
**Solution**: Check backend response - ensure the user object includes the `role` field

### Issue 2: Redirect loop
**Symptom**: Page keeps redirecting between /admin and /
**Solution**: 
- Clear localStorage
- Check that admin user in database has `role: "admin"`
- Verify backend `/auth/me` endpoint returns role field

### Issue 3: Still seeing user dashboard
**Symptom**: Redirects to /admin but shows user dashboard
**Solution**: 
- Check that AdminPage component is properly imported in App.jsx
- Verify the route configuration in App.jsx

## Verify Admin User in Database

Run this in MongoDB or your database tool:
```javascript
db.users.findOne({ email: "your-admin-email@example.com" })
```

The user document should have:
```json
{
  "email": "admin@example.com",
  "role": "admin",
  ...
}
```

If role is not "admin", update it:
```javascript
db.users.updateOne(
  { email: "your-admin-email@example.com" },
  { $set: { role: "admin" } }
)
```

## Testing Steps

1. **Clear browser cache and localStorage**
2. **Login with admin credentials**
3. **Check console logs** - should show role as "admin"
4. **Verify URL** - should be at `/admin`
5. **Check page content** - should show "Admin Dashboard" with sidebar

## Expected Behavior

✅ Admin user logs in → Redirects to `/admin` → Shows AdminPage with dashboard
✅ Regular user logs in → Redirects to `/dashboard` → Shows DashboardPage

## Next Steps

If the issue persists after following these steps:
1. Share the console logs from the browser
2. Check the Network tab to see the `/auth/login` response
3. Verify the user's role in the database
4. Check if there are any errors in the browser console

## Remove Debug Logs (After Fixing)

Once the issue is resolved, remove the console.log statements from:
- `frontend/src/pages/LoginPage.jsx`
- `frontend/src/layout/ProtectedRoute.jsx`
