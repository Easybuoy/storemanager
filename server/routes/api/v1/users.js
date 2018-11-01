import express from 'express';

import authenticate from '../../../middleware/authenticate';
import usersController from '../../../controllers/userController';

const {
  login, signup, getCurrentUser, makeAdmin, getAttendants,
} = usersController;

const { isLoggedIn, isAdmin } = authenticate;
const router = express.Router();

// @route   POST api/v1/users/register
// @desc    Register user
// @access  Private
router.post('/signup', isLoggedIn, isAdmin, signup);


// @route   POST api/v1/users/register
// @desc     Login user / Returning JWT Token
// @access   Public
router.post('/login', login);


// @route   GET api/v1/users/current
// @desc     Return current user
// @access   Private
router.get('/current', isLoggedIn, getCurrentUser);


// @route    POST api/v1/users/makeadmin
// @desc     Make store attendant an admin
// @access   Private
router.post('/makeadmin', isLoggedIn, isAdmin, makeAdmin);

// @route    GET api/v1/users/attendants
// @desc     Get All Store Attendants
// @access   Private
router.get('/attendants', isLoggedIn, isAdmin, getAttendants);

module.exports = router;
