import { getDistanceAndTime } from "./maps.service.js";
import { Ride } from "../src/models/ride.model.js";
import mongoose from "mongoose";
const fareRates = {
  car: { perKm: 10, perMin: 5 }, // 10 per km, 5 per min
  bike: { perKm: 5, perMin: 3 }, // 5 per km, 3 per min
  auto: { perKm: 8, perMin: 4 }, // 8 per km, 4 per min
};

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

  console.log({
    userId,
    startLocation,
    endLocation,
    vehicleType,
    fare: fare.message.fare,
    distance: fare.message.distance,
    duration: fare.message.duration,
  });

  const userObjectId = new mongoose.Types.ObjectId(userId);
  const ride = await Ride.create({
    user: userObjectId,
    startLocation,
    endLocation,
    vehicleType,
    fare: fare.message.fare,
    distance: fare.message.distance,
    duration: fare.message.duration,
  });

  return ride;
};
