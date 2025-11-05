const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.get('/sign-token', (req, res) => {
 res.json({ message: 'You are authorized'});
});

module.exports = router;