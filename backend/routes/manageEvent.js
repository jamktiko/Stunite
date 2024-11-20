const express = require('express');
const Event = require('../models/event');
const verifyToken = require('../verifytoken');

const multer = require('multer');
const path = require('path');

const router = express.Router();

// GET route to fetch all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET reitti yhden tapahtuman hakemiseen ID:n perusteella
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Hakee tapahtuman ID:n perusteella
    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE reitti tapahtuman poistamiseksi ID:n perusteella
router.delete('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    // Poista tapahtuma sen ID:n perusteella
    const deletedEvent = await Event.findByIdAndDelete(id);

    if (!deletedEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res
      .status(200)
      .json({ message: 'Event deleted successfully', event: deletedEvent });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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

// PUT reitti tapahtuman muokkaamiseksi ID:n perusteella
router.put('/:id', verifyToken, upload, async (req, res) => {
  const { id } = req.params;
  const updates = req.body; // Päivitettävät kentät tulevat pyynnön rungosta

  // Jos kuva on ladattu, päivitetään `imageUrl`
  let imageUrl;
  if (req.file) {
    imageUrl = `${req.protocol}://${req.get('host')}/uploads/${
      req.file.filename
    }`;
  }

  try {
    // Etsi ja päivitä tapahtuma ID:n perusteella
    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      { ...updates, imageUrl },
      {
        new: true, // Palauttaa päivitetyn dokumentin
        runValidators: true, // Varmistaa, että kenttien arvot ovat validit
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
