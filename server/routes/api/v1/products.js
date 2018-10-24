import express from 'express';
// import multer from 'multer';

import authenticate from '../../../middleware/authenticate';
import productController from '../../../controllers/productController';

const {
  createProduct, getProducts, getProductById, deleteProductById,
} = productController;

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

const router = express.Router();

// @route   GET api/v1/products
// @desc    Get/Fetch all products
// @access  Private
router.get('/', authenticate, getProducts);


// @route   GET api/v1/products/<productId>
// @desc    Get/Fetch a single product record
// @access   Private
router.get('/:id', authenticate, getProductById);

// @route   POST api/v1/products/
// @desc    Create a product
// @access   Private
// router.post('/', authenticate, upload.single('productImage'), createProduct);
router.post('/', authenticate, createProduct);


// @route   DELETE api/v1/products/<productId>
// @desc    Delete a single product record
// @access   Private
router.delete('/:id', authenticate, deleteProductById);

module.exports = router;
