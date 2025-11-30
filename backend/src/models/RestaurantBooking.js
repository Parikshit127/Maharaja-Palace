import mongoose from "mongoose";

const restaurantBookingSchema = new mongoose.Schema(
  {
    bookingNumber: {
      type: String,
      unique: true,
    },
    guest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    table: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RestaurantTable",
      required: true,
    },
    bookingDate: {
      type: Date,
      required: [true, "Please provide booking date"],
    },
    timeSlot: {
      type: String,
      enum: ["breakfast", "lunch", "afternoon_tea", "dinner", "late_dinner"],
      required: true,
    },
    numberOfGuests: {
      type: Number,
      required: [true, "Please specify number of guests"],
      min: 1,
    },
    specialDietaryRequirements: {
      type: String,
      default: "",
    },
    specialRequests: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled", "no-show"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate booking number before saving
restaurantBookingSchema.pre("save", function (next) {
  if (!this.bookingNumber) {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    this.bookingNumber = `REST-${timestamp}-${random}`;
  }
  next();
});

// Index for faster queries
restaurantBookingSchema.index({ bookingNumber: 1 });
restaurantBookingSchema.index({ guest: 1 });
restaurantBookingSchema.index({ bookingDate: 1, timeSlot: 1 });

export default mongoose.model("RestaurantBooking", restaurantBookingSchema);
