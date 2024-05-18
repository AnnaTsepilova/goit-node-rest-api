import bcrypt from "bcrypt";

import User from "../models/User.js";

export function saveUser(data) {
  const hashPassword = bcrypt.hash(data.password, 10);
  return User.create({ ...data, password: hashPassword });
}

export function findUser(data) {
  return User.findOne(data);
}

export const updateUser = (filter, data) => {
  return User.findOneAndUpdate(filter, data);
};
