
const asyncHandler = require("express-async-handler")
const Contact = require("../models/contactModel")
const getContacts = asyncHandler(async (req, res) => {
    const contacts = await Contact.find({ user_id: req.user.id });
    res.status(200).json(contacts);
})
const createContact = asyncHandler(async (req, res) => {
    const { name, email, phone } = req.body;
    console.log(req.body);
    if (!name || !email || !phone) {
        res.status(404).json({ message: "fields" });
    }
    const contact = await Contact.create({
        user_id: req.user.id,
        name, email, phone
    });
    res.status(201).json(contact);
})
const getContact = asyncHandler(async (req, res) => {
    console.log(req.params.id);
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        res.status(404).json({ message: "Contact not found" });
    }
    res.status(200).json(contact);
})

const updateContact = asyncHandler(async (req, res) => {

    console.log(req.params.id);
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        res.status(404).json({ message: "Contact not found" });
    }
    if (contact.user_id.toString() === req.user.id) {
        const updatedcontact = await Contact.findByIdAndUpdate(req.params.id,
            req.body,
            { new: true }
        );
        res.status(200).json(updatedcontact);
    }
    else {
        res.status(401);
        throw new Error("user is unauthorixed to perform this action");

    }
})

const deleteContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        res.status(404).json({ message: "Contact not found" });
    }
    if (contact.user_id.toString() === req.user.id) {
        const contactdelete = await Contact.findOneAndDelete(req.params.id);
        res.status(200).json({ message: `deleted contact of ${req.params.id}` });
    }
    else {
        res.status(401);
        throw new Error("user is unauthorixed to perform this action");

    }
})

module.exports = { getContact, getContacts, createContact, updateContact, deleteContact };