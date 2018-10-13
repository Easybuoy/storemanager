'use strict';

var express = require('express');
var db = require('../../../models/db');

var _require = require('../../../validation/products'),
    validateProductInput = _require.validateProductInput;

var router = express.Router();

// @route   GET api/v1/products
// @desc    Get/Fetch all products
// @access  Public
router.get('/', function (req, res) {
  res.json(db.products);
});

// @route   GET api/v1/products/<productId>
// @desc    Get/Fetch a single product record
// @access   Public
router.get('/:id', function (req, res) {
  var id = req.params.id;

  if (!id) {
    return res.status(400).json({ message: 'productId is required' });
  }

  var product = db.products[id - 1];
  if (!product) {
    return res.status(400).json({ message: 'Product with id ' + id + ' not found.' });
  }

  return res.json(product);
});

// @route   POST api/v1/products/
// @desc    Create a product
// @access   Private
router.post('/', function (req, res) {
  var _validateProductInput = validateProductInput(req.body),
      errors = _validateProductInput.errors,
      isValid = _validateProductInput.isValid;

  // Check validation


  if (!isValid) {
    return res.status(400).json(errors);
  }

  var id = db.products.length;
  id += 1;

  var data = {
    id: id,
    name: req.body.name,
    description: req.body.description,
    quantity: req.body.quantity,
    price: req.body.price
  };
  // const data = {
  //   id,
  //   store_attendant_user_id: req.body.store_attendant_user_id,
  //   product_id: req.body.product_id,
  //   date_time: new Date(),
  // };

  db.products.push(data);

  return res.status(201).json({ message: 'Product added successfully', data: data });
});

module.exports = router;