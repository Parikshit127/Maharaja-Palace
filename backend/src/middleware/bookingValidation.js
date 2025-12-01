import Booking from "../models/Booking.js";
import Room from "../models/Room.js";

/**
 * Middleware to validate room availability before creating a booking
 */
export const validateRoomAvailability = async (req, res, next) => {
  try {
    const { room, checkInDate, checkOutDate } = req.body;

    if (!room || !checkInDate || !checkOutDate) {
      return res.status(400).json({
        success: false,
        message: "Room ID, check-in date, and check-out date are required",
      });
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    // Validate dates
    if (checkIn >= checkOut) {
      return res.status(400).json({
        success: false,
        message: "Check-out date must be after check-in date",
      });
    }

    if (checkIn < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Check-in date cannot be in the past",
      });
    }

    // Check if room exists
    const roomExists = await Room.findById(room);
    if (!roomExists) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    if (!roomExists.isActive || roomExists.status === "maintenance") {
      return res.status(400).json({
        success: false,
        message: "This room is not available for booking",
      });
    }

    // Check for overlapping bookings
    const overlappingBooking = await Booking.findOne({
      room: room,
      status: { $in: ["confirmed", "pending"] },
      $or: [
        {
          checkInDate: { $lt: checkOut },
          checkOutDate: { $gt: checkIn },
        },
      ],
    });

    if (overlappingBooking) {
      return res.status(409).json({
        success: false,
        message: "This room is already booked for the selected dates",
        conflictingBooking: {
          checkIn: overlappingBooking.checkInDate,
          checkOut: overlappingBooking.checkOutDate,
          bookingId: overlappingBooking._id,
        },
      });
    }

    // If all validations pass, continue to the next middleware
    next();
  } catch (error) {
    console.error("Booking validation error:", error);
    res.status(500).json({
      success: false,
      message: "Error validating booking availability",
      error: error.message,
    });
  }
};

/**
 * Middleware to check for concurrent booking attempts (race condition prevention)
 */
export const preventConcurrentBooking = async (req, res, next) => {
  try {
    const { room, checkInDate, checkOutDate } = req.body;

    // Create a unique lock key
    const lockKey = `booking_${room}_${checkInDate}_${checkOutDate}`;

    // Check if there's a recent booking attempt (within last 30 seconds)
    const recentBooking = await Booking.findOne({
      room: room,
      checkInDate: new Date(checkInDate),
      checkOutDate: new Date(checkOutDate),
      createdAt: { $gte: new Date(Date.now() - 30000) }, // Last 30 seconds
    });

    if (recentBooking && recentBooking.status === "pending") {
      return res.status(409).json({
        success: false,
        message:
          "A booking for this room and dates is currently being processed. Please wait a moment.",
      });
    }

    next();
  } catch (error) {
    console.error("Concurrent booking check error:", error);
    next(); // Continue even if this check fails
  }
};
