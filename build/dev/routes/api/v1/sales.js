'use strict';

var express = require('express');
var db = require('../../../models/db');

var _require = require('../../../validation/sales'),
    validateSalesInput = _require.validateSalesInput;

var router = express.Router();

// @route   GET api/v1/sales
// @desc    Get/Fetch all sale records
// @access  Public
router.get('/', function (req, res) {
  res.json(db.sales);
});

// @route   GET api/v1/sales/<saleId>
// @desc    Get/Fetch a single sale record
// @access   Public
router.get('/:id', function (req, res) {
  var id = req.params.id;

  if (!id) {
    return res.status(400).json({ message: 'salesId is required' });
  }

  var sales = db.sales[id - 1];
  if (!sales) {
    return res.status(400).json({ message: 'Sales with id ' + id + ' not found.' });
  }

  return res.json(sales);
});

// @route   POST api/v1/sales
// @desc    Create a sale order
// @access   Private
router.post('/', function (req, res) {
  var _validateSalesInput = validateSalesInput(req.body),
      errors = _validateSalesInput.errors,
      isValid = _validateSalesInput.isValid;

  // Check validation


  if (!isValid) {
    return res.status(400).json(errors);
  }

  var id = db.sales.length;
  id += 1;

  var data = {
    id: id,
    store_attendant_user_id: req.body.store_attendant_user_id,
    product_id: req.body.product_id,
    date_time: new Date()
  };

  db.sales.push(data);

  return res.status(201).json({ message: 'Sale added successfully', data: data });
});

module.exports = router;