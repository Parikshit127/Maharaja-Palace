import cloudinary from "../config/cloudinary.js";
import BanquetHall from "../models/BanquetHall.js";
import BanquetBooking from "../models/BanquetBooking.js";
import { logger } from "../utils/logger.js";

// Upload buffer to Cloudinary
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "banquet_halls",
          resource_type: "auto",
        },
        (err, result) => {
          if (err) {
            console.error("Cloudinary upload error:", err);
            reject(err);
          } else {
            console.log("✅ Image uploaded to Cloudinary:", result.secure_url);
            resolve(result.secure_url);
          }
        }
      )
      .end(buffer);
  });
};

// ===========================
// DASHBOARD STATS
// ===========================
export const getBanquetDashboardStats = async (req, res) => {
  try {
    const totalHalls = await BanquetHall.countDocuments();
    const totalBookings = await BanquetBooking.countDocuments();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayBookings = await BanquetBooking.countDocuments({
      createdAt: { $gte: today },
    });

    res.json({
      success: true,
      stats: {
        totalHalls,
        totalBookings,
        todayBookings,
      },
    });
  } catch (err) {
    console.error("Stats error:", err);
    res.status(500).json({
      success: false,
      message: "Error loading banquet dashboard stats",
    });
  }
};

// ===========================
// GET ALL HALLS
// ===========================
export const getBanquetHalls = async (req, res) => {
  try {
    const halls = await BanquetHall.find().sort({ createdAt: -1 });

    console.log(`📦 Returning ${halls.length} banquet halls`);

    res.status(200).json({
      success: true,
      banquetHalls: halls,
    });
  } catch (err) {
    console.error("Get halls error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ===========================
// CREATE BANQUET HALL
// ===========================
export const createBanquetHall = async (req, res) => {
  try {
    console.log("📝 Creating banquet hall...");
    console.log("Body:", req.body);
    console.log("Files:", req.files?.length || 0);

    const { name, description, basePrice, amenities, capacity } = req.body;

    // Validate required fields
    if (!name || !description || !basePrice) {
      return res.status(400).json({
        success: false,
        message: "Name, description, and base price are required",
      });
    }

    let gallery = [];

    // Upload multiple images
    if (req.files && req.files.length > 0) {
      console.log(`📤 Uploading ${req.files.length} images to Cloudinary...`);

      for (const file of req.files) {
        try {
          const url = await uploadToCloudinary(file.buffer);
          gallery.push({ url, alt: name });
        } catch (uploadError) {
          console.error("Failed to upload image:", uploadError);
        }
      }

      console.log(`✅ Successfully uploaded ${gallery.length} images`);
    } else {
      console.log("⚠️ No images provided");
    }

    // Parse JSON strings
    const parsedAmenities = amenities ? JSON.parse(amenities) : [];
    const parsedCapacity = capacity
      ? JSON.parse(capacity)
      : {
        theater: 0,
        cocktail: 0,
        banquet: 0,
      };

    const hall = await BanquetHall.create({
      name,
      description,
      basePrice: Number(basePrice),
      amenities: parsedAmenities,
      capacity: parsedCapacity,
      images: gallery,
    });

    console.log("✅ Banquet hall created:", hall._id);

    res.status(201).json({
      success: true,
      message: "Banquet hall created successfully",
      hall,
    });
  } catch (err) {
    console.error("Create hall error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to create hall",
      error: err.message,
    });
  }
};

// ===========================
// UPDATE HALL
// ===========================
export const updateBanquetHall = async (req, res) => {
  try {
    const { id } = req.params;

    console.log(`📝 Updating hall ${id}...`);
    console.log("Files:", req.files?.length || 0);

    let hall = await BanquetHall.findById(id);
    if (!hall) {
      return res.status(404).json({
        success: false,
        message: "Hall not found",
      });
    }

    let updatedImages = [...hall.images];

    if (req.files && req.files.length > 0) {
      console.log(`📤 Uploading ${req.files.length} new images...`);

      for (const file of req.files) {
        try {
          const url = await uploadToCloudinary(file.buffer);
          updatedImages.push({ url, alt: hall.name });
        } catch (uploadError) {
          console.error("Failed to upload image:", uploadError);
        }
      }

      console.log(`✅ Total images: ${updatedImages.length}`);
    }

    const updateData = {
      ...req.body,
      images: updatedImages,
    };

    if (req.body.amenities) {
      updateData.amenities = JSON.parse(req.body.amenities);
    }
    if (req.body.capacity) {
      updateData.capacity = JSON.parse(req.body.capacity);
    }

    const updatedHall = await BanquetHall.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    console.log("✅ Hall updated:", updatedHall._id);

    res.status(200).json({
      success: true,
      message: "Hall updated",
      hall: updatedHall,
    });
  } catch (err) {
    console.error("Update hall error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to update hall",
      error: err.message,
    });
  }
};

// ===========================
// DELETE HALL
// ===========================
export const deleteBanquetHall = async (req, res) => {
  try {
    const { id } = req.params;

    console.log(`🗑️ Deleting hall ${id}...`);

    await BanquetHall.findByIdAndDelete(id);

    console.log("✅ Hall deleted");

    res.json({
      success: true,
      message: "Hall deleted",
    });
  } catch (err) {
    console.error("Delete hall error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to delete hall",
    });
  }
};

