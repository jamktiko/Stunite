const express = require('express');
const Event = require('../models/event');
const verifyToken = require('../verifytoken');

const router = express.Router();

router.post('/', verifyToken, async (req, res) => {
  const {
    eventName,
    date,
    startingTime,
    address,
    venue,
    city,
    ticketprice,
    theme,
    isFavorite,
    details,
    imageUrl,
    ticketLink,
    ticketSaleStart,
    ticketSaleEnd,
    publishDateTime,
    status,
    organizerId,
    organizationName,
  } = req.body;

  // Tarkista pakolliset kentät
  if (
    !eventName ||
    !date ||
    !startingTime ||
    !address ||
    !venue ||
    !city ||
    !ticketprice ||
    !status ||
    !organizerId ||
    !organizationName
  ) {
    return res
      .status(400)
      .json({ error: 'All required fields must be filled' });
  }

  try {
    // Luo uusi tapahtuma
    const newEvent = new Event({
      eventName,
      date,
      startingTime,
      address,
      venue,
      city,
      ticketprice,
      theme,
      isFavorite: isFavorite || false, // Oletusarvo false
      details,
      imageUrl,
      ticketLink,
      ticketSaleStart,
      ticketSaleEnd,
      publishDateTime,
      status,
      organizerId,
      organizationName,
    });

    await newEvent.save();
    res.status(201).json({ message: 'Event created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
