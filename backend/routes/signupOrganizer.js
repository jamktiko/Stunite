const express = require('express');
const bcrypt = require('bcryptjs');
const Organizer = require('../models/organizer');

const router = express.Router();

router.post('/', async (req, res) => {
  const {
    organizerId,
    firstName,
    lastName,
    email,
    phoneNumber,
    organizationName,
    customerServiceEmail,
    organizationPhoneNumber,
    website,
    description,
    address,
    postalCode,
    city,
    officialName,
    organizationType,
    businessId,
    billingAddress,
    paymentAddress,
    password,
    fieldsOfStudy,
  } = req.body;

  // Tarkista pakolliset kentät
  if (
    !organizerId ||
    !firstName ||
    !lastName ||
    !email ||
    !phoneNumber ||
    !organizationName ||
    !customerServiceEmail ||
    !address ||
    !postalCode ||
    !city ||
    !officialName ||
    !organizationType ||
    !businessId ||
    !billingAddress ||
    !paymentAddress ||
    !password
  ) {
    return res
      .status(400)
      .json({ error: 'All required fields must be filled' });
  }

  try {
    // Salasanan suolaus ja hash
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Luo uusi järjestäjä
    const newOrganizer = new Organizer({
      organizerId,
      firstName,
      lastName,
      email,
      phoneNumber,
      organizationName,
      customerServiceEmail,
      organizationPhoneNumber,
      website,
      description,
      address,
      postalCode,
      city,
      officialName,
      organizationType,
      businessId,
      billingAddress,
      paymentAddress,
      password: hashedPassword,
      fieldsOfStudy,
    });

    await newOrganizer.save();
    res.status(201).json({ message: 'Organizer created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
