import express from 'express';

import authenticate from '../../../middleware/authenticate';
import usersController from '../../../controllers/userController';

const { login, signup, getCurrentUser } = usersController;
const router = express.Router();

// @route   POST api/v1/users/register
// @desc    Register user
// @access  Private
router.post('/signup', authenticate, signup);


// @route   POST api/v1/users/register
// @desc     Login user / Returning JWT Token
// @access   Public
router.post('/login', login);


// @route   GET api/v1/users/current
// @desc     Return current user
// @access   Private
router.get('/current', authenticate, getCurrentUser);


module.exports = router;
