import axios from "axios";
import { Captain } from "../models/captain.model.js";

export const getSuggestedAddresses = async (address) => {
  const GOOGLE_PLACES_API_URL =
    "https://maps.googleapis.com/maps/api/place/autocomplete/json";
  try {
    // Send a request to Google Places API

    const response = await axios.get(GOOGLE_PLACES_API_URL, {
      params: {
        input: address.trim(), // The search query, i.e., location entered by the user
        key: process.env.GOOGLE_MAPS_API_KEY, // API key
        language: "en", // Language of the results
        types: "geocode", // Restrict to geocoding results (places)
        locationbias: "circle:5000@28.6139,77.2090", // Restrict to Delhi
      },
    });

    // If Google API responds with predictions
    if (response.data.status === "OK") {
      let places = response.data.predictions;
      let suggestions = [];
      for (let i = 0; i < 4; i++) {
        suggestions.push(response.data.predictions[i].description);
      }
      return {
        suggestions,
      };
    } else {
      console.log(response.data);

      throw new Error("Error fetching location suggestions");
    }
  } catch (error) {
    console.error(error);
    throw new Error("Something went wrong, please try again later");
  }
};

export const getAddressCoordinates = async (address) => {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  const baseUrl = "https://maps.googleapis.com/maps/api/geocode/json";

  try {
    // Make a request to Google Maps Geocoding API
    const response = await axios.get(baseUrl, {
      params: {
        address: address,
        key: apiKey,
      },
    });

    // Check if the response contains valid data
    if (response.data.status === "OK") {
      // Extract latitude and longitude from the response
      const { lat, lng } = response.data.results[0].geometry.location;

      // Return latitude and longitude as an object
      return { lat, lng };
    } else {
      throw new Error("Unable to get coordinates for the provided address");
    }
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    throw new Error("Error fetching coordinates");
  }
};

export const getDistanceAndTime = async (origin, destination) => {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  const baseUrl = "https://maps.googleapis.com/maps/api/distancematrix/json";

  try {
    // Make a request to the Google Maps Distance Matrix API
    const response = await axios.get(baseUrl, {
      params: {
        origins: origin,
        destinations: destination,
        mode: "driving",
        key: apiKey,
      },
    });

    // Check if the response status is OK
    if (response.data.status === "OK") {
      const element = response.data.rows[0].elements[0];

      if (element.status === "OK") {
        // Extract the distance and duration from the response
        const distance = element.distance.value / 1000; // Distance in human-readable format (e.g., "5 km")
        const duration = element.duration.value / 60; // Duration in human-readable format (e.g., "15 mins")

        // Return the distance and duration as an object
        return { distance, duration };
      } else {
        throw new Error(
          "Unable to calculate distance and time between the origin and destination"
        );
      }
    } else {
      throw new Error("Error fetching data from the Google Maps API");
    }
  } catch (error) {
    console.error("Error fetching distance and time:", error);
    throw new Error("Error fetching distance and time");
  }
};

export async function getCaptainsInRadius(ltd, lng, radius) {
  console.log(ltd, lng, radius);
  //radius in km
  const captains = await Captain.find({
    location: {
      $geoWithin: {
        $centerSphere: [[ltd, lng], radius / 6371],
      },
    },
  });

  return captains;
}
