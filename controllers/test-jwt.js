const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.get('/sign-token', (req, res) => {
 const user = {
  _id: 1,
  username: "John Doe",
  password: 'test'
 };
 const token = jwt.sign({ user }, process.env.JWT_SECRET); //sign method- to sign the tokem
 res.json({ token })// send this token to client
});

router.post('/verify-token', (req, res) => {
  const token = req.headers.authorization.split(" ")[1];//split where there is space, its going to create an array in order to grab the token in the array you have have to put the index [1]--thats where the token is @

const decoded = jwt.verify(token, process.env.JWT_SECRET);

  res.json({ decoded }); //decoded payload- we get to see the user info on postman
});

module.exports = router;