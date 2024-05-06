import Contact from "../models/Contact.js";

export async function listContacts() {
  Contact.find();
}

// export const listContacts = () => Contact.find();

export async function getContactById(contactId) {}

export async function addContact(data) {}

export async function updateContact(contactId, data) {}

export async function removeContact(contactId) {}
