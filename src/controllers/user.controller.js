import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { BlackList } from "../models/blackList.model.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;
  const { firstName, lastName } = fullName;

  if (
    [firstName, lastName, email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({ email });

  if (existedUser) {
    return res.status(400).json(new ApiError("Email already exists", 400));
  }

  const hashedPassword = await User.hashPassword(password);

  const user = await User.create({
    fullName: {
      firstName,
      lastName,
    },
    email,
    password: hashedPassword,
  });

  const token = user.generateAccessToken();
  const options = {
    httpOnly: true,
    secure: true,
  };
  res.cookie("user_token", token, options);
  return res
    .status(201)
    .json(new ApiResponse(200, { user, token }, "User created successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new ApiError(401, "Invalid email");
  }

  if (!(await user.isPasswordCorrect(password))) {
    throw new ApiError(401, "Invalid password.");
  }

  const token = user.generateAccessToken();
  const options = {
    httpOnly: true,
    secure: true,
  };
  res.cookie("user_token", token, options);
  return res
    .status(200)
    .json(new ApiResponse(200, { user, token }, "User logged in successfully"));
});

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, { user }, "User profile fetched successfully"));
});

const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("user_token");
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");
  await BlackList.create({ token });

  return res.status(200).json(new ApiResponse(200, "Logged out successfully"));
});

export { registerUser, loginUser, getUserProfile, logoutUser };
