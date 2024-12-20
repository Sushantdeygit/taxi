import mongoose, { Schema } from "mongoose";

const rideSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    captain: {
      type: Schema.Types.ObjectId,
      ref: "Captain",
    },
    startLocation: {
      type: String,
      required: true,
    },
    endLocation: {
      type: String,
      required: true,
    },
    fare: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "ongoing", "completed", "cancelled"],
      default: "pending",
    },
    duration: {
      type: String,
    },
    distance: {
      type: String,
    },
    paymentID: {
      type: String,
    },
    orderID: {
      type: String,
    },
    signature: {
      type: String,
    },
    otp: {
      type: Number,
      select: false,
      required: true,
    },
    feedback: {
      rating: {
        type: Number,
        min: 1,
        max: 5,
      },
      comments: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

export const Ride = mongoose.model("Ride", rideSchema);
