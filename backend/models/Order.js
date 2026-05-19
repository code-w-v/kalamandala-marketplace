const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      },

      title: String,
      price: Number,
      quantity: Number,
      image: String
    }
  ],

  totalAmount: {
    type: Number,
    required: true
  },

  // PAYMENT INFO
  paymentMethod: {
    type: String,
    default: 'COD'
  },

  // ✅ NEW FIELDS (ADD ONLY THESE)
  accountNumber: {
    type: String,
    default: null
  },

  transactionId: {
    type: String,
    default: null
  },

  status: {
    type: String,
    default: 'Pending'
  }

}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);