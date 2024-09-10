require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const signupRouter = require('./routes/signup');
const loginRouter = require('./routes/login');

const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors());

// Ota yhteys MongoDB Atlas -tietokantaan
const url = process.env.MONGODB_URI; // MongoDB URI ympäristömuuttujasta

mongoose
  .connect(url, {
    dbName: 'Stunite',
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB:', error.message);
  });

// Rekisteröinti- ja kirjautumisreitit
app.use('/api/signup', signupRouter);
app.use('/api/login', loginRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
