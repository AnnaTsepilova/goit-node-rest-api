import Contact from "../models/Contact.js";

export function listContacts() {
  return Contact.find({});
}

export function getContactById(contactId) {
  return Contact.findById(contactId);
}

export function addContact(data) {
  return Contact.create(data);
}

export function updateContact(contactId, data) {
  return Contact.findByIdAndUpdate(contactId, data);
}

export function removeContact(contactId) {
  return Contact.findByIdAndDelete(contactId);
}
