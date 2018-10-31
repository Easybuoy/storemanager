'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _authenticate = require('../../../middleware/authenticate');

var _authenticate2 = _interopRequireDefault(_authenticate);

var _saleController = require('../../../controllers/saleController');

var _saleController2 = _interopRequireDefault(_saleController);

var _saleControllerHelper = require('../../../controllers/Helpers/saleControllerHelper');

var _saleControllerHelper2 = _interopRequireDefault(_saleControllerHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import db from '../../../models/db';
const { isLoggedIn, isAdmin, isStoreAttendant } = _authenticate2.default;
const { createSale, getSales, getSaleById } = _saleController2.default;
const { processSale, updateProduct } = _saleControllerHelper2.default;
const router = _express2.default.Router();

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