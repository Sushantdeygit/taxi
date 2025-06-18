import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ApiError } from "./utils/ApiError.js";

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "https://riderly-eight.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//routes import
import userRouter from "./routes/user.route.js";
import captainRouter from "./routes/captain.route.js";
import mapRouter from "./routes/maps.route.js";
import rideRouter from "./routes/ride.route.js";
//routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/captains", captainRouter);
app.use("/api/v1/maps", mapRouter);
app.use("/api/v1/rides", rideRouter);

// http://localhost:8000/api/v1/users/register
// Global error handler
app.use((err, req, res, next) => {
  // Check if the error is an instance of ApiError
  if (err instanceof ApiError) {
    // Custom error message format for ApiError
    return res.status(err.statusCode).json({
      success: err.success,
      message: err.message,
      errors: err.errors || [],
    });
  }

  // If the error is not an instance of ApiError, handle it generically
  console.error(err); // Log the error for debugging purposes
  return res.status(500).json({
    success: false,
    message: "Something went wrong",
  });
});

export { app };
