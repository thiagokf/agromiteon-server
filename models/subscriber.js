const mongoose = require('mongoose');

const subscriberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true  
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Subscriber', subscriberSchema);