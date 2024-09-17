const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  eventName: { type: String, required: true },
  eventDateTime: { type: Date, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  price: { type: Number, required: true },
  themeOrDressCode: { type: String },
  addToFavorites: { type: Boolean, default: false }, // Toggle for adding to favorites
  description: { type: String },
  ticketSaleLink: { type: String },
  ticketSalePeriod: {
    startDate: { type: Date },
    endDate: { type: Date },
  },
  isPreliminaryOrInProduction: {
    type: String,
    enum: ['Varattu', 'Tuotannossa'],
    required: true,
  },
  ticketTypes: [String], // Array of different ticket types
  checklist: [String], // Checklist items for the event
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
