import express from "express";
import {
  createBooking,
  getMyBookings,
  getAllBookings,
  getBookingDetails,
  cancelBooking,
  updateBookingStatus,
  updateBookingPayment,
  getUserBookings,
  requestRefund,
  updateRefundStatus,
  getRefundStatus,
  markBookingAsPaid,
} from "../controllers/bookingController.js";
import { protect, authorize } from "../middleware/auth.js";
import {
  validateRoomAvailability,
  preventConcurrentBooking,
} from "../middleware/bookingValidation.js";

const router = express.Router();

// ⚠️ CRITICAL: Specific routes MUST come BEFORE dynamic routes like /:id

// Guest routes - Get my bookings (MUST be before /:bookingId)
router.get("/me", protect, getMyBookings);

// Admin routes (MUST be before /:bookingId)
router.get("/", protect, authorize("admin"), getAllBookings);
router.get("/user/:userId", protect, authorize("admin"), getUserBookings);

// Guest routes - Create booking with validation middleware
router.post(
  "/",
  protect,
  preventConcurrentBooking, // Step 1: Check for concurrent booking attempts
  validateRoomAvailability, // Step 2: Validate room is available for dates
  createBooking // Step 3: Create the booking
);

// Dev helper: Mark booking as paid without going through gateway
router.put("/:bookingId/mark-paid", protect, markBookingAsPaid);

// Refund routes
router.post("/:bookingId/refund/request", protect, requestRefund);
router.put(
  "/:bookingId/refund/status",
  protect,
  authorize("admin"),
  updateRefundStatus
);
router.get("/:bookingId/refund/status", protect, getRefundStatus);

// Dynamic routes (MUST come AFTER specific routes)
router.get("/:bookingId", protect, getBookingDetails);
router.put("/:bookingId/cancel", protect, cancelBooking);
router.put("/:id/payment", protect, updateBookingPayment);
router.put(
  "/:bookingId/status",
  protect,
  authorize("admin"),
  updateBookingStatus
);

export default router;
