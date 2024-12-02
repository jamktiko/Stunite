const express = require('express');
const bcrypt = require('bcryptjs');
const Organizer = require('../models/organizer');
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
    // Etsitään järjestäjä sähköpostin perusteella
    const organizer = await Organizer.findOne({ email });

    if (!organizer) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Tarkistetaan, että annettu salasana vastaa tietokannassa olevaa hashattua salasanaa
    const passwordMatch = await bcrypt.compare(password, organizer.password);

    // Jos salasanat eivät täsmää, palautetaan virhe
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
      organizer: {
        id: organizer._id,
        organizerId: organizer.organizerId,
        firstName: organizer.firstName,
        lastName: organizer.lastName,
        email: organizer.email,
        phoneNumber: organizer.phoneNumber,
        organizationName: organizer.organizationName,
        customerServiceEmail: organizer.customerServiceEmail,
        organizationPhoneNumber: organizer.organizationPhoneNumber,
        website: organizer.website,
        description: organizer.description,
        address: organizer.address,
        postalCode: organizer.postalCode,
        city: organizer.city,
        officialName: organizer.officialName,
        organizationType: organizer.organizationType,
        businessId: organizer.businessId,
        billingAddress: organizer.billingAddress,
        paymentAddress: organizer.paymentAddress,
        fieldsOfStudy: organizer.fieldsOfStudy,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
