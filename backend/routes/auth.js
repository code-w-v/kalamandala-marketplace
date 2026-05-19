const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

const router = express.Router();


// ================= REGISTER =================

router.post('/register', async (req, res) => {

  try {

    const {
      name,
      email,
      password,
      role
    } = req.body;

    // CHECK IF USER EXISTS
    const existingUser = await User.findOne({ email });

    if (existingUser) {

      return res.status(400).json({
        msg: 'User already exists'
      });

    }

    // CREATE USER
    const user = new User({
      name,
      email,
      password,
      role
    });

    await user.save();

    // CREATE TOKEN
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
        name: user.name
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d'
      }
    );

    // SEND RESPONSE
    res.json({

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      msg: error.message
    });

  }

});


// ================= LOGIN =================

router.post('/login', async (req, res) => {

  try {

    const { email, password } = req.body;

    // FIND USER
    const user = await User.findOne({ email });

    if (!user) {

      return res.status(400).json({
        msg: 'User not found'
      });

    }

    // CHECK PASSWORD
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {

      return res.status(400).json({
        msg: 'Invalid password'
      });

    }

    // CREATE TOKEN
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
        name: user.name
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d'
      }
    );

    // SEND RESPONSE
    res.json({

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      msg: error.message
    });

  }

});
module.exports = router;