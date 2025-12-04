# Payment & Refund System - Data Flow Diagrams

## 1️⃣ Complete Payment Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                       PAYMENT FLOW DIAGRAM                               │
└─────────────────────────────────────────────────────────────────────────┘

GUEST INTERFACE (Frontend)
┌──────────────────────────────────────┐
│  BookingPage.jsx                     │
│  1. Select room & dates              │
│  2. Choose payment option            │
│  3. Click "Proceed to Pay"           │
└──────────────────┬──────────────────┘
                   │
                   ▼
       ┌────────────────────────────┐
       │  Create Booking Request    │
       │  POST /bookings            │
       │  - room ID                 │
       │  - dates                   │
       │  - guests                  │
       └────────────┬───────────────┘
                    │
                    ▼
BACKEND (Server)
┌──────────────────────────────────────┐
│  bookingController.createBooking()   │
│  ✓ Validate dates                    │
│  ✓ Calculate price                   │
│  ✓ Create booking (status: pending)  │
│  ✓ Return booking._id                │
└──────────────────┬──────────────────┘
                   │
                   ▼
       ┌────────────────────────────┐
       │  Razorpay Payment Modal    │
       │  - Show order details      │
       │  - Guest enters info       │
       │  - Guest completes payment │
       └────────────┬───────────────┘
                    │
        (TEST MODE - NO REAL CHARGE)
                    │
                    ▼
       ┌────────────────────────────────────┐
       │  Razorpay Success Response         │
       │  {                                 │
       │    razorpay_payment_id: "pay_xxx"  │
       │    razorpay_order_id: "ord_yyy"    │
       │    razorpay_signature: "sig_zzz"   │
       │  }                                 │
       └────────────┬───────────────────────┘
                    │
                    ▼
GUEST INTERFACE (Frontend)
┌─────────────────────────────────────────┐
│  BookingPage.jsx - Payment Handler      │
│  handlePayment() callback receives      │
│  payment confirmation                  │
│                                         │
│  NOW CALLS BACKEND API:                 │
│  PUT /bookings/{id}/payment             │
│  {                                      │
│    amount: 15000,                       │
│    paymentId: "pay_xxx",                │
│    orderId: "ord_yyy",                  │
│    signature: "sig_zzz"                 │
│  }                                      │
└─────────────────┬───────────────────────┘
                  │
                  ▼
BACKEND (Server)
┌──────────────────────────────────────┐
│  bookingController.updatePayment()   │
│                                      │
│  1. Verify signature with            │
│     RAZORPAY_KEY_SECRET              │
│                                      │
│  2. If valid:                        │
│     - Update paidAmount              │
│     - Set transactionId              │
│     - Check if fully paid            │
│                                      │
│  3. If fully paid:                   │
│     - Set paymentStatus: "completed" │
│     - Set status: "confirmed"        │
│     - Save booking                   │
│                                      │
│  4. Return updated booking           │
└──────────────────┬───────────────────┘
                   │
                   ▼
GUEST INTERFACE (Frontend)
┌─────────────────────────────────────┐
│  BookingPage.jsx - Success Page      │
│  ✓ Show "Booking Confirmed!" message │
│  ✓ Display booking details           │
│  ✓ Redirect to /dashboard            │
└─────────────────┬───────────────────┘
                  │
                  ▼
GUEST DASHBOARD
┌──────────────────────────────────────┐
│  DashboardPage.jsx                   │
│  ✓ Fetch bookings                    │
│  ✓ Show booking with status:         │
│    "CONFIRMED" (green)               │
│  ✓ Show payment: "✓ PAID" (green)   │
│  ✓ Show refund option (blue)        │
└──────────────────────────────────────┘
       │
       │ (Admin also sees update)
       ▼
ADMIN DASHBOARD
┌──────────────────────────────────────┐
│  AdminBookings.jsx                   │
│  ✓ Booking appears in list           │
│  ✓ Status: confirmed                 │
│  ✓ Payment: completed (green) ✓      │
│  ✓ Can view details                  │
└──────────────────────────────────────┘

