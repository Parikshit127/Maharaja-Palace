import RestaurantTable from "../models/RestaurantTable.js";
import RestaurantBooking from "../models/RestaurantBooking.js";
import { logger } from "../utils/logger.js";

// Admin - Create Restaurant Table
export const createRestaurantTable = async (req, res, next) => {
  try {
    const { tableNumber, capacity, location, description, features } = req.body;

    if (!tableNumber || !capacity || !location) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const table = await RestaurantTable.create({
      tableNumber,
      capacity,
      location,
      description,
      features,
    });

    logger.info(`Restaurant table created: ${tableNumber}`);

    res.status(201).json({
      success: true,
      message: "Restaurant table created successfully",
      table,
    });
  } catch (error) {
    logger.error(`Create restaurant table error: ${error.message}`);
    next(error);
  }
};

// Get All Restaurant Tables
export const getAllRestaurantTables = async (req, res, next) => {
  try {
    const tables = await RestaurantTable.find({ isActive: true });

    res.status(200).json({
      success: true,
      count: tables.length,
      tables,
    });
  } catch (error) {
    logger.error(`Get restaurant tables error: ${error.message}`);
    next(error);
  }
};

// Get Available Tables for Date and Time
export const getAvailableTables = async (req, res, next) => {
  try {
    const { date, timeSlot } = req.query;

    if (!date || !timeSlot) {
      return res.status(400).json({
        success: false,
        message: "Please provide date and timeSlot",
      });
    }

    // Get all active tables
    const allTables = await RestaurantTable.find({ isActive: true });

    // Get booked tables for this date and time
    const bookedTables = await RestaurantBooking.find({
      bookingDate: {
        $gte: new Date(date).setHours(0, 0, 0, 0),
        $lt: new Date(date).setHours(23, 59, 59, 999),
      },
      timeSlot: timeSlot,
      status: { $in: ["pending", "confirmed"] },
    }).select("table");

    const bookedTableIds = bookedTables.map((b) => b.table.toString());

    // Filter available tables
    const availableTables = allTables.map((table) => ({
      ...table.toObject(),
      isBooked: bookedTableIds.includes(table._id.toString()),
    }));

    res.status(200).json({
      success: true,
      tables: availableTables,
    });
  } catch (error) {
    logger.error(`Get available tables error: ${error.message}`);
    next(error);
  }
};

// Guest - Create Restaurant Booking
export const createRestaurantBooking = async (req, res, next) => {
  try {
    const {
      table,
      bookingDate,
      timeSlot,
      numberOfGuests,
      specialDietaryRequirements,
      specialRequests,
    } = req.body;

    // Validate required fields
    if (!table || !bookingDate || !timeSlot || !numberOfGuests) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide all required fields: table, bookingDate, timeSlot, numberOfGuests",
      });
    }

    // Check if table exists and is active
    const tableExists = await RestaurantTable.findById(table);
    if (!tableExists) {
      return res.status(404).json({
        success: false,
        message: "Table not found",
      });
    }

    if (!tableExists.isActive) {
      return res.status(400).json({
        success: false,
        message: "This table is not available for booking",
      });
    }

    // Check table capacity
    if (numberOfGuests > tableExists.capacity) {
      return res.status(400).json({
        success: false,
        message: `This table can accommodate maximum ${tableExists.capacity} guests`,
      });
    }

    // Validate booking date (must be in the future)
    const bookingDateObj = new Date(bookingDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (bookingDateObj < today) {
      return res.status(400).json({
        success: false,
        message: "Booking date cannot be in the past",
      });
    }

    // Check for existing bookings at the same date and time slot
    const existingBooking = await RestaurantBooking.findOne({
      table: table,
      bookingDate: {
        $gte: new Date(bookingDate).setHours(0, 0, 0, 0),
        $lt: new Date(bookingDate).setHours(23, 59, 59, 999),
      },
      timeSlot: timeSlot,
      status: { $in: ["pending", "confirmed"] },
    });

    if (existingBooking) {
      return res.status(409).json({
        success: false,
        message:
          "This table is already booked for the selected date and time slot",
      });
    }

    // Create the booking
    const booking = await RestaurantBooking.create({
      guest: req.user.id,
      table,
      bookingDate,
      timeSlot,
      numberOfGuests,
      specialDietaryRequirements: specialDietaryRequirements || "",
      specialRequests: specialRequests || "",
      status: "pending",
    });

    // Populate guest and table information
    const populatedBooking = await RestaurantBooking.findById(booking._id)
      .populate("guest", "name email phone")
      .populate("table");

    logger.info(
      `Restaurant booking created: ${booking.bookingNumber} by user ${req.user.id}`
    );

    res.status(201).json({
      success: true,
      message: "Restaurant booking created successfully",
      booking: populatedBooking,
    });
  } catch (error) {
    logger.error(`Create restaurant booking error: ${error.message}`);

    // Handle specific mongoose errors
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors)
          .map((e) => e.message)
          .join(", "),
      });
    }

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid table ID format",
      });
    }

    next(error);
  }
};

