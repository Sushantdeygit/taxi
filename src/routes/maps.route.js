import { Router } from "express";
import {
  getAddressCoordinatesController,
  getDistanceAndTimeController,
} from "../controllers/maps.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  mapAddressValidator,
  mapDistanceAndTimeValidator,
  validateRequest,
} from "../helpers/validators.js";

const router = Router();

router
  .route("/getCoordinates")
  .post(
    verifyJWT,
    mapAddressValidator(),
    validateRequest,
    getAddressCoordinatesController
  );

router
  .route("/getDistanceAndTime")
  .post(
    verifyJWT,
    mapDistanceAndTimeValidator(),
    validateRequest,
    getDistanceAndTimeController
  );

export default router;
