import mongoose, { Schema } from "mongoose";

const vehicleSchema = new Schema({
  color: {
    type: String,
    required: true,
    minLength: [3, "Color must be atleast 3 characters long."],
  },
  capacity: {
    type: Number,
    required: true,
    minLength: [1, "Capacity must be atleast 1."],
  },

  licensePlate: {
    type: String,
    required: true,
    minLength: [3, "License Plate number must be atleast 3 characters long."],
  },

  vehicleType: {
    type: String,
    required: true,
    enum: ["car", "bike", "auto"],
  },
  vehicleImage: {
    type: String, //S3 Bucket
    required: true,
  },
});

export const Vehicle = mongoose.model("Vehicle", vehicleSchema);
