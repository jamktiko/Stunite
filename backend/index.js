// Lataa ympäristömuuttujat .env-tiedostosta
require('dotenv').config();

// Tuodaan tarvittavat moduulit
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const multer = require('multer');
const path = require('path');

// Tuodaan reittitiedostot
const signupUserRouter = require('./routes/signupUser');
const loginUserRouter = require('./routes/loginUser');
const signupOrganizerRouter = require('./routes/signupOrganizer');
const loginOrganizerRouter = require('./routes/loginOrganizer');
const createEventRouter = require('./routes/eventCreate');
const manageEventRouter = require('./routes/manageEvent');
const manageUserRouter = require('./routes/manageUser');
const manageOrganizerRouter = require('./routes/manageOrganizer');

const app = express();

// **Multer-konfiguraatio (tiedostojen lataamiseen)**

// Määritellään tallennusstrategia multerille
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Tiedostot tallennetaan 'uploads/'-kansioon
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Nimetään tiedostot aikaleiman ja alkuperäisen nimen mukaan
  },
});
const upload = multer({ storage: storage });

// **POST-reitti kuvan lataamiseen**
app.post('/create/event-with-image', upload.single('image'), (req, res) => {
  try {
    // Palautetaan ladatun tiedoston URL
    res.status(200).json({
      imageUrl: `${req.protocol}://${req.get('host')}/uploads/${
        req.file.filename
      }`,
    });
  } catch (error) {
    console.error('Error during file upload:', error);
    res.status(500).json({ error: 'Tiedoston lataus epäonnistui' });
  }
});

// Staattiset tiedostot 'uploads'-kansiosta
app.use('/uploads', express.static('uploads'));

// **Middlewaret**

app.use(cookieParser()); // Keksien käsittely
app.use(express.json()); // JSON-pyyntöjen käsittely
app.use(express.static(__dirname + '/dist/angular-pwa/browser')); // Angular-sovelluksen staattiset tiedostot

// CORS-käytännöt
app.use(
  cors({
    origin: [
      'http://localhost:4200', // Salli pyynnöt kehitysympäristöstä
      'https://stunite.eu-north-1.elasticbeanstalk.com', // Salli pyynnöt tuotantoympäristöstä
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Sallitut HTTP-metodit
    credentials: true, // Salli keksien lähetys CORS-pyynnöissä
  })
);

app.use(express.static('dist')); // Staattiset tiedostot 'dist'-kansiosta
app.use('/uploads', express.static('uploads')); // Staattiset tiedostot 'uploads'-kansiosta

// **Session-hallinta**
app.use(
  session({
    secret: 'salausarvo',
    cookie: {
      maxAge: 600000, // Session vanhenemisaika (10 minuuttia)
      secure: process.env.NODE_ENV === 'production', // 'secure'-asetus vain HTTPS:n kanssa
    },
    resave: true, // Tallenna session uudelleen jokaisen pyynnön jälkeen, vaikka sitä ei olisi muokattu
    saveUninitialized: true, // Luo session kaikille käyttäjille, vaikka sitä ei olisi alustettu
  })
);

// **Yhteys MongoDB Atlas -tietokantaan**
const url = process.env.MONGODB_URI; // Hae MongoDB URI ympäristömuuttujasta

mongoose
  .connect(url, {
    dbName: 'Stunite', // Käytettävän tietokannan nimi
    useNewUrlParser: true, // Käytä uutta URL-parseria
    useUnifiedTopology: true, // Käytä uutta yhteydenhallintaa
  })
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB:', error.message);
  });

// **Reitit**

app.use('/signup/user', signupUserRouter); // Käyttäjän rekisteröinti
app.use('/login/user', loginUserRouter); // Käyttäjän kirjautuminen
app.use('/signup/organizer', signupOrganizerRouter); // Järjestäjän rekisteröinti
app.use('/login/organizer', loginOrganizerRouter); // Järjestäjän kirjautuminen

app.use('/manage/user', manageUserRouter); // Käyttäjien hallinta (GET, PUT, DELETE)
app.use('/manage/organizer', manageOrganizerRouter); // Järjestäjien hallinta (GET, PUT, DELETE)

app.use('/create/event', createEventRouter); // Tapahtuman luonti
app.use('/manage/event', manageEventRouter); // Tapahtumien hallinta (GET, PUT, DELETE)

// **Käynnistä palvelin**
const PORT = process.env.PORT || 3001; // Portti määritellään ympäristömuuttujasta tai oletusarvoksi 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
