require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');

const signupUserRouter = require('./routes/signupUser');
const loginUserRouter = require('./routes/loginUser');
const signupOrganizerRouter = require('./routes/signupOrganizer');
const loginOrganizerRouter = require('./routes/loginOrganizer');
const createEventRouter = require('./routes/eventCreate');
const getEventsRouter = require('./routes/getEvents');
const manageEventRouter = require('./routes/manageEvent');
const manageUserRouter = require('./routes/manageUser');

const app = express();

app.use(express.json());

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
app.use('/signup/user', signupUserRouter);
app.use('/login/user', loginUserRouter);
app.use('/signup/organizer', signupOrganizerRouter);
app.use('/login/organizer', loginOrganizerRouter);

// Käyttäjien muokkaamisreitit
app.use('/manage/user', manageUserRouter);

// Tapahtumareitit
app.use('/create/event', createEventRouter); // POST route for creating events
app.use('/events', getEventsRouter); // GET route for fetching events
app.use('/manage/event', manageEventRouter); // DELETE route for deleting events or PUT route for edits

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
