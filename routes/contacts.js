const express = require("express");

const { check, validationResult } = require("express-validator");
const User = require("../models/User");
const Contact = require("../models/Contact");

const auth = require("../middleware/auth");

const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    const contacts = await Contact.find({ user: req.user.id }).sort({
      date: -1
    });
    res.json(contacts);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: "Server Error" });
  }
});

router.post(
  "/",
  [
    auth,
    check("name", "name is required")
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }

    const { name, email, phone, type } = req.body;
    try {
      const newContact = new Contact({
        name,
        email,
        phone,
        type,
        user: req.user.id
      });

      const contact = await newContact.save();
      res.json(contact);
    } catch (error) {
      console.error(err.message);
      return res.status(500).json({ msg: "Server Error" });
    }
  }
);

router.put("/:id", auth, async (req, res) => {
  const { name, email, phone, type } = req.body;

  const contactsFields = {};

  if (name) contactsFields.name = name;
  if (email) contactsFields.email = email;
  if (phone) contactsFields.phone = phone;
  if (type) contactsFields.type = type;

  try {
    let contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ msg: "No such contact available" });
    }

    // Make sure User owns the Contact
    if (contact.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { $set: contactsFields },
      { new: true }
    );

    res.json(contact);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: "Server Error" });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    let contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ msg: "No such contact available" });
    }

    // Make sure User owns the Contact
    if (contact.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    await Contact.findByIdAndRemove(req.params.id);
    res.json({ msg: "Contact removed" });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: "Server Error" });
  }
});

module.exports = router;
