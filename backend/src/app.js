import express from "express";
import cors from "cors";
import { config } from "./config/env.js";
import { logger } from "./utils/logger.js";

// Import routes
import authRoutes from "./routes/authRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import banquetRoutes from "./routes/banquetRoutes.js";
import restaurantRoutes from "./routes/restaurantRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

const app = express();

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "http://localhost:5174",
      "https://maharaja-palace-nine.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();

  // Log request
  logger.info(`→ ${req.method} ${req.path}`);

  // Log response
  res.on("finish", () => {
    const duration = Date.now() - start;
    const logLevel = res.statusCode >= 400 ? "error" : "info";
    logger[logLevel](
      `← ${req.method} ${req.path} ${res.statusCode} ${duration}ms`
    );
  });

  next();
});

// Health check route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Maharaja Palace Hotel API is running",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    endpoints: {
      test: "/api/test",
      auth: "/api/auth",
      rooms: "/api/rooms",
      bookings: "/api/bookings",
      banquet: "/api/banquet",
      restaurant: "/api/restaurant",
    },
  });
});

// Test route - MUST BE BEFORE other /api/* routes
app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "✅ API is working correctly!",
    timestamp: new Date().toISOString(),
    server: "Maharaja Palace Backend",
    port: config.port || 5000,
    environment: config.nodeEnv,
  });
});

// API Routes - These come AFTER the test route
app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/banquet", banquetRoutes);
app.use("/api/restaurant", restaurantRoutes);
app.use("/api/payments", paymentRoutes);

// API info route
app.get("/api", (req, res) => {
  res.json({
    success: true,
    message: "Maharaja Palace Hotel API",
    version: "1.0.0",
    endpoints: {
      test: "/api/test",
      auth: "/api/auth",
      rooms: "/api/rooms",
      bookings: "/api/bookings",
      banquet: "/api/banquet",
      restaurant: "/api/restaurant",
    },
  });
});

// 404 handler - Must be after all routes
app.use((req, res) => {
  logger.warn(`404 - Route not found: ${req.method} ${req.path}`);
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
    method: req.method,
    availableRoutes: [
      "GET /",
      "GET /api",
      "GET /api/test",
      "POST /api/auth/login",
      "POST /api/auth/register",
      "GET /api/auth/me",
      "GET /api/rooms/room-types",
      "GET /api/banquet/halls",
      "GET /api/restaurant/tables",
    ],
  });
});

// Global error handler - MUST BE LAST
app.use((err, req, res, next) => {
  logger.error(`Unhandled error on ${req.method} ${req.path}: ${err.message}`);
  logger.error(`Stack: ${err.stack}`);

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: messages.join(", "),
    });
  }

  // Mongoose duplicate key error (11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || "field";
    return res.status(409).json({
      success: false,
      message: `${
        field.charAt(0).toUpperCase() + field.slice(1)
      } already exists`,
    });
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: `Invalid ${err.path}: ${err.value}`,
    });
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "Invalid authentication token",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Authentication token expired",
    });
  }

  // Multer file upload errors
  if (err.name === "MulterError") {
    return res.status(400).json({
      success: false,
      message: `File upload error: ${err.message}`,
    });
  }

  // SyntaxError (usually from malformed JSON)
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON in request body",
    });
  }

  // Default error response
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || "Internal server error";

  res.status(statusCode).json({
    success: false,
    message: message,
    ...(config.nodeEnv === "development" && {
      error: err.message,
      stack: err.stack,
    }),
  });
});

export default app;
