import express from "express";

import * as authControllers from "../controllers/authControllers.js";
import isEmptyBody from "../helpers/isEmptyBody.js";
import validateBody from "../helpers/validateBody.js";
import authenticate from "../middlewares/authenticate.js";

import {
  authSignUpSchema,
  authSignInSchema,
  subscriptionSchema,
} from "../schemas/authSchemas.js";

const authRouter = express.Router();

authRouter.post(
  "/users/register",
  isEmptyBody,
  validateBody(authSignUpSchema),
  authControllers.signUp
);

authRouter.post(
  "/users/login",
  isEmptyBody,
  validateBody(authSignInSchema),
  authControllers.signIn
);

authRouter.post("/users/logout", authenticate, authControllers.signOut);

authRouter.get("/users/current", authenticate, authControllers.getCurrentUser);

authRouter.patch(
  "/users",
  authenticate,
  isEmptyBody,
  validateBody(subscriptionSchema),
  authControllers.updateSubscription
);

export default authRouter;
