require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const verifyToken = require('./verifyToken');

const signupUserRouter = require('./routes/signupUser');
const loginUserRouter = require('./routes/loginUser');
const signupOrganizerRouter = require('./routes/signupOrganizer');
const loginOrganizerRouter = require('./routes/loginOrganizer');
const createEventRouter = require('./routes/eventCreate');
const manageEventRouter = require('./routes/manageEvent');
const manageUserRouter = require('./routes/manageUser');
const manageOrganizerRouter = require('./routes/manageOrganizer');

const app = express();

app.use(cookieParser());

app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:4200', // Allow requests from your frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify the allowed HTTP methods
  })
);
app.use(express.static('dist'));
app.use(
  session({
    secret: 'salausarvo', // Salausavain, jota käytetään session id:n salaamiseen.
    cookie: {
      maxAge: 600000, // Keksi vanhenee 10 minuutin (600 000 millisekuntia) jälkeen.
    },
    resave: true, // Tallentaa session, vaikka sitä ei olisi muokattu pyynnön aikana.
    saveUninitialized: true, // Tallentaa session, vaikka sitä ei ole alustettu (eli session-objekti luodaan jokaiselle käyttäjälle).
  })
);

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
app.use('/login/user', verifyToken, loginUserRouter);
app.use('/signup/organizer', signupOrganizerRouter);
app.use('/login/organizer', verifyToken, loginOrganizerRouter);

// Käyttäjien muokkaamisreitit
app.use('/manage/user', manageUserRouter);
app.use('/manage/organizer', manageOrganizerRouter);

// Tapahtumareitit
app.use('/create/event', createEventRouter); // POST route for creating events
app.use('/manage/event', manageEventRouter); // GET for getting all events or DELETE route for deleting events or PUT route for edits

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
