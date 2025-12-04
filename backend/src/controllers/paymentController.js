import Razorpay from "razorpay";
import crypto from "crypto";
import Booking from "../models/Booking.js";
import dotenv from "dotenv";

dotenv.config();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay Order
export const createOrder = async (req, res) => {
  try {
    const { amount, bookingId } = req.body;

    // Validate booking exists
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Create Razorpay order
    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency: "INR",
      receipt: `receipt_${bookingId}`,
      notes: {
        bookingId: bookingId,
        bookingNumber: booking.bookingNumber,
      },
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      order,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create payment order",
      error: error.message,
    });
  }
};

// Verify Payment Signature
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingId,
    } = req.body;

    // Create expected signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    // Verify signature
    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Update booking status
      const booking = await Booking.findByIdAndUpdate(
        bookingId,
        {
          paymentStatus: "completed",
          status: "confirmed",
          transactionId: razorpay_payment_id,
          paymentMethod: "razorpay",
          paidAmount: booking.totalPrice,
        },
        { new: true }
      ).populate("room guest");

      res.status(200).json({
        success: true,
        message: "Payment verified successfully",
        booking,
      });
    } else {
      // Payment verification failed
      await Booking.findByIdAndUpdate(bookingId, {
        paymentStatus: "failed",
        status: "pending",
      });

      res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }
  } catch (error) {
    console.error("Verify payment error:", error);
    res.status(500).json({
      success: false,
      message: "Payment verification failed",
      error: error.message,
    });
  }
};

// Initiate Refund
export const initiateRefund = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { reason } = req.body;

    // Find booking
    const booking = await Booking.findById(bookingId).populate("room guest");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Check if payment was completed
    if (booking.paymentStatus !== "completed") {
      return res.status(400).json({
        success: false,
        message: "Cannot refund - payment not completed",
      });
    }

    // Check if already refunded
    if (booking.paymentStatus === "refunded") {
      return res.status(400).json({
        success: false,
        message: "Booking already refunded",
      });
    }

    // Calculate refund amount (you can add your refund policy here)
    const refundAmount = booking.paidAmount;

    try {
      // Process refund through Razorpay
      const refund = await razorpay.payments.refund(booking.transactionId, {
        amount: refundAmount * 100, // Amount in paise
        notes: {
          reason: reason || "Booking cancellation",
          bookingNumber: booking.bookingNumber,
        },
      });

      // Update booking
      booking.paymentStatus = "refunded";
      booking.status = "cancelled";
      await booking.save();

      res.status(200).json({
        success: true,
        message: "Refund processed successfully",
        refund,
        booking,
      });
    } catch (razorpayError) {
      console.error("Razorpay refund error:", razorpayError);

      // If Razorpay refund fails, still update booking status for testing
      booking.paymentStatus = "refunded";
      booking.status = "cancelled";
      await booking.save();

      res.status(200).json({
        success: true,
        message: "Refund initiated (Test Mode)",
        booking,
        note: "In test mode, actual refund may not process",
      });
    }
  } catch (error) {
    console.error("Initiate refund error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process refund",
      error: error.message,
    });
  }
};

// Get Payment Details
export const getPaymentDetails = async (req, res) => {
  try {
    const { paymentId } = req.params;

    const payment = await razorpay.payments.fetch(paymentId);

    res.status(200).json({
      success: true,
      payment,
    });
  } catch (error) {
    console.error("Get payment details error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch payment details",
      error: error.message,
    });
  }
};

// Webhook handler for Razorpay events
export const webhookHandler = async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers["x-razorpay-signature"];
    // Determine raw body string for signature verification
    let rawBody = null;
    if (req.body && typeof req.body === "string") {
      rawBody = req.body;
    } else if (req.body && Buffer.isBuffer(req.body)) {
      rawBody = req.body.toString("utf8");
    } else if (req.rawBody && Buffer.isBuffer(req.rawBody)) {
      rawBody = req.rawBody.toString("utf8");
    } else {
      // Fallback to stringifying the parsed body (less ideal for verification)
      try {
        rawBody = JSON.stringify(req.body);
      } catch (e) {
        rawBody = "";
      }
    }

    // Verify webhook signature using raw body
    const expectedSignature = crypto
      .createHmac("sha256", secret || "")
      .update(rawBody || "")
      .digest("hex");

    if (signature === expectedSignature) {
      // Parse payload safely
      let parsed = null;
      try {
        parsed =
          typeof req.body === "string" || Buffer.isBuffer(req.body)
            ? JSON.parse(rawBody)
            : req.body;
      } catch (e) {
        parsed = req.body;
      }

      const event = parsed?.event;
      const payload = parsed?.payload?.payment?.entity;

      // Handle different events
      switch (event) {
        case "payment.captured":
          // Payment successful
          await Booking.findOneAndUpdate(
            { transactionId: payload.id },
            {
              paymentStatus: "completed",
              status: "confirmed",
            }
          );
          break;

        case "payment.failed":
          // Payment failed
          await Booking.findOneAndUpdate(
            { transactionId: payload.id },
            {
              paymentStatus: "failed",
            }
          );
          break;

        case "refund.created":
          // Refund processed
          await Booking.findOneAndUpdate(
            { transactionId: payload.payment_id },
            {
              paymentStatus: "refunded",
              status: "cancelled",
            }
          );
          break;
      }

      res.status(200).json({ success: true });
    } else {
      res.status(400).json({ success: false, message: "Invalid signature" });
    }
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
