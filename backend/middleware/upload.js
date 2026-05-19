import express from 'express';
import upload from '../middleware/upload.js';

const router = express.Router();

// =======================
// UPLOAD IMAGE ROUTE
// =======================
router.post('/upload', upload.single('image'), (req, res) => {
  try {
    // CHECK IF FILE EXISTS
    if (!req.file) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }

    // RETURN IMAGE PATH
    return res.json({
      imageUrl: `/uploads/${req.file.filename}`
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: 'Upload failed' });
  }
});

export default router;