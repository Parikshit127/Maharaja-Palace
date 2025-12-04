import Booking from "../models/Booking.js";
import { logger } from "../utils/logger.js";
import {
  refundPayment,
  getPaymentDetails,
  verifyPayment,
} from "../services/paymentService.js";
import { sendBookingConfirmation, sendRefundApproval } from "../services/smsService.js";

// Guest - Create Booking
export const createBooking = async (req, res, next) => {
  try {
    const {
      room,
      checkInDate,
      checkOutDate,
      numberOfGuests,
      roomRate,
      specialRequests,
      bookingType = "full",
    } = req.body;

    if (
      !room ||
      !checkInDate ||
      !checkOutDate ||
      !numberOfGuests ||
      !roomRate
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Calculate number of nights and total price
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const numberOfNights = Math.ceil(
      (checkOut - checkIn) / (1000 * 60 * 60 * 24)
    );
    const totalPrice = numberOfNights * roomRate;

    // Calculate paid amount based on booking type
    const paidAmount =
      bookingType === "partial" ? Math.round(totalPrice * 0.1) : totalPrice;

    if (numberOfNights <= 0) {
      return res.status(400).json({
        success: false,
        message: "Check-out date must be after check-in date",
      });
    }

    const booking = await Booking.create({
      guest: req.user.id,
      room,
      checkInDate,
      checkOutDate,
      numberOfNights,
      numberOfGuests,
      roomRate,
      totalPrice,
      paidAmount,
      bookingType,
      specialRequests,
      status: "pending",
      paymentStatus: "pending",
    });

    logger.info(`Booking created: ${booking.bookingNumber}`);

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking: await booking.populate(["guest", "room"]),
    });
  } catch (error) {
    logger.error(`Create booking error: ${error.message}`);
    next(error);
  }
};

// Guest - Get My Bookings
export const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ guest: req.user.id })
      .populate("room")
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    logger.error(`Get my bookings error: ${error.message}`);
    next(error);
  }
};

// Guest - Update Booking Payment
export const updateBookingPayment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { amount, paymentId, orderId, signature } = req.body;

    const booking = await Booking.findById(id);

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

    // Verify payment signature. In production enforce verification, in development allow for testing.
    if (orderId && paymentId && signature) {
      const verificationResult = await verifyPayment(
        orderId,
        paymentId,
        signature
      );

      if (!verificationResult.success) {
        logger.warn(
          `Payment signature verification failed for ${paymentId}: ${
            verificationResult.message || "invalid signature"
          }`
        );

        // In production, reject invalid signatures
        if (process.env.NODE_ENV === "production") {
          return res.status(400).json({
            success: false,
            message: "Payment verification failed. Transaction not accepted.",
          });
        }

        // Otherwise (development/test), continue but log the event
        logger.info(
          "Continuing despite signature failure because NODE_ENV != production"
        );
      } else {
        logger.info(`Payment signature verified for ${paymentId}`);
        // Fetch payment details from Razorpay to validate the amount
        try {
          const paymentDetails = await getPaymentDetails(paymentId);

          if (paymentDetails.success && paymentDetails.payment) {
            const paidInPaisa = Number(paymentDetails.payment.amount);
            const expectedPaisa = Math.round(Number(amount) * 100);

            if (paidInPaisa !== expectedPaisa) {
              logger.warn(
                `Payment amount mismatch for ${paymentId}: expected ${expectedPaisa}, got ${paidInPaisa}`
              );

              if (process.env.NODE_ENV === "production") {
                return res.status(400).json({
                  success: false,
                  message: "Payment amount mismatch. Transaction not accepted.",
                });
              } else {
                logger.info(
                  "Amount mismatch allowed in non-production environment"
                );
              }
            }
          } else {
            logger.warn(`Could not fetch payment details for ${paymentId}`);
            if (process.env.NODE_ENV === "production") {
              return res.status(400).json({
                success: false,
                message:
                  "Unable to validate payment details. Transaction not accepted.",
              });
            }
          }
        } catch (err) {
          logger.error(
            `Error fetching payment details for ${paymentId}: ${err.message}`
          );
          if (process.env.NODE_ENV === "production") {
            return res.status(500).json({
              success: false,
              message: "Error validating payment. Transaction not accepted.",
            });
          }
        }
      }
    }

    // Update booking with payment information
    booking.paidAmount = (booking.paidAmount || 0) + Number(amount);
    booking.transactionId = paymentId;

    // Update payment and booking status
    if (booking.paidAmount >= booking.totalPrice) {
      booking.paymentStatus = "completed";
      booking.status = "confirmed"; // Auto-confirm when fully paid
    } else {
      booking.paymentStatus = "partial";
    }

    await booking.save();

    logger.info(
      `Booking payment updated: ${booking.bookingNumber}, Amount: ${amount}, Status: ${booking.status}`
    );

    res.status(200).json({
      success: true,
      message: "Payment updated successfully",
      booking,
    });
  } catch (error) {
    logger.error(`Update booking payment error: ${error.message}`);
    next(error);
  }
};

// Admin - Get All Bookings
export const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate(["guest", "room"])
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    logger.error(`Get all bookings error: ${error.message}`);
    next(error);
  }
};

// Guest - Get Booking Details
export const getBookingDetails = async (req, res, next) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId).populate([
      "guest",
      "room",
    ]);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Check if user owns the booking or is admin
    if (
      booking.guest._id.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this booking",
      });
    }

    res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    logger.error(`Get booking details error: ${error.message}`);
    next(error);
  }
};

