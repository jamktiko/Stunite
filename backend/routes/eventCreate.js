const express = require('express');
const multer = require('multer');
const path = require('path');
const Event = require('../models/event');
const verifyToken = require('../verifytoken');

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
  console.log('Received event data:', req.body); // Tämä kertoo, mitä dataa palvelin saa
  console.log('Received file:', req.file); // Tämä tarkistaa, että kuva on saapunut

  // Tarkistetaan, että kaikki pakolliset kentät ovat mukana
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

  // Tulostetaan jokainen kenttä erikseen
  console.log('eventName:', eventName);
  console.log('date:', date);
  console.log('startingTime:', startingTime);
  console.log('endingTime:', endingTime);
  console.log('endingDate:', endingDate);
  console.log('address:', address);
  console.log('venue:', venue);
  console.log('city:', city);
  console.log('ticketprice:', ticketprice);
  console.log('theme:', theme);
  console.log('isFavorite:', isFavorite);
  console.log('details:', details);
  console.log('ticketLink:', ticketLink);
  console.log('ticketSaleStart:', ticketSaleStart);
  console.log('ticketSaleEnd:', ticketSaleEnd);
  console.log('publishDateTime:', publishDateTime);
  console.log('status:', status);
  console.log('organizerId:', organizerId);
  console.log('organizationName:', organizationName);
  console.log('eventTags:', eventTags);

  // Tarkistetaan, että pakolliset kentät ovat mukana
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
    console.error('Pakolliset kentät puuttuvat');
    return res.status(400).json({ error: 'Pakolliset kentät puuttuvat' });
  }

  // Käytetään kuvaa, jos se on mukana
  const imageUrl = req.file
    ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
    : '';
  console.log('Image URL:', imageUrl);

  try {
    // Luodaan uusi tapahtuma
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

    // Tallennetaan tapahtuma tietokantaan
    await newEvent.save();
    res
      .status(201)
      .json({ message: 'Tapahtuma luotu onnistuneesti', event: newEvent });
  } catch (error) {
    console.error('Virhe tallentaessa tapahtumaa:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
