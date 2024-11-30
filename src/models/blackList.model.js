import mongoose, { Schema } from "mongoose";

const blackListSchema = new Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400,
  },
});

export const BlackList = mongoose.model("BlackList", blackListSchema);
