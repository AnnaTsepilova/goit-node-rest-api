import { Schema, model } from "mongoose";
import { handleSaveErrors, setUpdateSettings } from "./hooks.js";

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false, timestamps: true }
);

contactSchema.post("save", handleSaveErrors);
contactSchema.pre("findOneAndUpdate", setUpdateSettings);
contactSchema.post("findOneAndUpdate", handleSaveErrors);

const Contact = model("contact", contactSchema);

export default Contact;
