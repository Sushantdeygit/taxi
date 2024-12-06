import { Router } from "express";
import {
  getAddressCoordinatesController,
  getDistanceAndTimeController,
  getSuggestedAddressesController,
} from "../controllers/maps.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  mapAddressValidator,
  mapDistanceAndTimeValidator,
  mapSuggestedAddressesValidator,
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
router
  .route("/getSuggestedAddresses")
  .post(
    verifyJWT,
    mapSuggestedAddressesValidator(),
    validateRequest,
    getSuggestedAddressesController
  );

export default router;
