import bcrypt from "bcrypt";

import User from "../models/User.js";

export async function saveUser(data) {
  const hashPassword = await bcrypt.hash(data.password, 10);
  return User.create({ ...data, password: hashPassword });
}

export async function findUser(data) {
  return await User.findOne(data);
}

export async function updateUser(filter, data) {
  return await User.findOneAndUpdate(filter, data);
}
