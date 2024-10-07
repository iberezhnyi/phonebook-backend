import express from "express";
import validateBody from "../helpers/validateBody.js";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateStatusContact,
} from "../controllers/contactsControllers.js";
import {
  createContactSchema,
  updateContactSchema,
  updateFavoriteSchema,
} from "../schemas/contactsSchemas.js";
import { isValidId } from "../helpers/isValidId.js";
import { authenticate } from "../middlewares/authenticate.js";

const createValidation = validateBody(createContactSchema);
const updateValidation = validateBody(updateContactSchema);
const updateFavoriteValidation = validateBody(updateFavoriteSchema);

const contactsRouter = express.Router();

contactsRouter.get("/", authenticate, getAllContacts);

contactsRouter.get("/:id", authenticate, isValidId, getOneContact);

contactsRouter.post("/", authenticate, createValidation, createContact);

contactsRouter.put(
  "/:id",
  authenticate,
  isValidId,
  updateValidation,
  updateContact
);

contactsRouter.patch(
  "/:id/favorite",
  authenticate,
  isValidId,
  updateFavoriteValidation,
  updateStatusContact
);

contactsRouter.delete("/:id", authenticate, deleteContact);

export default contactsRouter;
