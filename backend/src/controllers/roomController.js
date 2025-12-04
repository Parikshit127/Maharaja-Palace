import Room from "../models/Room.js";
import RoomType from "../models/RoomType.js";
import Booking from "../models/Booking.js"; // Make sure you have this model
import { logger } from "../utils/logger.js";
import { cloudinary } from "../middleware/upload.js";

// Upload Room Image
export const uploadRoomImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload an image file",
      });
    }

    // File is already uploaded to Cloudinary by multer middleware
    const imageUrl = req.file.path;
    const publicId = req.file.filename;

    logger.info(`Image uploaded to Cloudinary: ${publicId}`);

    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      image: {
        url: imageUrl,
        publicId: publicId,
      },
    });
  } catch (error) {
    logger.error(`Upload image error: ${error.message}`);
    next(error);
  }
};

// Admin - Create Room Type
export const createRoomType = async (req, res, next) => {
  try {
    const {
      name,
      description,
      amenities,
      basePrice,
      maxOccupancy,
      squareFeet,
      features,
    } = req.body;

    if (!name || !description || !basePrice || !maxOccupancy || !squareFeet) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const roomType = await RoomType.create({
      name,
      description,
      amenities,
      basePrice,
      maxOccupancy,
      squareFeet,
      features,
      images: req.body.images || [],
      isActive: true,
    });

    logger.info(`Room type created: ${name}`);

    res.status(201).json({
      success: true,
      message: "Room type created successfully",
      roomType,
    });
  } catch (error) {
    logger.error(`Create room type error: ${error.message}`);
    next(error);
  }
};

// Admin - Get All Room Types
export const getAllRoomTypes = async (req, res, next) => {
  try {
    const roomTypes = await RoomType.find({ isActive: true });

    res.status(200).json({
      success: true,
      count: roomTypes.length,
      roomTypes,
    });
  } catch (error) {
    logger.error(`Get room types error: ${error.message}`);
    next(error);
  }
};

// Admin - Create Room
export const createRoom = async (req, res, next) => {
  try {
    logger.info('📝 CREATE ROOM REQUEST RECEIVED');
    logger.info('Request body:', JSON.stringify(req.body, null, 2));
    
    const { roomNumber, roomType, floor, currentPrice, status } = req.body;

    if (!roomNumber || !roomType || !floor || !currentPrice) {
      logger.error('❌ Missing required fields');
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    logger.info(`✓ Validation passed for room ${roomNumber}`);

    // Check if room type exists
    const type = await RoomType.findById(roomType);
    if (!type) {
      logger.error(`❌ Room type not found: ${roomType}`);
      return res.status(404).json({
        success: false,
        message: "Room type not found",
      });
    }

    logger.info(`✓ Room type found: ${type.name}`);

    // Ensure status is set to available if not provided
    const roomStatus = status || "available";

    logger.info(`Creating room with data:`, {
      roomNumber,
      roomType: type.name,
      floor,
      status: roomStatus,
      currentPrice,
      isActive: true
    });

    const room = await Room.create({
      roomNumber,
      roomType,
      floor,
      status: roomStatus,
      currentPrice,
      isActive: true, // Explicitly set isActive to true
    });

    logger.info(`✅ Room created successfully: ${roomNumber} (ID: ${room._id})`);

    const populatedRoom = await room.populate("roomType");

    logger.info(`✅ Room populated and ready to return`);

    res.status(201).json({
      success: true,
      message: "Room created successfully",
      room: populatedRoom,
    });
  } catch (error) {
    logger.error(`❌ Create room error: ${error.message}`);
    logger.error(`Error stack: ${error.stack}`);
    
    // Check for duplicate key error
    if (error.code === 11000) {
      logger.error(`Duplicate room number: ${req.body.roomNumber}`);
      return res.status(400).json({
        success: false,
        message: `Room number ${req.body.roomNumber} already exists`,
      });
    }
    
    next(error);
  }
};

// Admin - Get All Rooms
export const getAllRooms = async (req, res, next) => {
  try {
    const rooms = await Room.find({ isActive: true }).populate("roomType");

    res.status(200).json({
      success: true,
      count: rooms.length,
      rooms,
    });
  } catch (error) {
    logger.error(`Get rooms error: ${error.message}`);
    next(error);
  }
};

// Helper function to check if dates overlap
const datesOverlap = (start1, end1, start2, end2) => {
  return start1 < end2 && start2 < end1;
};

// Guest - Get Available Rooms (Enhanced with booking conflict check)
export const getAvailableRooms = async (req, res, next) => {
  try {
    const { checkIn, checkOut, guests } = req.query;

    if (!checkIn || !checkOut || !guests) {
      return res.status(400).json({
        success: false,
        message: "Please provide checkIn, checkOut, and guests dates",
      });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    // Validate dates
    if (checkInDate >= checkOutDate) {
      return res.status(400).json({
        success: false,
        message: "Check-out date must be after check-in date",
      });
    }

    if (checkInDate < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Check-in date cannot be in the past",
      });
    }

    // Get all active rooms
    const allRooms = await Room.find({
      isActive: true,
    }).populate("roomType");

    logger.info(`📊 Total active rooms in database: ${allRooms.length}`);
    
    // Log room details for debugging
    allRooms.forEach(room => {
      logger.info(`  Room ${room.roomNumber}: status=${room.status}, isActive=${room.isActive}, type=${room.roomType?.name}`);
    });

    // Find all bookings that overlap with the requested dates
    const overlappingBookings = await Booking.find({
      status: { $in: ["confirmed", "pending"] },
      $or: [
        {
          checkInDate: { $lt: checkOutDate },
          checkOutDate: { $gt: checkInDate },
        },
      ],
    }).select("room");

    logger.info(`📅 Overlapping bookings found: ${overlappingBookings.length}`);

    // Get IDs of booked rooms
    const bookedRoomIds = overlappingBookings.map((booking) =>
      booking.room.toString()
    );

    logger.info(`🔒 Booked room IDs: ${bookedRoomIds.join(', ') || 'none'}`);

    // Filter out booked rooms and check occupancy
    const availableRooms = allRooms.filter((room) => {
      const isNotBooked = !bookedRoomIds.includes(room._id.toString());
      const hasCapacity = room.roomType.maxOccupancy >= parseInt(guests);
      const isAvailable = room.status === "available";

      logger.info(`  Room ${room.roomNumber}: notBooked=${isNotBooked}, hasCapacity=${hasCapacity}, statusAvailable=${isAvailable}`);

      return isNotBooked && hasCapacity && isAvailable;
    });

    logger.info(`✅ Available rooms after filtering: ${availableRooms.length}`);

    res.status(200).json({
      success: true,
      count: availableRooms.length,
      rooms: availableRooms,
      checkIn: checkInDate,
      checkOut: checkOutDate,
    });
  } catch (error) {
    logger.error(`Get available rooms error: ${error.message}`);
    next(error);
  }
};

