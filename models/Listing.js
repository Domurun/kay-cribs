const mongoose = require('mongoose');

const ListingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['For Sale', 'For Rent', 'For Lease'],
    default: 'For Sale'
  },
  description: {
    type: String,
  },
  image: {
    type: String, // Store URL string
    required: true,
  },
  advertiser: {
    type: String,
    default: 'KayCribs Verified Agent'
  },
  verified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Listing', ListingSchema);