// Guest - Cancel Booking
export const cancelBooking = async (req, res, next) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

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

    booking.status = "cancelled";
    await booking.save();

    logger.info(`Booking cancelled: ${booking.bookingNumber}`);

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (error) {
    logger.error(`Cancel booking error: ${error.message}`);
    next(error);
  }
};

// Admin - Update Booking Status
export const updateBookingStatus = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Please provide status",
      });
    }

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { status },
      { new: true }
    ).populate(["guest", "room"]);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    logger.info(`Booking status updated: ${booking.bookingNumber} - ${status}`);

    res.status(200).json({
      success: true,
      message: "Booking status updated successfully",
      booking,
    });
  } catch (error) {
    logger.error(`Update booking status error: ${error.message}`);
    next(error);
  }
};

// Admin - Get User Bookings
export const getUserBookings = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const bookings = await Booking.find({ guest: userId })
      .populate("room")
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    logger.error(`Get user bookings error: ${error.message}`);
    next(error);
  }
};

// Guest - Request Refund
export const requestRefund = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const { reason } = req.body;

    const booking = await Booking.findById(bookingId);

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

    logger.info(`Refund requested for booking: ${booking.bookingNumber}`);

    res.status(200).json({
      success: true,
      message: "Refund request submitted successfully",
      booking,
    });
  } catch (error) {
    logger.error(`Request refund error: ${error.message}`);
    next(error);
  }
};

// Admin - Approve/Reject Refund
export const updateRefundStatus = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const { action, reason } = req.body; // action: 'approve' or 'reject'

    if (!["approve", "reject"].includes(action)) {
      return res.status(400).json({
        success: false,
        message: "Invalid action. Must be approve or reject",
      });
    }

    const booking = await Booking.findById(bookingId).populate([
      "guest",
      "room",
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

      logger.info(`Refund rejected for booking: ${booking.bookingNumber}`);

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
        `Refund approved for booking: ${booking.bookingNumber}. Will process in 12 hours.`
      );

      // Send SMS notification for refund approval
      try {
        await sendRefundApproval(booking.guest.phone, {
          bookingNumber: booking.bookingNumber,
          amount: booking.refundAmount,
          guestName: booking.guest.firstName
        });
      } catch (smsError) {
        logger.error(`Failed to send refund approval SMS: ${smsError.message}`);
        // Don't fail the refund approval if SMS fails
      }

      res.status(200).json({
        success: true,
        message: "Refund approved. Payment will be processed in 12 hours.",
        booking,
        processingTime: "12 hours",
      });
    }
  } catch (error) {
    logger.error(`Update refund status error: ${error.message}`);
    next(error);
  }
};

// Guest - Get Refund Status
export const getRefundStatus = async (req, res, next) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);

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
    logger.error(`Get refund status error: ${error.message}`);
    next(error);
  }
};

// Dev helper: mark booking as paid without payment gateway
export const markBookingAsPaid = async (req, res, next) => {
  try {
    const { bookingId } = req.params;

    if (process.env.NODE_ENV === "production") {
      return res
        .status(403)
        .json({
          success: false,
          message: "Mark-as-paid is disabled in production",
        });
    }

    const booking = await Booking.findById(bookingId).populate([
      "guest",
      "room",
    ]);

    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    // Only allow owner or admin to mark paid
    if (booking.guest._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res
        .status(403)
        .json({
          success: false,
          message: "Not authorized to mark this booking as paid",
        });
    }

    booking.paidAmount = booking.totalPrice;
    booking.transactionId = `dev_test_${Date.now()}`;
    booking.paymentStatus = "completed";
    booking.status = "confirmed";
    booking.paymentMethod = "razorpay"; // Set to razorpay for consistency

    await booking.save();

    logger.info(
      `Booking marked as paid (manual): ${booking.bookingNumber} by ${req.user.id}`
    );

    // Send SMS confirmation
    try {
      const roomType = booking.room?.roomType || booking.room;
      await sendBookingConfirmation(booking.guest.phone, {
        bookingNumber: booking.bookingNumber,
        type: roomType.name || 'Room',
        checkIn: new Date(booking.checkInDate).toLocaleDateString('en-IN'),
        amount: booking.paidAmount,
        guestName: booking.guest.firstName
      });
    } catch (smsError) {
      logger.error(`Failed to send booking SMS: ${smsError.message}`);
      // Don't fail the booking if SMS fails
    }

    res
      .status(200)
      .json({ success: true, message: "Booking marked as paid", booking });
  } catch (error) {
    logger.error(`Mark booking paid error: ${error.message}`);
    next(error);
  }
};

// Cron job helper: Process scheduled refunds (approved > 12 hours ago)
export const processScheduledRefunds = async () => {
  try {
    const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);
    
    // Find bookings approved for refund more than 12 hours ago but not yet processed
    const bookingsToRefund = await Booking.find({
      refundStatus: "approved",
      refundApprovedAt: { $lte: twelveHoursAgo },
    });

    logger.info(`Found ${bookingsToRefund.length} bookings to process for refund`);

    for (const booking of bookingsToRefund) {
      try {
        // Process actual refund via Razorpay
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
            `Auto-processed refund for booking: ${booking.bookingNumber} - Refund ID: ${refundResult.refundId}`
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
    logger.error(`Process scheduled refunds error: ${error.message}`);
  }
};
