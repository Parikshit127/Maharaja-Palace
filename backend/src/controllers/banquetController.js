import BanquetHall from '../models/BanquetHall.js';
import BanquetBooking from '../models/BanquetBooking.js';
import { logger } from '../utils/logger.js';

// Admin - Create Banquet Hall
export const createBanquetHall = async (req, res, next) => {
  try {
    const { name, description, capacity, basePrice, amenities, features } = req.body;

    if (!name || !description || !capacity || !basePrice) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    const banquetHall = await BanquetHall.create({
      name,
      description,
      capacity,
      basePrice,
      amenities,
      features,
    });

    logger.info(`Banquet hall created: ${name}`);

    res.status(201).json({
      success: true,
      message: 'Banquet hall created successfully',
      banquetHall,
    });
  } catch (error) {
    logger.error(`Create banquet hall error: ${error.message}`);
    next(error);
  }
};

// Get All Banquet Halls
export const getAllBanquetHalls = async (req, res, next) => {
  try {
    const banquetHalls = await BanquetHall.find({ isActive: true });

    res.status(200).json({
      success: true,
      count: banquetHalls.length,
      banquetHalls,
    });
  } catch (error) {
    logger.error(`Get banquet halls error: ${error.message}`);
    next(error);
  }
};

// Guest - Create Banquet Booking
export const createBanquetBooking = async (req, res, next) => {
  try {
    const { banquetHall, eventDate, eventType, expectedGuests, setupType, hallRate, specialRequirements } = req.body;

    if (!banquetHall || !eventDate || !eventType || !expectedGuests || !setupType || !hallRate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    const totalPrice = hallRate; // Will be enhanced with add-ons in Phase 2
    const booking = await BanquetBooking.create({
      guest: req.user.id,
      banquetHall,
      eventDate,
      eventType,
      expectedGuests,
      setupType,
      hallRate,
      totalPrice,
      specialRequirements,
      status: 'pending',
    });

    logger.info(`Banquet booking created: ${booking.bookingNumber}`);

    res.status(201).json({
      success: true,
      message: 'Banquet booking created successfully',
      booking: await booking.populate(['guest', 'banquetHall']),
    });
  } catch (error) {
    logger.error(`Create banquet booking error: ${error.message}`);
    next(error);
  }
};

// Get My Banquet Bookings
export const getMyBanquetBookings = async (req, res, next) => {
  try {
    const bookings = await BanquetBooking.find({ guest: req.user.id })
      .populate('banquetHall')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    logger.error(`Get my banquet bookings error: ${error.message}`);
    next(error);
  }
};

// Get Banquet Hall By ID
export const getBanquetHallById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const banquetHall = await BanquetHall.findById(id);

    if (!banquetHall) {
      return res.status(404).json({
        success: false,
        message: 'Banquet hall not found',
      });
    }

    res.status(200).json({
      success: true,
      banquetHall,
    });
  } catch (error) {
    logger.error(`Get banquet hall by id error: ${error.message}`);
    next(error);
  }
};
// Get All Banquet Bookings (Admin)
export const getAllBanquetBookings = async (req, res, next) => {
  try {
    const bookings = await BanquetBooking.find()
      .populate(['guest', 'banquetHall'])
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    logger.error(`Get all banquet bookings error: ${error.message}`);
    next(error);
  }
};

// Admin - Update Banquet Hall
export const updateBanquetHall = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, capacity, basePrice, amenities, features, images } = req.body;

    const banquetHall = await BanquetHall.findByIdAndUpdate(
      id,
      { name, description, capacity, basePrice, amenities, features, images },
      { new: true, runValidators: true }
    );

    if (!banquetHall) {
      return res.status(404).json({
        success: false,
        message: 'Banquet hall not found',
      });
    }

    logger.info(`Banquet hall updated: ${banquetHall.name}`);

    res.status(200).json({
      success: true,
      message: 'Banquet hall updated successfully',
      banquetHall,
    });
  } catch (error) {
    logger.error(`Update banquet hall error: ${error.message}`);
    next(error);
  }
};

// Admin - Delete Banquet Hall
export const deleteBanquetHall = async (req, res, next) => {
  try {
    const { id } = req.params;

    const banquetHall = await BanquetHall.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!banquetHall) {
      return res.status(404).json({
        success: false,
        message: 'Banquet hall not found',
      });
    }

    logger.info(`Banquet hall deleted: ${banquetHall.name}`);

    res.status(200).json({
      success: true,
      message: 'Banquet hall deleted successfully',
    });
  } catch (error) {
    logger.error(`Delete banquet hall error: ${error.message}`);
    next(error);
  }
};
