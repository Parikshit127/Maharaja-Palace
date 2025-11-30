import mongoose from 'mongoose';

const restaurantTableSchema = new mongoose.Schema(
  {
    tableNumber: {
      type: String,
      required: [true, 'Please provide table number'],
      unique: true,
    },
    capacity: {
      type: Number,
      required: [true, 'Please specify table capacity'],
      min: 1,
    },
    location: {
      type: String,
      enum: ['main_hall', 'garden', 'private_room', 'lounge'],
      required: true,
    },
    description: String,
    status: {
      type: String,
      enum: ['available', 'reserved', 'occupied'],
      default: 'available',
    },
    features: {
      hasPrivacy: { type: Boolean, default: false },
      hasWindowView: { type: Boolean, default: false },
      hasOutdoorAccess: { type: Boolean, default: false },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('RestaurantTable', restaurantTableSchema);
