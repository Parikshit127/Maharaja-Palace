import express from "express";
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
  checkRoomAvailability,
  getAvailableRoomTypes,
} from "../controllers/roomController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

// ⚠️ IMPORTANT: Specific routes MUST come BEFORE dynamic routes like /:id

// Room Types routes (must come first)
router.get("/room-types", getAllRoomTypes);
router.post("/room-types", protect, authorize("admin"), createRoomType);
router.put("/room-types/:id", protect, authorize("admin"), updateRoomType);
router.delete("/room-types/:id", protect, authorize("admin"), deleteRoomType);

// Availability routes (must come before /:id)
router.get("/available", getAvailableRooms);
router.get("/available-types", getAvailableRoomTypes);
router.get("/check-availability", checkRoomAvailability);

// Admin room management routes
router.post("/", protect, authorize("admin"), createRoom);
router.get("/", protect, authorize("admin"), getAllRooms);
router.put("/:id", protect, authorize("admin"), updateRoom);
router.delete("/:id", protect, authorize("admin"), deleteRoom);
router.put("/:id/status", protect, authorize("admin"), updateRoomStatus);

// Dynamic route (must come last)
router.get("/:id", getRoomById);

export default router;