✅ PAYMENT FLOW COMPLETE
Guest: confirmed booking ✓
Admin: sees confirmed booking ✓
Database: booking saved with payment ✓
```

---

## 2️⃣ Refund Request Flow (Guest Initiated)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                   REFUND REQUEST FLOW (GUEST)                            │
└─────────────────────────────────────────────────────────────────────────┘

GUEST DASHBOARD
┌───────────────────────────────────────┐
│  DashboardPage.jsx                    │
│  1. View confirmed booking            │
│  2. Click "View Details"              │
│  3. Modal opens showing:              │
│     - Booking details                 │
│     - "CONFIRMED" status (green)      │
│     - "✓ PAID" payment (green)       │
│     - "Refund Status: none"           │
│  4. Click "Request Refund" button     │
└───────────────┬───────────────────────┘
                │
                ▼
       ┌────────────────────────────────┐
       │  Refund Request Modal          │
       │  Shows:                        │
       │  - Booking ID                  │
       │  - Amount to be refunded       │
       │  - Text field for reason       │
       │                                │
       │  Guest enters reason:          │
       │  "Change of plans"             │
       │                                │
       │  Clicks "Submit Request"       │
       └────────────┬───────────────────┘
                    │
                    ▼
BACKEND REQUEST
┌──────────────────────────────────────┐
│  POST /bookings/{id}/refund/request  │
│  {                                   │
│    reason: "Change of plans"         │
│  }                                   │
└──────────────────┬───────────────────┘
                   │
                   ▼
BACKEND (Server)
┌──────────────────────────────────────┐
│  bookingController.requestRefund()   │
│                                      │
│  1. Verify user owns booking         │
│  2. Check paymentStatus = completed  │
│  3. Update booking:                  │
│     - refundStatus: "requested"      │
│     - refundAmount: paidAmount       │
│     - refundReason: reason           │
│     - refundRequestedAt: now()       │
│  4. Save booking                     │
│  5. Return updated booking           │
└──────────────────┬───────────────────┘
                   │
                   ▼
GUEST INTERFACE
┌───────────────────────────────────────┐
│  DashboardPage.jsx                    │
│  Modal updates:                       │
│  ✓ Refund Status: "requested"        │
│  ✓ Message: "Request submitted"      │
│  ✓ Modal closes                      │
│  ✓ Dashboard reloads                 │
│                                       │
│  Booking now shows:                  │
│  - Status: CONFIRMED (unchanged)    │
│  - Payment: ✓ PAID (unchanged)      │
│  - Refund: REQUESTED (yellow badge) │
└───────────────────────────────────────┘
       │
       │ (Admin notification)
       ▼
ADMIN DASHBOARD
┌───────────────────────────────────────┐
│  AdminBookings.jsx                    │
│  ✓ Booking still in list              │
│  ✓ Can click "View Details"          │
│  ✓ See "Refund Request" section      │
│  ✓ Shows:                            │
│    - Status: requested               │
│    - Amount: ₹15000                  │
│    - Reason: "Change of plans"       │
│  ✓ "Process Refund" button appears  │
└───────────────────────────────────────┘

✅ REFUND REQUEST SENT
Guest: sees "requested" status ✓
Admin: sees refund details ✓
Database: refund fields updated ✓
```

---

## 3️⃣ Refund Approval Flow (Admin)

