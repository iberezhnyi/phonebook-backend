import express from "express";
import validateBody from "../helpers/validateBody.js";
import { loginSchema, registerSchema } from "../schemas/usersSchemas.js";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/authControllers.js";
import { authenticate } from "../middlewares/authenticate.js";

const authRouter = express.Router();
const validateRegister = validateBody(registerSchema);
const validateLogin = validateBody(loginSchema);

authRouter.post("/register", validateRegister, registerUser);

authRouter.post("/login", validateLogin, loginUser);

authRouter.get("/current", authenticate, getCurrentUser);

authRouter.post("/logout", authenticate, logoutUser);

export default authRouter;
