const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  eventName: { type: String, required: true },
  date: { type: String, required: true },
  startingTime: { type: String, required: true },
  endingTime: { type: String, required: true },
  address: { type: String, required: true },
  venue: { type: String, required: true },
  city: { type: String, required: true },
  ticketprice: {
    minticketprice: {
      type: Number,
      required: true,
    },
    maxticketprice: {
      type: Number,
      required: true,
    },
  },
  theme: { type: String },
  isFavorite: { type: Boolean },
  details: { type: String },
  imageUrl: { type: String },
  ticketLink: { type: String },
  ticketSaleStart: {
    type: String,
  },
  ticketSaleEnd: {
    type: String,
  },
  publishDateTime: {
    type: String,
  },
  status: {
    type: String,
    enum: ['Varattu', 'Tuotannossa'],
    required: true,
  },
  organizerId: { type: String, required: true },
  organizationName: { type: String, required: true },
  eventTags: {
    type: [String],
    enum: [
      'Sitsit',
      'Appro',
      'Alkoholiton',
      'Lajikokeilu',
      'Risteily',
      'Ekskursio',
      'Liikunta',
      'Vuosijuhla',
      'Sillis',
      'Festivaali',
      'Musiikki',
      'Tanssiaiset',
      'Turnaus',
      'Online',
      'Bileet',
      'Bingo',
      'Poikkitieteellinen',
      'Vain jäsenille',
      'Vaihto-opiskelijoille',
      'Ilmainen',
      'Vappu',
      'Vapaa-aika',
      'Ruoka',
      'Kulttuuri',
      'Ammatillinen tapahtuma',
    ],
  },
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