```
┌─────────────────────────────────────────────────────────────────────────┐
│               REFUND APPROVAL FLOW (ADMIN PROCESSING)                   │
└─────────────────────────────────────────────────────────────────────────┘

ADMIN DASHBOARD
┌────────────────────────────────────┐
│  AdminBookings.jsx                 │
│  1. See booking with refund        │
│  2. Click Eye icon → View Details  │
│  3. See "Refund Request" section:  │
│     - Status: requested            │
│     - Amount: ₹15000               │
│     - Reason shown                 │
│  4. Click "Process Refund"        │
└───────────────┬────────────────────┘
                │
                ▼
       ┌────────────────────────────┐
       │  Refund Modal              │
       │                            │
       │  Shows:                    │
       │  - Booking details         │
       │  - Refund amount           │
       │  - TWO OPTIONS:            │
       │    ⚪ APPROVE              │
       │    ⚪ REJECT               │
       │                            │
       │  Admin selects: APPROVE    │
       │  Clicks "Process Refund"   │
       └────────────┬───────────────┘
                    │
                    ▼
BACKEND REQUEST
┌──────────────────────────────────────┐
│  PUT /bookings/{id}/refund/status    │
│  {                                   │
│    action: "approve"                 │
│  }                                   │
└──────────────────┬───────────────────┘
                   │
                   ▼
BACKEND (Server)
┌──────────────────────────────────────────┐
│  bookingController.updateRefundStatus()  │
│                                          │
│  1. Verify refund in "requested" status  │
│  2. Call refundPayment() service:        │
│     - Pass transactionId (from payment)  │
│     - Pass refundAmount                  │
│                                          │
│  3. Razorpay API processes refund:       │
│     ✓ Validates payment                  │
│     ✓ Creates refund transaction         │
│     ✓ Returns refundId                   │
│                                          │
│  4. Update booking:                      │
│     - refundStatus: "processed"          │
│     - refundId: rfnd_xyz789              │
│     - refundProcessedAt: now()           │
│     - paymentStatus: "refunded"          │
│     - status: "cancelled"                │
│  5. Save booking                         │
│  6. Return refund details                │
└──────────────────┬───────────────────────┘
                   │
                   ▼
ADMIN INTERFACE
┌────────────────────────────────────┐
│  AdminBookings.jsx                 │
│  Modal closes                      │
│  Success message shows:            │
│  "Refund processed successfully"   │
│                                    │
│  Booking list reloads:             │
│  Booking now shows:               │
│  - Status: CANCELLED (red)         │
│  - Payment: REFUNDED (blue)        │
│  - Refund ID visible               │
└────────────────┬────────────────────┘
                 │
                 ▼
GUEST DASHBOARD
┌────────────────────────────────────┐
│  DashboardPage.jsx (auto-refresh)  │
│  Booking updates:                  │
│  - Status: CANCELLED (red)         │
│  - Payment: REFUNDED (blue)        │
│  - Refund: PROCESSED (green) ✓     │
│  - Shows refund confirmation       │
└────────────────────────────────────┘

RAZORPAY ACCOUNT
┌────────────────────────────────────┐
│  ✓ Refund created with ID          │
│  ✓ Amount ₹15000 marked for return │
│  ✓ Guest receives refund (1-3 days)│
└────────────────────────────────────┘

✅ REFUND APPROVED & PROCESSED
Admin: sees success message ✓
Guest: sees refund processed ✓
Razorpay: refund initiated ✓
Database: booking status updated ✓
Guest account: refund pending ✓
```

---

## 4️⃣ Refund Rejection Flow (Admin)

```
┌─────────────────────────────────────────────────────────────────────────┐
│               REFUND REJECTION FLOW (ADMIN DENIES)                      │
└─────────────────────────────────────────────────────────────────────────┘

ADMIN DASHBOARD
(Same as approval flow until...)
       │
       ▼
       ┌────────────────────────────┐
       │  Refund Modal              │
       │                            │
       │  Admin selects: REJECT     │
       │  Clicks "Reject"           │
       └────────────┬───────────────┘
                    │
                    ▼
BACKEND REQUEST
┌──────────────────────────────────────┐
│  PUT /bookings/{id}/refund/status    │
│  {                                   │
│    action: "reject"                  │
│  }                                   │
└──────────────────┬───────────────────┘
                   │
                   ▼
BACKEND (Server)
┌──────────────────────────────────────┐
│  bookingController.updateRefundStatus│
│                                      │
│  1. Verify refund in "requested"     │
│  2. Update booking:                  │
│     - refundStatus: "rejected"       │
│     - ❌ DO NOT call Razorpay        │
│     - ❌ DO NOT refund money         │
│     - Booking stays "confirmed"      │
│     - Payment stays "completed"      │
│  3. Save booking                     │
│  4. Return response                  │
└──────────────────┬───────────────────┘
                   │
                   ▼
ADMIN INTERFACE
┌────────────────────────────────────┐
│  AdminBookings.jsx                 │
│  Modal closes                      │
│  Success message:                  │
│  "Refund request rejected"         │
│                                    │
│  Booking list reloads:             │
│  Booking unchanged:               │
│  - Status: CONFIRMED (still green) │
│  - Payment: COMPLETED (still green)│
│  - Can see refund was rejected     │
└────────────────┬────────────────────┘
                 │
                 ▼
GUEST DASHBOARD
┌────────────────────────────────────┐
│  DashboardPage.jsx (auto-refresh)  │
│  Booking updates:                  │
│  - Status: CONFIRMED (green)       │
│  - Payment: ✓ PAID (green)        │
│  - Refund: REJECTED (red) ❌       │
│  - "Request Refund" button         │
│    appears again (can retry)       │
└────────────────────────────────────┘

✅ REFUND REJECTED
Admin: refund denied ✓
Guest: sees rejection ✓
Money: stays with hotel ✓
Booking: remains confirmed ✓
Guest can: request refund again ✓
```

