const express = require('express');
const Event = require('../models/event');

const router = express.Router();

router.post('/', async (req, res) => {
  const {
    eventName,
    eventDateTime,
    address,
    city,
    price,
    themeOrDressCode,
    addToFavorites,
    description,
    ticketSaleLink,
    ticketSalePeriod,
    isPreliminaryOrInProduction,
    ticketTypes,
    checklist,
  } = req.body;

  // Tarkista pakolliset kentät
  if (
    !eventName ||
    !eventDateTime ||
    !address ||
    !city ||
    !price ||
    !isPreliminaryOrInProduction
  ) {
    return res
      .status(400)
      .json({ error: 'All required fields must be filled' });
  }

  try {
    // Luo uusi tapahtuma
    const newEvent = new Event({
      eventName,
      eventDateTime,
      address,
      city,
      price,
      themeOrDressCode,
      addToFavorites: addToFavorites || false, // Oletusarvo false
      description,
      ticketSaleLink,
      ticketSalePeriod,
      isPreliminaryOrInProduction,
      ticketTypes,
      checklist,
    });

    await newEvent.save();
    res.status(201).json({ message: 'Event created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
