import Joi from "joi";

import { emailRegexp, passwordRegexp } from "../constants/user-constants.js";

export const authSignUpSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).pattern(passwordRegexp).required(),
});

export const authSignInSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

export const subscription = Joi.object({
  subscription: Joi.string().valid("starter", "pro", "business"),
});
