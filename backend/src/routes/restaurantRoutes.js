import express from 'express';
import {
  createRestaurantTable,
  getAllRestaurantTables,
  updateRestaurantTable,
  deleteRestaurantTable,
  createRestaurantBooking,
  getMyRestaurantBookings,
  getRestaurantTableById,
  getAllRestaurantBookings,
} from '../controllers/restaurantController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Admin routes - Tables
router.post('/tables', protect, authorize('admin'), createRestaurantTable);
router.put('/tables/:id', protect, authorize('admin'), updateRestaurantTable);
router.delete('/tables/:id', protect, authorize('admin'), deleteRestaurantTable);

// Guest routes
router.get('/tables', getAllRestaurantTables);
router.get('/tables/:id', getRestaurantTableById);
router.post('/bookings', protect, createRestaurantBooking);
router.get('/bookings', protect, authorize('admin', 'manager'), getAllRestaurantBookings);
router.get('/bookings/me', protect, getMyRestaurantBookings);

export default router;
