import express from "express";
import cors from "cors";
import { config } from "./config/env.js";

import authRoutes from "./routes/authRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import banquetRoutes from "./routes/banquetRoutes.js";
import restaurantRoutes from "./routes/restaurantRoutes.js";

const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "http://localhost:5174",
      "https://maharajapalace.vercel.app",
      "https://maharaja-palace-mocha.vercel.app",
      "https://maharaja-palace-btcy.onrender.com",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`📍 ${req.method} ${req.path}`);
  next();
});

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

app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "✅ API is working correctly!",
    timestamp: new Date().toISOString(),
    server: "Maharaja Palace Backend",
    port: config.port || 5000,
  });
});

// API Routes - These come AFTER the test route
app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/banquet", banquetRoutes);
app.use("/api/restaurant", restaurantRoutes);
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
// 404 handler - This comes LAST
app.use((req, res) => {
  console.log(`❌ 404 - Route not found: ${req.method} ${req.path}`);
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
    method: req.method,
    availableRoutes: [
      "GET /",
      "GET /api/test",
      "POST /api/auth/login",
      "POST /api/auth/register",
      "GET /api/rooms/room-types",
      "GET /api/banquet/halls",
      "GET /api/restaurant/tables",
    ],
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
    }),
  });
});

export default app;
