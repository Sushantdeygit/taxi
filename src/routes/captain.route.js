import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
  captainregisterValidator,
  loginValidator,
  validateRequest,
} from "../helpers/validators.js";
import {
  getCaptainProfile,
  loginCaptain,
  logoutCaptain,
  registerCaptain,
} from "../controllers/captain.controller.js";
import { verifyCaptainJWT } from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/register").post(
  upload.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "vehicleImage", maxCount: 1 },
  ]),
  captainregisterValidator(),
  validateRequest,
  registerCaptain
);

router.route("/login").post(loginValidator(), validateRequest, loginCaptain);

router.route("/profile").get(verifyCaptainJWT, getCaptainProfile);
router.route("/logout").get(verifyCaptainJWT, logoutCaptain);

export default router;
