const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');




const saltRounds = 12;



//sign up
router.post('/sign-up', async (req, res) => {
  try {

    const { username, email, password } = req.body;

    const usernameInDatabase = await User.findOne({ username });
    const emailInDatabase = await User.findOne({ email })

    if (usernameInDatabase) {
      return res.status(409).json({err:`${username} is already taken sorry 🥺`});
    } else if (emailInDatabase) {
      return res.status(409).json({err: `There's already an account under ${email}, please try again.`})
    }
    //create a new user with hashed password
    const user = await User.create({
      username,
      email,
      hashedPassword: bcrypt.hashSync(password,saltRounds)//saltRounds- has it multiple times
    });


    const payload = { username: user.username, email: user.email, _id: user._id};

    const token = jwt.sign({ payload }, process.env.JWT_SECRET);// by sending this token means ur authenticated--signs up and also signs in


    res.status(201).json({ user });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});




//Sign In
router.post('/sign-in', async (req, res) => {
  try {
    //confirminf user has enter a valid username 
    const user = await User.findOne({ username: req.body.username });

    if (!user) {
      return res.status(401).json({ err: 'Invalid username, try again'});
    }

    const isPasswordCorrect = bcrypt.compareSync(
      req.body.password,
      user.hashedPassword
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({ err: 'Invalid, try again' });
    }


    const payload = { username: user.username, email: user.email, _id: user._id};

    const token = jwt.sign({ payload }, process.env.JWT_SECRET);

    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});



module.exports = router;