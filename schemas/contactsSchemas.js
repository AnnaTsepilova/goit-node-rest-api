import Joi from "joi";
import { emailRegexp } from "../constants/user-constants.js";

export const createContactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().pattern(emailRegexp).required(),
  phone: Joi.string().required(),
  favorite: Joi.boolean(),
  owner: Joi.object(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().pattern(emailRegexp),
  phone: Joi.string(),
  favorite: Joi.boolean(),
});

export const updateFavoriteStatusSchema = Joi.object({
  favorite: Joi.boolean().required(),
});
