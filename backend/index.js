require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');

// const multer = require('multer');
// const path = require('path');

const signupUserRouter = require('./routes/signupUser');
const loginUserRouter = require('./routes/loginUser');
const signupOrganizerRouter = require('./routes/signupOrganizer');
const loginOrganizerRouter = require('./routes/loginOrganizer');
const createEventRouter = require('./routes/eventCreate');
const manageEventRouter = require('./routes/manageEvent');
const manageUserRouter = require('./routes/manageUser');
const manageOrganizerRouter = require('./routes/manageOrganizer');

// const upload = multer({
//   dest: 'uploads/', // Store files directly in the uploads folder
//   limits: { fileSize: 5 * 1024 * 1024 }, // Max file size: 5MB
// }).single('image');

const app = express();

// app.post('/upload-image', (req, res) => {
//   upload(req, res, (err) => {
//     if (err) {
//       return res
//         .status(400)
//         .json({ message: 'Image upload failed', error: err });
//     }

//     // HUOM localhostissa
//     const imageUrl = `http://localhost:3001/uploads/${req.file.filename}`;

//     // Send the image URL back to the client
//     res.json({ imageUrl });
//   });
// });

app.use(cookieParser());

app.use(express.json());
app.use(express.static(__dirname + '/dist/angular-pwa/browser'));

app.use(
  cors({
    origin: [
      'http://localhost:4200',
      'https://stunite.eu-north-1.elasticbeanstalk.com/',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);
app.use(express.static('dist'));
// app.use('/uploads', express.static('uploads'));

app.use(
  session({
    secret: 'salausarvo', // Salausavain, jota käytetään session id:n salaamiseen.
    cookie: {
      maxAge: 600000, // Keksi vanhenee 10 minuutin (600 000 millisekuntia) jälkeen.
      secure: process.env.NODE_ENV === 'production', // Käytä secure=true vain HTTPS:n kanssa
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
app.use('/login/user', loginUserRouter);
app.use('/signup/organizer', signupOrganizerRouter);
app.use('/login/organizer', loginOrganizerRouter);

// Käyttäjien muokkaamisreitit
app.use('/manage/user', manageUserRouter); //GET for getting one or all users or DELETE or PUT
app.use('/manage/organizer', manageOrganizerRouter); //GET for getting one or all organizers or DELETE or PUT

// Tapahtumareitit
app.use('/create/event', createEventRouter); // POST route for creating events
app.use('/manage/event', manageEventRouter); // GET for getting all events or DELETE route for deleting events or PUT route for edits

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
