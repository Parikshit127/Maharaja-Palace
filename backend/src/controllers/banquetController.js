import cloudinary from "../config/cloudinary.js";
import BanquetHall from "../models/BanquetHall.js";
import BanquetBooking from "../models/BanquetBooking.js";

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
          // Continue with other images even if one fails
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

    let updatedImages = [...hall.images]; // keep old images

    // If new images uploaded → add them
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

    // Parse JSON fields if they exist
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
// GET ALL BOOKINGS
// ===========================
export const getBanquetBookings = async (req, res) => {
  try {
    const bookings = await BanquetBooking.find();
    res.json({
      success: true,
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
