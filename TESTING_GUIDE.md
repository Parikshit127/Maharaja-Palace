# Quick Setup & Testing Guide

## 🚀 Quick Setup

### Step 1: Update Backend `.env`

```env
# Add Razorpay credentials
RAZORPAY_KEY_ID=your_actual_key_id
RAZORPAY_KEY_SECRET=your_actual_key_secret
```

### Step 2: Update Frontend `.env`

```env
VITE_RAZORPAY_KEY_ID=rzp_test_RmTd6UtrZwwmTT  # Test key (already configured)
```

### Step 3: Install Razorpay SDK (Backend)

```bash
cd backend
npm install razorpay
```

### Step 4: Restart Services

```bash
# Terminal 1 - Backend
npm start

# Terminal 2 - Frontend
npm run dev
```

---

## 🧪 Complete Testing Workflow

### Test 1: Room Booking with Payment Confirmation

**Step 1: Create Booking**

1. Go to http://localhost:5173 (or your frontend URL)
2. Navigate to Rooms → Select a room
3. Enter check-in and check-out dates
4. Click "Check Availability"

**Step 2: Complete Payment Flow**

1. Click "Proceed to Pay"
2. Razorpay modal opens
3. Click "Proceed with Test"
4. Complete payment (test mode - doesn't charge)
5. See success message and redirect to dashboard

**Step 3: Verify Booking Status**

1. Check dashboard - booking shows "confirmed"
2. Payment status shows "completed" (green ✓)
3. Check admin panel - booking appears in list with green "completed" payment status

**Expected Result:**

```
✅ Booking status: confirmed
✅ Payment status: completed
✅ Dashboard shows booking
✅ Admin sees booking with completed payment
```

---

### Test 2: Partial Payment (10% Booking Amount)

**Step 1: Create Partial Booking**

1. During booking, select "Pay Booking Amount (10%)"
2. Amount shows as 10% of total
3. Complete payment

**Step 2: Verify Partial Payment**

1. Dashboard shows "Partial (10%)" payment status
2. "Pay Remaining" button appears

**Step 3: Pay Remaining**

1. Click "Pay Remaining" button
2. Amount shows remaining balance
3. Complete payment

**Step 4: Verify Full Payment**

1. Booking status changes to "confirmed"
2. Payment status changes to "completed"

**Expected Result:**

```
✅ Initial payment: 10% processed
✅ Remaining amount shown correctly
✅ Full payment completes booking
✅ Status updates to confirmed
```

---

### Test 3: Request Refund

**Step 1: Request Refund**

1. Go to Dashboard
2. Find a confirmed booking (payment completed)
3. Click "View Details"
4. Scroll to "Refund Status" section
5. Click "Request Refund"
6. Enter reason (e.g., "Change of plans")
7. Click "Submit Request"

**Step 2: Verify Refund Request**

1. Booking details modal updates
2. Refund Status shows "requested"
3. List reloads automatically

**Expected Result:**

```
✅ Modal shows "requested" status
✅ Dashboard updates without refresh
✅ Message confirms submission
```

---

### Test 4: Admin Approves Refund

**Step 1: View Refund in Admin Panel**

1. Log in as admin
2. Go to Admin Dashboard → Bookings
3. Find booking with refund request
4. Click Eye icon → View Details

**Step 2: Process Refund**

1. Scroll to "Refund Request" section
2. See status "requested" and reason
3. Click "Process Refund" button
4. Modal appears with Approve/Reject options
5. Select "Approve"
6. Click "Process Refund" button

**Step 3: Verify Refund Processing**

1. Booking details close
2. Booking list reloads
3. Booking status changes to "cancelled"
4. Payment status changes to "refunded" (blue)

**Expected Result:**

```
✅ Admin modal shows refund details
✅ Approve/Reject buttons work
✅ Booking status updates to "cancelled"
✅ Payment status updates to "refunded"
✅ List refreshes automatically
```

---

### Test 5: Admin Rejects Refund

**Step 1: Request Refund (Same as Test 3)**

**Step 2: Reject Refund**

1. Admin Panel → Bookings → View Details
2. See "Refund Request" section
3. Click "Process Refund"
4. Select "Reject" option
5. Click "Reject" button

**Step 3: Verify Rejection**

1. Refund Status updates to "rejected"
2. Booking remains "confirmed"
3. Payment status stays "completed"

**Expected Result:**

```
✅ Refund status: rejected
✅ Booking: confirmed (unchanged)
✅ Payment: completed (unchanged)
✅ List updates automatically
```

---

## 🐛 Troubleshooting

### Issue: Razorpay Modal Doesn't Open

**Solution:**

- Check browser console for errors
- Verify VITE_RAZORPAY_KEY_ID is in frontend .env
- Restart frontend with `npm run dev`
- Clear browser cache

### Issue: Payment Succeeds but Booking Stays "Pending"

**Solution:**

- Check backend logs for API errors
- Verify RAZORPAY_KEY_SECRET is correct
- Check MongoDB connection
- Verify booking API endpoint is called

### Issue: Admin Can't See Refund Section

**Solution:**

- Verify booking has refundStatus field in MongoDB
- Check if payment status is "completed"
- Try viewing different booking details
- Refresh admin page

### Issue: Refund Processing Fails

**Solution:**

- Verify Razorpay credentials are valid
- Check payment was completed (not pending)
- Check transaction ID exists
- Review backend logs for Razorpay API errors

---

## 📊 Database Verification

### Check Booking in MongoDB

```javascript
// Connect to MongoDB
// Run in mongo shell or MongoDB Compass

db.bookings.findOne({
  bookingNumber: "BK-xxx-xxx"
}, {
  status: 1,
  paymentStatus: 1,
  refundStatus: 1,
  transactionId: 1,
  refundId: 1,
  paidAmount: 1,
  totalPrice: 1
})

// Expected output for completed payment:
{
  "_id": ObjectId("..."),
  "status": "confirmed",
  "paymentStatus": "completed",
  "refundStatus": "none",
  "transactionId": "pay_xyz123",
  "paidAmount": 15000,
  "totalPrice": 15000
}

// Expected output for processed refund:
{
  "_id": ObjectId("..."),
  "status": "cancelled",
  "paymentStatus": "refunded",
  "refundStatus": "processed",
  "transactionId": "pay_xyz123",
  "refundId": "rfnd_abc456",
  "refundAmount": 15000
}
```

---

## 🔍 API Testing (Using Postman/Thunder)

### Test Update Payment Endpoint

```
PUT http://localhost:8080/api/bookings/{bookingId}/payment

Headers:
Authorization: Bearer {jwt_token}
Content-Type: application/json

Body:
{
  "amount": 15000,
  "paymentId": "pay_xyz123"
}

Expected Response:
{
  "success": true,
  "message": "Payment updated successfully",
  "booking": {
    "_id": "...",
    "status": "confirmed",
    "paymentStatus": "completed"
  }
}
```

### Test Request Refund Endpoint

```
POST http://localhost:8080/api/bookings/{bookingId}/refund/request

Headers:
Authorization: Bearer {jwt_token}
Content-Type: application/json

Body:
{
  "reason": "Change of plans"
}

Expected Response:
{
  "success": true,
  "message": "Refund request submitted successfully",
  "booking": {
    "_id": "...",
    "refundStatus": "requested",
    "refundReason": "Change of plans"
  }
}
```

### Test Process Refund Endpoint (Admin)

```
PUT http://localhost:8080/api/bookings/{bookingId}/refund/status

Headers:
Authorization: Bearer {admin_jwt_token}
Content-Type: application/json

Body:
{
  "action": "approve"
}

Expected Response:
{
  "success": true,
  "message": "Refund processed successfully",
  "booking": {
    "_id": "...",
    "status": "cancelled",
    "paymentStatus": "refunded",
    "refundStatus": "processed",
    "refundId": "rfnd_xyz789"
  },
  "refund": {
    "refundId": "rfnd_xyz789",
    "status": "processed",
    "amount": 1500000
  }
}
```

---

## ✅ Checklist: Before Going Live

- [ ] Razorpay test credentials working
- [ ] All 5 tests passed successfully
- [ ] Admin can approve/reject refunds
- [ ] Guests can request refunds
- [ ] Dashboard updates after payment
- [ ] Admin panel updates after refund
- [ ] Database fields populated correctly
- [ ] Error messages display properly
- [ ] No console errors in browser
- [ ] Backend logs show no errors
- [ ] Environment variables set correctly
- [ ] Package.json dependencies installed
- [ ] Frontend and backend both running

---

## 📝 Test Results Log

**Date:** ****\_\_\_****
**Tester:** ****\_\_\_****

### Test 1: Room Booking with Payment Confirmation

- [ ] Booking created: ****\_\_\_****
- [ ] Payment completed: ****\_\_\_****
- [ ] Status updated to confirmed: ****\_\_\_****
- [ ] Notes: ****\_\_\_****

### Test 2: Partial Payment

- [ ] 10% payment processed: ****\_\_\_****
- [ ] Remaining amount shown: ****\_\_\_****
- [ ] Full payment completed: ****\_\_\_****
- [ ] Notes: ****\_\_\_****

### Test 3: Request Refund

- [ ] Refund requested: ****\_\_\_****
- [ ] Status shows "requested": ****\_\_\_****
- [ ] Admin sees refund: ****\_\_\_****
- [ ] Notes: ****\_\_\_****

### Test 4: Admin Approves Refund

- [ ] Refund processed: ****\_\_\_****
- [ ] Status changed to "cancelled": ****\_\_\_****
- [ ] Payment changed to "refunded": ****\_\_\_****
- [ ] Notes: ****\_\_\_****

### Test 5: Admin Rejects Refund

- [ ] Refund rejected: ****\_\_\_****
- [ ] Booking stayed "confirmed": ****\_\_\_****
- [ ] Payment stayed "completed": ****\_\_\_****
- [ ] Notes: ****\_\_\_****

---

## 🎯 Summary

You now have a complete payment and refund system with:

✅ **Payment Processing**

- Razorpay integration
- Test mode support
- Automatic status updates
- Real-time dashboard updates

✅ **Refund Management**

- Guest-initiated refund requests
- Admin approval/rejection workflow
- Automatic Razorpay refund processing
- Status tracking and logging

✅ **Security**

- Signature verification
- Role-based access control
- Transaction audit trail
- Error handling

**Ready to test!** 🚀

---

_For detailed technical documentation, see PAYMENT_AND_REFUND_UPDATES.md_
