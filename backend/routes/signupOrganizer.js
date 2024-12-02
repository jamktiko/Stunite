const express = require('express');
const bcrypt = require('bcryptjs');
const Organizer = require('../models/organizer');

// Luodaan reitit
const router = express.Router();

// POST-reitti uuden järjestäjän luomiseksi
router.post('/', async (req, res) => {
  // Haetaan pyynnöstä kaikki tarvittavat kentät
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

  // Tarkistetaan, että kaikki pakolliset kentät on täytetty
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
    // Salasanan suolaaminen ja hashaminen
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Luodaan uusi Organizer-objekti käyttäen pyyntöä
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

    // Tallennetaan uusi järjestäjä tietokantaan
    await newOrganizer.save();
    res.status(201).json({ message: 'Organizer created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
