const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, required: true },
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
