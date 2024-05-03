import express from "express";
import {
  getAllContacts,
  getOneContact,
  createContact,
  updateContact,
  deleteContact,
} from "../controllers/contactsControllers.js";

import isEmptyBody from "../helpers/isEmptyBody.js";

const contactsRouter = express.Router();

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", getOneContact);

contactsRouter.post("/", isEmptyBody, createContact);

contactsRouter.put("/:id", isEmptyBody, updateContact);

contactsRouter.delete("/:id", deleteContact);

export default contactsRouter;
