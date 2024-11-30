import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {
  getAddressCoordinates,
  getDistanceAndTime,
} from "../../services/maps.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getAddressCoordinatesController = asyncHandler(async (req, res) => {
  const { address } = req.body;
  if (!address) {
    throw new ApiError(400, "Address is required");
  }
  try {
    const coordinates = await getAddressCoordinates(address);
    return res.status(200).json(
      new ApiResponse(200, "Address coordinates fetched successfully", {
        coordinates,
      })
    );
  } catch (error) {
    throw new ApiError(500, "Error fetching coordinates");
  }
});

const getDistanceAndTimeController = asyncHandler(async (req, res) => {
  const { origin, destination } = req.body;
  if (!origin || !destination) {
    throw new ApiError(400, "Origin and destination are required");
  }
  try {
    const { distance, duration } = await getDistanceAndTime(
      origin,
      destination
    );
    return res.status(200).json(
      new ApiResponse(200, "Distance and time fetched successfully", {
        distance,
        duration,
      })
    );
  } catch (error) {
    throw new ApiError(500, "Error fetching distance and time");
  }
});

export { getAddressCoordinatesController, getDistanceAndTimeController };
