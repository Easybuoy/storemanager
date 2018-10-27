import express from 'express';

import authenticate from '../../../middleware/authenticate';
// import db from '../../../models/db';
import saleController from '../../../controllers/saleController';
import saleControllerHelper from '../../../controllers/Helpers/saleControllerHelper';

const { isLoggedIn, isAdmin, isStoreAttendant } = authenticate;
const { createSale, getSales, getSaleById } = saleController;
const { processSale, updateProduct } = saleControllerHelper;
const router = express.Router();

// @route   GET api/v1/sales
// @desc    Get/Fetch all sale records
// @access  Private
router.get('/', isLoggedIn, isAdmin, getSales);


// @route   GET api/v1/sales/<saleId>
// @desc    Get/Fetch a single sale record
// @access   Private
router.get('/:id', isLoggedIn, getSaleById);

// @route   POST api/v1/sales
// @desc    Create a sale order
// @access   Private
router.post('/', isLoggedIn, isStoreAttendant, processSale, updateProduct, createSale);

module.exports = router;
