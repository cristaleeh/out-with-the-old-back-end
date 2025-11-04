require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const logger = require('morgan');

//this connect with .env
mongoose.connect(process.env.MONGODB_URI);

// event lister 
mongoose.connection.on('connected', () => {
  console.log(`connected to MongoDB ${mongoose.connection.name}`);
});

app.use(express.json()); //parse json data into js becuse json comes in a string
app.use(logger('dev'));

app.listen(3000, () => {
  console.log('Is this thing working!?', 3000);
});