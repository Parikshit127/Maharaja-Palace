#!/usr/bin/env node
import axios from "axios";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const BASE = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;

const ADMIN_EMAIL = process.env.TEST_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.TEST_ADMIN_PASSWORD;
const USER_EMAIL = process.env.TEST_USER_EMAIL || `testuser+${Date.now()}@example.com`;
const USER_PASSWORD = process.env.TEST_USER_PASSWORD || "Password123!";
const ROOM_ID = process.env.TEST_ROOM_ID || null;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function authLogin(email, password) {
  try {
    const res = await axios.post(`${BASE}/api/auth/login`, { email, password });
    return res.data.token || res.data.token || res.data?.token || res.data?.token;
  } catch (err) {
    return null;
  }
}

async function registerUser(email, password) {
  try {
    const res = await axios.post(`${BASE}/api/auth/register`, { firstName: "Test", lastName: "User", email, password });
    return res.data.token || null;
  } catch (err) {
    console.error("Register user failed:", err.response?.data || err.message);
    return null;
  }
}

async function main() {
  console.log("Starting integration test against:", BASE);

  // Ensure axios will not throw on non-2xx automatically when reading responses

  // Admin login
  let adminToken = null;
  if (ADMIN_EMAIL && ADMIN_PASSWORD) {
    console.log("Logging in admin...");
    try {
      const res = await axios.post(`${BASE}/api/auth/login`, { email: ADMIN_EMAIL, password: ADMIN_PASSWORD });
      adminToken = res.data.token;
      console.log("Admin token acquired");
    } catch (err) {
      console.warn("Admin login failed - continuing without admin. Error:", err.response?.data || err.message);
    }
  } else {
    console.log("No admin credentials supplied (TEST_ADMIN_EMAIL/TEST_ADMIN_PASSWORD). Some steps may require admin.");
  }

  // Create or login user
  console.log("Registering test user (or login if exists)...");
  let userToken = await registerUser(USER_EMAIL, USER_PASSWORD);
  if (!userToken) {
    console.log("Register failed or user exists, attempting login...");
    const loginRes = await axios.post(`${BASE}/api/auth/login`, { email: USER_EMAIL, password: USER_PASSWORD }).catch((e) => ({ data: null, error: e }));
    if (loginRes?.data?.token) userToken = loginRes.data.token;
  }

  if (!userToken) {
    console.error("Failed to obtain user token. Aborting.");
    process.exit(1);
  }

  console.log("User token ready. Email:", USER_EMAIL);

  // Determine room id
  let roomId = ROOM_ID;
  if (!roomId) {
    console.log("Looking up existing rooms...");
    try {
      const roomsRes = await axios.get(`${BASE}/api/rooms`);
      const rooms = roomsRes.data.rooms || roomsRes.data;
      if (rooms && rooms.length > 0) {
        roomId = rooms[0]._id || rooms[0].id;
        console.log("Using existing room:", roomId);
      } else {
        console.log("No rooms found. Attempting to create a room (requires admin token)...");
        if (!adminToken) {
          console.error("No admin token available to create room. Provide TEST_ROOM_ID or admin creds. Aborting.");
          process.exit(1);
        }

        const newRoomPayload = {
          roomNumber: `101-${Date.now()}`,
          roomType: "standard",
          basePrice: 1500,
          amenities: ["wifi"],
        };

        const createRes = await axios.post(`${BASE}/api/rooms`, newRoomPayload, {
          headers: { Authorization: `Bearer ${adminToken}` },
        });
        roomId = createRes.data.room._id;
        console.log("Created room:", roomId);
      }
    } catch (err) {
      console.error("Failed to get or create room:", err.response?.data || err.message);
      process.exit(1);
    }
  }

  // Create booking
  console.log("Creating booking...");
  const checkIn = new Date();
  const checkOut = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
  try {
    const bookingRes = await axios.post(
      `${BASE}/api/bookings`,
      {
        room: roomId,
        checkInDate: checkIn.toISOString().slice(0, 10),
        checkOutDate: checkOut.toISOString().slice(0, 10),
        numberOfGuests: 2,
        roomRate: 1500,
        bookingType: "full",
      },
      { headers: { Authorization: `Bearer ${userToken}` } }
    );

    const booking = bookingRes.data.booking;
    console.log("Booking created:", booking._id, "Total price:", booking.totalPrice);

    // Create Razorpay order
    console.log("Creating Razorpay order via backend...");
    const orderRes = await axios.post(
      `${BASE}/api/payments/order`,
      { amount: booking.paidAmount || booking.totalPrice, bookingId: booking._id },
      { headers: { Authorization: `Bearer ${userToken}` } }
    );

    const order = orderRes.data.order;
    console.log("Order created:", order.id, "amount:", order.amount);

    // Simulate successful payment by crafting a payment id and signature (if secret present)
    const fakePaymentId = `pay_sim_${Math.random().toString(36).substring(2, 10)}`;
    let signature = "sim_signature";
    if (process.env.RAZORPAY_KEY_SECRET) {
      const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
      hmac.update(`${order.id}|${fakePaymentId}`);
      signature = hmac.digest("hex");
      console.log("Generated HMAC signature using RAZORPAY_KEY_SECRET");
    } else {
      console.log("No RAZORPAY_KEY_SECRET provided - sending dummy signature (dev may allow it)");
    }

    // Update booking payment endpoint
    console.log("Notifying backend of payment (updateBookingPayment)...");
    const updateRes = await axios.put(
      `${BASE}/api/bookings/${booking._id}/payment`,
      {
        amount: booking.paidAmount || booking.totalPrice,
        paymentId: fakePaymentId,
        orderId: order.id,
        signature,
      },
      { headers: { Authorization: `Bearer ${userToken}` } }
    );

    console.log("Payment update response:", updateRes.data.message);

    // Request refund
    console.log("Requesting refund as user...");
    const refundReq = await axios.post(
      `${BASE}/api/bookings/${booking._id}/refund/request`,
      { reason: "Testing refund flow" },
      { headers: { Authorization: `Bearer ${userToken}` } }
    );

    console.log("Refund request response:", refundReq.data.message);

    // Approve refund as admin
    if (!adminToken) {
      console.warn("Admin token not available; skipping approve refund. Provide TEST_ADMIN_EMAIL/TEST_ADMIN_PASSWORD env vars to enable this step.");
    } else {
      console.log("Approving refund as admin...");
      const approve = await axios.put(
        `${BASE}/api/bookings/${booking._id}/refund/status`,
        { action: "approve" },
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );

      console.log("Refund approve response:", approve.data.message || approve.data);
    }

    console.log("Integration test completed.");
  } catch (err) {
    console.error("Integration test step failed:", err.response?.data || err.message);
    process.exit(1);
  }
}

main();
