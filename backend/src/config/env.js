import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  mongodbUri:
    process.env.MONGODB_URI || "mongodb://localhost:27017/maharaja-palace",
  jwtSecret:
    process.env.JWT_SECRET || "your_jwt_secret_key_change_this_in_production",
  jwtExpire: process.env.JWT_EXPIRE || "7d",
  corsOrigin: process.env.FRONTEND_URL || "http://localhost:5173",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",

  // Email configuration
  emailService: process.env.EMAIL_SERVICE || "gmail",
  emailUser: process.env.EMAIL_USER,
  emailPass: process.env.EMAIL_PASS,

  // Payment gateway
  razorpayKeyId: process.env.RAZORPAY_KEY_ID,
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET,

  // Cloudinary configuration (ADDED)
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
};
