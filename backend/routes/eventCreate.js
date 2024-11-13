const express = require('express');
const Event = require('../models/event');
const verifyToken = require('../verifytoken');

const router = express.Router();

// Set up multer for file upload specific to event creation (if needed)
// const multer = require('multer');
// const path = require('path');

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/'); // Store images in the 'uploads' folder
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
//   },
// });

// const upload = multer({ storage }).single('image');

// Event creation route
router.post('/', verifyToken, async (req, res) => {
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
    imageUrl,
    ticketLink,
    ticketSaleStart,
    ticketSaleEnd,
    publishDateTime,
    status,
    organizerId,
    organizationName,
    eventTags,
  } = req.body;

  // Ensure all required fields are present
  if (
    !eventName ||
    !date ||
    !startingTime ||
    !endingTime ||
    !endingDate ||
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

  // if (!req.file) {
  //   return res.status(400).json({ error: 'Image is required' });
  // }

  try {
    // Create a new event
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
      imageUrl, ///uploads/${req.file.filename}
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
    res.status(201).json({ message: 'Event created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
