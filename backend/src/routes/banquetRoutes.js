import express from "express";
import upload from "../middleware/multer.js";

import {
  createBanquetHall,
  updateBanquetHall,
  deleteBanquetHall,
  getBanquetHalls,
  getBanquetBookings,
  getBanquetDashboardStats,
} from "../controllers/banquetController.js";

const router = express.Router();

// ---------------------------
// Banquet Halls Routes
// ---------------------------

// Get all banquet halls
router.get("/halls", getBanquetHalls);

// Create a new banquet hall (with images)
router.post("/halls", upload.array("images", 10), createBanquetHall);

// Update existing banquet hall (with new images)
router.put("/halls/:id", upload.array("images", 10), updateBanquetHall);

// Delete a banquet hall
router.delete("/halls/:id", deleteBanquetHall);

// ---------------------------
// Bookings Routes
// ---------------------------

// Get all banquet bookings
router.get("/bookings", getBanquetBookings);

// ---------------------------
// Statistics Route
// ---------------------------

// Admin stats: total halls, bookings, revenue etc.
router.get("/stats", getBanquetDashboardStats);

export default router;
