import express from "express";

import * as authControllers from "../controllers/authControllers.js";
import isEmptyBody from "../helpers/isEmptyBody.js";
import validateBody from "../helpers/validateBody.js";
import isValidId from "../helpers/isValidId.js";

import { authSignUpSchema, authSignInSchema } from "../schemas/authSchemas.js";

const authRouter = express.Router();

authRouter.post(
  "/users/register",
  isEmptyBody,
  validateBody(authSignUpSchema),
  authControllers.signUp
);

export default authRouter;
