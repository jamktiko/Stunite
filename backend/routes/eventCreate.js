const express = require('express');
const multer = require('multer');
const path = require('path');
const Event = require('../models/event');
const verifyToken = require('../verifyToken');

const router = express.Router();

// Asetetaan multer tallentamaan kuvat `uploads`-kansioon
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Luodaan uniikki tiedostonimi
  },
});

const upload = multer({ storage }).single('image');

// Tapahtuman luontireitti
router.post('/', verifyToken, upload, async (req, res) => {
  const {
    eventName,
    date,
    startingTime,
    endingTime,
    endingDate,
    address,
    venue,
    city,
    ticketprice,
    theme,
    isFavorite,
    details,
    ticketLink,
    ticketSaleStart,
    ticketSaleEnd,
    publishDateTime,
    status,
    organizerId,
    organizationName,
    eventTags,
  } = req.body;

  if (
    !eventName ||
    !date ||
    !startingTime ||
    !endingTime ||
    !address ||
    !status ||
    !organizerId ||
    !organizationName
  ) {
    return res.status(400).json({ error: 'Pakolliset kentät puuttuvat' });
  }

  const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

  try {
    const newEvent = new Event({
      eventName,
      date,
      startingTime,
      endingTime,
      endingDate,
      address,
      venue,
      city,
      ticketprice,
      theme,
      isFavorite: isFavorite || false,
      details,
      imageUrl,
      ticketLink,
      ticketSaleStart,
      ticketSaleEnd,
      publishDateTime,
      status,
      organizerId,
      organizationName,
      eventTags,
    });

    await newEvent.save();
    res
      .status(201)
      .json({ message: 'Tapahtuma luotu onnistuneesti', event: newEvent });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
