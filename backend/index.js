require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors());

// Ota yhteys MongoDB Atlas -tietokantaan
const url = process.env.MONGODB_URI; // MongoDB URI ympäristömuuttujasta

mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB:', error.message);
  });

// Määrittele Mongoose-malli kokoelmalle 'test'
const testSchema = new mongoose.Schema(
  {
    testi: String,
  },
  { collection: 'test' }
);

const Test = mongoose.model('Test', testSchema);

// GET reitti kaikkien testikokoelman tietojen hakemiseen
app.get('/api/test', async (req, res) => {
  try {
    const result = await Test.find({});
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