// ===========================
// BOOKINGS - GET ALL (Admin)
// ===========================
export const getBanquetBookings = async (req, res) => {
  try {
    const bookings = await BanquetBooking.find()
      .populate("guest", "firstName lastName email phone")
      .populate("banquetHall")
      .sort("-createdAt");

    res.json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (err) {
    console.error("Get bookings error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to load bookings",
    });
  }
};

// ===========================
// BOOKINGS - GET MY BOOKINGS (Guest)
// ===========================
export const getMyBanquetBookings = async (req, res) => {
  try {
    const bookings = await BanquetBooking.find({ guest: req.user.id })
      .populate("banquetHall")
      .sort("-createdAt");

    logger.info(
      `User ${req.user.id} retrieved ${bookings.length} banquet bookings`
    );

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (err) {
    logger.error(`Get my banquet bookings error: ${err.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to load your bookings",
    });
  }
};

// ===========================
// BOOKINGS - CREATE (Guest)
// ===========================
export const createBanquetBooking = async (req, res) => {
  try {
    const {
      banquetHall,
      eventDate,
      eventType,
      expectedGuests,
      setupType,
      specialRequirements,
      bookingType = 'full'
    } = req.body;

    // Validate required fields
    if (
      !banquetHall ||
      !eventDate ||
      !eventType ||
      !expectedGuests ||
      !setupType
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Check if hall exists
    const hall = await BanquetHall.findById(banquetHall);
    if (!hall) {
      return res.status(404).json({
        success: false,
        message: "Banquet hall not found",
      });
    }

    // Check capacity
    const capacity = hall.capacity[setupType];
    if (expectedGuests > capacity) {
      return res.status(400).json({
        success: false,
        message: `This setup type can accommodate maximum ${capacity} guests`,
      });
    }

    // Check if hall is already booked for this date
    const eventDateObj = new Date(eventDate);
    const existingBooking = await BanquetBooking.findOne({
      banquetHall,
      eventDate: {
        $gte: new Date(eventDateObj).setHours(0, 0, 0, 0),
        $lt: new Date(eventDateObj).setHours(23, 59, 59, 999),
      },
      status: { $in: ["pending", "confirmed"] },
    });

    if (existingBooking) {
      return res.status(409).json({
        success: false,
        message: "This hall is already booked for the selected date",
      });
    }

    // Calculate paid amount
    const totalPrice = hall.basePrice;
    const paidAmount = bookingType === 'partial' ? Math.round(totalPrice * 0.1) : totalPrice;

    // Create booking
    const booking = await BanquetBooking.create({
      guest: req.user.id,
      banquetHall,
      eventDate,
      eventType,
      expectedGuests,
      setupType,
      hallRate: hall.basePrice,
      totalPrice,
      paidAmount,
      bookingType,
      specialRequirements: specialRequirements || "",
      status: "pending",
      paymentStatus: "pending",
    });

    const populatedBooking = await BanquetBooking.findById(booking._id)
      .populate("guest", "firstName lastName email phone")
      .populate("banquetHall");

    logger.info(`Banquet booking created: ${booking.bookingNumber}`);

    res.status(201).json({
      success: true,
      message: "Banquet booking created successfully",
      booking: populatedBooking,
    });
  } catch (err) {
    logger.error(`Create banquet booking error: ${err.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to create booking",
      error: err.message,
    });
  }
};

// ===========================
// BOOKINGS - CANCEL (Guest)
// ===========================
export const cancelBanquetBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await BanquetBooking.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Check if user owns the booking
    if (booking.guest.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to cancel this booking",
      });
    }

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

    logger.info(`Banquet booking cancelled: ${booking.bookingNumber}`);

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (err) {
    logger.error(`Cancel banquet booking error: ${err.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to cancel booking",
    });
  }
};

// ===========================
// BOOKINGS - UPDATE STATUS (Admin)
// ===========================
export const updateBanquetBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["pending", "confirmed", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const booking = await BanquetBooking.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    )
      .populate("guest", "firstName lastName email phone")
      .populate("banquetHall");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    logger.info(
      `Banquet booking status updated: ${booking.bookingNumber} to ${status}`
    );

    res.status(200).json({
      success: true,
      message: "Booking status updated successfully",
      booking,
    });
  } catch (err) {
    logger.error(`Update banquet booking status error: ${err.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to update booking status",
    });
  }
};

