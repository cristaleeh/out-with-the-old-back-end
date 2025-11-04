//we need model in order to talk and do things in our database (mongoose)(communicator)
const mongoose = require('mongoose');

//build our schema
//new- because schema is a class we are building a new instance of schema

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

//register the model
const User = mongoose.model('User', userSchema);

module.exports = User;