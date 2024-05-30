import bcrypt from "bcrypt";
import gravatar from "gravatar";

import User from "../models/User.js";

export async function saveUser(data) {
  const hashPassword = await bcrypt.hash(data.password, 10);
  const avatarURL = gravatar.url(data.email);
  return User.create({
    ...data,
    password: hashPassword,
    avatarURL: avatarURL,
  });
}

export async function findUser(data) {
  return await User.findOne(data);
}

export async function updateUser(filter, data) {
  return await User.findOneAndUpdate(filter, data);
}

export async function deleteAllUsers() {
  await User.deleteMany();
}

export async function findUserByVerificationToken(verificationToken) {
  return await User.findOne({ verificationToken: verificationToken });
}

export const verifyUser = async (userId) => {
  console.log("userId :>> ", userId);
  return await User.findByIdAndUpdate(userId, {
    verificationToken: null,
    verify: true,
  });
};
// export async function verifyUser(userId) {
//   return await User.findByIdAndUpdate(userId, {
//     $set: { verify: true, verificationToken: null },
//     runValidators: true,
//   });
// }
