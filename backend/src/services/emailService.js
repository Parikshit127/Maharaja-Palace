import nodemailer from "nodemailer";
import { config } from "../config/env.js";
import EmailLog from "../models/EmailLog.js";
import { logger } from "../utils/logger.js";

// Create transporter with error handling
let transporter;
try {
  transporter = nodemailer.createTransport({
    service: config.emailService,
    auth: {
      user: config.emailUser,
      pass: config.emailPass,
    },
  });
} catch (error) {
  logger.error(`Failed to create email transporter: ${error.message}`);
  transporter = null;
}

export const sendWelcomeEmail = async (user) => {
  // Check if transporter exists
  if (!transporter) {
    logger.warn("Email transporter not configured, skipping welcome email");
    return { success: false, error: "Email service not configured" };
  }

  // Check if email config is valid
  if (!config.emailUser || !config.emailPass) {
    logger.warn("Email credentials missing, skipping welcome email");
    return { success: false, error: "Email credentials not configured" };
  }

  try {
    const htmlContent = `
      <div style="font-family: 'Playfair Display', serif; text-align: center; background: linear-gradient(135deg, #FFF8E7 0%, #fff9f0 100%); padding: 40px; border: 2px solid #D4AF37;">
        <h1 style="color: #D4AF37; margin-bottom: 20px;">Welcome to Maharaja Palace</h1>
        <p style="font-size: 16px; color: #333; line-height: 1.6;">
          Dear ${user.firstName},<br><br>
          Welcome to Maharaja Palace - Where Luxury Meets Elegance.<br><br>
          We're thrilled to have you join our distinguished guest community. 
          Your account has been successfully created and is ready to explore 
          our world-class accommodations and premium services.
        </p>
        <p style="margin-top: 30px; color: #999; font-size: 12px;">
          If you have any questions, please contact us at support@maharajapalace.com
        </p>
      </div>
    `;

    const mailOptions = {
      from: config.emailUser,
      to: user.email,
      subject: "Welcome to Maharaja Palace",
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);

    // Log email success (with try-catch to prevent logging errors from breaking)
    try {
      await EmailLog.create({
        recipient: user.email,
        subject: mailOptions.subject,
        emailType: "welcome",
        status: "sent",
        relatedUserId: user._id,
      });
    } catch (logError) {
      logger.error(`Failed to log welcome email: ${logError.message}`);
      // Don't throw - email was sent successfully
    }

    logger.info(`Welcome email sent to ${user.email}`);
    return { success: true, info };
  } catch (error) {
    logger.error(
      `Failed to send welcome email to ${user.email}: ${error.message}`
    );

    // Try to log failed email (but don't fail if logging fails)
    try {
      await EmailLog.create({
        recipient: user.email,
        subject: "Welcome to Maharaja Palace",
        emailType: "welcome",
        status: "failed",
        errorMessage: error.message,
        relatedUserId: user._id,
      });
    } catch (logError) {
      logger.error(`Failed to log email error: ${logError.message}`);
      // Don't throw - just log it
    }

    return { success: false, error: error.message };
  }
};

export const sendBookingConfirmationEmail = async (user, booking) => {
  // Check if transporter exists
  if (!transporter) {
    logger.warn(
      "Email transporter not configured, skipping booking confirmation email"
    );
    return { success: false, error: "Email service not configured" };
  }

  // Check if email config is valid
  if (!config.emailUser || !config.emailPass) {
    logger.warn(
      "Email credentials missing, skipping booking confirmation email"
    );
    return { success: false, error: "Email credentials not configured" };
  }

  try {
    const htmlContent = `
      <div style="font-family: 'Inter', sans-serif; background: #FFF8E7; padding: 30px; border-left: 4px solid #D4AF37;">
        <h2 style="color: #D4AF37;">Booking Confirmed</h2>
        <p>Dear ${user.firstName},</p>
        <p>Your booking at Maharaja Palace has been confirmed!</p>
        <div style="background: white; padding: 20px; margin: 20px 0; border-radius: 4px;">
          <p><strong>Booking Number:</strong> ${booking.bookingNumber}</p>
          <p><strong>Check-in:</strong> ${new Date(
            booking.checkInDate
          ).toLocaleDateString()}</p>
          <p><strong>Check-out:</strong> ${new Date(
            booking.checkOutDate
          ).toLocaleDateString()}</p>
          <p><strong>Total Price:</strong> ₹${booking.totalPrice}</p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: config.emailUser,
      to: user.email,
      subject: `Booking Confirmation - ${booking.bookingNumber}`,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);

    // Log email success (with try-catch)
    try {
      await EmailLog.create({
        recipient: user.email,
        subject: mailOptions.subject,
        emailType: "booking_confirmation",
        status: "sent",
        relatedBookingId: booking._id,
        relatedUserId: user._id,
      });
    } catch (logError) {
      logger.error(
        `Failed to log booking confirmation email: ${logError.message}`
      );
      // Don't throw - email was sent successfully
    }

    logger.info(`Booking confirmation email sent to ${user.email}`);
    return { success: true, info };
  } catch (error) {
    logger.error(
      `Failed to send booking confirmation email to ${user.email}: ${error.message}`
    );

    // Try to log failed email (but don't fail if logging fails)
    try {
      await EmailLog.create({
        recipient: user.email,
        subject: `Booking Confirmation`,
        emailType: "booking_confirmation",
        status: "failed",
        errorMessage: error.message,
        relatedUserId: user._id,
      });
    } catch (logError) {
      logger.error(`Failed to log booking email error: ${logError.message}`);
      // Don't throw - just log it
    }

    return { success: false, error: error.message };
  }
};

// Helper function to verify email configuration
export const verifyEmailConfig = async () => {
  if (!transporter) {
    return { success: false, message: "Email transporter not configured" };
  }

  try {
    await transporter.verify();
    logger.info("Email service is ready");
    return { success: true, message: "Email service configured correctly" };
  } catch (error) {
    logger.error(`Email configuration error: ${error.message}`);
    return { success: false, message: error.message };
  }
};
