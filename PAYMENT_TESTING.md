# Payment & Refund Integration Testing

This document lists quick cURL / PowerShell commands to manually test the booking → payment → refund flow in development.

Prerequisites

- Backend running (default `http://localhost:5000`) with env vars:
  - `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`
  - `JWT` token for an authenticated user (or use direct DB seeding)
- Frontend running (optional) to create bookings

Important: In development the server may allow signature verification bypass for convenience; in production verification is enforced.

1. Create a booking (authenticated user)

curl example (replace token and room id):

```bash
curl -X POST "http://localhost:5000/api/bookings" \
  -H "Authorization: Bearer <USER_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "room":"<ROOM_ID>",
    "checkInDate":"2025-12-10",
    "checkOutDate":"2025-12-12",
    "numberOfGuests":2,
    "roomRate":1500,
    "bookingType":"full"
  }'
```

Response includes `booking._id`.

2. Create a Razorpay order via backend

```bash
curl -X POST "http://localhost:5000/api/payments/order" \
  -H "Authorization: Bearer <USER_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"amount":3000, "bookingId":"<BOOKING_ID>"}'
```

Response will include `order` (with `id` and `amount`) and `key`.

3. Open the Razorpay Checkout (performed by frontend) or simulate successful payment by calling the booking update API

Simulate invoking the backend booking update (use values from Razorpay test response):

```bash
curl -X PUT "http://localhost:5000/api/bookings/<BOOKING_ID>/payment" \
  -H "Authorization: Bearer <USER_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "amount":3000,
    "paymentId":"pay_test_123",
    "orderId":"order_test_123",
    "signature":"sig_test_123"
  }'
```

In development the server may accept this simulated signature; in production the signature must match.

4. Request a refund (user)

```bash
curl -X POST "http://localhost:5000/api/bookings/<BOOKING_ID>/refund/request" \
  -H "Authorization: Bearer <USER_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"reason":"Change of plans"}'
```

5. Approve refund (admin)

```bash
curl -X PUT "http://localhost:5000/api/bookings/<BOOKING_ID>/refund/status" \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"action":"approve"}'
```

This will call Razorpay refund API (if configured) and update booking `paymentStatus` to `refunded`.

Webhook testing

- Configure `RAZORPAY_WEBHOOK_SECRET` in your backend env and set webhook URL in Razorpay dashboard to `https://<your-host>/api/payments/webhook`.
- The route uses `express.raw` to verify signature correctly.

Automated integration test script

I added a Node script you can run to exercise the full flow (create booking, create order, simulate payment, request refund, approve refund):

1. Install script deps (in the `backend` folder):

```powershell
cd backend
npm install axios
```

2. Create environment variables (example PowerShell):

```powershell
#$env:BASE_URL = "http://localhost:5000"
#$env:TEST_USER_EMAIL = "testuser@example.com"
#$env:TEST_USER_PASSWORD = "Password123!"
#$env:TEST_ADMIN_EMAIL = "admin@example.com"    # optional - required to create rooms or approve refunds
#$env:TEST_ADMIN_PASSWORD = "AdminPassword!"
#$env:RAZORPAY_KEY_SECRET = "rzp_test_secret"  # optional - script will create a valid HMAC signature if provided
```

3. Run the script from the repo root or backend folder:

```powershell
node backend\scripts\integrationTest.js
```

Notes:

- If you don't provide `TEST_ROOM_ID` the script will try to pick an existing room; if none exists it attempts to create one using admin credentials (so provide admin creds if you need the script to create rooms).
- If `RAZORPAY_KEY_SECRET` is set, the script will generate a valid signature for the simulated payment; otherwise it will send a dummy signature (and the server may accept it in development).
- The script logs each step and exits on errors.
  Troubleshooting

- If signature verification fails in production, ensure `RAZORPAY_KEY_SECRET` is correct and the payment/order IDs come from Razorpay.
- If you need to simulate end-to-end in local development without Razorpay, use the booking update endpoint to mimic a successful payment (step 3).
