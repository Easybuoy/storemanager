import express from 'express';
import multer from 'multer';

import authenticate from '../../../middleware/authenticate';
import productController from '../../../controllers/products';
// import upload from '../../../middleware/imageupload';

const { isLoggedIn, isAdmin } = authenticate;
const {
  createProduct, getProducts, getProductById, deleteProductById, updateProductById,
  assignProductToCategory,
} = productController;

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'assets/uploads/products/');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().getTime() + file.originalname);
  },
});

const upload = multer(
  {
    storage,
    limits: {
      fileSize: 1024 * 1024 * 5,

    },
    fileFilter,
  },
);

const router = express.Router();

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
router.post('/', isLoggedIn, isAdmin, upload.single('productImage'), createProduct);


// @route   DELETE api/v1/products/<productId>
// @desc    Delete a single product record
// @access   Private
router.delete('/:id', isLoggedIn, isAdmin, deleteProductById);

// @route   PUT api/v1/products/<productId>
// @desc    Update a single product record
// @access   Private
router.put('/:id', isLoggedIn, isAdmin, upload.single('productImage'), updateProductById);

// @route   PUT api/v1/products/<productId>/<categoryId>
// @desc    Assign Products To Category
// @access   Private
router.put('/:id/:categoryId', isLoggedIn, isAdmin, assignProductToCategory);

module.exports = router;
