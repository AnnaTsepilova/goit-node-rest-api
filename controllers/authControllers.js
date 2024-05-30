import fs from "fs/promises";
import path from "path";
import "dotenv/config";
import { v4 as uuidv4 } from "uuid";

import sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

import * as authServises from "../services/authServices.js";
import HttpError from "../helpers/HttpError.js";
import compareHash from "../helpers/compareHash.js";
import { createToken } from "../helpers/jwt.js";
import imgResize from "../helpers/imgResize.js";

const { BASE_URL, BASE_EMAIL, PORT } = process.env;

const avatarPath = path.resolve("public", "avatars");

export const signUp = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await authServises.findUser({ email });

    if (user) {
      throw HttpError(409, `Email ${email} in use`);
    }
    const verificationToken = uuidv4();
    const newUser = await authServises.saveUser({
      ...req.body,
      verificationToken,
    });

    const msg = {
      to: email,
      from: BASE_EMAIL,
      subject: "Verification email",
      text: "Thank you for registration. Verificate your email",
      html: `<a href="${BASE_URL}:${PORT}/api/users/verify/${verificationToken}" target="_blank">Click to confirm registration</a>`,
    };

    await sgMail
      .send(msg)
      .then(() => {
        console.log("Email sent");
      })
      .catch((error) => {
        console.error(error);
      });

    res.status(201).json({
      user: { email: newUser.email, subscription: newUser.subscription },
    });
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

export const getCurrentUser = async (req, res, next) => {
  try {
    const { email, subscription } = req.user;

    res.json({ email, subscription });
  } catch (error) {
    next(error);
  }
};

export const signOut = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const user = await authServises.findUser(_id);

    if (!user) {
      throw HttpError(401, "Not authorized");
    }

    await authServises.updateUser({ _id }, { token: null });

    res.status(204).json();
  } catch (error) {
    next(error);
  }
};

export const updateSubscription = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { subscription } = req.body;

    const result = await authServises.updateUser(
      { _id },
      {
        subscription: subscription,
      }
    );

    if (!result) {
      throw HttpError(400, "Missing field subscription");
    }

    return res.status(200).json({ email: result.email, subscription });
  } catch (error) {
    next(error);
  }
};

export const updateAvatar = async (req, res, next) => {
  try {
    const { _id } = req.user;

    if (!req.file) {
      throw HttpError(400, "Please upload a file");
    }

    const { path: oldPath, filename } = req.file;

    const newPath = path.join(avatarPath, filename);
    await fs.rename(oldPath, newPath);
    await imgResize(newPath);
    const avatarURL = path.join("avatars", filename);

    const result = await authServises.updateUser(
      { _id },
      { avatarURL: avatarURL }
    );
    if (!result) {
      throw HttpError(401, "Not authorized");
    }
    return res.status(200).json({ avatarURL: avatarURL });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;
    console.log("verificationToken :>> ", verificationToken);

    const user = await authServises.findUserByVerificationToken(
      verificationToken
    );

    if (!user) {
      throw HttpError(404, "User not found");
    }

    if (user.verify) {
      return res.status(200).json({ message: "User has already verified" });
    }

    const { _id } = user;

    await authServises.verifyUser(
      { _id }
      // {
      //   verificationToken: null,
      //   verify: true,
      // }
    );

    res.status(200).json({ message: "Verification successful" });
  } catch (error) {
    console.log("error verify :>> ", error);
    next(error.message);
  }
};

// export const resendVerifyEmail = async (req, res, next) => {
//   try {
//     const { email } = req.body;
//     if (!email) {
//       return res.status(400).json({ message: "Missing required field email" });
//     }

//     const user = await getUserByEmail(email);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     if (user.verify) {
//       return res
//         .status(400)
//         .json({ message: "Verification has already been passed" });
//     }

//     const msg = {
//       to: email,
//       from: BASE_EMAIL,
//       subject: "Verification email",
//       text: "Thank you for registration. Verificate your email",
//       html: `<a href="${BASE_URL}/api/users/verify/${user.verificationToken}" target="_blank">Click to confirm registration</a>`,
//     };
//     await sgMail.send(msg);

//     return res.status(200).json({ message: "Verification email sent" });
//   } catch (error) {
//     next(error.message);
//   }
// };
