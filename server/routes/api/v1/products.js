const express = require('express');

const router = express.Router();
// @route   GET api/v1/products
// @desc     Get/Fetch all products
// @access   Public
router.get('/', (req, res) => {
  res.json('Products delivered');
});

module.exports = router;
