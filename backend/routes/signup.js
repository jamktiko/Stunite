const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const router = express.Router();

router.post('/', async (req, res) => {
  const { name, email, role, major, password } = req.body;

  if (!name || !email || !role || !password) {
    return res
      .status(400)
      .json({ error: 'Name, email, role, and password are required' });
  }

  try {
    // Salasanan suolaus ja hash
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Luo uusi käyttäjä
    const newUser = new User({
      name,
      email,
      role,
      major,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
