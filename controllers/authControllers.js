import * as authServises from "../services/authServices.js";
import HttpError from "../helpers/HttpError.js";
import compareHash from "../helpers/compareHash.js";
import { createToken } from "../helpers/jwt.js";

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

export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await authServises.findUser({ email });

    if (!user) {
      throw HttpError(401, "Email or password is wrong");
    }

    const comparePassword = await compareHash(password, user.password);

    if (!comparePassword) {
      throw HttpError(401, "Email or password is wrong");
    }

    const { _id: id } = user;
    const payload = { id };

    const token = createToken(payload);
    await authServises.updateUser({ _id: id }, { token });

    res.status(200).json({
      token: token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};
