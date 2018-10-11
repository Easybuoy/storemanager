const express = require('express');

const router = express.Router();


// @route   GET api/v1/saless
//@desc     Get/Fetch all sale records
//@access   Public
router.get('/',  (req, res) => {
    res.json('Sales delivered');
});

module.exports = router;