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
  "/register",
  isEmptyBody,
  validateBody(authSignUpSchema),
  authControllers.signUp
);

authRouter.post(
  "/login",
  isEmptyBody,
  validateBody(authSignInSchema),
  authControllers.signIn
);

authRouter.post("/logout", authenticate, authControllers.signOut);

authRouter.get("/current", authenticate, authControllers.getCurrentUser);

authRouter.patch(
  "/",
  authenticate,
  isEmptyBody,
  validateBody(subscriptionSchema),
  authControllers.updateSubscription
);

export default authRouter;