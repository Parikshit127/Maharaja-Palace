import express from "express";
import {
  createRestaurantTable,
  getAllRestaurantTables,
  updateRestaurantTable,
  deleteRestaurantTable,
  createRestaurantBooking,
  getMyRestaurantBookings,
  getRestaurantTableById,
  getAllRestaurantBookings,
  updateRestaurantBookingStatus,
  searchRestaurantBookings,
  getAvailableTables,
  cancelRestaurantBooking,
  updateRestaurantBookingPayment,
} from "../controllers/restaurantController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

// Public routes - Get tables
router.get("/tables", getAllRestaurantTables);
router.get("/tables/:id", getRestaurantTableById);
router.get("/tables/available", getAvailableTables);

// Guest routes - Bookings (MUST come before admin routes)
router.post("/bookings", protect, createRestaurantBooking);
router.get("/bookings/me", protect, getMyRestaurantBookings);
router.put("/bookings/:id/cancel", protect, cancelRestaurantBooking);
router.put("/bookings/:id/payment", protect, updateRestaurantBookingPayment);

// Admin routes - Table management
router.post("/tables", protect, authorize("admin"), createRestaurantTable);
router.put("/tables/:id", protect, authorize("admin"), updateRestaurantTable);
router.delete(
  "/tables/:id",
  protect,
  authorize("admin"),
  deleteRestaurantTable
);

// Admin routes - Booking management (MUST come after specific routes)
router.get(
  "/bookings/search",
  protect,
  authorize("admin", "manager"),
  searchRestaurantBookings
);
router.get(
  "/bookings",
  protect,
  authorize("admin", "manager"),
  getAllRestaurantBookings
);
router.put(
  "/bookings/:id/status",
  protect,
  authorize("admin", "manager"),
  updateRestaurantBookingStatus
);

export default router;