// Get My Restaurant Bookings
export const getMyRestaurantBookings = async (req, res, next) => {
  try {
    const bookings = await RestaurantBooking.find({ guest: req.user.id })
      .populate("table")
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    logger.error(`Get my restaurant bookings error: ${error.message}`);
    next(error);
  }
};

// Cancel Restaurant Booking (Guest)
export const cancelRestaurantBooking = async (req, res, next) => {
  try {
    const { id } = req.params;

    const booking = await RestaurantBooking.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Check if user is the booking owner
    if (booking.guest.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to cancel this booking",
      });
    }

    // Check if booking can be cancelled
    if (booking.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Booking is already cancelled",
      });
    }

    if (booking.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel completed booking",
      });
    }

    booking.status = "cancelled";
    await booking.save();

    logger.info(`Restaurant booking cancelled: ${booking.bookingNumber}`);

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (error) {
    logger.error(`Cancel restaurant booking error: ${error.message}`);
    next(error);
  }
};

// Get Restaurant Table By ID
export const getRestaurantTableById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const table = await RestaurantTable.findById(id);

    if (!table) {
      return res.status(404).json({
        success: false,
        message: "Table not found",
      });
    }

    res.status(200).json({
      success: true,
      table,
    });
  } catch (error) {
    logger.error(`Get restaurant table by id error: ${error.message}`);
    next(error);
  }
};

// Get All Restaurant Bookings (Admin)
export const getAllRestaurantBookings = async (req, res, next) => {
  try {
    const bookings = await RestaurantBooking.find()
      .populate("guest", "name email phone")
      .populate("table")
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    logger.error(`Get all restaurant bookings error: ${error.message}`);
    next(error);
  }
};

// Search Restaurant Bookings (Admin)
export const searchRestaurantBookings = async (req, res, next) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Please provide a search query",
      });
    }

    // Search by booking number, guest name, email, or phone
    const bookings = await RestaurantBooking.find()
      .populate("guest", "name email phone")
      .populate("table")
      .sort("-createdAt");

    // Filter bookings based on search query
    const filteredBookings = bookings.filter((booking) => {
      const searchLower = query.toLowerCase();
      return (
        booking.bookingNumber?.toLowerCase().includes(searchLower) ||
        booking.guest?.name?.toLowerCase().includes(searchLower) ||
        booking.guest?.email?.toLowerCase().includes(searchLower) ||
        booking.guest?.phone?.includes(query) ||
        booking.table?.tableNumber?.toLowerCase().includes(searchLower)
      );
    });

    res.status(200).json({
      success: true,
      count: filteredBookings.length,
      bookings: filteredBookings,
    });
  } catch (error) {
    logger.error(`Search restaurant bookings error: ${error.message}`);
    next(error);
  }
};

// Update Restaurant Booking Status (Admin)
export const updateRestaurantBookingStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = [
      "pending",
      "confirmed",
      "completed",
      "cancelled",
      "no-show",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const booking = await RestaurantBooking.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    )
      .populate("guest", "name email phone")
      .populate("table");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    logger.info(
      `Restaurant booking status updated: ${booking.bookingNumber} to ${status}`
    );

    res.status(200).json({
      success: true,
      message: "Booking status updated successfully",
      booking,
    });
  } catch (error) {
    logger.error(`Update restaurant booking status error: ${error.message}`);
    next(error);
  }
};

// Admin - Update Restaurant Table
export const updateRestaurantTable = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { tableNumber, capacity, location, description, features, status } =
      req.body;

    const table = await RestaurantTable.findByIdAndUpdate(
      id,
      { tableNumber, capacity, location, description, features, status },
      { new: true, runValidators: true }
    );

    if (!table) {
      return res.status(404).json({
        success: false,
        message: "Table not found",
      });
    }

    logger.info(`Restaurant table updated: ${table.tableNumber}`);

    res.status(200).json({
      success: true,
      message: "Restaurant table updated successfully",
      table,
    });
  } catch (error) {
    logger.error(`Update restaurant table error: ${error.message}`);
    next(error);
  }
};

// Admin - Delete Restaurant Table
export const deleteRestaurantTable = async (req, res, next) => {
  try {
    const { id } = req.params;

    const table = await RestaurantTable.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!table) {
      return res.status(404).json({
        success: false,
        message: "Table not found",
      });
    }

    logger.info(`Restaurant table deleted: ${table.tableNumber}`);

    res.status(200).json({
      success: true,
      message: "Restaurant table deleted successfully",
    });
  } catch (error) {
    logger.error(`Delete restaurant table error: ${error.message}`);
    next(error);
  }
};
