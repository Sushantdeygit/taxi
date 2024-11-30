import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Ride } from "../models/ride.model.js";
import { Captain } from "../models/captain.model.js";
import { User } from "../models/user.model.js";
import { createRide } from "../../services/ride.service.js";

const createRideController = asyncHandler(async (req, res) => {
  const { startLocation, endLocation, vehicleType } = req.body;
  console.log(req.user);

  if (!startLocation || !endLocation || !vehicleType) {
    throw new ApiError(400, "All fields are required");
  }

  const ride = await createRide({
    userId: req.user._id,
    startLocation,
    endLocation,
    vehicleType,
  });

  return res.status(201).json(
    new ApiResponse(200, "Ride created successfully", {
      ride,
      vehicleType,
    })
  );
});

export { createRideController };
