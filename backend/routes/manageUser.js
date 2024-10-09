const express = require('express');
const User = require('../models/user'); // Malli tiedostosta, johon skeema on tallennettu
const verifyToken = require('../verifytoken');

const router = express.Router();

// GET reitti kaikkien käyttäjien hakemiseen
router.get('/', async (req, res) => {
  try {
    const users = await User.find(); // Hakee kaikki käyttäjät
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET reitti yhden käyttäjän hakemiseen ID:n perusteella
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Hakee käyttäjän ID:n perusteella
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE reitti käyttäjän poistamiseksi ID:n perusteella
router.delete('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    // Poista käyttäjä sen ID:n perusteella
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res
      .status(200)
      .json({ message: 'User deleted successfully', user: deletedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT reitti käyttäjän muokkaamiseksi ID:n perusteella
router.put('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const updates = req.body; // Päivitettävät kentät tulevat pyynnön rungosta

  try {
    // Päivitä käyttäjä sen ID:n perusteella
    const updatedUser = await User.findByIdAndUpdate(id, updates, {
      new: true, // Palauttaa päivitetyn dokumentin
      runValidators: true, // Varmistaa skeeman mukaisuuden
    });

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res
      .status(200)
      .json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