// ===========================
// BOOKINGS - UPDATE PAYMENT (Guest)
// ===========================
export const updateBanquetBookingPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, paymentId } = req.body;

    const booking = await BanquetBooking.findById(id);

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
        message: "Not authorized to update this booking",
      });
    }

    booking.paidAmount = (booking.paidAmount || 0) + Number(amount);

    if (booking.paidAmount >= booking.totalPrice) {
      booking.paymentStatus = "completed";
      booking.status = "confirmed";
    } else {
      booking.paymentStatus = "partial";
    }

    await booking.save();

    logger.info(`Banquet booking payment updated: ${booking.bookingNumber}, Amount: ${amount}`);

    res.status(200).json({
      success: true,
      message: "Payment updated successfully",
      booking,
    });
  } catch (err) {
    logger.error(`Update banquet booking payment error: ${err.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to update payment",
    });
  }
};

// Dev helper: mark booking as paid without payment gateway
export const markBanquetBookingAsPaid = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (process.env.NODE_ENV === "production") {
      return res.status(403).json({
        success: false,
        message: "Mark-as-paid is disabled in production",
      });
    }

    const booking = await BanquetBooking.findById(id).populate("guest");

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
      `Banquet booking marked as paid (dev): ${booking.bookingNumber} by ${req.user.id}`
    );

    res
      .status(200)
      .json({ success: true, message: "Booking marked as paid", booking });
  } catch (error) {
    logger.error(`Mark banquet booking paid error: ${error.message}`);
    next(error);
  }
};

// ===========================
// REFUNDS
// ===========================

// Guest - Request Refund
export const requestBanquetRefund = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { reason } = req.body;

    const booking = await BanquetBooking.findById(bookingId);

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

    logger.info(`Refund requested for banquet booking: ${booking.bookingNumber}`);

    res.status(200).json({
      success: true,
      message: "Refund request submitted successfully",
      booking,
    });
  } catch (error) {
    logger.error(`Request banquet refund error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Error submitting refund request",
    });
  }
};

// Admin - Approve/Reject Refund
export const updateBanquetRefundStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { action, reason } = req.body; // action: 'approve' or 'reject'

    if (!["approve", "reject"].includes(action)) {
      return res.status(400).json({
        success: false,
        message: "Invalid action. Must be approve or reject",
      });
    }

    const booking = await BanquetBooking.findById(bookingId).populate([
      "guest",
      "banquetHall",
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

      logger.info(`Refund rejected for banquet booking: ${booking.bookingNumber}`);

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
        `Refund approved for banquet booking: ${booking.bookingNumber}. Will process in 12 hours.`
      );

      res.status(200).json({
        success: true,
        message: "Refund approved. Payment will be processed in 12 hours.",
        booking,
        processingTime: "12 hours",
      });
    }
  } catch (error) {
    logger.error(`Update banquet refund status error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Error updating refund status",
    });
  }
};

// Guest - Get Refund Status
export const getBanquetRefundStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await BanquetBooking.findById(bookingId);

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
    logger.error(`Get banquet refund status error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Error fetching refund status",
    });
  }
};

// Cron job helper: Process scheduled refunds (approved > 12 hours ago)
export const processScheduledBanquetRefunds = async () => {
  try {
    const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);
    
    // Find bookings approved for refund more than 12 hours ago but not yet processed
    const bookingsToRefund = await BanquetBooking.find({
      refundStatus: "approved",
      refundApprovedAt: { $lte: twelveHoursAgo },
    });

    if (bookingsToRefund.length > 0) {
      logger.info(`Found ${bookingsToRefund.length} banquet bookings to process for refund`);
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
            `Auto-processed refund for banquet booking: ${booking.bookingNumber} - Refund ID: ${refundResult.refundId}`
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
    logger.error(`Process scheduled banquet refunds error: ${error.message}`);
  }
};
