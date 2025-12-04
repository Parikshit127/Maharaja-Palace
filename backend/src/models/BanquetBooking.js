import mongoose from "mongoose";

const banquetBookingSchema = new mongoose.Schema(
  {
    bookingNumber: {
      type: String,
      unique: true,
      // REMOVED 'required: true' - will be generated in pre-save hook
    },
    guest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    banquetHall: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BanquetHall",
      required: true,
    },
    eventDate: {
      type: Date,
      required: [true, "Please provide event date"],
    },
    eventType: {
      type: String,
      enum: ["wedding", "conference", "party", "corporate", "other"],
      required: true,
    },
    expectedGuests: {
      type: Number,
      required: [true, "Please specify expected guests"],
      min: 1,
    },
    setupType: {
      type: String,
      enum: ["theater", "cocktail", "banquet"],
      required: true,
    },
    hallRate: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    paidAmount: {
      type: Number,
      default: 0,
    },
    bookingType: {
      type: String,
      enum: ['full', 'partial'],
      default: 'full',
    },
    specialRequirements: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
    refundStatus: {
      type: String,
      enum: ["none", "requested", "approved", "rejected", "processed"],
      default: "none",
    },
    refundAmount: {
      type: Number,
      default: 0,
    },
    refundId: {
      type: String,
      default: null,
    },
    refundReason: {
      type: String,
      default: null,
    },
    refundRequestedAt: {
      type: Date,
      default: null,
    },
    refundApprovedAt: {
      type: Date,
      default: null,
    },
    refundProcessedAt: {
      type: Date,
      default: null,
    },
    refundRejectionReason: {
      type: String,
      default: null,
    },
    refundProcessedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate booking number BEFORE saving
banquetBookingSchema.pre("save", function (next) {
  if (this.isNew && !this.bookingNumber) {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0");
    this.bookingNumber = `BANQ-${timestamp}-${random}`;
  }
  next();
});

export default mongoose.model("BanquetBooking", banquetBookingSchema);
