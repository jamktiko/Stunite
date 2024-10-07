const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const createToken = require('../createtoken'); // Lisää createToken

const router = express.Router();

router.post('/', async (req, res) => {
  const { email, password } = req.body;

  // Tarkista, että sähköposti ja salasana on annettu
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // Etsi käyttäjä sähköpostin perusteella
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Tarkista, vastaako annettu salasana hashattua salasanaa
    const passwordMatch = await bcrypt
      .compare(password, user.password)
      .catch((err) => {
        console.error('Error comparing passwords:', err);
        return false;
      });

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Luo token kirjautumisen jälkeen
    const token = createToken({
      username: email, // Voit käyttää esim. emailia tai muuta yksilöivää kenttää
    });

    // Kirjautuminen onnistui
    res.status(200).json({
      message: 'Login successful',
      token, // Palauta token vastauksessa
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        supporterMember: user.supporterMember,
        supporterPayment: user.supporterPayment,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
