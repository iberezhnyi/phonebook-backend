import express from "express";
import validateBody from "../helpers/validateBody.js";
import {
  loginSchema,
  registerSchema,
  verificationEmailSchema,
} from "../schemas/usersSchemas.js";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
  resendingEmail,
  verifyUser,
} from "../controllers/authControllers.js";
import { authenticate } from "../middlewares/authenticate.js";

const authRouter = express.Router();
const validateRegister = validateBody(registerSchema);
const validateLogin = validateBody(loginSchema);
const validateVerificationEmail = validateBody(verificationEmailSchema);

authRouter.post("/register", validateRegister, registerUser);

authRouter.get("/verify/:verificationToken", verifyUser);

authRouter.post("/verify", validateVerificationEmail, resendingEmail);

authRouter.post("/login", validateLogin, loginUser);

authRouter.get("/current", authenticate, getCurrentUser);

authRouter.post("/logout", authenticate, logoutUser);

export default authRouter;
