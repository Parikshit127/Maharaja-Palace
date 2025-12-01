import express from "express";
import upload from "../middleware/multer.js";
import { protect, authorize } from "../middleware/auth.js";

import {
  createBanquetHall,
  updateBanquetHall,
  deleteBanquetHall,
  getBanquetHalls,
  getBanquetBookings,
  getMyBanquetBookings,
  createBanquetBooking,
  cancelBanquetBooking,
  updateBanquetBookingStatus,
  getBanquetDashboardStats,
} from "../controllers/banquetController.js";

const router = express.Router();

// ---------------------------
// Banquet Halls Routes (Public + Admin)
// ---------------------------

// Get all banquet halls (Public)
router.get("/halls", getBanquetHalls);

// Create a new banquet hall (Admin)
router.post(
  "/halls",
  protect,
  authorize("admin"),
  upload.array("images", 10),
  createBanquetHall
);

// Update existing banquet hall (Admin)
router.put(
  "/halls/:id",
  protect,
  authorize("admin"),
  upload.array("images", 10),
  updateBanquetHall
);

// Delete a banquet hall (Admin)
router.delete("/halls/:id", protect, authorize("admin"), deleteBanquetHall);

// ---------------------------
// Bookings Routes
// ---------------------------

// Guest - Create booking
router.post("/bookings", protect, createBanquetBooking);

// Guest - Get my bookings (MUST come before /bookings/:id patterns)
router.get("/bookings/me", protect, getMyBanquetBookings);

// Guest - Cancel booking
router.put("/bookings/:id/cancel", protect, cancelBanquetBooking);

// Admin - Get all bookings
router.get("/bookings", protect, authorize("admin"), getBanquetBookings);

// Admin - Update booking status
router.put(
  "/bookings/:id/status",
  protect,
  authorize("admin"),
  updateBanquetBookingStatus
);

// ---------------------------
// Statistics Route (Admin)
// ---------------------------

// Admin stats: total halls, bookings, revenue etc.
router.get("/stats", protect, authorize("admin"), getBanquetDashboardStats);

export default router;
