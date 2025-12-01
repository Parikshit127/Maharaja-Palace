import app from "./app.js";
import connectDB from "./config/db.js";
import { config } from "./config/env.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

// Connect to MongoDB and fix indexes
connectDB().then(async () => {
  try {
    // Drop the problematic bookingId index if it exists
    const collection = mongoose.connection.collection("restaurantbookings");

    try {
      await collection.dropIndex("bookingId_1");
      console.log("✅ Dropped old bookingId_1 index");
    } catch (error) {
      if (error.codeName === "IndexNotFound") {
        console.log("ℹ️  No old bookingId index to drop");
      } else {
        console.log("⚠️  Index drop warning:", error.message);
      }
    }
  } catch (error) {
    console.log("⚠️  Could not check indexes:", error.message);
  }
});

// Start server
const server = app.listen(config.port, () => {
  console.log(`\n🏰 Maharaja Palace Hotel Booking System`);
  console.log(`🚀 Server running on port ${config.port}`);
  console.log(`📍 Environment: ${config.nodeEnv}`);
  console.log(`🔗 API Base URL: http://localhost:${config.port}/api`);
  console.log(`\n✅ Server is ready to accept requests\n`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error(`❌ Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});
