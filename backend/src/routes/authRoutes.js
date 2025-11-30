import express from 'express';
import { 
  register, 
  login, 
  getMe, 
  getAllUsers, 
  getUserDetails, 
  updateUser, 
  toggleUserStatus 
} from '../controllers/authController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);

// Admin routes
router.get('/users', protect, authorize('admin'), getAllUsers);
router.get('/users/:id', protect, authorize('admin'), getUserDetails);
router.put('/users/:id', protect, authorize('admin'), updateUser);
router.put('/users/:id/status', protect, authorize('admin'), toggleUserStatus);

export default router;
