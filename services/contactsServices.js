import Contact from "../models/Contact.js";

export function listContacts(search = {}) {
  const { filter = {}, fields = "", settings = {} } = search;
  return Contact.find(filter, fields, settings).populate("owner", "_id email");
}

export function getContact(filter) {
  return Contact.findOne(filter);
}

export function addContact(data) {
  return Contact.create(data);
}

export function updateContact(filter, data) {
  return Contact.findOneAndUpdate(filter, data);
}

export function removeContact(filter) {
  return Contact.findOneAndDelete(filter);
}

export const countContacts = (filter) => Contact.countDocuments(filter);
