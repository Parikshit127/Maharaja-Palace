import mongoose from 'mongoose';

const banquetHallSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide hall name'],
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
    },
    capacity: {
      theater: { type: Number, required: true },
      cocktail: { type: Number, required: true },
      banquet: { type: Number, required: true },
    },
    basePrice: {
      type: Number,
      required: [true, 'Please provide base price'],
      min: 0,
    },
    amenities: [
      {
        type: String,
      },
    ],
    features: {
      hasProjector: { type: Boolean, default: false },
      hasSoundSystem: { type: Boolean, default: true },
      hasParking: { type: Boolean, default: true },
      hasWifi: { type: Boolean, default: true },
      allowsExternalCatering: { type: Boolean, default: false },
    },
    images: [
      {
        url: String,
        alt: String,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('BanquetHall', banquetHallSchema);
