const express = require('express');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// =======================
// STORAGE
// =======================
const storage = multer.diskStorage({

  destination: (req, file, cb) => {

    cb(null, 'uploads/');

  },

  filename: (req, file, cb) => {

    cb(
      null,
      Date.now() + path.extname(file.originalname)
    );

  }

});

const upload = multer({ storage });

// =======================
// UPLOAD ROUTE
// =======================
router.post('/', upload.single('image'), (req, res) => {

  try {

    const imageUrl =
      `http://localhost:5000/uploads/${req.file.filename}`;

    res.json({
      imageUrl
    });

  } catch (error) {

    res.status(500).json({
      msg: error.message
    });

  }

});

module.exports = router;