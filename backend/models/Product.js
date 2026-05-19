const mongoose = require('mongoose');

// =======================
// REVIEW SCHEMA
// =======================
const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  name: {
    type: String,
    required: true,
    trim: true
  },

  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },

  comment: {
    type: String,
    trim: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

// =======================
// PRODUCT SCHEMA
// =======================
const productSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true,
    trim: true
  },

  description: {
    type: String,
    trim: true
  },

  price: {
    type: Number,
    required: true,
    min: 0
  },

  images: {
    type: [String],
    default: []
  },

  category: {
    type: String,
    required: true,
    enum: ['dot-mandala', 'lippan-art', 'rangoli', 'other']
  },

  // keep original relation (IMPORTANT)
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },

  // ✅ NEW FIELD (for frontend display)
  sellerName: {
    type: String,
    required: true,
    trim: true
  },

  // =======================
  // REVIEWS
  // =======================
  reviews: [reviewSchema]

}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);