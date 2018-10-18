import express from 'express';
import multer from 'multer';
import passport from 'passport';

import db from '../../../models/db';

import productsValidation from '../../../validation/products';

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
    cb(null, 'uploads/products/');
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

// const upload = multer({ dest: 'uploads/products/' });
const router = express.Router();

// @route   GET api/v1/products
// @desc    Get/Fetch all products
// @access  Public
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json(db.products);
});


// @route   GET api/v1/products/<productId>
// @desc    Get/Fetch a single product record
// @access   Public
router.get('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { id } = req.params;

  const product = db.products[id - 1];
  if (!product) {
    return res.status(400).json({ message: `Product with id ${id} not found.` });
  }

  return res.json(product);
});

// @route   POST api/v1/products/
// @desc    Create a product
// @access   Private
router.post('/', passport.authenticate('jwt', { session: false }), upload.single('productImage'), (req, res) => {
  // store owner / admin type  => 1
  // store attendant admin type => 2
  // store attendant type => 3

  // Checks if user making the request is the store owner / admin
  if (!(Number(req.user.type) === 1)) {
    return res.status(401).json('Unauthorized');
  }

  const { errors, isValid } = productsValidation.validateProductInput(req.body);
  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  let productImage = 'uploads\\products\\default.png';
  if (req.file) {
    productImage = req.file.path;
  }

  let id = db.products.length;
  id += 1;
  const host = req.get('host');
  const data = {
    id,
    name: req.body.name,
    description: req.body.description,
    quantity: req.body.quantity,
    price: {
      currency: '$',
      amount: req.body.price,
    },
    productImage,
  };

  db.products.push(data);

  data.request = {
    method: 'GET',
    url: `${host}/api/v1/products/${id}`,
  };

  return res.status(201).json({ message: 'Product added successfully', data });
});

module.exports = router;
