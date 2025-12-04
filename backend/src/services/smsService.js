import twilio from 'twilio';
import { logger } from '../utils/logger.js';

// Initialize Twilio client
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

let twilioClient = null;

// Check if Twilio is configured
const isTwilioConfigured = () => {
  return accountSid && authToken && twilioPhoneNumber;
};

// Initialize Twilio client if configured
if (isTwilioConfigured()) {
  try {
    twilioClient = twilio(accountSid, authToken);
    logger.info('📱 Twilio SMS service initialized successfully');
  } catch (error) {
    logger.error('❌ Failed to initialize Twilio:', error.message);
  }
} else {
  logger.warn('⚠️ Twilio not configured - SMS notifications disabled');
  logger.warn('   Add TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER to .env');
}

/**
 * Format phone number to international format
 */
const formatPhoneNumber = (phone) => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // If it starts with 91 (India code), add +
  if (cleaned.startsWith('91') && cleaned.length === 12) {
    return `+${cleaned}`;
  }
  
  // If it's 10 digits, assume India and add +91
  if (cleaned.length === 10) {
    return `+91${cleaned}`;
  }
  
  // If it already has +, return as is
  if (phone.startsWith('+')) {
    return phone;
  }
  
  // Otherwise, add + and return
  return `+${cleaned}`;
};

/**
 * Send SMS using Twilio
 */
const sendSMS = async (to, message) => {
  if (!isTwilioConfigured()) {
    logger.warn('⚠️ SMS not sent - Twilio not configured');
    return { success: false, error: 'Twilio not configured' };
  }

  try {
    const formattedPhone = formatPhoneNumber(to);
    
    logger.info(`📤 Sending SMS to ${formattedPhone}`);
    
    const result = await twilioClient.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to: formattedPhone,
    });

    logger.info(`✅ SMS sent successfully - SID: ${result.sid}`);
    
    return {
      success: true,
      messageSid: result.sid,
      status: result.status,
    };
  } catch (error) {
    logger.error(`❌ Failed to send SMS: ${error.message}`);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Send booking confirmation SMS
 */
export const sendBookingConfirmation = async (phone, bookingDetails) => {
  const { bookingNumber, type, checkIn, amount, guestName } = bookingDetails;
  
  const message = `🏰 Maharaja Palace
Booking Confirmed!

Booking #: ${bookingNumber}
Type: ${type}
Check-in: ${checkIn}
Amount Paid: ₹${amount.toLocaleString()}

Dear ${guestName}, thank you for choosing Maharaja Palace!`;

  return await sendSMS(phone, message);
};

/**
 * Send refund approval SMS
 */
export const sendRefundApproval = async (phone, refundDetails) => {
  const { bookingNumber, amount, guestName } = refundDetails;
  
  const message = `🏰 Maharaja Palace
Refund Approved!

Booking #: ${bookingNumber}
Refund Amount: ₹${amount.toLocaleString()}
Processing: 5-7 business days

Dear ${guestName}, your refund has been approved and will be processed shortly.`;

  return await sendSMS(phone, message);
};

/**
 * Send booking cancellation SMS
 */
export const sendBookingCancellation = async (phone, bookingDetails) => {
  const { bookingNumber, type, guestName } = bookingDetails;
  
  const message = `🏰 Maharaja Palace
Booking Cancelled

Booking #: ${bookingNumber}
Type: ${type}

Dear ${guestName}, your booking has been cancelled. If you have any questions, please contact us.`;

  return await sendSMS(phone, message);
};

/**
 * Send restaurant booking confirmation SMS
 */
export const sendRestaurantConfirmation = async (phone, bookingDetails) => {
  const { bookingNumber, tableNumber, date, timeSlot, guests, guestName } = bookingDetails;
  
  const message = `🏰 Maharaja Palace Restaurant
Reservation Confirmed!

Booking #: ${bookingNumber}
Table: ${tableNumber}
Date: ${date}
Time: ${timeSlot}
Guests: ${guests}

Dear ${guestName}, we look forward to serving you!`;

  return await sendSMS(phone, message);
};

/**
 * Send banquet booking confirmation SMS
 */
export const sendBanquetConfirmation = async (phone, bookingDetails) => {
  const { bookingNumber, hallName, date, eventType, guests, guestName } = bookingDetails;
  
  const message = `🏰 Maharaja Palace Banquet
Booking Confirmed!

Booking #: ${bookingNumber}
Hall: ${hallName}
Date: ${date}
Event: ${eventType}
Guests: ${guests}

Dear ${guestName}, your event booking is confirmed!`;

  return await sendSMS(phone, message);
};

export default {
  sendBookingConfirmation,
  sendRefundApproval,
  sendBookingCancellation,
  sendRestaurantConfirmation,
  sendBanquetConfirmation,
};
