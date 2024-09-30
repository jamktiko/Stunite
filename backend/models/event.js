const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  eventName: { type: String, required: true },
  date: { type: String, required: true },
  startingTime: { type: String, required: true },
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
  isFavorite: { type: Boolean }, // Toggle for adding to favorites
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
  organizerId: { type: Number, required: true },
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
