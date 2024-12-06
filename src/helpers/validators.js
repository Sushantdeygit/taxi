import { body, check, validationResult, param, query } from "express-validator";
import { ApiError } from "../utils/ApiError.js";

//user validator
const userregisterValidator = () => [
  body("fullName.firstName", "Please enter first name.")
    .notEmpty()
    .withMessage("First name cannot be empty.")
    .isLength({ min: 3 })
    .withMessage("First name must be at least 3 characters long."),
  body("fullName.lastName", "Please enter last name.")
    .notEmpty()
    .withMessage("Last name cannot be empty.")
    .isLength({ min: 3 })
    .withMessage("Last name must be at least 3 characters long."),
  body("email", "Please enter email.")
    .notEmpty()
    .withMessage("Email cannot be empty.")
    .isEmail()
    .withMessage("Invalid email format."),
  body("password", "Please enter password.")
    .notEmpty()
    .withMessage("Password cannot be empty.")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long."),
];

const loginValidator = () => [
  body("email", "Please enter email.").notEmpty(),
  body("password", "Please enter password.").notEmpty(),
];

//captain validator

const captainregisterValidator = () => [
  body("fullName.firstName", "Please enter first name.")
    .notEmpty()
    .withMessage("First name cannot be empty.")
    .isLength({ min: 3 })
    .withMessage("First name must be at least 3 characters long."),

  body("fullName.lastName", "Please enter last name.")
    .notEmpty()
    .withMessage("Last name cannot be empty.")
    .isLength({ min: 3 })
    .withMessage("Last name must be at least 3 characters long."),

  body("email", "Please enter a valid email.")
    .notEmpty()
    .withMessage("Email cannot be empty.")
    .isEmail()
    .withMessage("Invalid email format."),

  body("password", "Please enter a password.")
    .notEmpty()
    .withMessage("Password cannot be empty.")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long."),

  // Custom validation for profile picture
  body("profilePicture")
    .custom((value, { req }) => {
      if (!req.files || !req.files.profilePicture) {
        throw new Error("Please upload a profile picture.");
      }
      return true; // File is uploaded
    })
    .withMessage("Profile picture cannot be empty."),

  body("vehicle.color", "Please enter vehicle color.")
    .notEmpty()
    .withMessage("Vehicle color cannot be empty."),

  body("vehicle.capacity", "Please enter vehicle capacity.")
    .notEmpty()
    .withMessage("Vehicle capacity cannot be empty.")
    .isString({ min: 1 })
    .withMessage("Capacity must be a positive number."),

  body("vehicle.licensePlate", "Please enter vehicle license plate.")
    .notEmpty()
    .withMessage("Vehicle license plate cannot be empty."),

  body("vehicle.vehicleType", "Please enter vehicle type.")
    .notEmpty()
    .withMessage("Vehicle type cannot be empty."),

  // Custom validation for vehicle image
  body("vehicle.vehicleImage")
    .custom((value, { req }) => {
      if (!req.files || !req.files.vehicleImage) {
        throw new Error("Please upload a vehicle image.");
      }
      return true; // File is uploaded
    })
    .withMessage("Vehicle image cannot be empty."),
];

const mapAddressValidator = () => [
  body("address", "Please enter address.").isString().isLength({ min: 3 }),
];

const mapDistanceAndTimeValidator = () => [
  body("origin", "Please enter origin.").isString().isLength({ min: 3 }),
  body("destination", "Please enter destination.")
    .isString()
    .isLength({ min: 3 }),
];
const mapSuggestedAddressesValidator = () => [
  body("address", "Please enter address.").isString().isLength({ min: 3 }),
];

const rideCreateValidator = () => [
  body("startLocation", "Please enter startLocation.")
    .isString()
    .isLength({ min: 3 }),
  body("endLocation", "Please enter endLocation.")
    .isString()
    .isLength({ min: 3 }),
  body("vehicleType", "Please enter vehicleType.")
    .isString()
    .isIn(["car", "bike", "auto"])
    .withMessage("Invalid vehicle type"),
];

export const getFareValidator = () => [
  body("startLocation", "Please enter startLocation.")
    .isString()
    .isLength({ min: 3 }),
  body("endLocation", "Please enter endLocation.")
    .isString()
    .isLength({ min: 3 }),
];

export const confirmRideValidator = () => [
  body("rideId", "Please enter rideId.").isString().isLength({ min: 3 }),
];

export const startRideValidator = () => [
  query("rideId").isMongoId().withMessage("Invalid rideId"),
  query("otp").isInt().isLength({ min: 6 }).withMessage("Invalid OTP"),
];

export const endRideValidator = () => [
  body("rideId", "Please enter rideId.").isString().isLength({ min: 3 }),
];
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error("Validation Errors:", errors.array()); // Debug log
    throw new ApiError(
      400,
      errors
        .array()
        .map((e) => e.msg)
        .join(", ")
    );
  }
  next();
};

export {
  validateRequest,
  userregisterValidator,
  loginValidator,
  captainregisterValidator,
  mapAddressValidator,
  mapDistanceAndTimeValidator,
  rideCreateValidator,
  mapSuggestedAddressesValidator,
};
