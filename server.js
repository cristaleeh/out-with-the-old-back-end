require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors'); 
const logger = require('morgan');
const testJwtRouter = require('./controllers/test-jwt');
const authRouter = require('./controllers/auth');



//connect to mongoose code//
mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`connected to MongoDB ${mongoose.connection.name}`);
});


//middleware//
app.use(cors()); //opens our server to different domain, for our front- end to make request to back-end without getting rejected
app.use(express.json()); //parse json data into js becuse json comes in a string
app.use(logger('dev'));




//Routes//
app.use('/auth', authRouter);
app.use('/test-jwt', testJwtRouter);










app.listen(3000, () => {
  console.log('Is this thing working!?', 3000);
});