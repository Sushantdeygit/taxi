import mongoose, { Schema } from "mongoose";

const earningSchema = new Schema({
  captain: {
    type: Schema.Types.ObjectId,
    ref: "Captain",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: [0, "Earnings cannot be negative"],
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

export const Earning = mongoose.model("Earning", earningSchema);
