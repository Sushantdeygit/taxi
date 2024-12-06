import { getDistanceAndTime } from "./maps.service.js";
import { Ride } from "../models/ride.model.js";
import mongoose from "mongoose";
import crypto from "crypto";
const fareRates = {
  car: { perKm: 10, perMin: 5 }, // 10 per km, 5 per min
  bike: { perKm: 5, perMin: 3 }, // 5 per km, 3 per min
  auto: { perKm: 8, perMin: 4 }, // 8 per km, 4 per min
};
export async function getFare(pickup, destination) {
  if (!pickup || !destination) {
    throw new Error("Pickup and destination are required");
  }

  const { distance, duration } = await getDistanceAndTime(pickup, destination);
  console.log(duration);

  const baseFare = {
    auto: 30,
    car: 50,
    moto: 20,
  };

  const perKmRate = {
    auto: 10,
    car: 15,
    moto: 8,
  };

  const perMinuteRate = {
    auto: 3,
    car: 5,
    moto: 4,
  };

  const fare = {
    auto: Math.round(
      baseFare.auto +
        (distance / 1000) * perKmRate.auto +
        duration * perMinuteRate.auto
    ),
    car: Math.round(
      baseFare.car +
        (distance / 1000) * perKmRate.car +
        duration * perMinuteRate.car
    ),
    moto: Math.round(
      baseFare.moto +
        (distance / 1000) * perKmRate.moto +
        duration * perMinuteRate.moto
    ),
  };

  return fare;
}

export const fareCalculation = async (origin, destination, vehicleType) => {
  try {
    // Fetch distance and duration for the trip
    const { distance, duration } = await getDistanceAndTime(
      origin,
      destination
    );
    console.log(distance, duration);

    // Ensure the vehicle type exists in fareRates
    if (!fareRates[vehicleType]) {
      throw new Error("Invalid vehicle type");
    }

    // Get the fare rates for the selected vehicle type
    const { perKm, perMin } = fareRates[vehicleType];

    // Calculate the fare
    const fare = distance * perKm + duration * perMin;

    return {
      statusCode: 200,
      data: "Fare calculated successfully",
      message: {
        fare: fare.toFixed(2), // Return fare rounded to 2 decimal places
        distance: `${distance.toFixed(2)} km`,
        duration: `${duration.toFixed(0)} mins`,
      },
      success: true,
    };
  } catch (error) {
    console.error("Error calculating fare:", error);
    return {
      statusCode: 500,
      data: "Error calculating fare",
      message: error.message,
      success: false,
    };
  }
};

export const getOtp = async (length) => {
  let otp = "";

  // Ensure the first digit is not zero
  otp += crypto.randomInt(1, 10); // This ensures the first digit is between 1 and 9

  // Generate the rest of the OTP (length - 1 digits)
  for (let i = 1; i < length; i++) {
    otp += crypto.randomInt(0, 10); // Subsequent digits can be between 0 and 9
  }

  return otp;
};

export const createRide = async ({
  userId,
  startLocation,
  endLocation,
  vehicleType,
}) => {
  console.log(userId, startLocation, endLocation, vehicleType);
  if (!startLocation || !endLocation || !vehicleType) {
    throw new Error("Invalid input");
  }

  const fare = await fareCalculation(startLocation, endLocation, vehicleType);
  if (fare.success === false) {
    throw new Error("Invalid input");
  } else {
    console.log(fare.message);
  }

  const userObjectId = new mongoose.Types.ObjectId(userId);

  const otp = await getOtp(6);

  const ride = await Ride.create({
    user: userObjectId,
    otp,
    startLocation,
    endLocation,
    fare: fare.message.fare,
    distance: fare.message.distance,
    duration: fare.message.duration,
  });

  return ride;
};

export async function confirmRide({ rideId, captain }) {
  if (!rideId) {
    throw new Error("Ride id is required");
  }

  await Ride.findOneAndUpdate(
    {
      _id: rideId,
    },
    {
      status: "accepted",
      captain: captain._id,
    }
  );

  const ride = await Ride.findOne({
    _id: rideId,
  })
    .populate("user")
    .populate("captain")
    .select("+otp");

  if (!ride) {
    throw new Error("Ride not found");
  }

  return ride;
}

export async function startRide({ rideId, otp, captain }) {
  if (!rideId || !otp) {
    throw new Error("Ride id and OTP are required");
  }

  const ride = await Ride.findOne({
    _id: rideId,
  })
    .populate("user")
    .populate("captain")
    .select("+otp");

  if (!ride) {
    throw new Error("Ride not found");
  }

  if (ride.status !== "accepted") {
    throw new Error("Ride not accepted");
  }

  if (ride.otp !== Number(otp)) {
    throw new Error("Invalid OTP");
  }

  await Ride.findOneAndUpdate(
    {
      _id: rideId,
    },
    {
      status: "ongoing",
    }
  );

  return ride;
}

export async function endRide({ rideId, captain }) {
  if (!rideId) {
    throw new Error("Ride id is required");
  }

  const ride = await Ride.findOne({
    _id: rideId,
    captain: captain._id,
  })
    .populate("user")
    .populate("captain")
    .select("+otp");

  if (!ride) {
    throw new Error("Ride not found");
  }

  if (ride.status !== "ongoing") {
    throw new Error("Ride not ongoing");
  }

  await Ride.findOneAndUpdate(
    {
      _id: rideId,
    },
    {
      status: "completed",
    }
  );

  return ride;
}
