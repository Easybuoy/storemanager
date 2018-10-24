import express from 'express';

import authenticate from '../../../middleware/authenticate';
// import db from '../../../models/db';
import saleController from '../../../controllers/saleController';

const { createSale, getSales, getSaleById } = saleController;
const router = express.Router();

// @route   GET api/v1/sales
// @desc    Get/Fetch all sale records
// @access  Private
router.get('/', authenticate, getSales);


// @route   GET api/v1/sales/<saleId>
// @desc    Get/Fetch a single sale record
// @access   Private
router.get('/:id', authenticate, getSaleById);

// @route   POST api/v1/sales
// @desc    Create a sale order
// @access   Private
router.post('/', authenticate, createSale);

module.exports = router;
