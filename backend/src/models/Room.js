import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: String,
      required: [true, "Please provide a room number"],
      unique: true,
    },
    roomType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RoomType",
      required: [true, "Please specify room type"],
    },
    floor: {
      type: Number,
      required: [true, "Please specify floor number"],
      min: 1,
    },
    status: {
      type: String,
      enum: ["available", "occupied", "maintenance", "reserved"],
      default: "available",
    },
    currentPrice: {
      type: Number,
      required: [true, "Please provide current price"],
      min: 0,
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

export default mongoose.model("Room", roomSchema);