// Check Room Availability (New endpoint)
export const checkRoomAvailability = async (req, res, next) => {
  try {
    const { roomId, checkIn, checkOut } = req.query;

    if (!roomId || !checkIn || !checkOut) {
      return res.status(400).json({
        success: false,
        message: "Please provide roomId, checkIn, and checkOut dates",
      });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    // Validate dates
    if (checkInDate >= checkOutDate) {
      return res.status(400).json({
        success: false,
        message: "Check-out date must be after check-in date",
      });
    }

    // Check if room exists
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    // Find overlapping bookings for this specific room
    const overlappingBooking = await Booking.findOne({
      room: roomId,
      status: { $in: ["confirmed", "pending"] },
      $or: [
        {
          checkInDate: { $lt: checkOutDate },
          checkOutDate: { $gt: checkInDate },
        },
      ],
    });

    const isAvailable = !overlappingBooking && room.status === "available";

    res.status(200).json({
      success: true,
      available: isAvailable,
      room: {
        id: room._id,
        roomNumber: room.roomNumber,
        status: room.status,
      },
      conflictingBooking: overlappingBooking
        ? {
            checkIn: overlappingBooking.checkInDate,
            checkOut: overlappingBooking.checkOutDate,
          }
        : null,
    });
  } catch (error) {
    logger.error(`Check room availability error: ${error.message}`);
    next(error);
  }
};

// Get Available Room Types with count (New endpoint)
export const getAvailableRoomTypes = async (req, res, next) => {
  try {
    const { checkIn, checkOut, guests } = req.query;

    if (!checkIn || !checkOut) {
      return res.status(400).json({
        success: false,
        message: "Please provide checkIn and checkOut dates",
      });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    // Get all room types
    const roomTypes = await RoomType.find({ isActive: true });

    // Get all rooms
    const allRooms = await Room.find({ isActive: true }).populate("roomType");

    // Find overlapping bookings
    const overlappingBookings = await Booking.find({
      status: { $in: ["confirmed", "pending"] },
      $or: [
        {
          checkInDate: { $lt: checkOutDate },
          checkOutDate: { $gt: checkInDate },
        },
      ],
    }).select("room");

    const bookedRoomIds = overlappingBookings.map((booking) =>
      booking.room.toString()
    );

    // Calculate available rooms per room type
    const roomTypesWithAvailability = roomTypes.map((roomType) => {
      const roomsOfThisType = allRooms.filter(
        (room) =>
          room.roomType._id.toString() === roomType._id.toString() &&
          room.status === "available" &&
          !bookedRoomIds.includes(room._id.toString())
      );

      const guestCount = guests ? parseInt(guests) : 1;
      const canAccommodate = roomType.maxOccupancy >= guestCount;

      return {
        ...roomType.toObject(),
        availableRooms: canAccommodate ? roomsOfThisType.length : 0,
        totalRooms: allRooms.filter(
          (room) => room.roomType._id.toString() === roomType._id.toString()
        ).length,
      };
    });

    res.status(200).json({
      success: true,
      roomTypes: roomTypesWithAvailability,
      checkIn: checkInDate,
      checkOut: checkOutDate,
    });
  } catch (error) {
    logger.error(`Get available room types error: ${error.message}`);
    next(error);
  }
};

// Admin - Update Room Status
export const updateRoomStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Please provide status",
      });
    }

    const room = await Room.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate("roomType");

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    logger.info(`Room status updated: ${room.roomNumber} - ${status}`);

    res.status(200).json({
      success: true,
      message: "Room status updated successfully",
      room,
    });
  } catch (error) {
    logger.error(`Update room status error: ${error.message}`);
    next(error);
  }
};

