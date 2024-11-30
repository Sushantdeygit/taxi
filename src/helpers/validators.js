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
  body("email", "Please enter email.").notEmpty(),
  body("password", "Please enter password.").notEmpty(),
  body("profilePicture", "Please enter profile picture.").notEmpty(),
  body("vehicle.color", "Please enter vehicle color.").notEmpty(),
  body("vehicle.capacity", "Please enter vehicle capacity.").notEmpty(),
  body(
    "vehicle.licensePlate",
    "Please enter vehicle license plate."
  ).notEmpty(),
  body("vehicle.vehicleType", "Please enter vehicle type.").notEmpty(),
  body("vehicle.vehicleImage", "Please enter vehicle image.").notEmpty(),
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
};
