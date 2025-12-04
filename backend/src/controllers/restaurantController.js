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

    // Calculate total price (₹500 per guest reservation fee)
    const pricePerGuest = 500;
    const totalPrice = numberOfGuests * pricePerGuest;
    const bookingType = req.body.bookingType || 'full';

    let paidAmount = 0;
    if (bookingType === 'partial') {
      paidAmount = Math.round(totalPrice * 0.10); // 10% for partial
    } else {
      paidAmount = totalPrice; // Full payment
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
      totalPrice,
      paidAmount,
      bookingType,
      paymentStatus: 'pending' // Initially pending until payment is confirmed
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

// Guest - Update Booking Payment
export const updateRestaurantBookingPayment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { amount, paymentId } = req.body;

    const booking = await RestaurantBooking.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Check if user is the booking owner
    if (booking.guest.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this booking',
      });
    }

    booking.paidAmount = (booking.paidAmount || 0) + Number(amount);
    booking.transactionId = paymentId;

    if (booking.paidAmount >= booking.totalPrice) {
      booking.paymentStatus = 'completed';
      booking.status = 'confirmed'; // Auto-confirm if fully paid
    } else {
      booking.paymentStatus = 'partial';
    }

    await booking.save();

    logger.info(`Restaurant booking payment updated: ${booking.bookingNumber}, Amount: ${amount}`);

    res.status(200).json({
      success: true,
      message: 'Payment updated successfully',
      booking,
    });
  } catch (error) {
    logger.error(`Update restaurant booking payment error: ${error.message}`);
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
    if (booking.guest.toString() !== req.user._id.toString()) {
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

// Dev helper: mark booking as paid without payment gateway
export const markRestaurantBookingAsPaid = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (process.env.NODE_ENV === "production") {
      return res.status(403).json({
        success: false,
        message: "Mark-as-paid is disabled in production",
      });
    }

    const booking = await RestaurantBooking.findById(id).populate("guest");

    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    // Only allow owner or admin to mark paid
    if (
      booking.guest._id.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to mark this booking as paid",
      });
    }

    booking.paidAmount = booking.totalPrice;
    booking.transactionId = `dev_test_${Date.now()}`;
    booking.paymentStatus = "completed";
    booking.status = "confirmed";

    await booking.save();

    logger.info(
      `Restaurant booking marked as paid (dev): ${booking.bookingNumber} by ${req.user.id}`
    );

    res
      .status(200)
      .json({ success: true, message: "Booking marked as paid", booking });
  } catch (error) {
    logger.error(`Mark restaurant booking paid error: ${error.message}`);
    next(error);
  }
};

// ===========================
// REFUNDS
// ===========================

// Guest - Request Refund
export const requestRestaurantRefund = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const { reason } = req.body;

    const booking = await RestaurantBooking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Verify user owns the booking
    if (booking.guest.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to refund this booking",
      });
    }

    // Check if payment is completed
    if (booking.paymentStatus !== "completed") {
      return res.status(400).json({
        success: false,
        message: "Can only refund completed payments",
      });
    }

    // Check if refund already exists
    if (
      booking.refundStatus === "requested" ||
      booking.refundStatus === "processed"
    ) {
      return res.status(400).json({
        success: false,
        message: "Refund already requested for this booking",
      });
    }

    // Update booking with refund request
    booking.refundStatus = "requested";
    booking.refundAmount = booking.paidAmount;
    booking.refundReason = reason || "No reason provided";
    booking.refundRequestedAt = new Date();

    await booking.save();

    logger.info(`Refund requested for restaurant booking: ${booking.bookingNumber}`);

    res.status(200).json({
      success: true,
      message: "Refund request submitted successfully",
      booking,
    });
  } catch (error) {
    logger.error(`Request restaurant refund error: ${error.message}`);
    next(error);
  }
};

