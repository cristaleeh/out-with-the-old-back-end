const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const verifyToken = require('../middleware/verify-token');


//CREATE-- ADD new category

router.post('/', verifyToken, async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
});




router.get('/', async (req, res) => {
  try {
   
    const categories = await Category.find().lean();  
    //build a lookup map--
    const categoryMap = {};
    categories.forEach(cat => {
      cat.subcategories = []; 
      categoryMap[cat._id] = cat;
    });


    
    const grouped = [];
    categories.forEach(cat => {
      if (cat.parentCategory) {
        
        const parent = categoryMap[cat.parentCategory];
        if (parent) parent.subcategories.push(cat);
      } else {
        grouped.push(cat);
      }
    });
    res.status(200).json(grouped);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});



router.get('/:categoryId', async (req, res) => {
  try {
    const category = await Category.findById(req.params.categoryId);
    if (!category) return res.status(404).json({ err: 'Category not found' });
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json({ err: err.message })
  }
});


router.put('/:categoryId', verifyToken, async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.categoryId,
      req.body,
      { new: true }
    );
    if (!category) return res.status(404).json({ err: 'Category not found '});
    res.status(200).json(category);
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
});



router.delete('/:categoryId', verifyToken, async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.categoryId);
    if (!category) return res.status(404).json({ err: 'Category not found' });
    res.status(200).json({ msg: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ err: err.message })
  }
});


module.exports = router;