---

## 5️⃣ Status Summary Table

```
┌────────────────────────────────────────────────────────────────────┐
│                    STATUS COMBINATIONS                              │
├────────────────────────────────────────────────────────────────────┤

NEW BOOKING:
  Booking Status: PENDING
  Payment Status: PENDING
  Refund Status: NONE

PAYMENT COMPLETED:
  Booking Status: CONFIRMED ✓
  Payment Status: COMPLETED ✓
  Refund Status: NONE
  → Guest can now request refund

REFUND REQUESTED:
  Booking Status: CONFIRMED
  Payment Status: COMPLETED ✓
  Refund Status: REQUESTED 🟡
  → Waiting for admin approval

REFUND APPROVED (Processing):
  Booking Status: CONFIRMED
  Payment Status: COMPLETED ✓
  Refund Status: APPROVED 🔵
  → Razorpay processing...

REFUND PROCESSED:
  Booking Status: CANCELLED ❌
  Payment Status: REFUNDED 🔵
  Refund Status: PROCESSED ✓
  → Guest receives money in 1-3 days

REFUND REJECTED:
  Booking Status: CONFIRMED ✓
  Payment Status: COMPLETED ✓
  Refund Status: REJECTED ❌
  → Guest can request again

CANCELLED BOOKING (No Payment):
  Booking Status: CANCELLED ❌
  Payment Status: PENDING
  Refund Status: NONE
  → No refund needed

FAILED PAYMENT:
  Booking Status: PENDING
  Payment Status: FAILED ❌
  Refund Status: NONE
  → Can retry payment

└────────────────────────────────────────────────────────────────────┘
```

---

## 6️⃣ Real-time Updates Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                  REAL-TIME AUTO REFRESH FLOW                             │
└─────────────────────────────────────────────────────────────────────────┘

EVENT: Guest completes payment
│
├─→ Backend updates booking status → database
│
├─→ Frontend redirects to dashboard
│
├─→ Dashboard.jsx calls loadBookings()
│   - Fetches all bookings from API
│   - Gets latest status from database
│   - Updates state with new data
│
├─→ Admin Dashboard (if open)
│   - NO AUTO REFRESH (requires manual refresh)
│   - Can implement WebSocket for real-time
│
└─→ Result: Guest sees confirmed booking ✓

EVENT: Guest requests refund
│
├─→ Backend updates refundStatus → database
│
├─→ Frontend calls loadBookings()
│
├─→ Dashboard refreshes with "requested" status
│
└─→ Result: Status updates immediately ✓

EVENT: Admin approves refund
│
├─→ Backend calls Razorpay API
│
├─→ Razorpay processes refund
│
├─→ Backend updates booking status → database
│
├─→ Frontend reloads bookings
│
├─→ Admin panel refreshes
│
└─→ Result: Booking shows "cancelled" + "refunded" ✓
```

---

## 7️⃣ Data Structure in Database

```json
{
  "bookings": {
    "_id": "ObjectId",
    "bookingNumber": "BK-1701612345-9876",
    "guest": "ObjectId",
    "room": "ObjectId",
    "status": "confirmed|pending|cancelled|checked-in|checked-out",
    "paymentStatus": "pending|completed|failed|refunded|partial",
    "paymentMethod": "razorpay",
    "transactionId": "pay_xyz123abc",

    "totalPrice": 15000,
    "paidAmount": 15000,
    "bookingType": "full|partial",

    "refundStatus": "none|requested|approved|rejected|processed",
    "refundAmount": 15000,
    "refundReason": "Change of plans",
    "refundId": "rfnd_abc456def",
    "refundRequestedAt": "2025-12-03T10:30:00Z",
    "refundProcessedAt": "2025-12-03T11:00:00Z",

    "createdAt": "2025-12-03T09:00:00Z",
    "updatedAt": "2025-12-03T11:05:00Z"
  }
}
```

---

_These diagrams show the complete flow of payment processing and refund management in your system._
