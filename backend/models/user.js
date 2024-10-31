const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (email) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
      },
      message: 'Sähköposti ei ole oikeassa muodossa.',
    },
  },
  password: { type: String, required: true },
  phoneNumber: {
    type: String,
    required: true,
    validate: {
      validator: (phoneNumber) => {
        // Säännöllinen lauseke, joka sallii vain maakoodin ja paikallisen puhelinnumeron
        const phoneRegex = /^\+\d{1,3}\s?\d{9,10}$/; // Esim. +35812345678 tai +358 1234567
        return phoneRegex.test(phoneNumber);
      },
      message:
        'Puhelinnumeron on oltava muodossa +35812345678 tai +358 1234567.',
    },
  },
  supporterMember: {
    type: Boolean,
    required: true,
    default: false,
  },
  supporterPayment: {
    type: Number,
    enum: [3, 5, 10],
    required: function () {
      return this.supporterMember;
    }, // Required if the user opts for supporter membership
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
