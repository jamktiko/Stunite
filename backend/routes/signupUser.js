const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

// Luodaan reitit
const router = express.Router();

// POST-reitti uuden käyttäjän rekisteröimiseen
router.post('/', async (req, res) => {
  // Haetaan pyynnöstä kaikki tarvittavat kentät
  const {
    firstName,
    lastName,
    email,
    password,
    phoneNumber,
    supporterMember,
    supporterPayment,
  } = req.body;

  // Tarkistetaan, että kaikki pakolliset kentät on täytetty
  if (!firstName || !lastName || !email || !password || !phoneNumber) {
    return res
      .status(400)
      .json({ error: 'All required fields must be filled' });
  }

  try {
    // Tarkistetaan, onko käyttäjä jo olemassa tietokannassa
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    // Salasanan suolaaminen ja hashaminen
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Luodaan uusi User-objekti käyttäen pyyntöä
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phoneNumber,
      supporterMember: supporterMember || false,
      supporterPayment: supporterMember ? supporterPayment : null,
    });

    // Tallennetaan uusi käyttäjä tietokantaan
    await newUser.save();

    return res.status(201).json({
      message: 'User registered successfully',
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'User registration failed: ' + error.message });
  }
});

module.exports = router;