// Get Room By ID
export const getRoomById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const room = await Room.findById(id).populate("roomType");

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    res.status(200).json({
      success: true,
      room,
    });
  } catch (error) {
    logger.error(`Get room by id error: ${error.message}`);
    next(error);
  }
};

// Admin - Update Room Type
export const updateRoomType = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      amenities,
      basePrice,
      maxOccupancy,
      squareFeet,
      features,
      images,
    } = req.body;

    const roomType = await RoomType.findByIdAndUpdate(
      id,
      {
        name,
        description,
        amenities,
        basePrice,
        maxOccupancy,
        squareFeet,
        features,
        images,
      },
      { new: true, runValidators: true }
    );

    if (!roomType) {
      return res.status(404).json({
        success: false,
        message: "Room type not found",
      });
    }

    logger.info(`Room type updated: ${roomType.name}`);

    res.status(200).json({
      success: true,
      message: "Room type updated successfully",
      roomType,
    });
  } catch (error) {
    logger.error(`Update room type error: ${error.message}`);
    next(error);
  }
};

// Admin - Delete Room Type
export const deleteRoomType = async (req, res, next) => {
  try {
    const { id } = req.params;

    const roomType = await RoomType.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!roomType) {
      return res.status(404).json({
        success: false,
        message: "Room type not found",
      });
    }

    logger.info(`Room type deleted: ${roomType.name}`);

    res.status(200).json({
      success: true,
      message: "Room type deleted successfully",
    });
  } catch (error) {
    logger.error(`Delete room type error: ${error.message}`);
    next(error);
  }
};

// Admin - Update Room
export const updateRoom = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { roomNumber, roomType, floor, currentPrice, status } = req.body;

    const room = await Room.findByIdAndUpdate(
      id,
      { roomNumber, roomType, floor, currentPrice, status },
      { new: true, runValidators: true }
    ).populate("roomType");

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    logger.info(`Room updated: ${room.roomNumber}`);

    res.status(200).json({
      success: true,
      message: "Room updated successfully",
      room,
    });
  } catch (error) {
    logger.error(`Update room error: ${error.message}`);
    next(error);
  }
};

// Admin - Delete Room
export const deleteRoom = async (req, res, next) => {
  try {
    const { id } = req.params;

    const room = await Room.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    logger.info(`Room deleted: ${room.roomNumber}`);

    res.status(200).json({
      success: true,
      message: "Room deleted successfully",
    });
  } catch (error) {
    logger.error(`Delete room error: ${error.message}`);
    next(error);
  }
};

// DEBUG - Get all rooms with full details (for troubleshooting)
export const debugGetAllRooms = async (req, res, next) => {
  try {
    const allRooms = await Room.find({}).populate("roomType");
    
    const roomDetails = allRooms.map(room => ({
      id: room._id,
      roomNumber: room.roomNumber,
      roomType: room.roomType?.name,
      floor: room.floor,
      status: room.status,
      isActive: room.isActive,
      currentPrice: room.currentPrice,
      createdAt: room.createdAt
    }));

    logger.info(`🔍 DEBUG: Total rooms in database: ${allRooms.length}`);
    roomDetails.forEach(room => {
      logger.info(`  Room ${room.roomNumber}: status=${room.status}, isActive=${room.isActive}, type=${room.roomType}`);
    });

    res.status(200).json({
      success: true,
      count: allRooms.length,
      rooms: roomDetails
    });
  } catch (error) {
    logger.error(`Debug get all rooms error: ${error.message}`);
    next(error);
  }
};
