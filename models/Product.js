const mongoose = require('mongoose');



const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true
  },
  text: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const productSchema = new mongoose.Schema({

  user: { 
    type: mongoose.Schema.Types.ObjectId,
    ref:'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  brand: {
    type: String
  },
  openedDate: {
    type: Date,
    required: true
  },
  monthsAfterOpening: {
    type: Number
  },
  expiryDate: {
    type: Date
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category' 
  },

  comments: [commentSchema] 
}, 
{ timestamps: true } 
);


const Product = mongoose.model('Product', productSchema);
module.exports = Product;