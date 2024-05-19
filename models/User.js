import { Schema, model } from "mongoose";

import { handleSaveErrors, setUpdateSettings } from "./hooks.js";
import { emailRegexp } from "../constants/user-constants.js";

const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      match: emailRegexp,
      required: [true, "Email is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    token: {
      type: String,
      default: null,
    },
  },
  { versionKey: false, timestamps: true }
);

userSchema.post("save", handleSaveErrors);
userSchema.pre("findOneAndUpdate", setUpdateSettings);
userSchema.post("findOneAndUpdate", handleSaveErrors);

const User = model("user", userSchema);

export default User;
