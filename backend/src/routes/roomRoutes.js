import express from 'express';
import {
  createRoomType,
  getAllRoomTypes,
  updateRoomType,
  deleteRoomType,
  createRoom,
  getAllRooms,
  getAvailableRooms,
  updateRoomStatus,
  updateRoom,
  deleteRoom,
  getRoomById,
} from '../controllers/roomController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Admin routes - Room Types
router.post('/room-types', protect, authorize('admin'), createRoomType);
router.get('/room-types', getAllRoomTypes);
router.put('/room-types/:id', protect, authorize('admin'), updateRoomType);
router.delete('/room-types/:id', protect, authorize('admin'), deleteRoomType);

// Admin routes - Rooms
router.post('/', protect, authorize('admin'), createRoom);
router.get('/', protect, authorize('admin'), getAllRooms);
router.put('/:id', protect, authorize('admin'), updateRoom);
router.delete('/:id', protect, authorize('admin'), deleteRoom);
router.put('/:id/status', protect, authorize('admin'), updateRoomStatus);

// Guest routes
router.get('/available', getAvailableRooms);
router.get('/:id', getRoomById);

export default router;
