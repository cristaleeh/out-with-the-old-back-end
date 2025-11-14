// routes/products.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const Category = require('../models/Category');
const verifyToken = require('../middleware/verify-token');

router.use(verifyToken); 


const formatDate = (date) => {
  if (!date) return null;
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// -------------------- CREATE PRODUCT --------------------
router.post('/', async (req, res) => {
  try {
    const { name, brand, openedDate, monthsAfterOpening, category } = req.body;

    let cat;
    if (mongoose.Types.ObjectId.isValid(category)) {
      cat = await Category.findById(category);
    } else {
      cat = await Category.findOne({ name: category });
    }
    if (!cat) return res.status(404).json({ err: 'Category not found' });

    let expiryDate = null;
    if (openedDate && monthsAfterOpening) {
      const date = new Date(openedDate);
      date.setMonth(date.getMonth() + parseInt(monthsAfterOpening));
      expiryDate = date;
    }

    const product = await Product.create({
      name,
      brand,
      openedDate,
      monthsAfterOpening,
      expiryDate,
      category: cat._id,
      user: req.user._id,
    });

    await product.populate('user', 'username');
    await product.populate('category', 'name');

    res.status(201).json({
      ...product._doc,
      openedDate: formatDate(product.openedDate),
      expiryDate: formatDate(product.expiryDate),
    });
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
});

// -------------------- index--USER DASHBOARD ROUTES --------------------

// Get current user products
router.get('/my-products', async (req, res) => {
  try {
    const products = await Product.find({ user: req.user._id })
      .populate('user', 'username')
      .populate('category', 'name')
      .populate('comments.user', 'username')
      .sort({ createdAt: -1 });

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// Get all products (public view)
router.get('/all-products', async (req, res) => {
  try {
    const products = await Product.find()
      .populate('user', 'username')
      .populate('category', 'name')
      .populate('comments.user', 'username')
      .sort({ createdAt: -1 });

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// -------------------- show --------------------
router.get('/:productId', async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId)
      .populate('user', 'username')
      .populate('category', 'name')
      .populate('comments.user', 'username');

    if (!product) return res.status(404).json({ err: 'Product not found' });

    res.status(200).json({
      ...product._doc,
      openedDate: formatDate(product.openedDate),
      expiryDate: formatDate(product.expiryDate),
      comments: product.comments.map((c) => ({
        ...c._doc,
        date: formatDate(c.date),
      })),
    });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// -------------------- UPDATE PRODUCT --------------------
router.put('/:productId', async (req, res) => {
  try {
    const { name, brand, openedDate, monthsAfterOpening, category } = req.body;

    const product = await Product.findById(req.params.productId);
    if (!product) return res.status(404).json({ err: 'Product not found' });

    if (!product.user.equals(req.user._id))
      return res.status(403).json({ err: 'Not authorized' });

    if (name) product.name = name;
    if (brand) product.brand = brand;
    if (openedDate) product.openedDate = openedDate;
    if (monthsAfterOpening) product.monthsAfterOpening = monthsAfterOpening;

    if (category) {
      let cat;
      if (mongoose.Types.ObjectId.isValid(category)) {
        cat = await Category.findById(category);
      } else {
        cat = await Category.findOne({ name: category });
      }
      if (!cat) return res.status(404).json({ err: 'Category not found' });
      product.category = cat._id;
    }

    if (product.openedDate && product.monthsAfterOpening) {
      const date = new Date(product.openedDate);
      date.setMonth(date.getMonth() + parseInt(product.monthsAfterOpening));
      product.expiryDate = date;
    }

    await product.save();
    await product.populate('user', 'username');
    await product.populate('category', 'name');

    res.status(200).json({
      ...product._doc,
      openedDate: formatDate(product.openedDate),
      expiryDate: formatDate(product.expiryDate),
    });
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
});

// -------------------- DELETE PRODUCT --------------------
router.delete('/:productId', async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) return res.status(404).json({ err: 'Product not found' });

    if (!product.user.equals(req.user._id))
      return res.status(403).json({ err: 'Not authorized' });

    await product.deleteOne();
    res.status(200).json({ msg: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// -------------------- COMMENTS --------------------
router.post('/:productId/comments', async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) return res.status(404).json({ err: 'Product not found' });

    req.body.user = req.user._id;
    product.comments.push(req.body);
    await product.save();
    await product.populate('comments.user', 'username');

    const newComment = product.comments[product.comments.length - 1];
    res.status(201).json({
      ...newComment._doc,
      date: formatDate(newComment.date),
    });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

module.exports = router;
