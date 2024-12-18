import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Ride } from "../models/ride.model.js";
import { Captain } from "../models/captain.model.js";
import { User } from "../models/user.model.js";
import { Earning } from "../models/earning.model.js";
import {
  createRide,
  fareCalculation,
  getFare,
  startRide,
  endRide,
  confirmRide,
} from "../services/ride.service.js";
import {
  getAddressCoordinates,
  getCaptainsInRadius,
} from "../services/maps.service.js";
import { sendMessageToSocketId } from "../socket.js";

const createRideController = asyncHandler(async (req, res) => {
  const { startLocation, endLocation, vehicleType } = req.body;

  if (!startLocation || !endLocation || !vehicleType) {
    throw new ApiError(400, "All fields are required");
  }

  const ride = await createRide({
    userId: req.user._id,
    startLocation,
    endLocation,
    vehicleType,
  });

  const pickUpCoords = await getAddressCoordinates(startLocation);
  const destinationCoords = await getAddressCoordinates(endLocation);
  const captainsInRadius = await getCaptainsInRadius(
    pickUpCoords.lat,
    pickUpCoords.lng,
    2
  );

  ride.otp = "";
  const rideWithUserData = await Ride.findOne({ _id: ride._id }).populate(
    "user"
  );
  captainsInRadius.forEach((captain) => {
    sendMessageToSocketId(captain.socketId, {
      event: "new-ride",
      data: {
        ride: rideWithUserData,
        pickUpCoords,
        destinationCoords,
      },
    });
  });

  return res.status(201).json(
    new ApiResponse(200, "Ride created successfully", {
      ride,
      vehicleType,
    })
  );
});

const getFareController = asyncHandler(async (req, res) => {
  const { startLocation, endLocation } = req.body;
  if (!startLocation || !endLocation) {
    throw new ApiError(400, "Invalid input");
  }

  const fare = await getFare(startLocation, endLocation);
  return res
    .status(200)
    .json(new ApiResponse(200, fare, "Fare calculated successfully"));
});

const confirmRideController = asyncHandler(async (req, res) => {
  const { rideId } = req.body;
  if (!rideId) {
    throw new ApiError(400, "Ride id is required");
  }

  const startLocation = await Ride.findOne({ _id: rideId }).select(
    "startLocation"
  );
  const endLocation = await Ride.findOne({ _id: rideId }).select("endLocation");

  const pickUpCoords = await getAddressCoordinates(startLocation);
  const destinationCoords = await getAddressCoordinates(endLocation);

  console.log("nidde:", pickUpCoords, destinationCoords);

  const ride = await confirmRide({ rideId, captain: req.captain });

  sendMessageToSocketId(ride.user.socketId, {
    event: "ride-confirmed",
    data: {
      ride,
      pickUpCoords,
      destinationCoords,
    },
  });
  return res
    .status(200)
    .json(new ApiResponse(200, "Ride confirmed successfully"));
});
const startRideController = asyncHandler(async (req, res) => {
  const { rideId, otp } = req.query;

  if (!rideId || !otp) {
    throw new ApiError(400, "Invalid input");
  }
  const ride = await startRide({ rideId, otp, captain: req.captain });

  sendMessageToSocketId(ride.user.socketId, {
    event: "ride-started",
    data: ride,
  });
  return res
    .status(200)
    .json(new ApiResponse(200, "Ride started successfully"));
});

const endRideController = asyncHandler(async (req, res) => {
  const { rideId } = req.body;
  if (!rideId) {
    throw new ApiError(400, "Ride id is required");
  }
  const ride = await endRide({ rideId, captain: req.captain });

  sendMessageToSocketId(ride.user.socketId, {
    event: "ride-ended",
    data: ride,
  });

  await Earning.create({
    captain: req.captain._id,
    amount: ride.fare,
    date: new Date(),
  });

  return res.status(200).json(new ApiResponse(200, "Ride ended successfully"));
});
export {
  createRideController,
  getFareController,
  confirmRideController,
  startRideController,
  endRideController,
};
