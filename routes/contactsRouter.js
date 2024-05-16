import express from "express";
import {
  getAllContacts,
  getOneContact,
  createContact,
  updateContact,
  deleteContact,
  updateStatusContact,
} from "../controllers/contactsControllers.js";

import isEmptyBody from "../helpers/isEmptyBody.js";
import validateBody from "../helpers/validateBody.js";
import isValidId from "../helpers/isValidId.js";
import authenticate from "../middlewares/authenticate.js";
import {
  createContactSchema,
  updateContactSchema,
  updateFavoriteStatusSchema,
} from "../schemas/contactsSchemas.js";

const contactsRouter = express.Router();

contactsRouter.use(authenticate);

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", isValidId, getOneContact);

contactsRouter.post(
  "/",
  isEmptyBody,
  validateBody(createContactSchema),
  createContact
);

contactsRouter.put(
  "/:id",
  isValidId,
  isEmptyBody,
  validateBody(updateContactSchema),
  updateContact
);

contactsRouter.patch(
  "/:id/favorite",
  isValidId,
  isEmptyBody,
  validateBody(updateFavoriteStatusSchema),
  updateStatusContact
);

contactsRouter.delete("/:id", isValidId, deleteContact);

export default contactsRouter;
