const express = require('express');
const bcrypt = require('bcryptjs');
const Organizer = require('../models/organizer');

const router = express.Router();

router.post('/login/organizer', async (req, res) => {
  const { email, password } = req.body;

  // Tarkista, että sähköposti ja salasana on annettu
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // Etsi järjestäjä sähköpostin perusteella
    const organizer = await Organizer.findOne({ email });

    if (!organizer) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Tarkista, vastaako annettu salasana hashattua salasanaa
    const passwordMatch = await bcrypt.compare(password, organizer.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Kirjautuminen onnistui
    res.status(200).json({
      message: 'Login successful',
      organizer: {
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
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
