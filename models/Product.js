const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
  name: String,
  brand: String,
  openedDate: Date,
  monthsAfterOpening: Number,
  expiryDate: Date,
})