import Razorpay from "razorpay";
import crypto from "crypto";
import { logger } from "../utils/logger.js";

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * Create a Razorpay order for payment
 * @param {number} amount - Amount in paisa (multiply INR by 100)
 * @param {string} description - Payment description
 * @param {string} bookingId - Booking ID
 * @returns {Promise<Object>} Order details or error
 */
export const createPaymentOrder = async (amount, description, bookingId) => {
  try {
    const options = {
      amount: Math.round(amount * 100), // Convert to paisa
      currency: "INR",
      description,
      notes: {
        bookingId,
      },
    };

    const order = await razorpay.orders.create(options);
    logger.info(`Razorpay order created: ${order.id}`);

    return {
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    };
  } catch (error) {
    logger.error(`Create payment order error: ${error.message}`);
    return {
      success: false,
      message: "Failed to create payment order",
      error: error.message,
    };
  }
};

/**
 * Verify Razorpay payment signature
 * @param {string} orderId - Razorpay order ID
 * @param {string} paymentId - Razorpay payment ID
 * @param {string} signature - Razorpay signature
 * @returns {Promise<Object>} Verification result
 */
export const verifyPayment = async (orderId, paymentId, signature) => {
  try {
    // Create the signature body
    const body = `${orderId}|${paymentId}`;

    // Generate signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    // Compare signatures
    if (generatedSignature === signature) {
      logger.info(`Payment verified successfully: ${paymentId}`);
      return {
        success: true,
        message: "Payment verified successfully",
        paymentId,
      };
    } else {
      logger.warn(
        `Payment verification failed for ${paymentId}. Expected: ${generatedSignature}, Got: ${signature}`
      );
      return {
        success: false,
        message: "Payment verification failed - Invalid signature",
      };
    }
  } catch (error) {
    logger.error(`Payment verification error: ${error.message}`);
    return {
      success: false,
      message: "Payment verification failed",
      error: error.message,
    };
  }
};

/**
 * Process refund for a payment
 * @param {string} paymentId - Razorpay payment ID
 * @param {number} amount - Refund amount (optional, full refund if not provided)
 * @returns {Promise<Object>} Refund details or error
 */
export const refundPayment = async (paymentId, amount = null) => {
  try {
    const options = {};
    if (amount) {
      options.amount = Math.round(amount * 100); // Convert to paisa
    }

    const refund = await razorpay.payments.refund(paymentId, options);
    logger.info(`Refund processed: ${refund.id} for payment ${paymentId}`);

    return {
      success: true,
      refundId: refund.id,
      status: refund.status,
      amount: refund.amount,
    };
  } catch (error) {
    logger.error(`Refund processing error: ${error.message}`);
    return {
      success: false,
      message: "Failed to process refund",
      error: error.message,
    };
  }
};

/**
 * Get payment details from Razorpay
 * @param {string} paymentId - Razorpay payment ID
 * @returns {Promise<Object>} Payment details
 */
export const getPaymentDetails = async (paymentId) => {
  try {
    const payment = await razorpay.payments.fetch(paymentId);
    logger.info(`Payment details fetched: ${paymentId}`);

    return {
      success: true,
      payment: {
        id: payment.id,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        method: payment.method,
        acquirer_data: payment.acquirer_data,
      },
    };
  } catch (error) {
    logger.error(`Get payment details error: ${error.message}`);
    return {
      success: false,
      message: "Failed to fetch payment details",
      error: error.message,
    };
  }
};
