import BanquetHall from "../models/BanquetHall.js";
import BanquetBooking from "../models/BanquetBooking.js";
import { logger } from "../utils/logger.js";

// Admin - Create Banquet Hall
export const createBanquetHall = async (req, res, next) => {
  try {
    const { name, description, capacity, basePrice, amenities, features } =
      req.body;

    if (!name || !description || !capacity || !basePrice) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
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
      message: "Banquet hall created successfully",
      banquetHall,
    });
  } catch (error) {
    logger.error(`Create banquet hall error: ${error.message}`);
    next(error);
  }
};

// In banquetController.js - Update getAllBanquetHalls

export const getAllBanquetHalls = async (req, res, next) => {
  try {
    const banquetHalls = await BanquetHall.find({ isActive: true }).select(
      "name description capacity basePrice amenities features images"
    );

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

// Guest - Create Banquet Booking (with double-booking prevention)
export const createBanquetBooking = async (req, res, next) => {
  try {
    const {
      banquetHall,
      eventDate,
      eventType,
      expectedGuests,
      setupType,
      hallRate,
      specialRequirements,
    } = req.body;

    if (
      !banquetHall ||
      !eventDate ||
      !eventType ||
      !expectedGuests ||
      !setupType ||
      !hallRate
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Check if the hall is already booked on this date BY ANYONE
    const existingBooking = await BanquetBooking.findOne({
      banquetHall,
      eventDate: {
        $gte: new Date(eventDate).setHours(0, 0, 0, 0),
        $lt: new Date(eventDate).setHours(23, 59, 59, 999),
      },
      status: { $in: ["pending", "confirmed"] }, // Only check active bookings
      // NO guest filter - checks ALL users
    }).populate("guest", "name email");

    if (existingBooking) {
      // Get hall name for better error message
      const hall = await BanquetHall.findById(banquetHall);

      // Check if it's the same user trying to book again
      const isSameUser =
        existingBooking.guest._id.toString() === req.user.id.toString();

      if (isSameUser) {
        return res.status(400).json({
          success: false,
          message: `You have already booked ${
            hall?.name || "this hall"
          } for ${new Date(
            eventDate
          ).toLocaleDateString()}. Please check your bookings.`,
        });
      } else {
        return res.status(400).json({
          success: false,
          message: `Sorry, ${
            hall?.name || "this hall"
          } is already booked for ${new Date(
            eventDate
          ).toLocaleDateString()}. Please choose a different date or hall.`,
        });
      }
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
      status: "pending",
    });

    logger.info(`Banquet booking created: ${booking.bookingNumber}`);

    res.status(201).json({
      success: true,
      message: "Banquet booking created successfully",
      booking: await booking.populate(["guest", "banquetHall"]),
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
      .populate("banquetHall")
      .sort("-createdAt");

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
        message: "Banquet hall not found",
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
      .populate(["guest", "banquetHall"])
      .sort("-createdAt");

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
    const {
      name,
      description,
      capacity,
      basePrice,
      amenities,
      features,
      images,
    } = req.body;

    const banquetHall = await BanquetHall.findByIdAndUpdate(
      id,
      { name, description, capacity, basePrice, amenities, features, images },
      { new: true, runValidators: true }
    );

    if (!banquetHall) {
      return res.status(404).json({
        success: false,
        message: "Banquet hall not found",
      });
    }

    logger.info(`Banquet hall updated: ${banquetHall.name}`);

    res.status(200).json({
      success: true,
      message: "Banquet hall updated successfully",
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
        message: "Banquet hall not found",
      });
    }

    logger.info(`Banquet hall deleted: ${banquetHall.name}`);

    res.status(200).json({
      success: true,
      message: "Banquet hall deleted successfully",
    });
  } catch (error) {
    logger.error(`Delete banquet hall error: ${error.message}`);
    next(error);
  }
};
// TEMPORARY - Seed database via API
export const quickSeed = async (req, res) => {
  try {
    await BanquetHall.deleteMany({});

    const halls = [
      {
        name: "Grand Maharaja Ballroom",
        description:
          "Our largest and most opulent ballroom, featuring rich golden tones, ornate ceilings, and an ambience crafted for royal weddings and grand celebrations.",
        capacity: { theater: 8000, cocktail: 600, banquet: 500 },
        basePrice: 150000,
        amenities: [
          "WiFi",
          "Sound System",
          "Professional Lighting",
          "Catering Services",
          "Stage Setup",
          "Decoration",
        ],
        features: {
          hasProjector: true,
          hasSoundSystem: true,
          hasParking: true,
          hasWifi: true,
          allowsExternalCatering: false,
        },
        images: [
          {
            url: "https://i.pinimg.com/1200x/c5/91/95/c59195da3166c4dc498aee96dadc5b43.jpg",
            alt: "Grand Maharaja Ballroom",
          },
        ],
        isActive: true,
      },
      {
        name: "Royal Garden Terrace",
        description:
          "An elegant outdoor terrace with manicured gardens, perfect for intimate ceremonies and cocktail receptions under the stars.",
        capacity: { theater: 2500, cocktail: 180, banquet: 120 },
        basePrice: 75000,
        amenities: [
          "WiFi",
          "Sound System",
          "Professional Lighting",
          "Outdoor Seating",
          "Garden Area",
        ],
        features: {
          hasProjector: false,
          hasSoundSystem: true,
          hasParking: true,
          hasWifi: true,
          allowsExternalCatering: true,
        },
        images: [
          {
            url: "https://images.unsplash.com/photo-1519167758481-83f29da8c424?w=1600&q=80",
            alt: "Royal Garden Terrace",
          },
        ],
        isActive: true,
      },
      {
        name: "Royal Durbar Hall",
        description:
          "A heritage-inspired hall featuring ornate wall carvings, handwoven drapery, and a majestic stage.",
        capacity: { theater: 5200, cocktail: 400, banquet: 320 },
        basePrice: 120000,
        amenities: [
          "WiFi",
          "Sound System",
          "Professional Lighting",
          "Catering Services",
          "Stage Setup",
          "Decoration",
        ],
        features: {
          hasProjector: true,
          hasSoundSystem: true,
          hasParking: true,
          hasWifi: true,
          allowsExternalCatering: false,
        },
        images: [
          {
            url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1600&q=80",
            alt: "Royal Durbar Hall",
          },
        ],
        isActive: true,
      },
      {
        name: "Imperial Wedding Hall",
        description:
          "A breathtaking venue illuminated with warm golden hues, designed exclusively for grand wedding rituals and celebrations.",
        capacity: { theater: 4500, cocktail: 300, banquet: 240 },
        basePrice: 100000,
        amenities: [
          "WiFi",
          "Sound System",
          "Professional Lighting",
          "Catering Services",
          "Stage Setup",
          "Decoration",
        ],
        features: {
          hasProjector: true,
          hasSoundSystem: true,
          hasParking: true,
          hasWifi: true,
          allowsExternalCatering: false,
        },
        images: [
          {
            url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1600&q=80",
            alt: "Imperial Wedding Hall",
          },
        ],
        isActive: true,
      },
      {
        name: "Crystal Banquet Chamber",
        description:
          "A richly modern banquet hall featuring crystal lighting, elegant décor, and luxurious seating for elite events and corporate galas.",
        capacity: { theater: 3000, cocktail: 200, banquet: 150 },
        basePrice: 80000,
        amenities: [
          "WiFi",
          "Sound System",
          "Professional Lighting",
          "Catering Services",
          "Stage Setup",
          "Decoration",
        ],
        features: {
          hasProjector: true,
          hasSoundSystem: true,
          hasParking: true,
          hasWifi: true,
          allowsExternalCatering: true,
        },
        images: [
          {
            url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1600&q=80",
            alt: "Crystal Banquet Chamber",
          },
        ],
        isActive: true,
      },
      {
        name: "Heritage Maharaja Hall",
        description:
          "An intimate venue with traditional motifs, handcrafted accents, and a regal charm perfect for private celebrations.",
        capacity: { theater: 3800, cocktail: 250, banquet: 200 },
        basePrice: 90000,
        amenities: [
          "WiFi",
          "Sound System",
          "Professional Lighting",
          "Catering Services",
          "Stage Setup",
          "Decoration",
        ],
        features: {
          hasProjector: true,
          hasSoundSystem: true,
          hasParking: true,
          hasWifi: true,
          allowsExternalCatering: false,
        },
        images: [
          {
            url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1600&q=80",
            alt: "Heritage Maharaja Hall",
          },
        ],
        isActive: true,
      },
    ];

    const created = await BanquetHall.insertMany(halls);
    res.status(200).json({
      success: true,
      message: `Successfully seeded ${created.length} halls`,
      halls: created,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
