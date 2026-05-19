const express = require('express');
const Product = require('../models/Product');
const jwt = require('jsonwebtoken');

const router = express.Router();


// =======================
// AUTH MIDDLEWARE
// =======================
const auth = (req, res, next) => {

  try {

    const authHeader = req.header('Authorization');

    if (!authHeader) {
      return res.status(401).json({
        msg: 'No token, authorization denied'
      });
    }

    const token = authHeader.replace('Bearer ', '');

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();

  } catch (err) {
    return res.status(401).json({
      msg: 'Invalid or expired token'
    });
  }
};


// =======================
// GET ALL PRODUCTS
// =======================
router.get('/', async (req, res) => {

  try {

    const { search, category } = req.query;

    let filter = {};

    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }

    if (category) {
      filter.category = category;
    }

    const products = await Product.find(filter)
      .populate('seller', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(products);

  } catch (error) {
    res.status(500).json({ msg: error.message });
  }

});


// =======================
// GET SELLER PRODUCTS
// =======================
router.get('/seller/my-products', auth, async (req, res) => {

  try {

    const products = await Product.find({
      seller: req.user.userId
    }).sort({ createdAt: -1 });

    res.status(200).json(products);

  } catch (error) {
    res.status(500).json({ msg: error.message });
  }

});


// =======================
// GET SINGLE PRODUCT
// =======================
router.get('/:id', async (req, res) => {

  try {

    const product = await Product.findById(req.params.id)
      .populate('seller', 'name email');

    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    res.status(200).json(product);

  } catch (error) {
    res.status(500).json({ msg: error.message });
  }

});


// =======================
// ADD PRODUCT
// =======================
router.post('/', auth, async (req, res) => {

  try {

    const {
      title,
      description,
      price,
      images,
      category,
      sellerName   // ✅ NEW FIELD
    } = req.body;

    if (!title || !price || !category) {
      return res.status(400).json({
        msg: 'Title, price and category are required'
      });
    }

    if (req.user.role !== 'seller') {
      return res.status(403).json({
        msg: 'Only sellers can add products'
      });
    }

    const product = new Product({

      title,
      description,
      price,
      images,
      category,

      // existing relation
      seller: req.user.userId,

      // ✅ NEW: store seller name for UI
      sellerName: sellerName || req.user.name

    });

    await product.save();

    res.status(201).json({
      msg: 'Product added successfully',
      product
    });

  } catch (error) {
    res.status(500).json({ msg: error.message });
  }

});


// =======================
// UPDATE PRODUCT
// =======================
router.put('/:id', auth, async (req, res) => {

  try {

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    if (product.seller?.toString() !== req.user.userId) {
      return res.status(403).json({ msg: 'Unauthorized' });
    }

    const {
      title,
      description,
      price,
      images,
      category,
      sellerName   // ✅ allow update if needed
    } = req.body;

    if (title) product.title = title;
    if (description) product.description = description;
    if (price !== undefined) product.price = price;
    if (images) product.images = images;
    if (category) product.category = category;
    if (sellerName) product.sellerName = sellerName;

    await product.save();

    res.status(200).json({
      msg: 'Product updated successfully',
      product
    });

  } catch (error) {
    res.status(500).json({ msg: error.message });
  }

});


// =======================
// DELETE PRODUCT
// =======================
router.delete('/:id', auth, async (req, res) => {

  try {

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    if (product.seller?.toString() !== req.user.userId) {
      return res.status(403).json({ msg: 'Unauthorized' });
    }

    await product.deleteOne();

    res.status(200).json({
      msg: 'Product deleted successfully'
    });

  } catch (error) {
    res.status(500).json({ msg: error.message });
  }

});


// =======================
// ADD REVIEW
// =======================
router.post('/:id/review', auth, async (req, res) => {

  try {

    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    const review = {
      user: req.user.userId,
      name: req.user.name,
      rating,
      comment
    };

    product.reviews.push(review);

    await product.save();

    res.status(201).json({
      msg: 'Review added successfully',
      reviews: product.reviews
    });

  } catch (error) {
    res.status(500).json({ msg: error.message });
  }

});

module.exports = router;