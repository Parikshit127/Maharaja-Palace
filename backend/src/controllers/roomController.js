import Room from "../models/Room.js";
import RoomType from "../models/RoomType.js";
import { logger } from "../utils/logger.js";

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
    const { roomNumber, roomType, floor, currentPrice } = req.body;

    if (!roomNumber || !roomType || !floor || !currentPrice) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Check if room type exists
    const type = await RoomType.findById(roomType);
    if (!type) {
      return res.status(404).json({
        success: false,
        message: "Room type not found",
      });
    }

    const room = await Room.create({
      roomNumber,
      roomType,
      floor,
      status: "available",
      currentPrice,
    });

    logger.info(`Room created: ${roomNumber}`);

    res.status(201).json({
      success: true,
      message: "Room created successfully",
      room: await room.populate("roomType"),
    });
  } catch (error) {
    logger.error(`Create room error: ${error.message}`);
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

// Guest - Get Available Rooms
export const getAvailableRooms = async (req, res, next) => {
  try {
    const { checkIn, checkOut, guests } = req.query;

    if (!checkIn || !checkOut || !guests) {
      return res.status(400).json({
        success: false,
        message: "Please provide checkIn, checkOut, and guests dates",
      });
    }

    // Get available rooms (basic - will be enhanced with booking date checking in Phase 2)
    const availableRooms = await Room.find({
      status: "available",
      isActive: true,
    }).populate("roomType");

    // Filter by occupancy
    const filteredRooms = availableRooms.filter(
      (room) => room.roomType.maxOccupancy >= parseInt(guests)
    );

    res.status(200).json({
      success: true,
      count: filteredRooms.length,
      rooms: filteredRooms,
    });
  } catch (error) {
    logger.error(`Get available rooms error: ${error.message}`);
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
