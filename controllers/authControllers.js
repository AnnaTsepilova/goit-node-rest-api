import * as authServises from "../services/authServices.js";
import HttpError from "../helpers/HttpError.js";

export const signUp = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await authServises.findUser({ email });

    if (user) {
      throw HttpError(409, `Email ${email} in use`);
    }

    const newUser = await authServises.saveUser(req.body);

    res
      .status(201)
      .json({ email: newUser.email, subscription: newUser.subscription });
  } catch (error) {
    next(error);
  }
};
