import { Captain } from "../models/captain.model.js";
import { Vehicle } from "../models/vehicle.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadToS3 } from "../helpers/s3Bucket.js";

const registerCaptain = asyncHandler(async (req, res) => {
  const { fullName, email, password, vehicle } = req.body;

  // Parse and validate vehicle details
  const { firstName, lastName } = fullName;
  const { color, capacity, licensePlate, vehicleType } = vehicle;
  if (
    !firstName ||
    !lastName ||
    !email ||
    !password ||
    !vehicle ||
    !req.files?.profilePicture ||
    !req.files?.vehicleImage
  ) {
    throw new ApiError(400, "All fields are required, including images.");
  }

  // Check if captain already exists
  const existedCaptain = await Captain.findOne({ email });
  if (existedCaptain) {
    throw new ApiError(400, "Email already exists.");
  }

  const existedVehicle = await Vehicle.findOne({ licensePlate });
  if (existedVehicle) {
    throw new ApiError(400, "License Plate already exists.");
  }
  // Upload images to S3
  const profilePictureUrl = await uploadToS3(
    req.files.profilePicture[0],
    "captains/profile-pictures"
  );
  const vehicleImageUrl = await uploadToS3(
    req.files.vehicleImage[0],
    "vehicles/images"
  );

  // Save vehicle to the database
  const vehicleDoc = await Vehicle.create({
    color,
    capacity,
    licensePlate,
    vehicleType,
    vehicleImage: vehicleImageUrl,
  });
  // Hash password
  const hashedPassword = await Captain.hashPassword(password);

  // Save captain to the database
  const captain = await Captain.create({
    fullName: { firstName, lastName },
    email,
    password: hashedPassword,
    profilePicture: profilePictureUrl,
    vehicle: vehicleDoc,
  });

  const token = captain.generateAccessToken();
  res
    .cookie("captain_token", token, {
      httpOnly: true,
      secure: true,
    })
    .status(201)
    .json(
      new ApiResponse(200, { captain, token }, "Captain created successfully.")
    );
});

const loginCaptain = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const captain = await Captain.findOne({ email }).select("+password");
  if (!captain) {
    throw new ApiError(401, "Invalid email");
  }
  if (!(await captain.isPasswordCorrect(password))) {
    throw new ApiError(401, "Invalid password.");
  }
  const token = captain.generateAccessToken();
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .cookie("captain_token", token, options)
    .status(200)
    .cookie("token", token, options)
    .json(
      new ApiResponse(200, { captain, token }, "Captain logged in successfully")
    );
});

const getCaptainProfile = asyncHandler(async (req, res) => {
  const captain = await Captain.findById(req.captain._id);
  if (!captain) {
    throw new ApiError(404, "Captain not found");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, { captain }, "Captain profile fetched successfully")
    );
});

const logoutCaptain = asyncHandler(async (req, res) => {
  res.clearCookie("captain_token");
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");
  await BlackList.create({ token });

  return res.status(200).json(new ApiResponse(200, "Logged out successfully"));
});

export { registerCaptain, loginCaptain, getCaptainProfile, logoutCaptain };
