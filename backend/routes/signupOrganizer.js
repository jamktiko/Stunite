const express = require('express');
const bcrypt = require('bcryptjs');
const Organizer = require('../models/organizer');

const router = express.Router();

router.post('/signup/organizer', async (req, res) => {
  const {
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
  } = req.body;

  // Tarkista pakolliset kentät
  if (
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
    });

    await newOrganizer.save();
    res.status(201).json({ message: 'Organizer created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
