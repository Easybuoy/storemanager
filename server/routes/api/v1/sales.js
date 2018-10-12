const express = require('express');
const db = require('../../../models/db');

const router = express.Router();

// @route   GET api/v1/sales
// @desc    Get/Fetch all sale records
// @access  Public
router.get('/', (req, res) => {
  res.json(db.sales);
});


// @route   GET api/v1/sales/<saleId>
// @desc    Get/Fetch a single sale record
// @access   Public
router.get('/:id', (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: 'salesId is required' });
  }

  const sales = db.sales[id - 1];
  if (!sales) {
    return res.status(400).json({ message: `Sales with id ${id} not found.` });
  }

  return res.json(sales);
});

// @route   POST api/v1/sales
// @desc    Create a sale order
// @access   Private
router.post('/', (req, res) => {
  // const { id } = req.body;

  let id = db.sales.length;
  id += 1;

  const data = {
    id,
    store_attendant_user_id: req.body.store_attendant_user_id,
    product_id: req.body.product_id,
    date_time: new Date(),
  };

  db.sales.push(data);


  return res.json({ message: 'Sale added successfully', data });
});

module.exports = router;
