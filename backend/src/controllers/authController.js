import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";
import { sendWelcomeEmail } from "../services/emailService.js";
import { logger } from "../utils/logger.js";

export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password, confirmPassword } =
      req.body;

    // Validation
    if (!firstName || !lastName || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      phone,
      password,
      role: "guest",
    });

    // Generate token
    const token = generateToken(user._id);

    // Send welcome email (non-blocking)
    setImmediate(async () => {
      try {
        await sendWelcomeEmail(user);
        logger.info(`Welcome email sent to: ${user.email}`);
      } catch (emailError) {
        logger.error(
          `Failed to send welcome email to ${user.email}: ${emailError.message}`
        );
      }
    });

    logger.info(`New user registered: ${user.email}`);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    logger.error(`Registration error: ${error.message}`);
    logger.error(`Error stack: ${error.stack}`);

    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Handle Mongoose validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(", "),
      });
    }

    // Generic server error
    return res.status(500).json({
      success: false,
      message: "Server error during registration. Please try again later.",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // Find user and include password field
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+password"
    );
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check password
    const isPasswordCorrect = await user.matchPassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account has been deactivated. Please contact support.",
      });
    }

    // Generate token
    const token = generateToken(user._id);

    // Update last login
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    logger.info(`User logged in: ${user.email}`);

    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    logger.error(`Login error: ${error.message}`);
    logger.error(`Error stack: ${error.stack}`);

    return res.status(500).json({
      success: false,
      message: "Server error during login. Please try again later.",
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profileImage: user.profileImage,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    logger.error(`Get user error: ${error.message}`);

    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

// Admin - Get All Users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort("-createdAt");

    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    logger.error(`Get all users error: ${error.message}`);

    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

// Admin - Get User Details
export const getUserDetails = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    logger.error(`Get user details error: ${error.message}`);

    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

// Admin - Update User
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, phone, role } = req.body;

    // Validate MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    // If email is being updated, check for duplicates
    if (email) {
      const existingUser = await User.findOne({
        email: email.toLowerCase(),
        _id: { $ne: id },
      });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "Email already in use by another user",
        });
      }
    }

    const user = await User.findByIdAndUpdate(
      id,
      { firstName, lastName, email: email?.toLowerCase(), phone, role },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    logger.info(`User updated: ${user.email}`);

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    logger.error(`Update user error: ${error.message}`);

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(", "),
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

// Admin - Toggle User Status
export const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Prevent admin from deactivating themselves
    if (req.user.id === id && user.isActive) {
      return res.status(403).json({
        success: false,
        message: "You cannot deactivate your own account",
      });
    }

    user.isActive = !user.isActive;
    await user.save({ validateBeforeSave: false });

    logger.info(
      `User status toggled: ${user.email} - ${
        user.isActive ? "active" : "inactive"
      }`
    );

    return res.status(200).json({
      success: true,
      message: `User ${
        user.isActive ? "activated" : "deactivated"
      } successfully`,
      user,
    });
  } catch (error) {
    logger.error(`Toggle user status error: ${error.message}`);

    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};
