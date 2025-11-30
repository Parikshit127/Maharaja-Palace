import express from 'express';
import {
  createBanquetHall,
  getAllBanquetHalls,
  updateBanquetHall,
  deleteBanquetHall,
  createBanquetBooking,
  getMyBanquetBookings,
  getBanquetHallById,
  getAllBanquetBookings,
} from '../controllers/banquetController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Admin routes - Halls
router.post('/halls', protect, authorize('admin'), createBanquetHall);
router.put('/halls/:id', protect, authorize('admin'), updateBanquetHall);
router.delete('/halls/:id', protect, authorize('admin'), deleteBanquetHall);

// Guest routes
router.get('/halls', getAllBanquetHalls);
router.get('/halls/:id', getBanquetHallById);
router.post('/bookings', protect, createBanquetBooking);
router.get('/bookings', protect, authorize('admin', 'manager'), getAllBanquetBookings);
router.get('/bookings/me', protect, getMyBanquetBookings);

export default router;
