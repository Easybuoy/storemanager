'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _authenticate = require('../../../middleware/authenticate');

var _authenticate2 = _interopRequireDefault(_authenticate);

var _productController = require('../../../controllers/productController');

var _productController2 = _interopRequireDefault(_productController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import multer from 'multer';

const { isLoggedIn, isAdmin } = _authenticate2.default;
const {
  createProduct, getProducts, getProductById, deleteProductById, updateProductById
} = _productController2.default;

// const fileFilter = (req, file, cb) => {
//   // reject a file
//   if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
//     cb(null, true);
//   } else {
//     cb(null, false);
//   }
// };
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/products/');
//   },
//   filename: (req, file, cb) => {
//     cb(null, new Date().getTime() + file.originalname);
//   },
// });

// const upload = multer(
//   {
//     storage,
//     limits: {
//       fileSize: 1024 * 1024 * 5,

//     },
//     fileFilter,
//   },
// );

const router = _express2.default.Router();

// @route   GET api/v1/products
// @desc    Get/Fetch all products
// @access  Private
router.get('/', isLoggedIn, getProducts);

// @route   GET api/v1/products/<productId>
// @desc    Get/Fetch a single product record
// @access   Private
router.get('/:id', isLoggedIn, getProductById);

// @route   POST api/v1/products/
// @desc    Create a product
// @access   Private
// router.post('/', authenticate, upload.single('productImage'), createProduct);
router.post('/', isLoggedIn, isAdmin, createProduct);

// @route   DELETE api/v1/products/<productId>
// @desc    Delete a single product record
// @access   Private
router.delete('/:id', isLoggedIn, isAdmin, deleteProductById);

// @route   PUT api/v1/products/<productId>
// @desc    Update a single product record
// @access   Private
router.put('/:id', isLoggedIn, isAdmin, updateProductById);
module.exports = router;