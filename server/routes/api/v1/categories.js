import express from 'express';

import authenticate from '../../../middleware/authenticate';
import categoriesController from '../../../controllers/categories';

const {
  createCategory, updateCategory, deleteCategory, getCategories,
} = categoriesController;

const { isLoggedIn, isAdmin } = authenticate;
const router = express.Router();

// @route   POST api/v1/categories/
// @desc    Create Product Category
// @access  Private
router.post('/', isLoggedIn, isAdmin, createCategory);


// @route    POST api/v1/categories/<categoryId>
// @desc     Update A Product Category
// @access   Private
router.put('/:id', isLoggedIn, isAdmin, updateCategory);


// @route   DELETE api/v1/categories/<categoryId>
// @desc     Delete A Category
// @access   Private
router.delete('/:id', isLoggedIn, isAdmin, deleteCategory);


// @route    GET api/v1/categories/
// @desc     Get All Categories
// @access   Private
router.get('/', isLoggedIn, isAdmin, getCategories);

module.exports = router;
