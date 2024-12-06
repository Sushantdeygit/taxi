import { Router } from "express";
import {
  getFareValidator,
  rideCreateValidator,
  confirmRideValidator,
  validateRequest,
  startRideValidator,
  endRideValidator,
} from "../helpers/validators.js";
import {
  confirmRideController,
  createRideController,
  getFareController,
  startRideController,
  endRideController,
} from "../controllers/ride.controller.js";
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

router
  .route("/getFare")
  .post(verifyJWT, getFareValidator(), validateRequest, getFareController);

router
  .route("/confirm")
  .post(
    verifyCaptainJWT,
    confirmRideValidator(),
    validateRequest,
    confirmRideController
  );
router
  .route("/start-ride")
  .get(
    verifyCaptainJWT,
    startRideValidator(),
    validateRequest,
    startRideController
  );

router
  .route("/end-ride")
  .post(
    verifyCaptainJWT,
    endRideValidator(),
    validateRequest,
    endRideController
  );
export default router;
