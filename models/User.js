const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // We will store hashed passwords here
  role: { 
    type: String, 
    enum: ['buyer', 'seller'], 
    default: 'buyer' 
  },
  idNumber: { type: String }, // For sellers/agents only
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);