import express from "express";
import * as contactsControllers from "../controllers/contactsControllers.js";

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

contactsRouter.get("/", contactsControllers.getAllContacts);

contactsRouter.get("/:id", isValidId, contactsControllers.getOneContact);

contactsRouter.post(
  "/",
  isEmptyBody,
  validateBody(createContactSchema),
  contactsControllers.createContact
);

contactsRouter.put(
  "/:id",
  isValidId,
  isEmptyBody,
  validateBody(updateContactSchema),
  contactsControllers.updateContact
);

contactsRouter.patch(
  "/:id/favorite",
  isValidId,
  isEmptyBody,
  validateBody(updateFavoriteStatusSchema),
  contactsControllers.updateStatusContact
);

contactsRouter.delete("/:id", isValidId, contactsControllers.deleteContact);

export default contactsRouter;
