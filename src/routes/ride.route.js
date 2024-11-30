import { Router } from "express";
import { rideCreateValidator, validateRequest } from "../helpers/validators.js";
import { createRideController } from "../controllers/ride.controller.js";
import { verifyCaptainJWT, verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router
  .route("/create")
  .post(
    verifyJWT,
    rideCreateValidator(),
    validateRequest,
    createRideController
  );

export default router;
