import express from "express";
import validateBody from "../helpers/validateBody.js";
import { updateSubscriptionSchema } from "../schemas/usersSchemas.js";
import { authenticate } from "../middlewares/authenticate.js";
import {
  updateAvatarUser,
  updateSubscriptionUser,
} from "../controllers/usersControllers.js";
import { upload } from "../middlewares/upload.js";

const validateSubscription = validateBody(updateSubscriptionSchema);

const usersRouter = express.Router();

usersRouter.patch(
  "/",
  authenticate,
  validateSubscription,
  updateSubscriptionUser
);

usersRouter.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  updateAvatarUser
);

export default usersRouter;
