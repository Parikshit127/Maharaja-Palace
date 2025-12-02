import Booking from '../models/Booking.js';
import { logger } from '../utils/logger.js';

// Guest - Create Booking
export const createBooking = async (req, res, next) => {
  try {
    const { room, checkInDate, checkOutDate, numberOfGuests, roomRate, specialRequests, bookingType = 'full' } = req.body;

    if (!room || !checkInDate || !checkOutDate || !numberOfGuests || !roomRate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Calculate number of nights and total price
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const numberOfNights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    const totalPrice = numberOfNights * roomRate;

    // Calculate paid amount based on booking type
    const paidAmount = bookingType === 'partial' ? Math.round(totalPrice * 0.1) : totalPrice;

    if (numberOfNights <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Check-out date must be after check-in date',
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
      status: 'pending',
      paymentStatus: 'pending',
    });

    logger.info(`Booking created: ${booking.bookingNumber}`);

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking: await booking.populate(['guest', 'room']),
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
      .populate('room')
      .sort('-createdAt');

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
    const { amount, paymentId } = req.body;

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Check if user is the booking owner
    if (booking.guest.toString() !== req.user.id) {
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

    logger.info(`Booking payment updated: ${booking.bookingNumber}, Amount: ${amount}`);

    res.status(200).json({
      success: true,
      message: 'Payment updated successfully',
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
      .populate(['guest', 'room'])
      .sort('-createdAt');

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

    const booking = await Booking.findById(bookingId).populate(['guest', 'room']);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Check if user owns the booking or is admin
    if (booking.guest._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this booking',
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
        message: 'Booking not found',
      });
    }

    if (booking.guest.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking',
      });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Booking is already cancelled',
      });
    }

    booking.status = 'cancelled';
    await booking.save();

    logger.info(`Booking cancelled: ${booking.bookingNumber}`);

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
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
        message: 'Please provide status',
      });
    }

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { status },
      { new: true }
    ).populate(['guest', 'room']);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    logger.info(`Booking status updated: ${booking.bookingNumber} - ${status}`);

    res.status(200).json({
      success: true,
      message: 'Booking status updated successfully',
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
      .populate('room')
      .sort('-createdAt');

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
