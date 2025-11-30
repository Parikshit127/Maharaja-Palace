import express from 'express';
import {
  createBooking,
  getMyBookings,
  getAllBookings,
  getBookingDetails,
  cancelBooking,
  updateBookingStatus,
  getUserBookings,
} from '../controllers/bookingController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Guest routes
router.post('/', protect, createBooking);
router.get('/me', protect, getMyBookings);
router.get('/:bookingId', protect, getBookingDetails);
router.put('/:bookingId/cancel', protect, cancelBooking);

// Admin routes
router.get('/', protect, authorize('admin'), getAllBookings);
router.put('/:bookingId/status', protect, authorize('admin'), updateBookingStatus);
router.get('/user/:userId', protect, authorize('admin'), getUserBookings);

export default router;
