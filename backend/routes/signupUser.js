const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const router = express.Router();

router.post('/', async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    phoneNumber,
    supporterMember,
    supporterPayment,
  } = req.body;

  // Tarkista, että kaikki vaaditut kentät on annettu
  if (!firstName || !lastName || !email || !password || !phoneNumber) {
    return res
      .status(400)
      .json({ error: 'All required fields must be filled' });
  }

  // Tarkista, onko käyttäjä jo olemassa
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    // Salasanan suolaus ja hash
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Luo uusi käyttäjä
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phoneNumber,
      supporterMember: supporterMember || false, // Oletusarvo false
      supporterPayment: supporterMember ? supporterPayment : null, // Vain jos jäsenyys on true
    });

    await newUser.save();

    // Palauta token vastauksessa
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