// Admin - Approve/Reject Refund
export const updateRestaurantRefundStatus = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const { action, reason } = req.body; // action: 'approve' or 'reject'

    if (!["approve", "reject"].includes(action)) {
      return res.status(400).json({
        success: false,
        message: "Invalid action. Must be approve or reject",
      });
    }

    const booking = await RestaurantBooking.findById(bookingId).populate([
      "guest",
      "table",
    ]);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.refundStatus !== "requested") {
      return res.status(400).json({
        success: false,
        message: "Refund must be in requested status",
      });
    }

    if (action === "reject") {
      booking.refundStatus = "rejected";
      booking.refundRejectionReason = reason || "Refund request denied by admin";
      booking.refundProcessedBy = req.user._id;
      await booking.save();

      logger.info(`Refund rejected for restaurant booking: ${booking.bookingNumber}`);

      return res.status(200).json({
        success: true,
        message: "Refund request rejected",
        booking,
      });
    }

    // Approve refund - will be processed after 12 hours
    if (action === "approve") {
      booking.refundStatus = "approved";
      booking.refundApprovedAt = new Date();
      booking.refundProcessedBy = req.user._id;
      
      await booking.save();

      logger.info(
        `Refund approved for restaurant booking: ${booking.bookingNumber}. Will process in 12 hours.`
      );

      res.status(200).json({
        success: true,
        message: "Refund approved. Payment will be processed in 12 hours.",
        booking,
        processingTime: "12 hours",
      });
    }
  } catch (error) {
    logger.error(`Update restaurant refund status error: ${error.message}`);
    next(error);
  }
};

// Guest - Get Refund Status
export const getRestaurantRefundStatus = async (req, res, next) => {
  try {
    const { bookingId } = req.params;

    const booking = await RestaurantBooking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.guest.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this booking",
      });
    }

    res.status(200).json({
      success: true,
      refundStatus: booking.refundStatus,
      refundAmount: booking.refundAmount,
      refundReason: booking.refundReason,
      refundRequestedAt: booking.refundRequestedAt,
      refundProcessedAt: booking.refundProcessedAt,
      refundId: booking.refundId,
    });
  } catch (error) {
    logger.error(`Get restaurant refund status error: ${error.message}`);
    next(error);
  }
};

// Cron job helper: Process scheduled refunds (approved > 12 hours ago)
export const processScheduledRestaurantRefunds = async () => {
  try {
    const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);
    
    // Find bookings approved for refund more than 12 hours ago but not yet processed
    const bookingsToRefund = await RestaurantBooking.find({
      refundStatus: "approved",
      refundApprovedAt: { $lte: twelveHoursAgo },
    });

    if (bookingsToRefund.length > 0) {
      logger.info(`Found ${bookingsToRefund.length} restaurant bookings to process for refund`);
    }

    for (const booking of bookingsToRefund) {
      try {
        // Process actual refund via Razorpay
        // Note: Assuming refundPayment service is imported
        const { refundPayment } = await import("../services/paymentService.js");
        
        const refundResult = await refundPayment(
          booking.transactionId,
          booking.paidAmount
        );

        if (refundResult.success) {
          // Update booking with refund details
          booking.refundStatus = "processed";
          booking.refundId = refundResult.refundId;
          booking.refundProcessedAt = new Date();
          booking.paymentStatus = "refunded";
          booking.status = "cancelled"; // Auto-cancel on full refund

          await booking.save();

          logger.info(
            `Auto-processed refund for restaurant booking: ${booking.bookingNumber} - Refund ID: ${refundResult.refundId}`
          );
        } else {
          logger.error(
            `Failed to auto-process refund for ${booking.bookingNumber}: ${refundResult.error}`
          );
        }
      } catch (err) {
        logger.error(
          `Error processing refund for ${booking.bookingNumber}: ${err.message}`
        );
      }
    }
  } catch (error) {
    logger.error(`Process scheduled restaurant refunds error: ${error.message}`);
  }
};
