import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(bodyParser.json());
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

export { app };
