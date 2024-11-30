import axios from "axios";

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
