import express from "express";
import {
  createOrder,
  verifyPayment,
  initiateRefund,
  getPaymentDetails,
  webhookHandler,
} from "../controllers/paymentController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

// Create a Razorpay order for a booking (user)
router.post("/order", protect, createOrder);

// Verify payment signature and attach payment to booking (user)
router.post("/verify", protect, verifyPayment);

// Initiate refund (user request) - this records request and may be invoked by user
router.post("/:bookingId/refund", protect, initiateRefund);

// Admin: get payment details
router.get("/:paymentId", protect, authorize("admin"), getPaymentDetails);

// Razorpay webhook endpoint (use raw body parser for signature verification)
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  webhookHandler
);

export default router;
