import { Router } from "express";
import {
  loginValidator,
  userregisterValidator,
  validateRequest,
} from "../helpers/validators.js";
import {
  getUserProfile,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router
  .route("/register")
  .post(userregisterValidator(), validateRequest, registerUser);

router.route("/login").post(loginValidator(), validateRequest, loginUser);
router.route("/profile").get(verifyJWT, getUserProfile);
router.route("/logout").post(verifyJWT, logoutUser);

export default router;
