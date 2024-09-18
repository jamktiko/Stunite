const express = require('express');
const Event = require('../models/event'); // Malli tiedostosta, johon skeema on tallennettu

const router = express.Router();

// DELETE reitti tapahtuman poistamiseksi ID:n perusteella
router.delete('/:id', async (req, res) => {
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

// PUT reitti tapahtuman muokkaamiseksi ID:n perusteella
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body; // Päivitettävät kentät tulevat pyynnön rungosta

  try {
    // Päivitä tapahtuma sen ID:n perusteella
    const updatedEvent = await Event.findByIdAndUpdate(id, updates, {
      new: true, // Palauttaa päivitetyn dokumentin
      runValidators: true, // Varmistaa skeeman mukaisuuden
    });

    if (!updatedEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res
      .status(200)
      .json({ message: 'Event updated successfully', event: updatedEvent });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
