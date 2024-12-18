import { Server as SocketIoServer } from "socket.io";
import { Captain } from "./models/captain.model.js";
import { User } from "./models/user.model.js";
import { Ride } from "./models/ride.model.js";

let io;

export function initializeSocket(server) {
  io = new SocketIoServer(server, {
    cors: {
      origin: "*", // Allow all origins (update in production)
      methods: ["GET", "POST"], // Allowed methods
    },
  });

  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Handle client joining
    socket.on("join", async (data) => {
      const { userId, userType } = data;

      if (!userId || !userType) {
        return socket.emit("error", { message: "Invalid join data" });
      }

      try {
        if (userType === "user") {
          await User.findByIdAndUpdate(userId, { socketId: socket.id });
        } else if (userType === "captain") {
          await Captain.findByIdAndUpdate(userId, { socketId: socket.id });
        }
      } catch (err) {
        console.error("Error updating socket ID:", err);
        socket.emit("error", { message: "Failed to join" });
      }
    });

    // Handle maps and live location updates for users and captains
    socket.on("track-ride", ({ rideId }) => {
      console.log(`Socket ${socket.id} is tracking ride ${rideId}`);
      socket.join(`ride-${rideId}`); // Join a room for the ride
    });

    // Broadcast location updates for captains (drivers)
    socket.on(
      "update-location-captain",
      async ({ userId, location, rideId = null }) => {
        if (
          !userId ||
          !location ||
          typeof location.ltd !== "number" ||
          typeof location.lng !== "number"
        ) {
          return socket.emit("error", { message: "Invalid location data" });
        }

        try {
          await Captain.findByIdAndUpdate(userId, {
            location: {
              ltd: location.ltd,
              lng: location.lng,
            },
          });

          console.log(`Location updated for captain ${userId}:`, location);

          await rideId;

          // Step 2: If rideId is provided (ride confirmed), broadcast the location
          if (rideId) {
            io.to(`ride-${rideId}`).emit("update-location-captain", {
              lat: location.ltd,
              lng: location.lng,
            });

            console.log(
              `Broadcasting updated location for captain ${userId} in ride ${rideId}`
            );
          }
        } catch (err) {
          console.error("Error handling location update:", err);
          socket.emit("error", { message: "Failed to update location" });
        }
      }
    );

    // Handle ride phase changes
    socket.on("update-ride-phase", ({ rideId, phase }) => {
      if (rideId && phase) {
        console.log(`Updating ride ${rideId} to phase ${phase}`);
        io.to(`ride-${rideId}`).emit("update-ride-phase", { rideId, phase });
      }
    });

    //disconnect from room
    socket.on("disconnect-ride", ({ rideId }) => {
      console.log(`Socket ${socket.id} disconnected from ride ${rideId}`);
      socket.leave(`ride-${rideId}`);
    });

    // Handle client disconnection
    socket.on("disconnect", async () => {
      console.log(`Client disconnected: ${socket.id}`);
      try {
        await User.updateMany({ socketId: socket.id }, { socketId: null });
        await Captain.updateMany({ socketId: socket.id }, { socketId: null });
      } catch (err) {
        console.error("Error clearing socket ID on disconnect:", err);
      }
    });
  });
}

// Function to send messages to a specific socket ID
export const sendMessageToSocketId = (socketId, messageObject) => {
  console.log(socketId, messageObject);
  try {
    if (messageObject?.event && messageObject?.data) {
      console.log("Emitting event:", messageObject.event);
      io.to(socketId).emit(messageObject.event, messageObject.data);
      console.log("Message sent successfully");
    } else {
      console.log("Invalid messageObject format");
    }
  } catch (error) {
    console.error("Error emitting event:", err);
  }
};
