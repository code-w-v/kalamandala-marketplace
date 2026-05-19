const express = require('express');
const jwt = require('jsonwebtoken');
const Order = require('../models/Order');

const router = express.Router();


// =======================
// AUTH MIDDLEWARE
// =======================
const auth = (req, res, next) => {

  try {

    const token = req.header('Authorization');

    if (!token) {
      return res.status(401).json({ msg: 'No token' });
    }

    const cleanToken = token.replace('Bearer ', '');

    const decoded = jwt.verify(cleanToken, process.env.JWT_SECRET);

    req.user = decoded;

    next();

  } catch (error) {
    return res.status(401).json({ msg: 'Invalid token' });
  }
};


// =======================
// CREATE ORDER
// =======================
router.post('/', auth, async (req, res) => {

  try {

    const {
      items,
      totalAmount,
      paymentMethod,
      accountNumber,     // ✅ NEW
      transactionId      // ✅ NEW
    } = req.body;

    const order = new Order({

      user: req.user.userId,
      items,
      totalAmount,
      paymentMethod,
      accountNumber,     // ✅ SAVE IT
      transactionId      // ✅ SAVE IT

    });

    await order.save();

    res.status(201).json(order);

  } catch (error) {

    res.status(500).json({
      msg: error.message
    });

  }

});


// =======================
// GET MY ORDERS
// =======================
router.get('/my-orders', auth, async (req, res) => {

  try {

    const orders = await Order.find({
      user: req.user.userId
    }).sort({ createdAt: -1 });

    res.status(200).json(orders);

  } catch (error) {

    res.status(500).json({
      msg: error.message
    });

  }

});


// =======================
// GET USER ORDERS
// =======================
router.get('/', auth, async (req, res) => {

  try {

    const orders = await Order.find({
      user: req.user.userId
    }).sort({ createdAt: -1 });

    res.status(200).json(orders);

  } catch (error) {

    res.status(500).json({
      msg: error.message
    });

  }

});

module.exports = router;