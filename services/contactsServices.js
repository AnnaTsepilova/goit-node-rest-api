import Contact from "../models/Contact.js";

export async function listContacts() {
  return await Contact.find({});
}

export async function getContactById(contactId) {
  return await Contact.findById(contactId);
}

export async function addContact(data) {
  return await Contact.create(data);
}

export async function updateContact(contactId, data) {
  return await Contact.findByIdAndUpdate(contactId, data);
}

export async function removeContact(contactId) {
  return await Contact.findByIdAndDelete(contactId);
}
