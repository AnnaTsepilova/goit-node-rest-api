import User from "../models/User.js";

export async function saveUser(data) {
  return await User.create(data);
}

export async function findUser(data) {
  return await User.findOne(data);
}
