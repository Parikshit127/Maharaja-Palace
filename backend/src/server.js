import app from "./app.js";
import connectDB from "./config/db.js";
import { config } from "./config/env.js";
import { verifyEmailConfig } from "./services/emailService.js";
import { logger } from "./utils/logger.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Graceful shutdown handler
const gracefulShutdown = (signal, server) => {
  logger.info(`${signal} received. Shutting down gracefully...`);

  server.close(async () => {
    logger.info("HTTP server closed");

    try {
      await mongoose.connection.close(false);
      logger.info("MongoDB connection closed");
      process.exit(0);
    } catch (err) {
      logger.error("Error closing MongoDB connection", err);
      process.exit(1);
    }
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    logger.error("Forced shutdown after timeout");
    process.exit(1);
  }, 10000);
};

// Start application
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    logger.info("✓ Database connected successfully");

    // Fix indexes
    try {
      const collection = mongoose.connection.collection("restaurantbookings");

      try {
        await collection.dropIndex("bookingId_1");
        logger.info("✓ Dropped old bookingId_1 index");
      } catch (error) {
        if (error.codeName === "IndexNotFound") {
          logger.info("ℹ️  No old bookingId index to drop");
        } else {
          logger.warn(`⚠️  Index drop warning: ${error.message}`);
        }
      }
    } catch (error) {
      logger.warn(`⚠️  Could not check indexes: ${error.message}`);
    }

    // Verify email configuration (non-blocking)
    verifyEmailConfig()
      .then((result) => {
        if (result.success) {
          logger.info("✓ Email service configured and ready");
        } else {
          logger.warn(`⚠️  Email service not configured: ${result.message}`);
          logger.warn(
            "⚠️  Registration will work, but welcome emails will not be sent"
          );
        }
      })
      .catch((error) => {
        logger.error(`Email verification failed: ${error.message}`);
      });

    // Start server
    const server = app.listen(config.port, "0.0.0.0", () => {
      logger.info(`\n🏰 Maharaja Palace Hotel Booking System`);
      logger.info(`🚀 Server running on port ${config.port}`);
      logger.info(`📍 Environment: ${config.nodeEnv}`);
      logger.info(`🔗 API Base URL: http://localhost:${config.port}/api`);
      logger.info(`\n✅ Server is ready to accept requests\n`);
    });

    // Handle unhandled promise rejections
    process.on("unhandledRejection", (err) => {
      logger.error(`❌ Unhandled Promise Rejection: ${err.message}`);
      logger.error(`Stack: ${err.stack}`);
      gracefulShutdown("UNHANDLED_REJECTION", server);
    });

    // Handle uncaught exceptions
    process.on("uncaughtException", (err) => {
      logger.error(`❌ Uncaught Exception: ${err.message}`);
      logger.error(`Stack: ${err.stack}`);
      gracefulShutdown("UNCAUGHT_EXCEPTION", server);
    });

    // Handle SIGTERM (production shutdown)
    process.on("SIGTERM", () => {
      gracefulShutdown("SIGTERM", server);
    });

    // Handle SIGINT (Ctrl+C)
    process.on("SIGINT", () => {
      gracefulShutdown("SIGINT", server);
    });

    return server;
  } catch (error) {
    logger.error(`❌ Failed to start server: ${error.message}`);
    logger.error(`Stack: ${error.stack}`);
    process.exit(1);
  }
};

// Start the server
startServer();
