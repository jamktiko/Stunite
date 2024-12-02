const express = require('express');
const Event = require('../models/event');
const verifyToken = require('../verifytoken');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');

// Luodaan reitit
const router = express.Router();

// Multerin konfiguraatio tiedostojen tallentamiseen
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Määritetään latauskansion sijainti
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Luodaan uniikki tiedostonimi aikaleimalla ja alkuperäisellä tiedostotunnisteella
  },
});

// Tiedostotyypin tarkistus: sallitaan vain JPEG-, JPG- ja PNG-kuvat
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extname = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = fileTypes.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, JPG, and PNG images are allowed!'));
    }
  },
}).single('image');

// GET-reitti kaikkien tapahtumien hakemiseen
router.get('/', async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET-reitti yhden tapahtuman hakemiseen ID:n perusteella
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }

  try {
    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE-reitti tapahtuman poistamiseksi ID:n perusteella
router.delete('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }

  try {
    const deletedEvent = await Event.findByIdAndDelete(id);

    if (!deletedEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.status(200).json({
      message: 'Event deleted successfully',
      event: deletedEvent,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT-reitti tapahtuman muokkaamiseksi ID:n perusteella
router.put('/:id', verifyToken, upload, async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }

  const updates = req.body;

  // Jos kuva on ladattu, päivitetään `imageUrl`
  let imageUrl;
  if (req.file) {
    imageUrl = `${req.protocol}://${req.get('host')}/uploads/${
      req.file.filename
    }`;
  }

  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      { ...updates, imageUrl },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.status(200).json({
      message: 'Event updated successfully',
      event: updatedEvent,
    });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
