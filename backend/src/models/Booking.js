import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    bookingNumber: {
      type: String,
      unique: true,
    },
    guest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: true,
    },
    checkInDate: {
      type: Date,
      required: [true, 'Please provide check-in date'],
    },
    checkOutDate: {
      type: Date,
      required: [true, 'Please provide check-out date'],
    },
    numberOfNights: {
      type: Number,
      required: true,
    },
    numberOfGuests: {
      type: Number,
      required: [true, 'Please specify number of guests'],
      min: 1,
    },
    roomRate: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    specialRequests: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'checked-in', 'checked-out', 'cancelled'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['credit_card', 'debit_card', 'razorpay', 'bank_transfer'],
      default: null,
    },
    transactionId: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate booking number
bookingSchema.pre('save', function (next) {
  if (this.isNew && !this.bookingNumber) {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    this.bookingNumber = `BK-${timestamp}-${random}`;
  }
  next();
});

export default mongoose.model('Booking', bookingSchema);
