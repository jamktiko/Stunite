const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const createToken = require('../createtoken');

// Luodaan reitit
const router = express.Router();

// Kirjautumisreitti
router.post('/', async (req, res) => {
  // Puretaan sähköposti ja salasana pyynnön rungosta
  const { email, password } = req.body;

  // Tarkistetaan, että sähköposti ja salasana on annettu
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // Etsitään käyttäjä sähköpostin perusteella
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Tarkistetaan, että annettu salasana vastaa tietokannassa olevaa hashattua salasanaa
    const passwordMatch = await bcrypt
      .compare(password, user.password)
      .catch((err) => {
        console.error('Error comparing passwords:', err);
        return false;
      });

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Luo JWT-token kirjautumisen jälkeen
    const token = createToken({
      username: email,
    });

    // Palautetaan onnistunut kirjautuminen ja käyttäjän tiedot
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
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
