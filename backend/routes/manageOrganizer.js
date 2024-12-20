const express = require('express');
const Organizer = require('../models/organizer');
const verifyToken = require('../verifytoken');

// Luodaan reitit
const router = express.Router();

// GET-reitti kaikkien järjestäjien hakemiseen
router.get('/', async (req, res) => {
  try {
    const organizers = await Organizer.find();
    res.status(200).json(organizers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET-reitti yhden järjestäjän hakemiseen ID:n perusteella
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const organizer = await Organizer.findById(id);

    if (!organizer) {
      return res.status(404).json({ error: 'Organizer not found' });
    }

    res.status(200).json(organizer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE-reitti järjestäjän poistamiseksi ID:n perusteella
router.delete('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    const deletedOrganizer = await Organizer.findByIdAndDelete(id);

    if (!deletedOrganizer) {
      return res.status(404).json({ error: 'Organizer not found' });
    }

    res.status(200).json({
      message: 'Organizer deleted successfully',
      organizer: deletedOrganizer,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT-reitti järjestäjän muokkaamiseksi ID:n perusteella
router.put('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const updatedOrganizer = await Organizer.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedOrganizer) {
      return res.status(404).json({ error: 'Organizer not found' });
    }

    res.status(200).json({
      message: 'Organizer updated successfully',
      organizer: updatedOrganizer,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
