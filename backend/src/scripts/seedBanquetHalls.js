// backend/scripts/seedBanquetHalls.js
// Fixed version using require instead of import

const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Define the BanquetHall schema directly in this file
const banquetHallSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide hall name"],
      unique: true,
    },
    description: {
      type: String,
      required: [true, "Please provide a description"],
    },
    capacity: {
      theater: { type: Number, required: true },
      cocktail: { type: Number, required: true },
      banquet: { type: Number, required: true },
    },
    basePrice: {
      type: Number,
      required: [true, "Please provide base price"],
      min: 0,
    },
    amenities: [
      {
        type: String,
      },
    ],
    features: {
      hasProjector: { type: Boolean, default: false },
      hasSoundSystem: { type: Boolean, default: true },
      hasParking: { type: Boolean, default: true },
      hasWifi: { type: Boolean, default: true },
      allowsExternalCatering: { type: Boolean, default: false },
    },
    images: [
      {
        url: String,
        alt: String,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const BanquetHall = mongoose.model("BanquetHall", banquetHallSchema);

const banquetHalls = [
  {
    name: "Grand Maharaja Ballroom",
    description:
      "Our largest and most opulent ballroom, featuring rich golden tones, ornate ceilings, and an ambience crafted for royal weddings and grand celebrations.",
    capacity: {
      theater: 8000,
      cocktail: 600,
      banquet: 500,
    },
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
    name: "Royal Durbar Hall",
    description:
      "A heritage-inspired hall featuring ornate wall carvings, handwoven drapery, and a majestic stage — ideal for receptions, cultural ceremonies, and lavish gatherings.",
    capacity: {
      theater: 5200,
      cocktail: 400,
      banquet: 320,
    },
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
    capacity: {
      theater: 4500,
      cocktail: 300,
      banquet: 240,
    },
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
    capacity: {
      theater: 3000,
      cocktail: 200,
      banquet: 150,
    },
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
    capacity: {
      theater: 3800,
      cocktail: 250,
      banquet: 200,
    },
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
  {
    name: "Royal Garden Terrace",
    description:
      "An elegant outdoor terrace with manicured gardens, perfect for intimate ceremonies and cocktail receptions under the stars.",
    capacity: {
      theater: 2500,
      cocktail: 180,
      banquet: 120,
    },
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
];

const seedBanquetHalls = async () => {
  try {
    // Connect to MongoDB
    console.log("🔄 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing halls (optional - comment out if you want to keep existing)
    await BanquetHall.deleteMany({});
    console.log("🗑️  Cleared existing halls");

    // Insert new halls
    const insertedHalls = await BanquetHall.insertMany(banquetHalls);
    console.log(
      `✅ Successfully seeded ${insertedHalls.length} banquet halls\n`
    );

    // Display inserted halls
    insertedHalls.forEach((hall, index) => {
      console.log(`${index + 1}. ${hall.name}`);
      console.log(`   Price: ₹${(hall.basePrice / 1000).toFixed(0)}K`);
      console.log(`   Capacity: ${hall.capacity.banquet} guests (Banquet)`);
      console.log(`   ID: ${hall._id}\n`);
    });

    console.log("🎉 Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding banquet halls:", error);
    process.exit(1);
  }
};

seedBanquetHalls();
