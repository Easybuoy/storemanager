const express = require('express');
const db = require('../../../models/db');

const router = express.Router();

// @route   GET api/v1/products
// @desc    Get/Fetch all products
// @access  Public
router.get('/', (req, res) => {
  res.json(db.products);
});


// @route   GET api/v1/products/<productId>
// @desc    Get/Fetch a single product record
// @access   Public
router.get('/:id', (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: 'productId is required' });
  }

  const product = db.products[id - 1];
  if (!product) {
    return res.status(400).json({ message: `Product with id ${id} not found.` });
  }

  return res.json(product);
});

// @route   POST api/v1/products/
// @desc    Create a product
// @access   Private
router.post('/', (req, res) => {
  // const { id } = req.body;

  let id = db.products.length;
  id += 1;

  const data = {
    id,
    name: req.body.name,
    description: req.body.description,
    quantity: req.body.quantity,
    price: req.body.price,

  };

  db.products.push(data);


  return res.json({ message: 'Product added successfully', data });
});

module.exports = router;
