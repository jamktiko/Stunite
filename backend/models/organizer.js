const mongoose = require('mongoose');

const organizerSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  organizationName: { type: String, required: true },
  customerServiceEmail: { type: String, required: true },
  organizationPhoneNumber: { type: String },
  website: { type: String },
  description: { type: String },
  address: { type: String, required: true },
  postalCode: { type: String, required: true },
  city: { type: String, required: true },
  officialName: { type: String, required: true },
  organizationType: {
    type: String,
    required: true,
    enum: [
      'baari tai yökerho',
      'tapahtuman tuottaja',
      'liikunta ja urheilu',
      'opiskelija-ainejärjestö',
      'opiskelijakunta',
      'liitto',
      'opiskelijaliitto',
      'muu',
    ],
    required: true,
  },
  businessId: { type: String, required: true },
  billingAddress: { type: String, required: true },
  paymentAddress: { type: String, required: true },
  password: { type: String, required: true },
  fieldsOfStudy: {
    type: [String],
    required: true,
  },
});

const Organizer = mongoose.model('Organizer', organizerSchema);

module.exports = Organizer;
